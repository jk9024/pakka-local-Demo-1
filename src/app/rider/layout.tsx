'use client';

import { useAuth } from '@/lib/auth/context';
import { useTranslation } from '@/lib/i18n/context';
import { usePlatform } from '@/lib/store/platform-store';
import { useRouter } from 'next/navigation';

export default function RiderLayout({ children }: { children: React.ReactNode }) {
  const { switchRole } = useAuth();
  const { locale, setLocale } = useTranslation();
  const { isRiderOnDuty, toggleRiderDuty, riderCashInHand } = usePlatform();
  const router = useRouter();

  return (
    <div className="rider-shell">
      {/* Top Rider Bar */}
      <header style={{
        background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
        color: '#fff',
        padding: '16px 20px',
        boxShadow: '0 4px 20px rgba(6,78,59,0.2)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              boxShadow: '0 4px 10px rgba(16,185,129,0.3)',
            }}>
              🛵
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h1 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#fff' }}>
                  {locale === 'te' ? 'వెంకట్ రెడ్డి' : 'Venkat Reddy'}
                </h1>
                <span style={{
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  background: 'rgba(16, 185, 129, 0.25)',
                  color: '#6ee7b7',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  padding: '2px 6px',
                  borderRadius: 4,
                }}>
                  FLEET PILOT
                </span>
              </div>
              <p style={{ fontSize: '0.72rem', color: '#a7f3d0', margin: '2px 0 0' }}>
                Bajaj Pulsar • AP 05 AB 1234 • COD Float: ₹{riderCashInHand.toFixed(0)}
              </p>
            </div>
          </div>

          {/* Quick Role & Language Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => setLocale(locale === 'en' ? 'te' : 'en')}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#fff',
                padding: '5px 9px',
                borderRadius: 8,
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {locale === 'en' ? '🇮🇳 తెలుగు' : '🇬🇧 EN'}
            </button>
            <button
              onClick={() => {
                switchRole('customer');
                router.push('/app');
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#fff',
                padding: '5px 12px',
                borderRadius: 8,
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Customer View →
            </button>
          </div>
        </div>

        {/* Duty Toggle Strip */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: isRiderOnDuty ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.25)',
          border: isRiderOnDuty ? '1px solid rgba(74, 222, 128, 0.3)' : '1px solid rgba(248, 113, 113, 0.3)',
          borderRadius: 10,
          padding: '8px 14px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: isRiderOnDuty ? '#4ade80' : '#f87171',
              boxShadow: isRiderOnDuty ? '0 0 10px #4ade80' : 'none',
            }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: isRiderOnDuty ? '#a7f3d0' : '#fca5a5' }}>
              {isRiderOnDuty
                ? (locale === 'te' ? 'ఆన్‌లైన్ • డెలివరీ ఆర్డర్‌లు అందుబాటులో ఉన్నాయి' : 'ON DUTY • Receiving delivery gigs in Gandhi Nagar')
                : (locale === 'te' ? 'ఆఫ్‌లైన్ • విశ్రాంతి మోడ్' : 'OFF DUTY • Offline')}
            </span>
          </div>

          <button
            onClick={toggleRiderDuty}
            style={{
              padding: '5px 14px',
              borderRadius: 20,
              background: isRiderOnDuty ? '#dc2626' : '#16a34a',
              color: '#fff',
              border: 'none',
              fontSize: '0.72rem',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {isRiderOnDuty ? (locale === 'te' ? 'ఆఫ్‌లైన్' : 'Go Offline') : (locale === 'te' ? 'ఆన్‌లైన్' : 'Go Online')}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="page-content" style={{ paddingBottom: 60 }}>
        {children}
      </main>
    </div>
  );
}
