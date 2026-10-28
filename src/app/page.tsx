'use client';

import { useAuth } from '@/lib/auth/context';
import { useTranslation } from '@/lib/i18n/context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace('/auth');
      return;
    }

    // Route based on role
    switch (user?.role) {
      case 'restaurant_owner':
        router.replace('/restaurant');
        break;
      case 'rider':
        router.replace('/rider');
        break;
      case 'admin':
      case 'support_agent':
        router.replace('/admin');
        break;
      default:
        router.replace('/app');
    }
  }, [isAuthenticated, isLoading, user, router]);

  return (
    <div className="app-shell" style={{ alignItems: 'center', justifyContent: 'center', minHeight: '100dvh' }}>
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        {/* Animated saffron spinner */}
        <div style={{
          width: 56,
          height: 56,
          margin: '0 auto 20px',
          border: '3px solid var(--border-default)',
          borderTopColor: 'var(--saffron-500)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: 700,
          background: 'linear-gradient(135deg, var(--saffron-600), var(--spice-600))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 4,
        }}>
          {t('common.appName')}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          {t('common.loading')}
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
