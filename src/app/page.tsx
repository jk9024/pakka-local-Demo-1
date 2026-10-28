'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n/context';
import { usePlatform } from '@/lib/store/platform-store';
import { CUISINE_CIRCLES } from '@/lib/mock-data';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { locale, setLocale } = useTranslation();
  const { restaurants, platformSettings } = usePlatform();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/app/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/app');
    }
  };

  return (
    <div style={{ minHeight: '100dvh', background: '#f8fafc', color: '#0f172a', width: '100%', overflowX: 'hidden' }}>
      {/* ============================================================
          1. Top Navigation Bar (Full Width Responsive Header)
          ============================================================ */}
      <header style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
      }}>
        <div style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}>
          {/* Brand Logo & Tagline */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/icon-192.png"
              alt="Pakka Local"
              style={{ width: 42, height: 42, borderRadius: 12, boxShadow: '0 4px 12px rgba(234, 88, 12, 0.35)' }}
            />
            <div>
              <div style={{
                fontSize: '1.3rem',
                fontWeight: 900,
                color: '#ea580c',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}>
                {locale === 'te' ? 'పక్కా లోకల్' : 'Pakka Local'}
              </div>
              <div className="brand-subtext" style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>
                {locale === 'te' ? 'పక్కా లోకల్. పక్కా టేస్టీ.' : 'Pakka local. Pakka tasty.'}
              </div>
            </div>
          </Link>

          {/* Right Header Navigation & Language */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('open-pwa-install'));
                }
              }}
              style={{
                background: '#fff7ed',
                border: '1px solid #fed7aa',
                color: '#c2410c',
                padding: '6px 10px',
                borderRadius: 99,
                fontSize: '0.75rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <span>📲</span>
              <span>{locale === 'te' ? 'యాప్' : 'Install'}</span>
            </button>

            <button
              onClick={() => setLocale(locale === 'en' ? 'te' : 'en')}
              style={{
                background: '#fff7ed',
                border: '1px solid #fed7aa',
                color: '#c2410c',
                padding: '6px 10px',
                borderRadius: 99,
                fontSize: '0.75rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <span>{locale === 'en' ? 'తెలుగు' : 'English'}</span>
            </button>

            <Link
              href="/app"
              className="header-order-btn"
              style={{
                background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                color: '#ffffff',
                textDecoration: 'none',
                padding: '7px 16px',
                borderRadius: 10,
                fontSize: '0.82rem',
                fontWeight: 800,
                boxShadow: '0 3px 10px rgba(234, 88, 12, 0.35)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span>{locale === 'te' ? 'ఆర్డర్ ప్రారంభించండి' : 'Order Now'}</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Announcement Ticker if enabled */}
      {platformSettings?.announcement_active && platformSettings?.announcement_ticker && (
        <div style={{
          background: 'linear-gradient(135deg, #ea580c, #c2410c)',
          color: '#ffffff',
          textAlign: 'center',
          padding: '8px 16px',
          fontSize: '0.82rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}>
          <span>⚡</span>
          <span>{platformSettings.announcement_ticker}</span>
        </div>
      )}

      {/* ============================================================
          2. Hero Section (Responsive Full Screen Showcase)
          ============================================================ */}
      <section style={{
        position: 'relative',
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
        color: '#ffffff',
        padding: '50px 20px 60px',
        overflow: 'hidden',
      }}>
        {/* Background Ambient Glow */}
        <div style={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 450,
          height: 450,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(234, 88, 12, 0.3) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(234, 88, 12, 0.25)',
            border: '1px solid rgba(234, 88, 12, 0.5)',
            color: '#fdba74',
            padding: '4px 14px',
            borderRadius: 99,
            fontSize: '0.78rem',
            fontWeight: 800,
            marginBottom: 16,
          }}>
            <span>🌶️</span>
            <span>{locale === 'te' ? 'విజయవాడ, గుంటూరు & హైదరాబాద్ పక్కా లోకల్ డెలివరీ' : 'Vijayawada • Guntur • Hyderabad Authentic Delivery'}</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(1.9rem, 5vw, 3.2rem)',
            fontWeight: 900,
            lineHeight: 1.18,
            margin: '0 auto 16px',
            maxWidth: 820,
            letterSpacing: '-0.02em',
          }}>
            {locale === 'te'
              ? 'ఘుమఘుమలాడే తెలుగు వంటకాలు, క్షణాల్లో మీ ఇంటి వద్దకే!'
              : 'Authentic Telugu Flavours Delivered Piping Hot to Your Doorstep'}
          </h1>

          <p style={{
            fontSize: 'clamp(0.95rem, 2vw, 1.15rem)',
            color: '#cbd5e1',
            margin: '0 auto 28px',
            maxWidth: 680,
            lineHeight: 1.5,
          }}>
            {locale === 'te'
              ? 'హైదరాబాదీ దమ్ బిర్యానీ, పెసరట్టు, నాటుకోడి పులుసు, మరియు నోరూరించే ఆంధ్ర భోజనం.'
              : 'Craving Hyderabadi Dum Biryani, Andhra Spicy Thali, Guntur Karam Dosa, or Natukodi Pulusu? Order now with Doorstep Pay on Delivery!'}
          </p>

          {/* Quick Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            style={{
              maxWidth: 580,
              margin: '0 auto 36px',
              display: 'flex',
              alignItems: 'center',
              background: '#ffffff',
              borderRadius: 16,
              padding: '6px 8px 6px 18px',
              boxShadow: '0 12px 36px rgba(0,0,0,0.3)',
            }}
          >
            <span style={{ fontSize: '1.2rem', color: '#94a3b8', marginRight: 10 }}>🔍</span>
            <input
              type="text"
              placeholder={locale === 'te' ? 'బిర్యానీ, దోస, భోజనం కోసం వెతకండి...' : 'Search for Dum Biryani, Dosa, Thali, Gongura...'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                fontSize: '0.95rem',
                fontWeight: 600,
                color: '#0f172a',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 12,
                padding: '12px 22px',
                fontSize: '0.9rem',
                fontWeight: 800,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {locale === 'te' ? 'శోధించండి' : 'Find Food'}
            </button>
          </form>

          {/* 3 Value Pillars */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
            maxWidth: 820,
            margin: '0 auto',
            textAlign: 'left',
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 14,
              padding: '14px 16px',
            }}>
              <div style={{ fontSize: '1.4rem', marginBottom: 4 }}>💵</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>Pay on Delivery</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Cash on Delivery or Doorstep UPI QR. No card hassles.</div>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 14,
              padding: '14px 16px',
            }}>
              <div style={{ fontSize: '1.4rem', marginBottom: 4 }}>🧭</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>Live Route Radar</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Simulated real-time pilot dispatch radar without API limits.</div>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 14,
              padding: '14px 16px',
            }}>
              <div style={{ fontSize: '1.4rem', marginBottom: 4 }}>🌐</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>తెలుగు & English</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Complete native Telugu language support across all features.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          3. 4-Portal Interactive Launchpad (Core Demo Center)
          ============================================================ */}
      <section style={{ maxWidth: 1200, margin: '-28px auto 0', padding: '0 20px', position: 'relative', zIndex: 20 }}>
        <div style={{
          background: '#ffffff',
          borderRadius: 20,
          padding: '24px',
          boxShadow: '0 14px 35px rgba(0,0,0,0.08)',
          border: '1px solid #e2e8f0',
        }}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#ea580c',
              background: '#fff7ed',
              padding: '3px 10px',
              borderRadius: 6,
            }}>
              Interactive Multi-Role Portals
            </span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, margin: '8px 0 4px', color: '#0f172a' }}>
              Select Any Role to Experience the Platform
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
              All 4 portals are live and fully synchronized in real-time.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 16,
          }}>
            {/* 1. Customer Card */}
            <Link
              href="/app"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                border: '1.5px solid #fed7aa',
                borderRadius: 16,
                padding: '20px',
                background: 'linear-gradient(180deg, #fffaf5 0%, #ffffff 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
            >
              <div>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #f97316, #ea580c)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  marginBottom: 14,
                  boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)',
                }}>
                  🛍️
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
                  Customer App
                </div>
                <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4, margin: '0 0 16px' }}>
                  Browse authentic restaurants, Swiggy-style circular carousels, custom cart, coupon discounts, and live route radar.
                </p>
              </div>
              <div style={{
                color: '#ea580c',
                fontSize: '0.85rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}>
                <span>Launch Customer View</span>
                <span>→</span>
              </div>
            </Link>

            {/* 2. Restaurant Merchant Card */}
            <Link
              href="/restaurant"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                border: '1.5px solid #fed7aa',
                borderRadius: 16,
                padding: '20px',
                background: 'linear-gradient(180deg, #fffaf5 0%, #ffffff 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
            >
              <div>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  marginBottom: 14,
                  boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
                }}>
                  🏪
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
                  Restaurant Merchant
                </div>
                <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4, margin: '0 0 16px' }}>
                  Live kitchen order manager (15/25/40m prep times), full menu dish CRUD, emergency kitchen pause, and settlement bank.
                </p>
              </div>
              <div style={{
                color: '#0284c7',
                fontSize: '0.85rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}>
                <span>Launch Kitchen Portal</span>
                <span>→</span>
              </div>
            </Link>

            {/* 3. Delivery Pilot Card */}
            <Link
              href="/rider"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                border: '1.5px solid #bbf7d0',
                borderRadius: 16,
                padding: '20px',
                background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
            >
              <div>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  marginBottom: 14,
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                }}>
                  🛵
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
                  Delivery Pilot Fleet
                </div>
                <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4, margin: '0 0 16px' }}>
                  On-duty toggle, simulated turn-by-turn route navigation, restaurant pickup PIN, and customer cash float collection.
                </p>
              </div>
              <div style={{
                color: '#059669',
                fontSize: '0.85rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}>
                <span>Launch Rider Cockpit</span>
                <span>→</span>
              </div>
            </Link>

            {/* 4. Super Admin Operations Card */}
            <Link
              href="/admin"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                border: '1.5px solid #cbd5e1',
                borderRadius: 16,
                padding: '20px',
                background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
            >
              <div>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #0f172a, #334155)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  marginBottom: 14,
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.3)',
                }}>
                  🛡️
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
                  Super Admin Hub
                </div>
                <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4, margin: '0 0 16px' }}>
                  Global platform settings, GST %, surge pricing, city announcement ticker, direct menu editor for any restaurant, & fleet pilots.
                </p>
              </div>
              <div style={{
                color: '#0f172a',
                fontSize: '0.85rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}>
                <span>Launch Operations Center</span>
                <span>→</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================
          4. "What's on your mind?" Cuisine Showcase
          ============================================================ */}
      <section style={{ maxWidth: 1200, margin: '40px auto 0', padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
              {locale === 'te' ? 'మీ మనసులో ఏముంది?' : "What's on your mind?"}
            </h2>
            <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0' }}>
              Explore authentic local dishes crafted with native Telugu spices
            </p>
          </div>
          <Link
            href="/app"
            style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ea580c', textDecoration: 'none' }}
          >
            See All Dishes →
          </Link>
        </div>

        <div className="no-scrollbar" style={{
          display: 'flex',
          gap: 16,
          overflowX: 'auto',
          paddingBottom: 10,
        }}>
          {CUISINE_CIRCLES.map(circle => (
            <Link
              key={circle.id}
              href={`/app/search?q=${encodeURIComponent(circle.query)}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textDecoration: 'none',
                color: 'inherit',
                flexShrink: 0,
              }}
            >
              <div style={{
                width: 86,
                height: 86,
                borderRadius: '50%',
                overflow: 'hidden',
                background: '#e2e8f0',
                boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
                border: '2px solid #ffffff',
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={circle.image_url}
                  alt={circle.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <span style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#1e293b',
                marginTop: 8,
                textAlign: 'center',
              }}>
                {locale === 'te' ? circle.name_te : circle.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ============================================================
          5. Top Telugu Partner Restaurants Grid
          ============================================================ */}
      <section style={{ maxWidth: 1200, margin: '40px auto 60px', padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
              {locale === 'te' ? 'అత్యుత్తమ తెలుగు రెస్టారెంట్లు' : 'Top Telugu Partner Restaurants'}
            </h2>
            <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0' }}>
              Hand-picked authentic kitchens with top customer hygiene ratings
            </p>
          </div>
          <Link
            href="/app"
            style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ea580c', textDecoration: 'none' }}
          >
            Explore All Outlets →
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 20,
        }}>
          {restaurants.slice(0, 6).map(rest => (
            <Link
              key={rest.id}
              href={`/app/restaurant/${rest.id}`}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                background: '#ffffff',
                borderRadius: 16,
                overflow: 'hidden',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Cover Photo */}
              <div style={{ position: 'relative', width: '100%', height: 160 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={rest.cover_photo_url}
                  alt={rest.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%)',
                }} />
                {rest.discount_tag && (
                  <div style={{
                    position: 'absolute',
                    bottom: 10,
                    left: 12,
                    background: '#ea580c',
                    color: '#fff',
                    padding: '3px 8px',
                    borderRadius: 6,
                    fontSize: '0.7rem',
                    fontWeight: 900,
                    letterSpacing: '0.04em',
                  }}>
                    {rest.discount_tag}
                  </div>
                )}
              </div>

              {/* Restaurant Info */}
              <div style={{ padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                    {locale === 'te' ? rest.name_te || rest.name : rest.name}
                  </h3>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 3,
                    background: '#15803d',
                    color: '#fff',
                    padding: '2px 6px',
                    borderRadius: 6,
                    fontSize: '0.75rem',
                    fontWeight: 800,
                  }}>
                    <span>★</span>
                    <span>{rest.rating}</span>
                  </div>
                </div>

                <div style={{
                  fontSize: '0.78rem',
                  color: '#64748b',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  marginBottom: 6,
                }}>
                  {rest.cuisines.join(', ')}
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#475569',
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: 8,
                }}>
                  <span>⏱️ {rest.delivery_time_range}</span>
                  <span>•</span>
                  <span>📍 {rest.distance}</span>
                  <span>•</span>
                  <span>₹{rest.cost_for_two} for two</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============================================================
          6. Footer
          ============================================================ */}
      <footer style={{
        background: '#0f172a',
        color: '#94a3b8',
        padding: '36px 20px',
        borderTop: '1px solid #1e293b',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', marginBottom: 4 }}>
            పక్కా లోకల్ • Pakka Local
          </div>
          <p style={{ fontSize: '0.78rem', margin: '0 0 16px', lineHeight: 1.5 }}>
            Hyperlocal authentic Telugu food delivery operating across Vijayawada, Guntur, and Amaravati.
            Built with Next.js Turbopack & progressive web app technology.
          </p>
          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
            © 2026 Pakka Local Technologies. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
