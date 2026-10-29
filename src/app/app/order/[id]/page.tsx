'use client';

import { useState, use } from 'react';
import { useTranslation } from '@/lib/i18n/context';
import { usePlatform } from '@/lib/store/platform-store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t, locale } = useTranslation();
  const {
    isInitialized,
    orders,
    restaurantAcceptOrder,
    restaurantMarkReady,
    riderConfirmPickup,
    riderDeliverOrder,
    customerRateOrder,
    ratings,
  } = usePlatform();
  const router = useRouter();

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [foodRating, setFoodRating] = useState(5);
  const [riderRating, setRiderRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  // Fallback to localStorage if order is newly created and state update is batched
  let order = orders.find(o => o.id === id);
  if (!order && typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('mr_platform_orders_v2');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          order = parsed.find((o: { id: string }) => o.id === id);
        }
      }
    } catch {}
  }

  if (!isInitialized && !order) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', background: '#ffffff', minHeight: '80vh' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>⏳</div>
        <p style={{ color: '#64748b', fontWeight: 700 }}>
          {locale === 'te' ? 'ఆర్డర్ వివరాలు లోడ్ అవుతున్నాయి...' : 'Loading order details...'}
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', background: '#ffffff', minHeight: '80vh' }}>
        <h2>{locale === 'te' ? 'ఆర్డర్ కనుగొనబడలేదు' : 'Order not found'}</h2>
        <Link href="/app/orders" className="btn-primary" style={{ marginTop: 20 }}>
          {locale === 'te' ? 'ఆర్డర్‌ల జాబితాకు వెళ్ళండి' : 'Go to Orders'}
        </Link>
      </div>
    );
  }

  const steps = [
    { key: 'placed', label: 'Order Confirmed', labelTe: 'ఆర్డర్ నిర్ధారించబడింది', icon: '📝' },
    { key: 'preparing', label: 'Kitchen is Cooking', labelTe: 'వంట చేయబడుతోంది', icon: '🍳' },
    { key: 'ready_for_pickup', label: 'Food Ready for Pickup', labelTe: 'పిక్-అప్ కోసం సిద్ధం', icon: '📦' },
    { key: 'picked_up', label: 'Rider is on the Way', labelTe: 'రైడర్ దారిలో ఉన్నారు', icon: '🛵' },
    { key: 'delivered', label: 'Delivered at Doorstep', labelTe: 'ఆర్డర్ చేరింది', icon: '🎉' },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'placed': return 0;
      case 'accepted': return 1;
      case 'preparing': return 1;
      case 'ready_for_pickup': return 2;
      case 'picked_up': return 3;
      case 'delivered': return 4;
      default: return 0;
    }
  };

  const currentStepIdx = getStepIndex(order.status);
  const isDelivered = order.status === 'delivered';
  const existingRating = ratings[order.id];

  // Simulator for instant end-to-end testing
  const advanceSimulatedStep = () => {
    switch (order.status) {
      case 'placed':
        restaurantAcceptOrder(order.id);
        break;
      case 'accepted':
      case 'preparing':
        restaurantMarkReady(order.id);
        break;
      case 'ready_for_pickup':
        riderConfirmPickup(order.id, order.pickup_code);
        break;
      case 'picked_up':
        riderDeliverOrder(order.id, order.delivery_otp);
        setShowRatingModal(true);
        break;
      default:
        break;
    }
  };

  const handleSubmitRating = (e: React.FormEvent) => {
    e.preventDefault();
    customerRateOrder(order.id, foodRating, riderRating, reviewComment);
    setRatingSubmitted(true);
    setShowRatingModal(false);
  };

  const etaMinutes = isDelivered ? 0 : order.status === 'picked_up' ? 8 : order.status === 'ready_for_pickup' ? 14 : 22;

  return (
    <div style={{ paddingBottom: 60, background: '#f8fafc', minHeight: '100dvh' }}>
      {/* 1. Header with back */}
      <div style={{
        background: '#ffffff',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #e2e8f0',
      }}>
        <button
          onClick={() => router.push('/app/orders')}
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

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 900 }}>{order.order_code}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{order.restaurant_name}</div>
        </div>

        {!isDelivered ? (
          <button
            onClick={advanceSimulatedStep}
            style={{
              background: '#fff7ed',
              border: '1px solid #fed7aa',
              color: '#c2410c',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.7rem',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            ⚡ SIMULATE
          </button>
        ) : (
          <button
            onClick={() => setShowRatingModal(true)}
            style={{
              background: '#f0fdf4',
              border: '1px solid #86efac',
              color: '#15803d',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.7rem',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            ★ RATE
          </button>
        )}
      </div>

      {/* 2. Interactive Animated Route Radar Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: '#ffffff',
        padding: '24px 20px 20px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Radar Route Grid visual */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 18,
          position: 'relative',
        }}>
          {/* Restaurant Node */}
          <div style={{ textAlign: 'center', zIndex: 2 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: '#334155',
              border: '2px solid #64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.3rem',
              margin: '0 auto 4px',
            }}>
              🏪
            </div>
            <span style={{ fontSize: '0.68rem', opacity: 0.8 }}>Kitchen</span>
          </div>

          {/* Motorbike Moving along the route */}
          <div style={{
            flex: 1,
            height: 3,
            background: 'rgba(255,255,255,0.2)',
            margin: '0 8px',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute',
              top: -16,
              left: `${Math.min(100, (currentStepIdx / 4) * 100)}%`,
              transform: 'translateX(-50%)',
              transition: 'left 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              fontSize: '1.6rem',
              filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.4))',
            }}>
              🛵
            </div>
          </div>

          {/* Customer Doorstep Node */}
          <div style={{ textAlign: 'center', zIndex: 2 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: isDelivered ? 'var(--rating-green)' : '#334155',
              border: '2px solid #64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.3rem',
              margin: '0 auto 4px',
            }}>
              🏠
            </div>
            <span style={{ fontSize: '0.68rem', opacity: 0.8 }}>Doorstep</span>
          </div>
        </div>

        {/* ETA Headline */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {isDelivered
              ? (locale === 'te' ? 'ఆర్డర్ అందించబడింది' : 'Delivered at Doorstep')
              : (locale === 'te' ? 'అంచనా వేసిన సమయం' : 'Estimated Delivery Time')}
          </div>
          <div style={{
            fontSize: '1.8rem',
            fontWeight: 900,
            letterSpacing: '-0.02em',
            marginTop: 2,
            color: isDelivered ? '#4ade80' : '#ffffff',
          }}>
            {isDelivered ? 'Delivered with Freshness 🎉' : `Arriving in ${etaMinutes} mins`}
          </div>
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        {/* 3. Delivery OTP Card */}
        {!isDelivered && (
          <div style={{
            background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
            color: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 20px',
            marginBottom: 16,
            boxShadow: '0 8px 24px rgba(249, 115, 22, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.9 }}>
                🔒 {locale === 'te' ? 'డెలివరీ ఓటీపీ (రైడర్‌కు చెప్పండి)' : 'Doorstep Delivery OTP'}
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, letterSpacing: '0.2em', marginTop: 2 }}>
                {order.delivery_otp}
              </div>
              <div style={{ fontSize: '0.72rem', opacity: 0.9 }}>
                Share this 4-digit code only when rider arrives with your food
              </div>
            </div>
            <div style={{ fontSize: '2.4rem' }}>
              🔑
            </div>
          </div>
        )}

        {/* Rating Banner if already submitted */}
        {existingRating && (
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #86efac',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            marginBottom: 16,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#15803d' }}>
                ✓ You rated this meal: ★ {existingRating.foodRating}/5
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Rider: ★ {existingRating.riderRating}/5
              </span>
            </div>
            {existingRating.review && (
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '4px 0 0', fontStyle: 'italic' }}>
                "{existingRating.review}"
              </p>
            )}
          </div>
        )}

        {/* 4. Delivery Partner Card */}
        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.6rem',
                border: '2px solid #e2e8f0',
              }}>
                🛵
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800 }}>
                    {order.rider_name || 'Venkat Reddy'}
                  </span>
                  <div className="swiggy-rating" style={{ fontSize: '0.7rem', padding: '1px 5px' }}>
                    ★ 4.9
                  </div>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  Bajaj Pulsar • AP 05 AB 1234
                </div>
              </div>
            </div>

            <a
              href="tel:+919876543212"
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: '#f0fdf4',
                border: '1.5px solid #86efac',
                color: 'var(--veg-green)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                textDecoration: 'none',
              }}
            >
              📞
            </a>
          </div>
        </div>

        {/* 5. Live Journey Stepper */}
        <div className="card" style={{ padding: 18, marginBottom: 16 }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 900, marginBottom: 16 }}>
            📋 {locale === 'te' ? 'ఆర్డర్ ప్రయాణం' : 'Live Order Journey'}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {steps.map((st, i) => {
              const isDone = i < currentStepIdx;
              const isCurrent = i === currentStepIdx;

              return (
                <div key={st.key} style={{ display: 'flex', gap: 14, minHeight: 46, position: 'relative' }}>
                  {i < steps.length - 1 && (
                    <div style={{
                      position: 'absolute',
                      top: 24,
                      left: 13,
                      width: 2,
                      height: 'calc(100% - 10px)',
                      background: isDone ? 'var(--rating-green)' : '#e2e8f0',
                    }} />
                  )}

                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: isDone
                      ? 'var(--rating-green)'
                      : isCurrent
                      ? 'var(--primary)'
                      : '#f1f5f9',
                    color: isDone || isCurrent ? '#ffffff' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    zIndex: 1,
                  }}>
                    {isDone ? '✓' : st.icon}
                  </div>

                  <div style={{ flex: 1, paddingTop: 3 }}>
                    <div style={{
                      fontSize: '0.88rem',
                      fontWeight: isCurrent ? 900 : isDone ? 700 : 500,
                      color: isCurrent
                        ? 'var(--primary)'
                        : isDone
                        ? 'var(--text-main)'
                        : 'var(--text-muted)',
                    }}>
                      {locale === 'te' ? st.labelTe : st.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 6. Order Items & Receipt */}
        <div className="card" style={{ padding: 16 }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 900, marginBottom: 10 }}>
            🧾 {locale === 'te' ? 'ఆర్డర్ రసీదు' : 'Order Receipt'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.82rem' }}>
            {order.items.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div className={item.is_veg ? 'veg-icon' : 'nonveg-icon'} />
                  <span>{item.quantity}x {locale === 'te' ? item.item_name_te : item.item_name}</span>
                </div>
                <span style={{ fontWeight: 700 }}>₹{item.total_price}</span>
              </div>
            ))}

            <div style={{
              borderTop: '1px solid #e2e8f0',
              paddingTop: 8,
              marginTop: 6,
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: 900,
              fontSize: '0.95rem',
            }}>
              <span>Total Paid</span>
              <span style={{ color: 'var(--primary)' }}>₹{order.total_amount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rating & Review Modal */}
      {showRatingModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
          zIndex: 150,
        }}>
          <form onSubmit={handleSubmitRating} className="card" style={{
            width: '100%',
            maxWidth: 400,
            padding: 24,
            background: '#ffffff',
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, margin: '0 0 6px', textAlign: 'center' }}>
              🎉 How was your meal?
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', margin: '0 0 16px' }}>
              Your feedback helps {order.restaurant_name} & your delivery partner improve.
            </p>

            {/* Food Rating Stars */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, marginBottom: 4 }}>
                Rate Food Quality:
              </div>
              <div style={{ display: 'flex', gap: 8, fontSize: '1.5rem', cursor: 'pointer' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <span
                    key={star}
                    onClick={() => setFoodRating(star)}
                    style={{ color: star <= foodRating ? '#f59e0b' : '#cbd5e1' }}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            {/* Rider Rating Stars */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, marginBottom: 4 }}>
                Rate Delivery Partner ({order.rider_name || 'Venkat Reddy'}):
              </div>
              <div style={{ display: 'flex', gap: 8, fontSize: '1.5rem', cursor: 'pointer' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <span
                    key={star}
                    onClick={() => setRiderRating(star)}
                    style={{ color: star <= riderRating ? '#f59e0b' : '#cbd5e1' }}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <textarea
              placeholder="Tell us what you liked about the food or delivery..."
              value={reviewComment}
              onChange={e => setReviewComment(e.target.value)}
              rows={3}
              className="input"
              style={{ fontSize: '0.82rem', marginBottom: 16 }}
            />

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                onClick={() => setShowRatingModal(false)}
                className="btn-secondary"
                style={{ flex: 1, padding: '10px 0', fontSize: '0.85rem' }}
              >
                Skip
              </button>
              <button
                type="submit"
                className="btn-primary"
                style={{ flex: 1, padding: '10px 0', fontSize: '0.85rem' }}
              >
                Submit Review
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
