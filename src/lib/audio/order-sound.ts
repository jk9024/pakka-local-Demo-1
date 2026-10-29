// High-Reliability Dual Audio Synthesizer (Web Audio API + HTML5 Audio Fallback)
// Zero external assets, works across Chrome, Edge, Safari, Firefox, Android, iOS

function generateChimeDataUri(): string {
  if (typeof window === 'undefined') return '';
  try {
    const sampleRate = 8000;
    const duration = 0.75;
    const numSamples = Math.floor(sampleRate * duration);
    const buffer = new Uint8Array(44 + numSamples);

    // RIFF
    buffer[0] = 0x52; buffer[1] = 0x49; buffer[2] = 0x46; buffer[3] = 0x46;
    const fileSize = 36 + numSamples;
    buffer[4] = fileSize & 0xff;
    buffer[5] = (fileSize >> 8) & 0xff;
    buffer[6] = (fileSize >> 16) & 0xff;
    buffer[7] = (fileSize >> 24) & 0xff;
    buffer[8] = 0x57; buffer[9] = 0x41; buffer[10] = 0x56; buffer[11] = 0x45; // WAVE

    // fmt
    buffer[12] = 0x66; buffer[13] = 0x6d; buffer[14] = 0x74; buffer[15] = 0x20;
    buffer[16] = 16; buffer[17] = 0; buffer[18] = 0; buffer[19] = 0;
    buffer[20] = 1; buffer[21] = 0; // PCM
    buffer[22] = 1; buffer[23] = 0; // mono
    buffer[24] = sampleRate & 0xff;
    buffer[25] = (sampleRate >> 8) & 0xff;
    buffer[26] = 0; buffer[27] = 0;
    buffer[28] = sampleRate & 0xff;
    buffer[29] = (sampleRate >> 8) & 0xff;
    buffer[30] = 0; buffer[31] = 0;
    buffer[32] = 1; buffer[33] = 0;
    buffer[34] = 8; buffer[35] = 0; // 8 bit

    // data
    buffer[36] = 0x64; buffer[37] = 0x61; buffer[38] = 0x74; buffer[39] = 0x61;
    buffer[40] = numSamples & 0xff;
    buffer[41] = (numSamples >> 8) & 0xff;
    buffer[42] = (numSamples >> 16) & 0xff;
    buffer[43] = (numSamples >> 24) & 0xff;

    // Harmonic bell chime waveform (notes: 830Hz + 1318Hz with decay)
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      const decay = Math.exp(-t * 5);
      const s1 = Math.sin(2 * Math.PI * 830.61 * t);
      const s2 = Math.sin(2 * Math.PI * 1318.51 * t);
      const val = (s1 * 0.6 + s2 * 0.4) * decay;
      buffer[44 + i] = Math.max(0, Math.min(255, Math.floor(128 + val * 115)));
    }

    let binary = '';
    const len = buffer.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(buffer[i]);
    }
    return 'data:audio/wav;base64,' + window.btoa(binary);
  } catch {
    return '';
  }
}

class OrderSoundPlayer {
  private ctx: AudioContext | null = null;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private isLooping: boolean = false;
  private isMuted: boolean = false;
  private audioEl: HTMLAudioElement | null = null;
  private wavDataUri: string = '';

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.wavDataUri = generateChimeDataUri();
        if (this.wavDataUri) {
          this.audioEl = new Audio(this.wavDataUri);
          this.audioEl.volume = 0.9;
        }
      } catch {}

      // Auto-unlock on first user interaction anywhere on the window
      const unlock = () => this.unlockAudio();
      window.addEventListener('click', unlock, { once: true, passive: true });
      window.addEventListener('touchstart', unlock, { once: true, passive: true });
      window.addEventListener('keydown', unlock, { once: true, passive: true });
    }
  }

  public getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Pre-unlock audio on user touch/click/test button
  public unlockAudio() {
    const ctx = this.getContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    if (this.audioEl) {
      try {
        this.audioEl.play().then(() => {
          this.audioEl?.pause();
          if (this.audioEl) this.audioEl.currentTime = 0;
        }).catch(() => {});
      } catch {}
    }
  }

  // Play a single ring pattern (4 harmonically rich bell tones)
  public playSingleChime() {
    if (this.isMuted) return;

    const ctx = this.getContext();
    if (ctx) {
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      try {
        const now = ctx.currentTime;
        // Notes: E5 (659Hz), G#5 (830Hz), B5 (987Hz), E6 (1318Hz)
        const notes = [
          { freq: 659.25, time: 0, dur: 0.25 },
          { freq: 830.61, time: 0.16, dur: 0.25 },
          { freq: 987.77, time: 0.32, dur: 0.28 },
          { freq: 1318.51, time: 0.48, dur: 0.70 },
        ];

        notes.forEach(({ freq, time, dur }) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + time);

          gain.gain.setValueAtTime(0.001, now + time);
          gain.gain.exponentialRampToValueAtTime(0.55, now + time + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + time + dur);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + time);
          osc.stop(now + time + dur + 0.05);
        });
      } catch (e) {
        console.warn('Web Audio error:', e);
      }
    }

    // Also attempt HTML5 Audio element fallback
    if (this.audioEl) {
      try {
        this.audioEl.currentTime = 0;
        this.audioEl.play().catch(() => {});
      } catch {}
    }
  }

  // User click test button: unmutes, resumes context and plays chime out loud
  public testRingtone() {
    this.setMuted(false);
    this.unlockAudio();
    this.playSingleChime();
  }

  // Start continuous looping until explicitly stopped
  public startAlertLoop() {
    if (this.isLooping) return;
    this.isLooping = true;
    this.unlockAudio();

    // Trigger first chime immediately
    this.playSingleChime();

    // Repeat every 1.5 seconds
    this.intervalId = setInterval(() => {
      if (this.isLooping) {
        this.playSingleChime();
      } else {
        if (this.intervalId) {
          clearInterval(this.intervalId);
          this.intervalId = null;
        }
      }
    }, 1500);
  }

  // Stop looping immediately
  public stopAlertLoop() {
    this.isLooping = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.audioEl) {
      try {
        this.audioEl.pause();
        this.audioEl.currentTime = 0;
      } catch {}
    }
  }

  public isPlaying(): boolean {
    return this.isLooping;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopAlertLoop();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }
}

export const orderSound = new OrderSoundPlayer();
