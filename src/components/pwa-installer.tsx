'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export default function PwaInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Detect if running inside installed standalone PWA
    const isApp = window.matchMedia('(display-mode: standalone)').matches ||
                  (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
                  document.referrer.includes('android-app://');
    setIsStandalone(isApp);

    // 2. Detect OS / Device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isApple = /iphone|ipad|ipod/.test(userAgent) && !((window as unknown as { MSStream?: unknown }).MSStream);
    const isHandheld = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    setIsIOS(isApple);
    setIsMobile(isHandheld);

    // Check temporary session dismissal (reset on refresh/new session so demo users always see it)
    const sessionDismissed = sessionStorage.getItem('mr_pwa_session_dismissed');
    if (sessionDismissed === 'true') {
      setIsDismissed(true);
    }

    // 3. Register Service Worker immediately
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[PWA] Service Worker registered:', reg.scope);
        })
        .catch((err) => {
          console.warn('[PWA] SW register warning:', err);
        });
    }

    // 4. Capture Chromium install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsStandalone(true);
      setShowGuideModal(false);
    };

    // 5. Global listener for manual header buttons
    const handleOpenManual = () => {
      triggerInstallFlow();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('open-pwa-install', handleOpenManual);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('open-pwa-install', handleOpenManual);
    };
  }, []);

  const triggerInstallFlow = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setIsStandalone(true);
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.error('[PWA] Install error:', err);
        setShowGuideModal(true);
      }
    } else {
      // Fallback instructions modal for iOS or Android where prompt hasn't triggered yet
      setShowGuideModal(true);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('mr_pwa_session_dismissed', 'true');
    }
  };

  // If already running as an installed PWA, do not show install prompts
  if (isStandalone) {
    return null;
  }

  return (
    <>
      {/* ============================================================
          1. Bottom Floating Install Bar (Swiggy / Zomato Mobile Style)
          ============================================================ */}
      {!isDismissed && (
        <div
          style={{
            position: 'fixed',
            top: 12,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 24px)',
            maxWidth: 520,
            zIndex: 9999,
            background: 'linear-gradient(135deg, #18181b 0%, #09090b 100%)',
            color: '#ffffff',
            borderRadius: 16,
            padding: '12px 14px',
            boxShadow: '0 12px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/icon-192.png"
              alt="Mana Ruchulu"
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                flexShrink: 0,
                boxShadow: '0 3px 10px rgba(234,88,12,0.45)',
              }}
            />
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontSize: '0.84rem',
                fontWeight: 800,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                Install Mana Ruchulu App
              </div>
              <div style={{
                fontSize: '0.7rem',
                color: '#a1a1aa',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                Faster food ordering & live radar tracking
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <button
              onClick={triggerInstallFlow}
              style={{
                background: 'linear-gradient(135deg, #ea580c, #c2410c)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 10,
                padding: '8px 15px',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 3px 10px rgba(234,88,12,0.5)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <span>Install</span>
              <span style={{ fontSize: '0.85rem' }}>⚡</span>
            </button>
            <button
              onClick={handleDismiss}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#71717a',
                fontSize: '1.1rem',
                lineHeight: 1,
                cursor: 'pointer',
                padding: '4px 6px',
              }}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ============================================================
          2. Step-by-Step Install Guide Modal (For iOS Safari & Fallbacks)
          ============================================================ */}
      {showGuideModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100000,
          padding: 16,
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 20,
            padding: 24,
            maxWidth: 420,
            width: '100%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            color: '#0f172a',
            position: 'relative',
            animation: 'scaleUp 0.25s ease-out',
          }}>
            <button
              onClick={() => setShowGuideModal(false)}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: 32,
                height: 32,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                color: '#64748b',
              }}
            >
              ✕
            </button>

            {/* App Header in Modal */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/icons/icon-192.png"
                alt="Mana Ruchulu"
                style={{ width: 48, height: 48, borderRadius: 12 }}
              />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900 }}>
                  Install Mana Ruchulu
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#64748b' }}>
                  Add to your home screen for instant app experience
                </p>
              </div>
            </div>

            {/* Platform Specific Steps */}
            {isIOS ? (
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                padding: '14px 16px',
                fontSize: '0.84rem',
                lineHeight: 1.5,
              }}>
                <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>
                  📲 On iPhone / iPad Safari:
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%', background: '#ea580c', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0
                  }}>1</div>
                  <div>
                    Tap the <strong>Share</strong> button <span style={{ fontSize: '1.1rem' }}>⎙ / ⎋</span> at the bottom of Safari.
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%', background: '#ea580c', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0
                  }}>2</div>
                  <div>
                    Scroll down and tap <strong>&quot;Add to Home Screen&quot; ⊞</strong>.
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%', background: '#ea580c', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0
                  }}>3</div>
                  <div>
                    Tap <strong>Add</strong> in the top right corner. Done!
                  </div>
                </div>
              </div>
            ) : (
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                padding: '14px 16px',
                fontSize: '0.84rem',
                lineHeight: 1.5,
              }}>
                <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>
                  🤖 On Android / Chrome Browser:
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%', background: '#ea580c', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0
                  }}>1</div>
                  <div>
                    Tap the <strong>Browser Menu (⋮)</strong> in the top right corner.
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%', background: '#ea580c', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0
                  }}>2</div>
                  <div>
                    Select <strong>&quot;Install app&quot;</strong> or <strong>&quot;Add to Home screen&quot;</strong>.
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%', background: '#ea580c', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0
                  }}>3</div>
                  <div>
                    Confirm <strong>Install</strong> to add Mana Ruchulu to your device.
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowGuideModal(false)}
              style={{
                width: '100%',
                marginTop: 18,
                padding: '12px',
                borderRadius: 12,
                background: 'linear-gradient(135deg, #ea580c, #c2410c)',
                color: '#fff',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              Got It, Thanks!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
