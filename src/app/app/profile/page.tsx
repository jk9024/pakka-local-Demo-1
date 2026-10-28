'use client';

import { useAuth, type UserRole } from '@/lib/auth/context';
import { useTranslation } from '@/lib/i18n/context';
import { usePlatform } from '@/lib/store/platform-store';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ProfilePage() {
  const { user, logout, switchRole } = useAuth();
  const { locale, setLocale } = useTranslation();
  const { savedAddresses, addSavedAddress, deleteSavedAddress, orders } = usePlatform();
  const router = useRouter();

  const [copied, setCopied] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddrType, setNewAddrType] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [newAddrFlat, setNewAddrFlat] = useState('');
  const [newAddrLandmark, setNewAddrLandmark] = useState('');
  const [newAddrArea, setNewAddrArea] = useState('Gandhi Nagar');

  // Support chat modal state
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string }>>([
    {
      sender: 'bot',
      text: 'Namaste! Welcome to Mana Ruchulu 24x7 Helpdesk. How can we help with your dining or order experience today?',
    },
  ]);

  const copyReferral = () => {
    if (user?.referral_code) {
      navigator.clipboard.writeText(user.referral_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrFlat.trim()) return;

    addSavedAddress({
      type: newAddrType,
      label: newAddrType,
      flat: newAddrFlat.trim(),
      landmark: newAddrLandmark.trim() || 'Near Main Road',
      area: newAddrArea,
      isDefault: savedAddresses.length === 0,
    });

    setNewAddrFlat('');
    setNewAddrLandmark('');
    setShowAddressModal(false);
  };

  const handleSupportQuery = (query: string) => {
    const userMsg = { sender: 'user' as const, text: query };
    let reply = '';

    if (query.includes('Where is my order')) {
      const latest = orders[0];
      if (latest) {
        reply = `Your latest order #${latest.order_code} from ${latest.restaurant_name} is currently "${latest.status.replace(/_/g, ' ')}". ${latest.rider_name ? `Rider ${latest.rider_name} is handling delivery.` : 'Kitchen is packing your food.'}`;
      } else {
        reply = "You don't have any active orders right now. Browse our restaurants to place one!";
      }
    } else if (query.includes('Pay on Delivery')) {
      reply = 'We support Pay on Delivery! You can pay cash or scan the delivery pilot\'s PhonePe/GPay QR code right at your doorstep after verifying your food parcel.';
    } else if (query.includes('Cancel order')) {
      reply = 'Orders can be cancelled before the restaurant accepts cooking. Once kitchen starts prep, cancellation is subject to partner approval.';
    } else {
      reply = 'Our support supervisor is available at +91 98765 43210. Feel free to call us anytime!';
    }

    setChatMessages(prev => [...prev, userMsg, { sender: 'bot', text: reply }]);
  };

  const roles: { role: UserRole; label: string; labelTe: string; path: string; icon: string; desc: string }[] = [
    { role: 'customer', label: 'Customer View', labelTe: 'కస్టమర్ వ్యూ', path: '/app', icon: '🛍️', desc: 'Browse dishes & order' },
    { role: 'restaurant_owner', label: 'Restaurant Partner', labelTe: 'రెస్టారెంట్ భాగస్వామి', path: '/restaurant', icon: '🏪', desc: 'Kitchen live orders & menu stock' },
    { role: 'rider', label: 'Delivery Rider', labelTe: 'డెలివరీ రైడర్', path: '/rider', icon: '🛵', desc: 'Accept trips, pickup code & cash float' },
    { role: 'admin', label: 'Admin Operations', labelTe: 'అడ్మిన్ డాష్‌బోర్డ్', path: '/admin', icon: '🛡️', desc: 'City orders, surge tariffs & partner approvals' },
  ];

  return (
    <div style={{ padding: '16px 16px 90px', maxWidth: 640, margin: '0 auto' }}>
      {/* Profile Header */}
      <div style={{
        background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
        color: '#fff',
        borderRadius: 20,
        padding: '24px 20px',
        marginBottom: 18,
        boxShadow: '0 8px 24px rgba(249,115,22,0.25)',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
      }}>
        <div style={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          border: '2px solid rgba(255, 255, 255, 0.4)',
        }}>
          👤
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0 }}>
              {user?.full_name || 'Ravi Kumar'}
            </h2>
            <span style={{
              background: '#fef08a',
              color: '#854d0e',
              fontSize: '0.62rem',
              fontWeight: 900,
              padding: '2px 8px',
              borderRadius: 20,
              letterSpacing: '0.04em',
            }}>
              GOLD VIP
            </span>
          </div>
          <div style={{ fontSize: '0.82rem', opacity: 0.95, marginTop: 2 }}>
            {user?.phone || '+91 98765 43210'}
          </div>
          <div style={{ fontSize: '0.72rem', opacity: 0.85, marginTop: 4 }}>
            Free deliveries active on all orders above ₹149
          </div>
        </div>
      </div>

      {/* Language Selector Card */}
      <div className="card" style={{ padding: 16, marginBottom: 16 }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>
          🌐 {locale === 'te' ? 'యాప్ భాష (Language)' : 'App Language'}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button
            onClick={() => setLocale('en')}
            style={{
              padding: '10px 14px',
              borderRadius: 10,
              border: locale === 'en' ? '2px solid #f97316' : '1px solid #e2e8f0',
              background: locale === 'en' ? '#fff7ed' : '#fff',
              color: locale === 'en' ? '#c2410c' : '#334155',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <span>🇬🇧</span>
            <span>English</span>
            {locale === 'en' && <span>✓</span>}
          </button>

          <button
            onClick={() => setLocale('te')}
            style={{
              padding: '10px 14px',
              borderRadius: 10,
              border: locale === 'te' ? '2px solid #f97316' : '1px solid #e2e8f0',
              background: locale === 'te' ? '#fff7ed' : '#fff',
              color: locale === 'te' ? '#c2410c' : '#334155',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <span>🇮🇳</span>
            <span>తెలుగు (Telugu)</span>
            {locale === 'te' && <span>✓</span>}
          </button>
        </div>
      </div>

      {/* Saved Addresses Book */}
      <div className="card" style={{ padding: 16, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
              📍 Saved Delivery Addresses
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
              Easily select doorstep address at checkout
            </div>
          </div>
          <button
            onClick={() => setShowAddressModal(true)}
            style={{
              background: '#fff7ed',
              color: '#ea580c',
              border: '1px solid #fed7aa',
              padding: '5px 10px',
              borderRadius: 8,
              fontSize: '0.74rem',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            + Add New
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {savedAddresses.map(addr => (
            <div
              key={addr.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid #f1f5f9',
                background: '#f8fafc',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: '0.85rem' }}>
                    {addr.type === 'Home' ? '🏠' : addr.type === 'Work' ? '💼' : '📍'}
                  </span>
                  <strong style={{ fontSize: '0.84rem', color: '#0f172a' }}>{addr.label}</strong>
                  {addr.isDefault && (
                    <span style={{ fontSize: '0.62rem', background: '#ecfdf5', color: '#047857', padding: '1px 5px', borderRadius: 4, fontWeight: 700 }}>
                      DEFAULT
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
                  {addr.flat}, {addr.landmark}, {addr.area}
                </div>
              </div>

              {savedAddresses.length > 1 && (
                <button
                  onClick={() => deleteSavedAddress(addr.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    padding: 4,
                  }}
                  title="Delete address"
                >
                  🗑️
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Role Switcher (For Demo & Testing) */}
      <div className="card" style={{ padding: 16, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
              🔀 {locale === 'te' ? 'పాత్ర మార్చండి (మల్టీ-రోల్ డెమో)' : 'Multi-Role Portal Switcher'}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
              Seamlessly test between Customer, Restaurant Kitchen, Rider & Admin
            </div>
          </div>
          <span style={{
            fontSize: '0.62rem',
            fontWeight: 800,
            background: '#ffedd5',
            color: '#c2410c',
            padding: '2px 6px',
            borderRadius: 4,
          }}>
            LIVE STORE
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {roles.map(r => {
            const isCurrent = user?.role === r.role;
            return (
              <div
                key={r.role}
                onClick={() => {
                  switchRole(r.role);
                  router.push(r.path);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: isCurrent ? '1.5px solid #f97316' : '1px solid #e2e8f0',
                  background: isCurrent ? '#fff7ed' : '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: '1.4rem' }}>{r.icon}</span>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                      {locale === 'te' ? r.labelTe : r.label}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                      {r.desc}
                    </div>
                  </div>
                </div>
                <div>
                  {isCurrent ? (
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#ea580c' }}>
                      {locale === 'te' ? 'సక్రియం' : 'Active'}
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      Launch →
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Install Mobile PWA App Card */}
      <div className="card" style={{
        padding: 16,
        marginBottom: 16,
        background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
        border: '1.5px solid #fed7aa',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/icon-192.png"
              alt="Mana Ruchulu"
              style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, boxShadow: '0 2px 8px rgba(234,88,12,0.4)' }}
            />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#9a3412' }}>
                {locale === 'te' ? 'మన రుచులు యాప్‌ను ఇన్‌స్టాల్ చేయండి' : 'Install Mana Ruchulu App'}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#c2410c' }}>
                {locale === 'te' ? 'హోమ్ స్క్రీన్‌కు జోడించి వేగంగా ఆర్డర్ చేయండి' : 'Add to home screen for 1-tap ordering & live tracking'}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('open-pwa-install'));
              }
            }}
            className="btn-primary"
            style={{ padding: '8px 14px', fontSize: '0.78rem', height: 'auto', flexShrink: 0 }}
          >
            {locale === 'te' ? 'ఇన్‌స్టాల్' : 'Install'}
          </button>
        </div>
      </div>

      {/* Referral Code Card */}
      <div className="card" style={{ padding: 16, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: '1.2rem' }}>🎁</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>
            {locale === 'te' ? 'స్నేహితుడిని ఆహ్వానించండి & ₹50 సంపాదించండి' : 'Refer a Friend & Earn ₹50'}
          </span>
        </div>
        <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 12px' }}>
          Share your referral code. Both of you get ₹50 off on next delicious Andhra order!
        </p>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#f8fafc',
          padding: '8px 14px',
          borderRadius: 8,
          border: '1px dashed #cbd5e1',
        }}>
          <span style={{ fontSize: '0.95rem', fontWeight: 900, letterSpacing: '0.1em', color: '#f97316' }}>
            {user?.referral_code || 'MANA50'}
          </span>
          <button
            onClick={copyReferral}
            style={{
              background: copied ? '#16a34a' : '#f97316',
              color: '#fff',
              border: 'none',
              padding: '6px 12px',
              borderRadius: 6,
              fontSize: '0.75rem',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            {copied ? (locale === 'te' ? 'కాపీ చేయబడింది!' : 'Copied!') : (locale === 'te' ? 'కాపీ' : 'Copy Code')}
          </button>
        </div>
      </div>

      {/* Customer Support & Help Bot */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          onClick={() => setShowSupportModal(true)}
          style={{
            padding: '12px 18px',
            borderRadius: 12,
            background: 'linear-gradient(135deg, #059669, #047857)',
            color: '#fff',
            border: 'none',
            fontWeight: 800,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            boxShadow: '0 4px 12px rgba(5,150,105,0.2)',
          }}
        >
          <span>💬 24x7 Live Order Support Chatbot</span>
        </button>

        <a
          href="tel:+919876543210"
          className="btn-secondary"
          style={{ textDecoration: 'none', textAlign: 'center', justifyContent: 'center', padding: '12px 0' }}
        >
          📞 Call Support Hotline (+91 98765 43210)
        </a>

        <button
          onClick={() => {
            logout();
            router.push('/auth');
          }}
          style={{
            padding: '12px 20px',
            borderRadius: 12,
            background: '#fef2f2',
            color: '#dc2626',
            border: '1px solid #fecaca',
            fontWeight: 800,
            fontSize: '0.88rem',
            cursor: 'pointer',
          }}
        >
          🚪 {locale === 'te' ? 'లాగ్ అవుట్' : 'Log Out'}
        </button>
      </div>

      {/* ======================================================================= */}
      {/* MODAL: ADD NEW ADDRESS                                                  */}
      {/* ======================================================================= */}
      {showAddressModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
          backdropFilter: 'blur(4px)',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 18,
            width: '100%',
            maxWidth: 420,
            padding: 22,
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                + Add Delivery Address
              </h3>
              <button
                onClick={() => setShowAddressModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#94a3b8' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAddress} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                  Address Type
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {(['Home', 'Work', 'Other'] as const).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setNewAddrType(type)}
                      style={{
                        flex: 1,
                        padding: '8px 0',
                        borderRadius: 8,
                        border: '1.5px solid ' + (newAddrType === type ? '#f97316' : '#cbd5e1'),
                        background: newAddrType === type ? '#fff7ed' : '#fff',
                        color: newAddrType === type ? '#c2410c' : '#475569',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                      }}
                    >
                      {type === 'Home' ? '🏠 Home' : type === 'Work' ? '💼 Work' : '📍 Other'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                  Flat / House / Apartment No. *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat 301, Sai Nilayam"
                  value={newAddrFlat}
                  onChange={(e) => setNewAddrFlat(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                  Street / Landmark
                </label>
                <input
                  type="text"
                  placeholder="e.g. Near Ramalayam Temple"
                  value={newAddrLandmark}
                  onChange={(e) => setNewAddrLandmark(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                  Area / Zone
                </label>
                <select
                  value={newAddrArea}
                  onChange={(e) => setNewAddrArea(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="Gandhi Nagar">Gandhi Nagar</option>
                  <option value="Collectorate Road">Collectorate Road</option>
                  <option value="Revenue Colony">Revenue Colony</option>
                  <option value="Bhavani Island Road">Bhavani Island Road</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  style={{
                    flex: 1,
                    padding: '10px 0',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    background: '#fff',
                    color: '#64748b',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 2,
                    padding: '10px 0',
                    borderRadius: 8,
                    border: 'none',
                    background: '#f97316',
                    color: '#fff',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL: 24x7 INTERACTIVE SUPPORT BOT                                     */}
      {/* ======================================================================= */}
      {showSupportModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
          backdropFilter: 'blur(4px)',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 20,
            width: '100%',
            maxWidth: 440,
            height: '80vh',
            maxHeight: 560,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            overflow: 'hidden',
          }}>
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #059669, #047857)',
              color: '#fff',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '1.4rem' }}>🤖</span>
                <div>
                  <strong style={{ fontSize: '0.95rem' }}>Mana Ruchulu Care</strong>
                  <div style={{ fontSize: '0.68rem', color: '#a7f3d0' }}>Online • Instant replies</div>
                </div>
              </div>
              <button
                onClick={() => setShowSupportModal(false)}
                style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Chat Body */}
            <div style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              background: '#f8fafc',
            }}>
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    background: msg.sender === 'user' ? '#f97316' : '#fff',
                    color: msg.sender === 'user' ? '#fff' : '#0f172a',
                    padding: '10px 14px',
                    borderRadius: 14,
                    fontSize: '0.82rem',
                    lineHeight: 1.4,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    border: msg.sender === 'user' ? 'none' : '1px solid #e2e8f0',
                  }}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Quick Action Chips */}
            <div style={{
              padding: '10px 14px',
              background: '#fff',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              gap: 6,
              overflowX: 'auto',
            }}>
              {[
                'Where is my order?',
                'Pay on Delivery info',
                'Cancel order policy',
              ].map(q => (
                <button
                  key={q}
                  onClick={() => handleSupportQuery(q)}
                  style={{
                    whiteSpace: 'nowrap',
                    padding: '6px 12px',
                    borderRadius: 20,
                    border: '1px solid #e2e8f0',
                    background: '#f1f5f9',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    color: '#334155',
                    cursor: 'pointer',
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
