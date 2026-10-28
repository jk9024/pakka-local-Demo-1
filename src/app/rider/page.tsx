'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n/context';
import { usePlatform } from '@/lib/store/platform-store';
import Link from 'next/link';

export default function RiderDashboard() {
  const { locale } = useTranslation();
  const {
    orders,
    restaurants,
    riderCashInHand,
    riderDepositCash,
    isRiderOnDuty,
    toggleRiderDuty,
    riderAcceptOrder,
    riderConfirmPickup,
    riderDeliverOrder,
  } = usePlatform();

  // Active rider tabs
  const [activeTab, setActiveTab] = useState<'delivery' | 'earnings' | 'cash'>('delivery');

  // Input states for 4-digit codes
  const [enteredPickupCode, setEnteredPickupCode] = useState<string>('');
  const [enteredDeliveryOtp, setEnteredDeliveryOtp] = useState<string>('');
  const [codeError, setCodeError] = useState<string>('');
  const [successCelebration, setSuccessCelebration] = useState<boolean>(false);

  // Cash deposit modal
  const [showDepositModal, setShowDepositModal] = useState<boolean>(false);
  const [depositAmount, setDepositAmount] = useState<number>(500);

  // Active delivery finding: look for an order currently assigned to this rider that is not delivered/cancelled
  const activeDelivery = orders.find(
    o => o.rider_name === 'Venkat Reddy' && (
      o.status === 'confirmed' ||
      o.status === 'preparing' ||
      o.status === 'ready_for_pickup' ||
      o.status === 'out_for_delivery'
    )
  );

  // Available gigs: orders that need a rider (status in 'confirmed', 'preparing', 'ready_for_pickup' without a rider assigned)
  const availableGigs = orders.filter(
    o => !o.rider_name && (o.status === 'confirmed' || o.status === 'preparing' || o.status === 'ready_for_pickup')
  );

  // Completed deliveries for this rider
  const completedDeliveries = orders.filter(
    o => o.rider_name === 'Venkat Reddy' && o.status === 'delivered'
  );

  // Sub-stage tracking for active delivery
  const isAtCustomer = activeDelivery?.status === 'out_for_delivery' && enteredPickupCode === 'ARRIVED_DOORSTEP';

  // Handle Accept Delivery Gig
  const handleAcceptGig = (orderId: string) => {
    riderAcceptOrder(orderId, {
      name: 'Venkat Reddy',
      phone: '+91 98765 43210',
      vehicle: 'Bajaj Pulsar (AP 05 AB 1234)',
    });
    setEnteredPickupCode('');
    setEnteredDeliveryOtp('');
    setCodeError('');
    setSuccessCelebration(false);
  };

  // Handle Verify Pickup Code
  const handleVerifyPickup = (orderId: string) => {
    if (!enteredPickupCode.trim()) {
      setCodeError(locale === 'te' ? 'దయచేసి 4 అంకెల పికప్ కోడ్ నమోదు చేయండి' : 'Please enter 4-digit pickup code');
      return;
    }

    const res = riderConfirmPickup(orderId, enteredPickupCode.trim());
    if (!res.success) {
      setCodeError(res.message);
      return;
    }

    setCodeError('');
    setEnteredPickupCode('');
  };

  // Handle Verify Customer Delivery OTP
  const handleVerifyDeliveryOtp = (orderId: string) => {
    if (!enteredDeliveryOtp.trim()) {
      setCodeError(locale === 'te' ? 'దయచేసి 4 అంకెల డెలివరీ ఓటీపీ నమోదు చేయండి' : 'Please enter 4-digit delivery OTP');
      return;
    }

    const res = riderDeliverOrder(orderId, enteredDeliveryOtp.trim());
    if (!res.success) {
      setCodeError(res.message);
      return;
    }

    setCodeError('');
    setEnteredDeliveryOtp('');
    setSuccessCelebration(true);
  };

  // Handle Cash Deposit
  const handleConfirmDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (depositAmount <= 0) return;
    riderDepositCash(depositAmount);
    setShowDepositModal(false);
    alert(`₹${depositAmount} successfully deposited at Central Hub! Floating cash updated.`);
  };

  // Earnings calculations
  const totalTripsDone = completedDeliveries.length + 6; // + mock historical trips
  const baseEarnings = totalTripsDone * 40;
  const tipEarnings = 90;
  const surgeEarnings = 45;
  const todayTotalEarnings = baseEarnings + tipEarnings + surgeEarnings;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '16px' }}>
      {/* Offline Duty Warning Banner */}
      {!isRiderOnDuty && (
        <div style={{
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          color: '#fff',
          borderRadius: 14,
          padding: '16px 20px',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 4px 16px rgba(239,68,68,0.25)',
        }}>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>
              {locale === 'te' ? 'మీరు ప్రస్తుతం ఆఫ్‌లైన్‌లో ఉన్నారు' : 'You are currently OFF DUTY'}
            </div>
            <div style={{ fontSize: '0.74rem', opacity: 0.9, marginTop: 2 }}>
              Switch ON duty to receive nearby delivery gigs and earn up to ₹800 today.
            </div>
          </div>
          <button
            onClick={toggleRiderDuty}
            style={{
              background: '#fff',
              color: '#dc2626',
              border: 'none',
              padding: '8px 16px',
              borderRadius: 20,
              fontSize: '0.8rem',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            Go Online Now
          </button>
        </div>
      )}

      {/* Floating Cash in Hand Top Bar */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: '#fff',
        borderRadius: 16,
        padding: '16px 20px',
        marginBottom: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 16px rgba(15,23,42,0.12)',
      }}>
        <div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            💵 {locale === 'te' ? 'చేతిలో ఉన్న క్యాష్ (COD ఫ్లోట్)' : 'Cash in Hand (COD Float)'}
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#facc15', marginTop: 2 }}>
            ₹{riderCashInHand.toFixed(0)}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>
            Hub Limit: ₹2,500 max before deposit required
          </div>
        </div>

        <button
          onClick={() => setShowDepositModal(true)}
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            color: '#fff',
            padding: '8px 16px',
            borderRadius: 10,
            fontSize: '0.78rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span>🏦 Deposit at Hub</span>
        </button>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        background: '#e2e8f0',
        borderRadius: 12,
        padding: 4,
        marginBottom: 18,
      }}>
        <button
          onClick={() => { setActiveTab('delivery'); setSuccessCelebration(false); }}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: 10,
            border: 'none',
            fontSize: '0.84rem',
            fontWeight: 800,
            background: activeTab === 'delivery' ? '#fff' : 'transparent',
            color: activeTab === 'delivery' ? '#059669' : '#64748b',
            boxShadow: activeTab === 'delivery' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <span>🛵 Delivery Radar</span>
          {activeDelivery && (
            <span style={{
              background: '#059669',
              color: '#fff',
              fontSize: '0.66rem',
              fontWeight: 800,
              padding: '1px 6px',
              borderRadius: 12,
            }}>
              1 ACTIVE
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('earnings')}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: 10,
            border: 'none',
            fontSize: '0.84rem',
            fontWeight: 800,
            background: activeTab === 'earnings' ? '#fff' : 'transparent',
            color: activeTab === 'earnings' ? '#059669' : '#64748b',
            boxShadow: activeTab === 'earnings' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
            cursor: 'pointer',
          }}
        >
          💰 Earnings & Payouts
        </button>

        <button
          onClick={() => setActiveTab('cash')}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: 10,
            border: 'none',
            fontSize: '0.84rem',
            fontWeight: 800,
            background: activeTab === 'cash' ? '#fff' : 'transparent',
            color: activeTab === 'cash' ? '#059669' : '#64748b',
            boxShadow: activeTab === 'cash' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
            cursor: 'pointer',
          }}
        >
          🏦 Cash Float ({Math.round(riderCashInHand)})
        </button>
      </div>

      {/* ======================================================================= */}
      {/* TAB 1: DELIVERY WORKFLOW & GIG RADAR                                    */}
      {/* ======================================================================= */}
      {activeTab === 'delivery' && (
        <div>
          {/* CASE A: SUCCESSFUL DELIVERY CELEBRATION */}
          {successCelebration && (
            <div style={{
              background: '#fff',
              borderRadius: 18,
              padding: '36px 24px',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(5,150,105,0.15)',
              border: '2px solid #a7f3d0',
              animation: 'fadeIn 0.3s ease',
              marginBottom: 16,
            }}>
              <div style={{ fontSize: '3.5rem', marginBottom: 10 }}>🎉</div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#047857', margin: '0 0 6px' }}>
                {locale === 'te' ? 'డెలివరీ విజయవంతంగా పూర్తయింది!' : 'Order Delivered Successfully!'}
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 16px' }}>
                Trip payout of <strong>₹45.00</strong> credited to your earnings wallet. Customer OTP verified!
              </p>

              <button
                onClick={() => setSuccessCelebration(false)}
                style={{
                  background: 'linear-gradient(135deg, #059669, #047857)',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 28px',
                  borderRadius: 12,
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(5,150,105,0.3)',
                }}
              >
                + Check Available Gigs Radar
              </button>
            </div>
          )}

          {/* CASE B: ACTIVE DELIVERY IN PROGRESS */}
          {activeDelivery && !successCelebration ? (
            <div style={{
              background: '#fff',
              borderRadius: 18,
              border: '2px solid #059669',
              boxShadow: '0 8px 30px rgba(5,150,105,0.12)',
              overflow: 'hidden',
            }}>
              {/* Active Header */}
              <div style={{
                background: 'linear-gradient(90deg, #ecfdf5 0%, #f0fdf4 100%)',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #d1fae5',
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      background: '#059669',
                      color: '#fff',
                      fontWeight: 900,
                      fontSize: '0.7rem',
                      padding: '2px 8px',
                      borderRadius: 6,
                    }}>
                      LIVE GIG
                    </span>
                    <strong style={{ fontSize: '1.05rem', color: '#0f172a' }}>#{activeDelivery.order_code}</strong>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#047857', fontWeight: 600, marginTop: 2 }}>
                    Trip Earning: ₹45.00 • {activeDelivery.items.length} food items
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: 6,
                    background: activeDelivery.payment_method === 'cod' ? '#fef3c7' : '#ecfdf5',
                    color: activeDelivery.payment_method === 'cod' ? '#b45309' : '#047857',
                  }}>
                    {activeDelivery.payment_method === 'cod' ? `💵 Collect COD: ₹${activeDelivery.total_amount}` : '✓ Pre-Paid'}
                  </span>
                </div>
              </div>

              {/* Step Flow Bar for Rider */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 6,
                padding: '12px 18px',
                background: '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
                textAlign: 'center',
                fontSize: '0.72rem',
                fontWeight: 800,
              }}>
                <div style={{
                  padding: '6px 4px',
                  borderRadius: 8,
                  background: activeDelivery.status !== 'out_for_delivery' ? '#059669' : '#e2e8f0',
                  color: activeDelivery.status !== 'out_for_delivery' ? '#fff' : '#64748b',
                }}>
                  1. KITCHEN PICKUP
                </div>
                <div style={{
                  padding: '6px 4px',
                  borderRadius: 8,
                  background: activeDelivery.status === 'out_for_delivery' && !isAtCustomer ? '#059669' : '#e2e8f0',
                  color: activeDelivery.status === 'out_for_delivery' && !isAtCustomer ? '#fff' : '#64748b',
                }}>
                  2. ON THE WAY
                </div>
                <div style={{
                  padding: '6px 4px',
                  borderRadius: 8,
                  background: isAtCustomer ? '#059669' : '#e2e8f0',
                  color: isAtCustomer ? '#fff' : '#64748b',
                }}>
                  3. VERIFY & DROP
                </div>
              </div>

              <div style={{ padding: '18px 20px' }}>
                {/* ------------------------------------------------------------- */}
                {/* STAGE 1: PICKUP AT RESTAURANT                                */}
                {/* ------------------------------------------------------------- */}
                {activeDelivery.status !== 'out_for_delivery' && (
                  <div>
                    <div style={{
                      background: '#f8fafc',
                      borderRadius: 14,
                      padding: '14px 16px',
                      border: '1px solid #e2e8f0',
                      marginBottom: 16,
                    }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#f97316', textTransform: 'uppercase' }}>
                        Pickup Kitchen Location
                      </div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginTop: 2 }}>
                        {activeDelivery.restaurant_name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 2 }}>
                        📍 Near Gandhi Statue, Main Road, Gandhi Nagar • ~1.2 km
                      </div>

                      <div style={{ fontSize: '0.78rem', color: '#334155', marginTop: 8, borderTop: '1px solid #e2e8f0', paddingTop: 8 }}>
                        <strong>Items:</strong> {activeDelivery.items.map(it => `${it.quantity}x ${it.item_name}`).join(', ')}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                      <a
                        href="tel:+919876543211"
                        style={{
                          padding: '10px 0',
                          borderRadius: 10,
                          border: '1.5px solid #cbd5e1',
                          background: '#fff',
                          color: '#0f172a',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          textAlign: 'center',
                          textDecoration: 'none',
                        }}
                      >
                        📞 Call Kitchen
                      </a>
                      <div
                        style={{
                          padding: '10px 0',
                          borderRadius: 10,
                          background: '#f1f5f9',
                          color: '#64748b',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          textAlign: 'center',
                        }}
                      >
                        ⏱ Prep: {activeDelivery.status === 'ready_for_pickup' ? 'Ready!' : 'Cooking (~5m)'}
                      </div>
                    </div>

                    {/* Enter Restaurant Pickup Verification Code */}
                    <div style={{
                      background: '#eff6ff',
                      border: '1.5px solid #bfdbfe',
                      borderRadius: 14,
                      padding: '16px',
                      textAlign: 'center',
                      marginBottom: 12,
                    }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e40af', marginBottom: 4 }}>
                        Enter Restaurant 4-Digit Pickup Code
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#3b82f6', marginBottom: 12 }}>
                        Ask kitchen staff for the code on their dashboard. (Hint: <b>{activeDelivery.pickup_code}</b>)
                      </div>

                      <input
                        type="text"
                        maxLength={4}
                        placeholder="••••"
                        value={enteredPickupCode}
                        onChange={(e) => setEnteredPickupCode(e.target.value)}
                        style={{
                          width: 140,
                          padding: '8px 12px',
                          borderRadius: 10,
                          border: '2px solid #3b82f6',
                          fontSize: '1.4rem',
                          fontWeight: 900,
                          textAlign: 'center',
                          letterSpacing: '0.25em',
                          marginBottom: 10,
                          background: '#fff',
                        }}
                      />

                      {codeError && (
                        <div style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 700, marginBottom: 8 }}>
                          {codeError}
                        </div>
                      )}

                      <button
                        onClick={() => handleVerifyPickup(activeDelivery.id)}
                        style={{
                          width: '100%',
                          padding: '12px 0',
                          borderRadius: 10,
                          border: 'none',
                          background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                          color: '#fff',
                          fontSize: '0.88rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                        }}
                      >
                        ✓ Confirm Packed Parcel Received
                      </button>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* STAGE 2: ON THE WAY TO CUSTOMER                               */}
                {/* ------------------------------------------------------------- */}
                {activeDelivery.status === 'out_for_delivery' && !isAtCustomer && (
                  <div>
                    <div style={{
                      background: '#ecfdf5',
                      border: '1.5px solid #a7f3d0',
                      borderRadius: 14,
                      padding: '16px',
                      marginBottom: 16,
                    }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase' }}>
                        Customer Drop Location
                      </div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginTop: 2 }}>
                        {activeDelivery.delivery_address || 'Gandhi Nagar'}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 2 }}>
                        Distance: ~2.4 km • Est. travel time: 8 mins
                      </div>

                      {activeDelivery.special_instructions && (
                        <div style={{
                          marginTop: 10,
                          padding: '8px 10px',
                          background: '#fff',
                          borderRadius: 8,
                          border: '1px solid #cbd5e1',
                          fontSize: '0.78rem',
                          color: '#0f172a',
                        }}>
                          <strong>Doorstep Note:</strong> {activeDelivery.special_instructions}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                      <a
                        href="tel:+919876543210"
                        style={{
                          padding: '10px 0',
                          borderRadius: 10,
                          border: '1.5px solid #cbd5e1',
                          background: '#fff',
                          color: '#0f172a',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          textAlign: 'center',
                          textDecoration: 'none',
                        }}
                      >
                        📞 Call Customer
                      </a>
                      <div
                        style={{
                          padding: '10px 0',
                          borderRadius: 10,
                          background: '#f1f5f9',
                          color: '#059669',
                          fontWeight: 800,
                          fontSize: '0.82rem',
                          textAlign: 'center',
                        }}
                      >
                        🟢 Radar Active
                      </div>
                    </div>

                    <button
                      onClick={() => setEnteredPickupCode('ARRIVED_DOORSTEP')}
                      style={{
                        width: '100%',
                        padding: '14px 0',
                        borderRadius: 12,
                        border: 'none',
                        background: 'linear-gradient(135deg, #059669, #047857)',
                        color: '#fff',
                        fontSize: '0.92rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(5,150,105,0.3)',
                      }}
                    >
                      🏠 Arrived at Customer Doorstep →
                    </button>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* STAGE 3: DOORSTEP OTP & COD PAYMENT                           */}
                {/* ------------------------------------------------------------- */}
                {isAtCustomer && (
                  <div>
                    {activeDelivery.payment_method === 'cod' && (
                      <div style={{
                        background: '#fef3c7',
                        border: '2px solid #f59e0b',
                        borderRadius: 14,
                        padding: '16px',
                        textAlign: 'center',
                        marginBottom: 16,
                      }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#92400e', textTransform: 'uppercase' }}>
                          COLLECT CASH ON DELIVERY (COD)
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: 900, color: '#b45309', margin: '4px 0' }}>
                          ₹{activeDelivery.total_amount}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#78350f' }}>
                          Collect exact cash or let customer scan your QR code before handing over food bag.
                        </div>
                      </div>
                    )}

                    <div style={{
                      background: '#f8fafc',
                      border: '1.5px solid #e2e8f0',
                      borderRadius: 14,
                      padding: '18px',
                      textAlign: 'center',
                    }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
                        Enter Customer 4-Digit Delivery OTP
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: 12 }}>
                        Customer sees this OTP on their live tracking screen. (Hint: <b>{activeDelivery.delivery_otp}</b>)
                      </div>

                      <input
                        type="text"
                        maxLength={4}
                        placeholder="••••"
                        value={enteredDeliveryOtp}
                        onChange={(e) => setEnteredDeliveryOtp(e.target.value)}
                        style={{
                          width: 140,
                          padding: '8px 12px',
                          borderRadius: 10,
                          border: '2px solid #059669',
                          fontSize: '1.4rem',
                          fontWeight: 900,
                          textAlign: 'center',
                          letterSpacing: '0.25em',
                          marginBottom: 10,
                          background: '#fff',
                        }}
                      />

                      {codeError && (
                        <div style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 700, marginBottom: 8 }}>
                          {codeError}
                        </div>
                      )}

                      <button
                        onClick={() => handleVerifyDeliveryOtp(activeDelivery.id)}
                        style={{
                          width: '100%',
                          padding: '14px 0',
                          borderRadius: 12,
                          border: 'none',
                          background: 'linear-gradient(135deg, #059669, #047857)',
                          color: '#fff',
                          fontSize: '0.92rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          boxShadow: '0 4px 14px rgba(5,150,105,0.3)',
                        }}
                      >
                        ✓ Complete Delivery & Collect Cash
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {/* CASE C: NO ACTIVE DELIVERY -> SHOW AVAILABLE GIGS RADAR */}
          {!activeDelivery && !successCelebration && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12,
              }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    ⚡ Available Delivery Gigs Nearby
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '2px 0 0' }}>
                    Real-time requests ready for rider pickup in Gandhi Nagar & Suburbs
                  </p>
                </div>
                <span style={{
                  background: availableGigs.length > 0 ? '#d1fae5' : '#f1f5f9',
                  color: availableGigs.length > 0 ? '#047857' : '#64748b',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: 10,
                }}>
                  {availableGigs.length} Gigs Available
                </span>
              </div>

              {availableGigs.length === 0 ? (
                <div style={{
                  background: '#fff',
                  borderRadius: 16,
                  padding: '48px 20px',
                  textAlign: 'center',
                  border: '1px solid #e2e8f0',
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: 12 }}>📡</div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
                    Scanning for nearby food delivery requests...
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', maxWidth: 420, margin: '0 auto 16px' }}>
                    When a customer places an order from the customer portal, it will immediately appear here on your delivery radar with pickup location and payout rate.
                  </p>
                  <Link
                    href="/app"
                    style={{
                      display: 'inline-block',
                      background: '#f97316',
                      color: '#fff',
                      padding: '10px 20px',
                      borderRadius: 10,
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      textDecoration: 'none',
                    }}
                  >
                    Open Customer App to Place Test Order →
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {availableGigs.map(gig => (
                    <div
                      key={gig.id}
                      style={{
                        background: '#fff',
                        borderRadius: 16,
                        border: '1px solid #e2e8f0',
                        padding: '16px 18px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 14,
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 240 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{
                            background: '#ffedd5',
                            color: '#c2410c',
                            fontWeight: 800,
                            fontSize: '0.68rem',
                            padding: '2px 6px',
                            borderRadius: 4,
                          }}>
                            {gig.status.toUpperCase()}
                          </span>
                          <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>#{gig.order_code}</strong>
                          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            • {gig.items.length} items
                          </span>
                        </div>

                        <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#1e293b' }}>
                          🏪 {gig.restaurant_name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
                          📍 Drop: {gig.delivery_address || 'Gandhi Nagar'}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#059669' }}>
                            ₹45
                          </div>
                          <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                            {gig.payment_method === 'cod' ? '💵 COD' : '✓ Pre-Paid'}
                          </div>
                        </div>

                        <button
                          onClick={() => handleAcceptGig(gig.id)}
                          style={{
                            background: 'linear-gradient(135deg, #059669, #047857)',
                            color: '#fff',
                            border: 'none',
                            padding: '10px 18px',
                            borderRadius: 10,
                            fontSize: '0.84rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(5,150,105,0.25)',
                          }}
                        >
                          Accept Gig →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ======================================================================= */}
      {/* TAB 2: EARNINGS & INCENTIVES                                            */}
      {/* ======================================================================= */}
      {activeTab === 'earnings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Daily Total Summary Card */}
          <div style={{
            background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
            color: '#fff',
            borderRadius: 16,
            padding: '22px 24px',
            boxShadow: '0 8px 24px rgba(6,78,59,0.2)',
          }}>
            <div style={{ fontSize: '0.76rem', color: '#a7f3d0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Today's Net Pilot Earnings
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#fff', marginTop: 4 }}>
              ₹{todayTotalEarnings.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#a7f3d0', marginTop: 4 }}>
              Auto bank settlement scheduled tonight at 11:59 PM to HDFC Bank A/C ending 3829
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 8,
              borderTop: '1px solid rgba(255,255,255,0.2)',
              marginTop: 16,
              paddingTop: 14,
              textAlign: 'center',
            }}>
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{totalTripsDone}</div>
                <div style={{ fontSize: '0.68rem', color: '#a7f3d0' }}>Trips Completed</div>
              </div>
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>₹{baseEarnings}</div>
                <div style={{ fontSize: '0.68rem', color: '#a7f3d0' }}>Base Pay (₹40/trip)</div>
              </div>
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>₹{tipEarnings}</div>
                <div style={{ fontSize: '0.68rem', color: '#a7f3d0' }}>Customer Tips</div>
              </div>
            </div>
          </div>

          {/* Daily Target Incentive Card */}
          <div style={{
            background: '#fff',
            borderRadius: 14,
            padding: '16px 18px',
            border: '1px solid #e2e8f0',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>
                🎯 Milestone Target: Complete 10 Orders
              </strong>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#f97316' }}>
                ₹150 Extra Bonus
              </span>
            </div>

            <div style={{
              width: '100%',
              height: 8,
              background: '#f1f5f9',
              borderRadius: 99,
              overflow: 'hidden',
              marginBottom: 8,
            }}>
              <div style={{
                width: `${Math.min(100, (totalTripsDone / 10) * 100)}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #f97316, #ea580c)',
                borderRadius: 99,
              }} />
            </div>

            <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
              You've finished <strong>{totalTripsDone} of 10</strong> deliveries. {Math.max(0, 10 - totalTripsDone)} more to unlock bonus!
            </div>
          </div>

          {/* Pilot Rating & Badges */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
          }}>
            <div style={{ background: '#fff', borderRadius: 14, padding: 16, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Pilot Rating</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#059669', marginTop: 2 }}>
                ★ 4.9 / 5.0
              </div>
              <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600 }}>Top 2% in City</div>
            </div>

            <div style={{ background: '#fff', borderRadius: 14, padding: 16, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>On-Time Rate</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#2563eb', marginTop: 2 }}>
                98.4%
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Avg drop: 14 mins</div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* TAB 3: CASH MANAGEMENT & HUB DEPOSIT                                    */}
      {/* ======================================================================= */}
      {activeTab === 'cash' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{
            background: '#fff',
            borderRadius: 16,
            padding: '20px 22px',
            border: '1px solid #e2e8f0',
          }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
              Cash on Delivery (COD) Collection Limit
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 16px' }}>
              Under Swiggy/Zomato logistics rules, cash collected from customers must be deposited at the central hub once it exceeds the safety threshold.
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: 6 }}>
              <span>Current Float: ₹{riderCashInHand.toFixed(0)}</span>
              <span style={{ color: '#64748b' }}>Limit: ₹2,500</span>
            </div>

            <div style={{
              width: '100%',
              height: 10,
              background: '#f1f5f9',
              borderRadius: 99,
              overflow: 'hidden',
              marginBottom: 16,
            }}>
              <div style={{
                width: `${Math.min(100, (riderCashInHand / 2500) * 100)}%`,
                height: '100%',
                background: riderCashInHand > 2000 ? '#ef4444' : '#22c55e',
                borderRadius: 99,
              }} />
            </div>

            <button
              onClick={() => setShowDepositModal(true)}
              style={{
                width: '100%',
                padding: '12px 0',
                borderRadius: 10,
                border: 'none',
                background: 'linear-gradient(135deg, #059669, #047857)',
                color: '#fff',
                fontSize: '0.88rem',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              Deposit Cash at Gandhi Nagar Central Hub →
            </button>
          </div>

          {/* Hub Location Card */}
          <div style={{
            background: '#f8fafc',
            borderRadius: 14,
            padding: '16px',
            border: '1px solid #e2e8f0',
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
              🏢 Designated Cash Collection Hub
            </div>
            <div style={{ fontSize: '0.82rem', color: '#334155' }}>
              Pakka Local Logistics Office, Opp. APSRTC Bus Complex, Gandhi Nagar
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 2 }}>
              Open 08:00 AM - 11:30 PM • Manager: Ramesh (Ext 401)
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL: DEPOSIT CASH AT HUB                                              */}
      {/* ======================================================================= */}
      {showDepositModal && (
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
            maxWidth: 400,
            padding: 24,
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Deposit Floating Cash
              </h3>
              <button
                onClick={() => setShowDepositModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#94a3b8' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 14px' }}>
              Total COD Cash in Hand: <strong>₹{riderCashInHand.toFixed(0)}</strong>. Select or type deposit amount:
            </p>

            <form onSubmit={handleConfirmDeposit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                {[500, 1000, Math.round(riderCashInHand)].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setDepositAmount(amt)}
                    style={{
                      flex: 1,
                      padding: '8px 0',
                      borderRadius: 8,
                      border: '1.5px solid ' + (depositAmount === amt ? '#059669' : '#cbd5e1'),
                      background: depositAmount === amt ? '#ecfdf5' : '#fff',
                      color: depositAmount === amt ? '#047857' : '#334155',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                  Custom Amount (₹)
                </label>
                <input
                  type="number"
                  min={1}
                  max={riderCashInHand}
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button
                  type="button"
                  onClick={() => setShowDepositModal(false)}
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
                    background: '#059669',
                    color: '#fff',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  Confirm Deposit Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
