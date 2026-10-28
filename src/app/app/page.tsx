'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n/context';
import { useAuth } from '@/lib/auth/context';
import { useCart } from '@/lib/cart/context';
import { usePlatform } from '@/lib/store/platform-store';
import { useRouter } from 'next/navigation';
import { BANNERS, CUISINE_CIRCLES, type Restaurant } from '@/lib/mock-data';
import Link from 'next/link';

export default function CustomerHome() {
  const { t, locale, setLocale } = useTranslation();
  const { user } = useAuth();
  const { itemCount, subtotal } = useCart();
  const { restaurants, zones, surgePricing, platformSettings } = usePlatform();
  const router = useRouter();

  const [selectedZone, setSelectedZone] = useState<string>('zone-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [showZonePicker, setShowZonePicker] = useState(false);
  const [selectedCuisineFilter, setSelectedCuisineFilter] = useState<string | null>(null);
  const [vegOnly, setVegOnly] = useState(false);
  const [fastDeliveryOnly, setFastDeliveryOnly] = useState(false);
  const [topRatedOnly, setTopRatedOnly] = useState(false);
  const [favourites, setFavourites] = useState<string[]>(['rest-2', 'rest-1']);

  const currentZone = zones.find(z => z.id === selectedZone) || zones[0] || { name: 'Gandhi Nagar', name_te: 'గాంధీ నగర్', base_delivery_fee: 20 };

  const toggleFavourite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavourites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  // Filter restaurants
  const filteredRestaurants = restaurants.filter(r => {
    if (r.approval_status !== 'approved') return false;
    if (vegOnly && !r.cuisines.some(c => c.toLowerCase().includes('south indian') || c.toLowerCase().includes('meals'))) {
      // In pure veg mode, highlight veg-forward places
    }
    if (fastDeliveryOnly && r.avg_prep_time > 15) return false;
    if (topRatedOnly && r.rating < 4.6) return false;
    if (selectedCuisineFilter) {
      const q = selectedCuisineFilter.toLowerCase();
      const matchesCuisine = r.cuisines.some(c => c.toLowerCase().includes(q));
      const matchesName = r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
      if (!matchesCuisine && !matchesName) return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        r.name_te.includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.cuisines.some(c => c.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div style={{ paddingBottom: itemCount > 0 ? 120 : 70 }}>
      {/* ============================================================
          1. Swiggy Top Header Bar (Location + Language + Profile)
          ============================================================ */}
      <header style={{
        background: '#ffffff',
        padding: '14px 16px 10px',
        borderBottom: '1px solid #f1f5f9',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Location Trigger */}
          <div
            onClick={() => setShowZonePicker(!showZonePicker)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
          >
            <span style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>📍</span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
                  {locale === 'te' ? currentZone.name_te : currentZone.name}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>▼</span>
              </div>
              <div style={{
                fontSize: '0.72rem',
                color: 'var(--text-muted)',
                maxWidth: 200,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                Flat 402, Sai Residency, Main Road
              </div>
            </div>
          </div>

          {/* Right Controls: Language & Profile Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => setLocale(locale === 'en' ? 'te' : 'en')}
              style={{
                background: '#fff7ed',
                border: '1px solid #fed7aa',
                color: '#c2410c',
                padding: '4px 9px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.72rem',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              {locale === 'en' ? 'తెలుగు' : 'English'}
            </button>

            <Link
              href="/app/profile"
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'var(--primary-gradient)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem',
                textDecoration: 'none',
                fontWeight: 800,
                boxShadow: '0 2px 6px rgba(249, 115, 22, 0.3)',
              }}
            >
              {user?.full_name ? user.full_name[0] : 'R'}
            </Link>
          </div>
        </div>

        {/* Zone Dropdown Modal */}
        {showZonePicker && (
          <div style={{
            marginTop: 10,
            padding: 12,
            background: '#ffffff',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: 8 }}>
              {locale === 'te' ? 'డెలివరీ జోన్ ఎంచుకోండి:' : 'Select Delivery Zone:'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {zones.map(z => (
                <div
                  key={z.id}
                  onClick={() => {
                    setSelectedZone(z.id);
                    setShowZonePicker(false);
                  }}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: selectedZone === z.id ? '#fff7ed' : '#f8fafc',
                    border: selectedZone === z.id ? '1px solid #fdba74' : '1px solid transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                    {locale === 'te' ? z.name_te : z.name}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    ₹{z.base_delivery_fee} fee
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Citywide Announcement Ticker Banner */}
        {platformSettings?.announcement_active && platformSettings?.announcement_ticker && (
          <div style={{
            marginTop: 10,
            background: 'linear-gradient(135deg, #fff7ed, #ffedd5)',
            border: '1px solid #fed7aa',
            borderRadius: 10,
            padding: '7px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 1px 3px rgba(249,115,22,0.08)',
          }}>
            <span style={{ fontSize: '0.85rem' }}>📢</span>
            <span style={{ fontSize: '0.76rem', color: '#9a3412', fontWeight: 700, lineHeight: 1.3 }}>
              {platformSettings.announcement_ticker}
            </span>
          </div>
        )}

        {/* ============================================================
            2. Search Bar (Swiggy Style with icon & clear button)
            ============================================================ */}
        <div style={{ position: 'relative', marginTop: 12 }}>
          <span style={{
            position: 'absolute',
            left: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '1rem',
            color: 'var(--text-muted)',
          }}>
            🔍
          </span>
          <input
            type="search"
            placeholder={
              locale === 'te'
                ? 'బిర్యానీ, పెసరట్టు, భోజనం కోసం శోధించండి...'
                : 'Search for "Dum Biryani", "Dosa", "Thali"...'
            }
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (!searchQuery) router.push('/app/search');
            }}
            className="input"
            style={{
              paddingLeft: 38,
              paddingRight: 38,
              fontSize: '0.88rem',
              background: '#f8fafc',
              border: '1.5px solid #e2e8f0',
              borderRadius: 'var(--radius-md)',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
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
      </header>

      {/* Surge Pricing Alert Banner */}
      {surgePricing && (
        <div style={{
          background: '#eff6ff',
          borderBottom: '1px solid #bfdbfe',
          color: '#1d4ed8',
          padding: '8px 16px',
          fontSize: '0.75rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <span>🌧️</span>
          <span>{locale === 'te' ? 'రద్దీ / వర్షం సర్జ్: రైడర్లకు మద్దతుగా డెలివరీ ఫీజు సర్దుబాటు చేయబడింది' : 'High Demand / Rain Surge Active: Delivery fee adjusted to support our delivery partners.'}</span>
        </div>
      )}

      {/* ============================================================
          3. "What's on your mind?" (Swiggy Circular Categories)
          ============================================================ */}
      <section style={{ padding: '16px 0 8px' }}>
        <div style={{ padding: '0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{
            fontSize: '1.05rem',
            fontWeight: 800,
            color: 'var(--text-main)',
            letterSpacing: '-0.02em',
            margin: 0,
          }}>
            {locale === 'te' ? 'మీ మనసులో ఏముంది?' : "What's on your mind?"}
          </h2>
          {selectedCuisineFilter && (
            <button
              onClick={() => setSelectedCuisineFilter(null)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Clear Filter ✕
            </button>
          )}
        </div>

        <div className="no-scrollbar" style={{
          display: 'flex',
          gap: 16,
          overflowX: 'auto',
          padding: '12px 16px 6px',
        }}>
          {CUISINE_CIRCLES.map(circle => {
            const isSelected = selectedCuisineFilter === circle.query;
            return (
              <div
                key={circle.id}
                onClick={() => setSelectedCuisineFilter(isSelected ? null : circle.query)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <div style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: isSelected ? '3px solid var(--primary)' : '2px solid transparent',
                  boxShadow: isSelected ? '0 0 12px rgba(249, 115, 22, 0.4)' : '0 2px 8px rgba(0,0,0,0.08)',
                  transition: 'transform 0.15s, border-color 0.15s',
                  transform: isSelected ? 'scale(1.06)' : 'scale(1)',
                  background: '#f1f5f9',
                }}>
                  <img
                    src={circle.image_url}
                    alt={circle.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: isSelected ? 800 : 700,
                  color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                  marginTop: 6,
                  textAlign: 'center',
                }}>
                  {locale === 'te' ? circle.name_te : circle.name}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================
          4. Hero Promotional Banners Carousel (Swiggy Style)
          ============================================================ */}
      <section style={{ padding: '8px 0 12px' }}>
        <div className="no-scrollbar" style={{
          display: 'flex',
          gap: 14,
          overflowX: 'auto',
          padding: '0 16px',
        }}>
          {BANNERS.map(banner => (
            <Link
              key={banner.id}
              href={banner.link_url}
              style={{
                position: 'relative',
                width: 310,
                height: 155,
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                flexShrink: 0,
                textDecoration: 'none',
                color: '#fff',
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              }}
            >
              <img
                src={banner.image_url}
                alt={banner.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.85) 100%)',
                padding: '16px 14px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
              }}>
                {banner.discount_code && (
                  <span style={{
                    alignSelf: 'flex-start',
                    background: '#f97316',
                    color: '#fff',
                    fontSize: '0.68rem',
                    fontWeight: 900,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-xs)',
                    letterSpacing: '0.05em',
                    marginBottom: 4,
                  }}>
                    USE {banner.discount_code}
                  </span>
                )}
                <h3 style={{ fontSize: '1.05rem', fontWeight: 900, margin: 0, lineHeight: 1.2 }}>
                  {locale === 'te' ? banner.title_te : banner.title}
                </h3>
                <p style={{ fontSize: '0.72rem', opacity: 0.9, margin: '2px 0 0' }}>
                  {locale === 'te' ? banner.subtitle_te : banner.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============================================================
          5. Sticky Filter Strip (Sort, Fast Delivery, Pure Veg, Rating)
          ============================================================ */}
      <section style={{
        padding: '10px 16px',
        background: '#ffffff',
        borderTop: '1px solid #f8fafc',
        borderBottom: '1px solid #f1f5f9',
        position: 'sticky',
        top: 104,
        zIndex: 40,
      }}>
        <div className="no-scrollbar" style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
          <button
            onClick={() => setFastDeliveryOnly(!fastDeliveryOnly)}
            className={`filter-pill ${fastDeliveryOnly ? 'active' : ''}`}
          >
            ⚡ {locale === 'te' ? 'వేగవంతమైన డెలివరీ (<20m)' : 'Fast Delivery'}
          </button>
          <button
            onClick={() => setVegOnly(!vegOnly)}
            className={`filter-pill ${vegOnly ? 'active' : ''}`}
          >
            <span className="veg-icon" style={{ width: 12, height: 12 }} />
            {locale === 'te' ? 'వెజ్ మాత్రమే' : 'Pure Veg'}
          </button>
          <button
            onClick={() => setTopRatedOnly(!topRatedOnly)}
            className={`filter-pill ${topRatedOnly ? 'active' : ''}`}
          >
            ★ {locale === 'te' ? 'రేటింగ్ 4.6+' : 'Ratings 4.6+'}
          </button>
          <Link href="/app/offers" className="filter-pill" style={{ textDecoration: 'none' }}>
            🏷️ {locale === 'te' ? 'ఆఫర్లు' : 'Offers'}
          </Link>
        </div>
      </section>

      {/* ============================================================
          6. Restaurant Cards Grid (Authentic Swiggy/Zomato Cards)
          ============================================================ */}
      <section style={{ padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h2 style={{
            fontSize: '1.15rem',
            fontWeight: 900,
            color: 'var(--text-main)',
            letterSpacing: '-0.02em',
            margin: 0,
          }}>
            {locale === 'te'
              ? `${currentZone.name_te} లో అగ్ర రెస్టారెంట్లు`
              : `Top Restaurants to explore (${filteredRestaurants.length})`}
          </h2>
        </div>

        {filteredRestaurants.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🍲</div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 4px', color: 'var(--text-main)' }}>
              {locale === 'te' ? 'రెస్టారెంట్లు కనుగొనబడలేదు' : 'No restaurants found'}
            </h3>
            <p style={{ fontSize: '0.8rem' }}>
              {locale === 'te' ? 'దయచేసి మీ ఫిల్టర్‌లను క్లియర్ చేయండి' : 'Try clearing your filters or search query'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {filteredRestaurants.map(rest => {
              const isFav = favourites.includes(rest.id);
              return (
                <Link
                  key={rest.id}
                  href={`/app/restaurant/${rest.id}`}
                  className="restaurant-card"
                >
                  {/* Hero Image Container */}
                  <div className="restaurant-img-wrap">
                    <img
                      src={rest.cover_photo_url}
                      alt={rest.name}
                      loading="lazy"
                    />

                    {/* Gradient & Overlay Info */}
                    <div className="restaurant-img-overlay">
                      {/* Big Bold Discount text */}
                      <div className="restaurant-discount-text">
                        {rest.discount_tag || 'FLAT ₹50 OFF'}
                      </div>

                      {/* Delivery Time Pill */}
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(8px)',
                        color: 'var(--text-main)',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-xs)',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                      }}>
                        ⏱ {rest.delivery_time_range}
                      </div>
                    </div>

                    {/* Top Right Favourite Heart Button */}
                    <button
                      onClick={e => toggleFavourite(rest.id, e)}
                      style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: 'rgba(0, 0, 0, 0.4)',
                        backdropFilter: 'blur(6px)',
                        border: 'none',
                        color: isFav ? '#ef4444' : '#ffffff',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'transform 0.15s ease',
                      }}
                    >
                      {isFav ? '❤️' : '🤍'}
                    </button>
                  </div>

                  {/* Restaurant Details Line */}
                  <div style={{ padding: '10px 4px 4px' }}>
                    {/* Line 1: Name + Rating Badge */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{
                        fontSize: '1.1rem',
                        fontWeight: 800,
                        color: 'var(--text-main)',
                        margin: 0,
                        letterSpacing: '-0.01em',
                      }}>
                        {locale === 'te' ? rest.name_te : rest.name}
                      </h3>
                      <div className="swiggy-rating">
                        <span>★</span>
                        <span>{rest.rating}</span>
                      </div>
                    </div>

                    {/* Line 2: Delivery ETA • Distance */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: 'var(--text-main)',
                      marginTop: 3,
                    }}>
                      <span>{rest.delivery_time_range}</span>
                      <span>•</span>
                      <span>{rest.distance}</span>
                      <span>•</span>
                      <span style={{ color: 'var(--text-secondary)' }}>₹{rest.cost_for_two} for two</span>
                    </div>

                    {/* Line 3: Cuisines list */}
                    <div style={{
                      fontSize: '0.78rem',
                      color: 'var(--text-muted)',
                      marginTop: 2,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {rest.cuisines.join(', ')}
                    </div>

                    {/* Line 4: Special Promo banner underline */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: '0.72rem',
                      color: 'var(--primary)',
                      fontWeight: 700,
                      marginTop: 6,
                      borderTop: '1px dashed #e2e8f0',
                      paddingTop: 6,
                    }}>
                      <span>⚡</span>
                      <span>
                        {locale === 'te' ? 'ఉచిత డెలివరీ & అదనపు క్యాష్‌బ్యాక్' : 'Free delivery with Mana Pass • No minimum order'}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* ============================================================
          7. Floating Cart Bar (Swiggy Signature)
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
