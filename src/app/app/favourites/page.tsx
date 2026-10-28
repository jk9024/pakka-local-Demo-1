'use client';

import { useTranslation } from '@/lib/i18n/context';
import { RESTAURANTS, MENU_ITEMS } from '@/lib/mock-data';
import Link from 'next/link';

export default function FavouritesPage() {
  const { t, locale } = useTranslation();

  const favRestaurants = RESTAURANTS.slice(0, 3);
  const favItems = MENU_ITEMS.filter(m => m.is_bestseller).slice(0, 4);

  return (
    <div style={{ padding: '16px 16px 90px', background: '#f8fafc', minHeight: '100dvh' }}>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: 4, letterSpacing: '-0.02em' }}>
        ❤️ {locale === 'te' ? 'మీ ఇష్టమైనవి' : 'Your Favourites'}
      </h1>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 20 }}>
        {locale === 'te'
          ? 'మీకు అత్యంత ఇష్టమైన రెస్టారెంట్లు మరియు వంటకాలు'
          : 'Your go-to restaurants and delicacies in one place'}
      </p>

      {/* Favourite Restaurants Section */}
      <h2 style={{ fontSize: '1.05rem', fontWeight: 900, marginBottom: 12 }}>
        🏪 {locale === 'te' ? 'ఇష్టమైన రెస్టారెంట్లు' : 'Favourite Restaurants'}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
        {favRestaurants.map(r => (
          <Link
            key={r.id}
            href={`/app/restaurant/${r.id}`}
            className="card"
            style={{
              padding: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                background: '#e2e8f0',
                flexShrink: 0,
              }}>
                <img
                  src={r.cover_photo_url}
                  alt={r.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 900, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {locale === 'te' ? r.name_te : r.name}
                </h3>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                  marginTop: 3,
                }}>
                  <div className="swiggy-rating" style={{ fontSize: '0.68rem', padding: '1px 5px' }}>
                    ★ {r.rating}
                  </div>
                  <span>•</span>
                  <span>{r.delivery_time_range}</span>
                  <span>•</span>
                  <span>{r.distance}</span>
                </div>
              </div>
            </div>
            <span style={{ fontSize: '1.2rem', color: '#ef4444' }}>❤️</span>
          </Link>
        ))}
      </div>

      {/* Favourite Dishes Section */}
      <h2 style={{ fontSize: '1.05rem', fontWeight: 900, marginBottom: 12 }}>
        🍲 {locale === 'te' ? 'జనాదరణ పొందిన వంటకాలు' : 'Your Favourite Dishes'}
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {favItems.map(item => (
          <Link
            key={item.id}
            href={`/app/restaurant/${item.restaurant_id}`}
            className="card"
            style={{
              overflow: 'hidden',
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ width: '100%', height: 110, position: 'relative', background: '#e2e8f0' }}>
              <img
                src={item.photo_url}
                alt={item.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', top: 6, left: 6 }}>
                <div className={item.is_veg ? 'veg-icon' : 'nonveg-icon'} />
              </div>
              <div style={{ position: 'absolute', top: 6, right: 6, fontSize: '0.9rem' }}>
                ❤️
              </div>
            </div>

            <div style={{ padding: 10 }}>
              <div style={{
                fontSize: '0.88rem',
                fontWeight: 800,
                marginBottom: 2,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {locale === 'te' ? item.name_te : item.name}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--text-main)' }}>
                  ₹{item.price}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 800 }}>
                  Order →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
