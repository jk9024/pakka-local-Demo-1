'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n/context';
import { usePlatform } from '@/lib/store/platform-store';
import { useCart } from '@/lib/cart/context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SearchPage() {
  const { locale } = useTranslation();
  const { restaurants, menuItems } = usePlatform();
  const { addItem, items, updateQuantity, itemCount, subtotal } = useCart();
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);

  const popularSearches = ['Biryani', 'Dosa', 'Pesarattu', 'Thali', 'Chicken 65', 'Filter Coffee'];

  // Match menu items
  const matchingItems = query.trim().length > 0
    ? menuItems.filter(item => {
        if (vegOnly && !item.is_veg) return false;
        const q = query.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.name_te.includes(q) ||
          item.description.toLowerCase().includes(q)
        );
      })
    : [];

  // Match restaurants
  const matchingRestaurants = query.trim().length > 0
    ? restaurants.filter(r => {
        const q = query.toLowerCase();
        return (
          r.name.toLowerCase().includes(q) ||
          r.name_te.includes(q) ||
          r.cuisines.some(c => c.toLowerCase().includes(q))
        );
      })
    : [];

  const getItemQuantity = (itemId: string) => {
    const ci = items.find(i => i.menu_item.id === itemId);
    return ci ? ci.quantity : 0;
  };

  return (
    <div style={{ paddingBottom: itemCount > 0 ? 120 : 60, background: '#ffffff', minHeight: '100dvh' }}>
      {/* Top Search Bar */}
      <div style={{
        padding: '14px 16px',
        position: 'sticky',
        top: 0,
        background: '#ffffff',
        zIndex: 50,
        borderBottom: '1px solid #f1f5f9',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => router.back()}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem',
            }}
          >
            ←
          </button>

          <div style={{ flex: 1, position: 'relative' }}>
            <span style={{
              position: 'absolute',
              left: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              fontSize: '1rem',
            }}>
              🔍
            </span>
            <input
              type="search"
              placeholder={locale === 'te' ? 'వంటకం లేదా రెస్టారెంట్ శోధించండి...' : 'Search for restaurant or dish...'}
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoFocus
              className="input"
              style={{
                paddingLeft: 38,
                paddingRight: 36,
                fontSize: '0.9rem',
                borderRadius: 'var(--radius-md)',
                background: '#f8fafc',
              }}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Veg Only Toggle */}
          <button
            onClick={() => setVegOnly(!vegOnly)}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              border: vegOnly ? '1.5px solid var(--veg-green)' : '1px solid #cbd5e1',
              background: vegOnly ? '#f0fdf4' : '#ffffff',
              color: vegOnly ? 'var(--veg-green)' : 'var(--text-secondary)',
              fontWeight: 800,
              fontSize: '0.75rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span className="veg-icon" style={{ width: 12, height: 12 }} />
            <span>Veg</span>
          </button>
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        {/* Popular Searches Tags when query is empty */}
        {!query && (
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: 10 }}>
              🔥 {locale === 'te' ? 'జనాదరణ పొందిన శోధనలు' : 'Popular Cuisines & Dishes'}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {popularSearches.map(term => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-full)',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    color: 'var(--text-main)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <span>🔍</span>
                  <span>{term}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results: Matching Restaurants */}
        {matchingRestaurants.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: 12, letterSpacing: '-0.01em' }}>
              🏪 {locale === 'te' ? 'రెస్టారెంట్లు' : 'Matching Restaurants'} ({matchingRestaurants.length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {matchingRestaurants.map(r => (
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 50,
                      height: 50,
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
                    <div>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 900, margin: 0 }}>
                        {locale === 'te' ? r.name_te : r.name}
                      </h3>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
                        ★ {r.rating} • {r.delivery_time_range} • {r.address_text}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 800 }}>
                    View →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Results: Matching Dishes with Direct +ADD */}
        {matchingItems.length > 0 && (
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: 12, letterSpacing: '-0.01em' }}>
              🍲 {locale === 'te' ? 'రుచికరమైన వంటకాలు' : 'Dishes'} ({matchingItems.length})
            </h2>
            <div>
              {matchingItems.map(item => {
                const rest = restaurants.find(r => r.id === item.restaurant_id);
                const qty = getItemQuantity(item.id);

                return (
                  <div key={item.id} className="menu-item-row" style={{ padding: '14px 0' }}>
                    <div className="menu-item-details">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <div className={item.is_veg ? 'veg-icon' : 'nonveg-icon'} />
                        {rest && (
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                            From {rest.name}
                          </span>
                        )}
                      </div>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '2px 0' }}>
                        {locale === 'te' ? item.name_te : item.name}
                      </h3>
                      <div style={{ fontSize: '0.9rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: 2 }}>
                        ₹{item.price}
                      </div>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0, maxWidth: 220 }}>
                        {locale === 'te' ? item.description_te : item.description}
                      </p>
                    </div>

                    <div className="menu-item-media">
                      <img
                        src={item.photo_url || rest?.cover_photo_url}
                        alt={item.name}
                        className="menu-item-img"
                      />
                      {qty === 0 ? (
                        <button
                          onClick={() => {
                            if (rest) addItem(item, rest.id, rest.name);
                          }}
                          className="swiggy-add-btn"
                        >
                          ADD
                        </button>
                      ) : (
                        <div className="swiggy-stepper">
                          <button onClick={() => updateQuantity(item.id, qty - 1)}>−</button>
                          <span>{qty}</span>
                          <button onClick={() => updateQuantity(item.id, qty + 1)}>+</button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* No Results */}
        {query && matchingRestaurants.length === 0 && matchingItems.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🔍</div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px' }}>
              No matches found for "{query}"
            </h3>
            <p style={{ fontSize: '0.78rem' }}>
              Try searching for "Biryani", "Dosa", or "Tiffins"
            </p>
          </div>
        )}
      </div>

      {/* Floating Cart Bar */}
      {itemCount > 0 && (
        <div
          onClick={() => router.push('/app/cart')}
          className="swiggy-floating-cart"
        >
          <div>
            <div style={{ fontSize: '0.75rem', opacity: 0.9, fontWeight: 700 }}>
              {itemCount} {itemCount === 1 ? 'ITEM' : 'ITEMS'} ADDED
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900 }}>
              ₹{subtotal.toFixed(2)}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 900, fontSize: '0.95rem' }}>
            <span>{locale === 'te' ? 'కార్ట్ చూడండి' : 'VIEW CART'}</span>
            <span style={{ fontSize: '1.2rem' }}>🛒 →</span>
          </div>
        </div>
      )}
    </div>
  );
}
