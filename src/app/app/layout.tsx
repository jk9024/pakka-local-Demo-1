'use client';

import { useAuth } from '@/lib/auth/context';
import { CartProvider } from '@/lib/cart/context';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { useTranslation } from '@/lib/i18n/context';

const NAV_ITEMS = [
  { key: 'home', path: '/app', icon: '🏠' },
  { key: 'orders', path: '/app/orders', icon: '📋' },
  { key: 'favourites', path: '/app/favourites', icon: '❤️' },
  { key: 'offers', path: '/app/offers', icon: '🏷️' },
  { key: 'profile', path: '/app/profile', icon: '👤' },
];

function BottomNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map(item => {
        const isActive = item.path === '/app' 
          ? pathname === '/app' 
          : pathname.startsWith(item.path);

        return (
          <button
            key={item.key}
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => router.push(item.path)}
          >
            <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{item.icon}</span>
            <span>{t(`customer.${item.key}`)}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="app-shell" style={{ alignItems: 'center', justifyContent: 'center', minHeight: '100dvh' }}>
        <div style={{
          width: 40, height: 40,
          border: '3px solid var(--border-default)',
          borderTopColor: 'var(--saffron-500)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <CartProvider>
      <div className="app-shell">
        <div className="page-content">
          <Suspense fallback={null}>
            {children}
          </Suspense>
        </div>

        {/* Bottom Navigation wrapped in Suspense for PPR streaming */}
        <Suspense fallback={<nav className="bottom-nav" />}>
          <BottomNavigation />
        </Suspense>
      </div>
    </CartProvider>
  );
}
