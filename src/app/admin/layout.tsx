'use client';

import { useAuth } from '@/lib/auth/context';
import { useTranslation } from '@/lib/i18n/context';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { switchRole } = useAuth();
  const { locale, setLocale } = useTranslation();
  const router = useRouter();

  return (
    <div className="admin-shell">
      {/* Top Admin Bar */}
      <header style={{
        background: 'linear-gradient(135deg, #0f172a, #1e293b)',
        color: '#fff',
        padding: '16px 20px',
        boxShadow: 'var(--shadow-md)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '1.6rem' }}>🛡️</span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h1 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#fff' }}>
                  {locale === 'te' ? 'మన రుచులు అడ్మిన్' : 'Mana Ruchulu Admin'}
                </h1>
                <span className="badge badge-herb" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                  OPERATIONS
                </span>
              </div>
              <p style={{ fontSize: '0.72rem', opacity: 0.8, margin: '2px 0 0' }}>
                Platform Control & Monitoring
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => setLocale(locale === 'en' ? 'te' : 'en')}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                border: 'none',
                color: '#fff',
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
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
                border: 'none',
                color: '#fff',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ← Customer View
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="page-content" style={{ paddingBottom: 40 }}>
        {children}
      </main>
    </div>
  );
}
