// Web Audio API Order Notification Synthesizer
// Clean, zero-external-dependency audio alerts for Restaurant Partner & Rider Fleet

class OrderSoundPlayer {
  private ctx: AudioContext | null = null;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private isLooping: boolean = false;
  private isMuted: boolean = false;

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

  // Pre-unlock audio on user touch/click
  public unlockAudio() {
    const ctx = this.getContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  }

  // Play a single ring pattern (4 harmonically rich bell tones)
  public playSingleChime() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      const now = ctx.currentTime;
      // Notes: E5 (659Hz), G#5 (830Hz), B5 (987Hz), E6 (1318Hz)
      const notes = [
        { freq: 659.25, time: 0, dur: 0.24 },
        { freq: 830.61, time: 0.16, dur: 0.24 },
        { freq: 987.77, time: 0.32, dur: 0.26 },
        { freq: 1318.51, time: 0.48, dur: 0.70 },
      ];

      notes.forEach(({ freq, time, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + time);

        // Volume envelope with bell decay
        gain.gain.setValueAtTime(0.001, now + time);
        gain.gain.exponentialRampToValueAtTime(0.38, now + time + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + time + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + time);
        osc.stop(now + time + dur + 0.05);
      });
    } catch (err) {
      console.warn('[Audio] Error playing alert chime:', err);
    }
  }

  // Start continuous looping until explicitly stopped
  public startAlertLoop() {
    if (this.isLooping) return;
    this.isLooping = true;

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

export const orderSound = typeof window !== 'undefined' ? new OrderSoundPlayer() : (new OrderSoundPlayer());
