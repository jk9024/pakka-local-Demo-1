'use client';

import { useState, use } from 'react';
import { useTranslation } from '@/lib/i18n/context';
import { useCart } from '@/lib/cart/context';
import { usePlatform } from '@/lib/store/platform-store';
import { CATEGORIES } from '@/lib/mock-data';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RestaurantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t, locale } = useTranslation();
  const { items, addItem, updateQuantity, restaurantId, itemCount, subtotal } = useCart();
  const { restaurants, menuItems } = usePlatform();
  const router = useRouter();

  const [vegOnly, setVegOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFav, setIsFav] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const restaurant = restaurants.find(r => r.id === id);

  if (!restaurant) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2>{locale === 'te' ? 'రెస్టారెంట్ కనుగొనబడలేదు' : 'Restaurant not found'}</h2>
        <Link href="/app" className="btn-primary" style={{ marginTop: 20 }}>
          {locale === 'te' ? 'హోమ్‌కు తిరిగి వెళ్ళండి' : 'Back to Home'}
        </Link>
      </div>
    );
  }

  const categories = CATEGORIES.filter(c => c.restaurant_id === id && c.is_active);
  const allRestaurantItems = menuItems.filter(m => m.restaurant_id === id);

  const filteredItems = allRestaurantItems.filter(item => {
    if (vegOnly && !item.is_veg) return false;
    if (selectedCategory !== 'all' && item.category_id !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.name_te.includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getItemQuantity = (itemId: string) => {
    const ci = items.find(i => i.menu_item.id === itemId);
    return ci ? ci.quantity : 0;
  };

  const isDifferentRestaurantInCart = restaurantId && restaurantId !== restaurant.id && items.length > 0;

  return (
    <div style={{ paddingBottom: itemCount > 0 ? 110 : 40, background: '#ffffff', minHeight: '100dvh' }}>
      {/* ============================================================
          1. Swiggy Top Navigation Bar
          ============================================================ */}
      <div style={{
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        background: '#ffffff',
        zIndex: 50,
        borderBottom: '1px solid #f1f5f9',
      }}>
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

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => setIsFav(!isFav)}
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
              fontSize: '1rem',
              color: isFav ? '#ef4444' : '#64748b',
            }}
          >
            {isFav ? '❤️' : '🤍'}
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: restaurant.name, url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Restaurant link copied to clipboard!');
              }
            }}
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
              fontSize: '1rem',
            }}
          >
            📤
          </button>
        </div>
      </div>

      {/* ============================================================
          2. Restaurant Hero Info Card (Zomato / Swiggy Signature)
          ============================================================ */}
      <div style={{ padding: '16px 16px 12px' }}>
        <div style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid #e2e8f0',
          padding: '18px 16px',
          boxShadow: '0 8px 30px rgba(15, 23, 42, 0.06)',
          position: 'relative',
        }}>
          {/* Header Line */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <div>
              <h1 style={{
                fontSize: '1.35rem',
                fontWeight: 900,
                color: 'var(--text-main)',
                margin: 0,
                letterSpacing: '-0.02em',
              }}>
                {locale === 'te' ? restaurant.name_te : restaurant.name}
              </h1>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '3px 0 0' }}>
                {restaurant.cuisines.join(', ')}
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                📍 {restaurant.address_text} • {restaurant.distance}
              </p>
            </div>

            {/* Rating Pill */}
            <div style={{ textAlign: 'right' }}>
              <div className="swiggy-rating" style={{ fontSize: '0.85rem', padding: '3px 8px' }}>
                <span>★</span>
                <span>{restaurant.rating}</span>
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 3 }}>
                {restaurant.total_ratings}+ ratings
              </div>
            </div>
          </div>

          {/* Delivery ETA & Cost for Two strip */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            borderTop: '1px solid #f1f5f9',
            paddingTop: 12,
            marginTop: 10,
            fontSize: '0.8rem',
            fontWeight: 800,
            color: 'var(--text-main)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span>⏱</span>
              <span>{restaurant.delivery_time_range}</span>
            </div>
            <span>•</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span>₹</span>
              <span>₹{restaurant.cost_for_two} for two</span>
            </div>
          </div>

          {/* Active Offer Chip inside Restaurant */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: '#fff7ed',
            border: '1px solid #fed7aa',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 12px',
            marginTop: 12,
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#c2410c',
          }}>
            <span>🏷️</span>
            <span>{restaurant.discount_tag || 'FLAT ₹50 OFF'} • Use coupon on checkout</span>
          </div>

          {/* Kitchen Pause Status Banner */}
          {restaurant.is_paused && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#fef2f2',
              border: '1.5px solid #fecaca',
              borderRadius: 'var(--radius-sm)',
              padding: '9px 12px',
              marginTop: 10,
              fontSize: '0.78rem',
              fontWeight: 800,
              color: '#b91c1c',
            }}>
              <span>🔴</span>
              <span>Kitchen is temporarily paused and not accepting new orders at this moment.</span>
            </div>
          )}

          {/* Live Partner Notice Banner */}
          {restaurant.notice_message && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: 'var(--radius-sm)',
              padding: '9px 12px',
              marginTop: 10,
              fontSize: '0.76rem',
              fontWeight: 700,
              color: '#1d4ed8',
            }}>
              <span>📢</span>
              <span>Note from {restaurant.name}: {restaurant.notice_message}</span>
            </div>
          )}
        </div>
      </div>

      {/* Cart warning if switching restaurants */}
      {isDifferentRestaurantInCart && (
        <div style={{
          margin: '0 16px 12px',
          padding: '10px 14px',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: 'var(--radius-md)',
          color: '#b91c1c',
          fontSize: '0.78rem',
          fontWeight: 600,
        }}>
          ⚠️ {locale === 'te'
            ? 'మీ కార్ట్‌లో మరొక రెస్టారెంట్ వస్తువులు ఉన్నాయి. జోడిస్తే మునుపటివి తొలగించబడతాయి.'
            : 'Your cart contains items from another restaurant. Adding items here will reset the cart.'}
        </div>
      )}

      {/* ============================================================
          3. Menu Search & Veg-Only Filter Bar
          ============================================================ */}
      <div style={{
        padding: '0 16px 10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
      }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            type="search"
            placeholder={locale === 'te' ? 'మెనూలో శోధించండి...' : 'Search within menu...'}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="input"
            style={{
              padding: '8px 12px',
              fontSize: '0.82rem',
              borderRadius: 'var(--radius-md)',
              background: '#f8fafc',
            }}
          />
        </div>

        {/* Veg Only Toggle */}
        <button
          onClick={() => setVegOnly(!vegOnly)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: vegOnly ? '#f0fdf4' : '#ffffff',
            border: vegOnly ? '1.5px solid var(--veg-green)' : '1px solid #cbd5e1',
            borderRadius: 'var(--radius-full)',
            padding: '6px 12px',
            cursor: 'pointer',
            fontSize: '0.78rem',
            fontWeight: 800,
            color: vegOnly ? 'var(--veg-green)' : 'var(--text-secondary)',
          }}
        >
          <span className="veg-icon" style={{ width: 14, height: 14 }} />
          <span>Veg</span>
        </button>
      </div>

      {/* Categories Tabs */}
      <div className="no-scrollbar" style={{
        display: 'flex',
        gap: 8,
        overflowX: 'auto',
        padding: '0 16px 12px',
        borderBottom: '1px solid #f1f5f9',
      }}>
        <button
          onClick={() => setSelectedCategory('all')}
          className={`filter-pill ${selectedCategory === 'all' ? 'active' : ''}`}
        >
          {locale === 'te' ? 'అన్నీ' : 'All Dishes'} ({allRestaurantItems.length})
        </button>
        {categories.map(cat => {
          const count = allRestaurantItems.filter(i => i.category_id === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`filter-pill ${selectedCategory === cat.id ? 'active' : ''}`}
            >
              {locale === 'te' ? cat.name_te : cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* ============================================================
          4. Swiggy Two-Column Menu Items List
          ============================================================ */}
      <div style={{ padding: '0 16px' }}>
        {filteredItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '2rem', marginBottom: 6 }}>🍲</p>
            <p style={{ fontSize: '0.85rem' }}>
              {locale === 'te' ? 'వస్తువులు కనుగొనబడలేదు' : 'No items match your filter'}
            </p>
          </div>
        ) : (
          filteredItems.map(item => {
            const qty = getItemQuantity(item.id);
            return (
              <div key={item.id} className="menu-item-row">
                {/* Left: Dish Details */}
                <div className="menu-item-details">
                  {/* Veg/Non-Veg & Bestseller */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <div className={item.is_veg ? 'veg-icon' : 'nonveg-icon'} />
                    {item.is_bestseller && (
                      <span style={{
                        color: '#d97706',
                        fontSize: '0.68rem',
                        fontWeight: 900,
                        letterSpacing: '0.02em',
                      }}>
                        ★ BESTSELLER
                      </span>
                    )}
                  </div>

                  {/* Title & Price */}
                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: 800,
                    color: 'var(--text-main)',
                    margin: '2px 0 3px',
                    letterSpacing: '-0.01em',
                  }}>
                    {locale === 'te' ? item.name_te : item.name}
                  </h3>
                  <div style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: 4 }}>
                    ₹{item.price}
                  </div>

                  {/* Rating if available */}
                  {item.rating && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                      <span style={{ color: 'var(--rating-green)', fontSize: '0.75rem', fontWeight: 800 }}>
                        ★ {item.rating}
                      </span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                        ({item.rating_count})
                      </span>
                    </div>
                  )}

                  {/* Description */}
                  <p style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.4,
                    margin: 0,
                    width: '100%',
                  }}>
                    {locale === 'te' ? item.description_te : item.description}
                  </p>
                </div>

                {/* Right: Media + Swiggy Floating ADD Button */}
                <div className="menu-item-media">
                  <img
                    src={item.photo_url || restaurant.cover_photo_url}
                    alt={item.name}
                    className="menu-item-img"
                    loading="lazy"
                  />

                  {/* Floating Add Button / Stepper */}
                  {qty === 0 ? (
                    <button
                      onClick={() => addItem(item, restaurant.id, restaurant.name)}
                      disabled={!restaurant.is_open || !item.is_available}
                      className="swiggy-add-btn"
                    >
                      ADD
                    </button>
                  ) : (
                    <div className="swiggy-stepper">
                      <button onClick={() => updateQuantity(item.id, qty - 1)}>
                        −
                      </button>
                      <span>{qty}</span>
                      <button onClick={() => updateQuantity(item.id, qty + 1)}>
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ============================================================
          5. Floating Swiggy Cart Bar
          ============================================================ */}
      {itemCount > 0 && (
        <div
          onClick={() => router.push('/app/cart')}
          className="swiggy-floating-cart"
        >
          <div>
            <div style={{ fontSize: '0.75rem', opacity: 0.9, fontWeight: 700, letterSpacing: '0.04em' }}>
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
