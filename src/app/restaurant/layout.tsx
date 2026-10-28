'use client';

import { useAuth } from '@/lib/auth/context';
import { useTranslation } from '@/lib/i18n/context';
import { usePlatform } from '@/lib/store/platform-store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RestaurantLayout({ children }: { children: React.ReactNode }) {
  const { switchRole } = useAuth();
  const { locale, setLocale } = useTranslation();
  const { restaurants, toggleRestaurantOpen, orders } = usePlatform();
  const router = useRouter();

  const currentRestaurant = restaurants.find(r => r.id === 'rest-1') || restaurants[0];
  const isOpen = currentRestaurant?.is_open ?? currentRestaurant?.is_active ?? true;
  const pendingOrdersCount = orders.filter(
    o => o.restaurant_id === currentRestaurant?.id && (o.status === 'placed' || o.status === 'accepted' || o.status === 'confirmed' || o.status === 'preparing')
  ).length;

  return (
    <div className="merchant-shell">
      {/* Top Restaurant Bar */}
      <header style={{
        background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
        color: '#fff',
        padding: '16px 20px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
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
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              boxShadow: '0 4px 10px rgba(249,115,22,0.3)',
            }}>
              🏪
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h1 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#fff', letterSpacing: '-0.01em' }}>
                  {locale === 'te' ? currentRestaurant?.name_te || currentRestaurant?.name : currentRestaurant?.name}
                </h1>
                <span style={{
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  background: 'rgba(249, 115, 22, 0.25)',
                  color: '#fb923c',
                  border: '1px solid rgba(249, 115, 22, 0.4)',
                  padding: '2px 6px',
                  borderRadius: 4,
                }}>
                  MERCHANT
                </span>
                {pendingOrdersCount > 0 && (
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    background: '#ef4444',
                    color: '#fff',
                    padding: '2px 8px',
                    borderRadius: 99,
                    animation: 'pulse 1.5s infinite',
                  }}>
                    {pendingOrdersCount} Active
                  </span>
                )}
              </div>
              <p style={{ fontSize: '0.72rem', color: '#9ca3af', margin: '2px 0 0' }}>
                {currentRestaurant?.address_text || currentRestaurant?.area || 'Gandhi Nagar'} • Outlet ID: #{currentRestaurant?.id?.toUpperCase() || 'REST-001'}
              </p>
            </div>
          </div>

          {/* Quick Role & Language Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => setLocale(locale === 'en' ? 'te' : 'en')}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
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
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
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

        {/* Store Live Switcher */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: isOpen ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
          border: isOpen ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: 10,
          padding: '8px 14px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: isOpen ? '#22c55e' : '#ef4444',
              boxShadow: isOpen ? '0 0 10px #22c55e' : 'none',
            }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: isOpen ? '#4ade80' : '#f87171' }}>
              {isOpen
                ? (locale === 'te' ? 'స్టోర్ ఆన్‌లైన్ • ఆర్డర్‌లు స్వీకరిస్తోంది' : 'STORE ONLINE • Accepting Orders')
                : (locale === 'te' ? 'స్టోర్ ఆఫ్‌లైన్ • కస్టమర్ల నుండి పాజ్ చేయబడింది' : 'STORE OFFLINE • Paused on Customer App')}
            </span>
          </div>

          <button
            onClick={() => currentRestaurant && toggleRestaurantOpen(currentRestaurant.id)}
            style={{
              padding: '5px 14px',
              borderRadius: 20,
              background: isOpen ? '#dc2626' : '#16a34a',
              color: '#fff',
              border: 'none',
              fontSize: '0.72rem',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {isOpen ? (locale === 'te' ? 'ఆఫ్‌లైన్ చేయండి' : 'Go Offline') : (locale === 'te' ? 'ఆన్‌లైన్ వెళ్లండి' : 'Go Online')}
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
