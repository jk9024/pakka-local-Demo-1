'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export default function PwaInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // 1. Check if already installed / running in standalone mode
    if (typeof window !== 'undefined') {
      const isApp = window.matchMedia('(display-mode: standalone)').matches ||
                    (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      setIsStandalone(isApp);

      // Check local storage dismissal
      const dismissed = localStorage.getItem('mr_pwa_dismissed');
      if (dismissed && Date.now() - parseInt(dismissed, 10) < 86400000 * 3) {
        setIsDismissed(true);
      }
    }

    // 2. Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('[PWA] Service Worker registered with scope:', reg.scope);
          })
          .catch((err) => {
            console.error('[PWA] Service Worker registration failed:', err);
          });
      });
    }

    // 3. Listen for browser install prompt (Chrome, Edge, Android)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
      setIsStandalone(true);
      console.log('[PWA] Mana Ruchulu was installed!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstallable(false);
      }
      setDeferredPrompt(null);
    } catch (err) {
      console.error('[PWA] Install prompt error:', err);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mr_pwa_dismissed', Date.now().toString());
    }
  };

  // Do not show if already running in app mode or dismissed or prompt not ready
  if (isStandalone || !isInstallable || isDismissed) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 74,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)',
        maxWidth: 440,
        zIndex: 9999,
        background: '#18181b',
        color: '#ffffff',
        borderRadius: 16,
        padding: '12px 14px',
        boxShadow: '0 12px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.1)',
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
          style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0, boxShadow: '0 2px 8px rgba(234,88,12,0.4)' }}
        />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Install Mana Ruchulu App
          </div>
          <div style={{ fontSize: '0.7rem', color: '#a1a1aa', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Faster ordering & live pilot tracking
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <button
          onClick={handleInstallClick}
          style={{
            background: 'linear-gradient(135deg, #ea580c, #c2410c)',
            color: '#ffffff',
            border: 'none',
            borderRadius: 10,
            padding: '7px 14px',
            fontSize: '0.76rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(234,88,12,0.5)',
          }}
        >
          Install
        </button>
        <button
          onClick={handleDismiss}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#71717a',
            fontSize: '1rem',
            lineHeight: 1,
            cursor: 'pointer',
            padding: 4,
          }}
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
