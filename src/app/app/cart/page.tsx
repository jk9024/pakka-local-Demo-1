'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n/context';
import { useCart } from '@/lib/cart/context';
import { useAuth } from '@/lib/auth/context';
import { usePlatform, type SavedAddress } from '@/lib/store/platform-store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CartPage() {
  const { t, locale } = useTranslation();
  const { user } = useAuth();
  const { items, restaurantId, restaurantName, updateQuantity, clearCart, subtotal, itemCount } = useCart();
  const { placeOrder, restaurants, coupons, savedAddresses, addSavedAddress, surgePricing, surgeFeeAmount, platformSettings } = usePlatform();
  const router = useRouter();

  const [cookingInstructions, setCookingInstructions] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>('PAKKA10');
  const [couponError, setCouponError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'card'>('cod');
  const [selectedAddressId, setSelectedAddressId] = useState<string>(savedAddresses[0]?.id || 'addr-1');
  const [noContactDelivery, setNoContactDelivery] = useState(false);
  const [tipAmount, setTipAmount] = useState<number>(20);
  const [isPlacing, setIsPlacing] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);

  // New address form state
  const [newType, setNewType] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [newFlat, setNewFlat] = useState('');
  const [newLandmark, setNewLandmark] = useState('');
  const [newArea, setNewArea] = useState('Gandhi Nagar');

  const restaurant = restaurants.find(r => r.id === restaurantId);
  const currentAddress = savedAddresses.find(a => a.id === selectedAddressId) || savedAddresses[0];

  // Delivery & bill calculation with dynamic platform settings
  const isFreeDelivery = (platformSettings?.free_delivery_above || 500) > 0 && subtotal >= (platformSettings?.free_delivery_above || 500);
  const baseDeliveryFee = isFreeDelivery ? 0 : 25;
  const surgeFee = surgePricing ? (surgeFeeAmount || 15) : 0;
  const deliveryFee = baseDeliveryFee + surgeFee;
  const platformFee = platformSettings?.platform_fee ?? 5;
  const gstRate = (platformSettings?.gst_rate_percent ?? 5) / 100;
  const taxAmount = Math.round(subtotal * gstRate * 100) / 100;

  // Coupon discount calculation
  let discountAmount = 0;
  if (appliedCoupon) {
    const coupon = coupons.find(c => c.code === appliedCoupon);
    if (coupon) {
      if (coupon.discount_type === 'percentage') {
        const calculated = (subtotal * coupon.discount_value) / 100;
        discountAmount = coupon.max_discount ? Math.min(calculated, coupon.max_discount) : calculated;
      } else {
        discountAmount = coupon.discount_value;
      }
    }
  }

  const grandTotal = Math.max(0, subtotal + deliveryFee + platformFee + taxAmount + tipAmount - discountAmount);

  const handleApplyCoupon = (codeToApply?: string) => {
    const targetCode = (codeToApply || couponCode).trim().toUpperCase();
    setCouponError('');
    const coupon = coupons.find(c => c.code === targetCode && c.is_active);
    if (!coupon) {
      setCouponError(locale === 'te' ? 'చెల్లని కూపన్ కోడ్' : 'Invalid coupon code');
      return;
    }
    if (subtotal < coupon.min_order_amount) {
      setCouponError(
        locale === 'te'
          ? `కనీస ఆర్డర్ ₹${coupon.min_order_amount} అవసరం`
          : `Minimum order of ₹${coupon.min_order_amount} required`
      );
      return;
    }
    setAppliedCoupon(targetCode);
    setCouponCode(targetCode);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFlat) return;
    addSavedAddress({
      type: newType,
      label: newType,
      flat: newFlat,
      landmark: newLandmark,
      area: newArea,
      isDefault: false,
    });
    setNewFlat('');
    setNewLandmark('');
    setShowAddAddressModal(false);
  };

  const handlePlaceOrder = () => {
    if (!restaurant) return;
    setIsPlacing(true);

    const formattedAddress = currentAddress
      ? `${currentAddress.flat}, ${currentAddress.landmark ? currentAddress.landmark + ', ' : ''}${currentAddress.area}`
      : 'Flat 402, Sai Residency, Gandhi Nagar';

    const placedOrder = placeOrder({
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      itemsTotal: subtotal,
      deliveryFee: deliveryFee,
      discountAmount: discountAmount,
      taxAmount: taxAmount + platformFee,
      totalAmount: grandTotal,
      isCOD: paymentMethod === 'cod',
      deliveryAddress: formattedAddress,
      specialInstructions: `${cookingInstructions} ${noContactDelivery ? '(No-contact delivery requested)' : ''}`.trim(),
      items: items.map(ci => ({
        id: `oi-${Date.now()}-${ci.menu_item.id}`,
        item_name: ci.menu_item.name,
        item_name_te: ci.menu_item.name_te,
        base_price: ci.menu_item.price,
        quantity: ci.quantity,
        total_price: ci.menu_item.price * ci.quantity,
        is_veg: ci.menu_item.is_veg,
      })),
    });

    setTimeout(() => {
      clearCart();
      setIsPlacing(false);
      router.push(`/app/order/${placedOrder.id}`);
    }, 1000);
  };

  if (items.length === 0) {
    return (
      <div style={{
        padding: '60px 20px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '75vh',
        background: '#ffffff',
      }}>
        <div style={{
          width: 90,
          height: 90,
          borderRadius: '50%',
          background: '#fff7ed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.8rem',
          marginBottom: 16,
        }}>
          🛒
        </div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: 6, color: 'var(--text-main)' }}>
          {locale === 'te' ? 'మీ కార్ట్ ఖాళీగా ఉంది' : 'Your cart is empty'}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: 280, marginBottom: 24 }}>
          {locale === 'te'
            ? 'రుచికరమైన ఆంధ్ర మరియు తెలంగాణ వంటకాలను అన్వేషించండి!'
            : 'Good food is always cooking! Add delicious items from local restaurants.'}
        </p>
        <Link href="/app" className="btn-primary" style={{ padding: '12px 28px' }}>
          {locale === 'te' ? 'రెస్టారెంట్లను అన్వేషించండి →' : 'Browse Restaurants →'}
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '16px 16px 120px', background: '#f8fafc', minHeight: '100dvh' }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <button
          onClick={() => router.back()}
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: '#ffffff',
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
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0, letterSpacing: '-0.02em' }}>
            {locale === 'te' ? 'ఆర్డర్ చెక్అవుట్' : 'Order Checkout'}
          </h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
            {restaurantName} • ⏱ 20-25 mins
          </p>
        </div>
      </div>

      {/* 1. Items Card */}
      <div className="card" style={{ padding: 16, marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '1.2rem' }}>🏪</span>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>{restaurantName}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {currentAddress ? `${currentAddress.label}: ${currentAddress.flat}` : 'Delivery to Doorstep'}
              </div>
            </div>
          </div>
          <button
            onClick={clearCart}
            style={{
              background: 'none',
              border: 'none',
              color: '#ef4444',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Clear
          </button>
        </div>

        {/* Item Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map(ci => (
            <div
              key={ci.menu_item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: 10,
                borderBottom: '1px solid #f1f5f9',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                <div className={ci.menu_item.is_veg ? 'veg-icon' : 'nonveg-icon'} style={{ flexShrink: 0 }} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {locale === 'te' ? ci.menu_item.name_te : ci.menu_item.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    ₹{ci.menu_item.price}
                  </div>
                </div>
              </div>

              {/* Stepper */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: '#f0fdf4',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid #86efac',
                  color: 'var(--veg-green)',
                }}>
                  <button
                    onClick={() => updateQuantity(ci.menu_item.id, ci.quantity - 1)}
                    style={{
                      width: 26,
                      height: 26,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 800,
                      color: 'inherit',
                      fontSize: '1rem',
                    }}
                  >
                    −
                  </button>
                  <span style={{ minWidth: 20, textAlign: 'center', fontSize: '0.82rem', fontWeight: 800 }}>
                    {ci.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(ci.menu_item.id, ci.quantity + 1)}
                    style={{
                      width: 26,
                      height: 26,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 800,
                      color: 'inherit',
                      fontSize: '1rem',
                    }}
                  >
                    +
                  </button>
                </div>

                <div style={{ minWidth: 50, textAlign: 'right', fontWeight: 800, fontSize: '0.9rem' }}>
                  ₹{(ci.menu_item.price * ci.quantity).toFixed(0)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cooking instructions input */}
        <div style={{ marginTop: 12 }}>
          <input
            type="text"
            placeholder={
              locale === 'te'
                ? 'వంట సూచనలు (ఉదా: తక్కువ కారం, ఉల్లిపాయలు వద్దు)...'
                : 'Add cooking notes (e.g. less spicy, extra raita)...'
            }
            value={cookingInstructions}
            onChange={e => setCookingInstructions(e.target.value)}
            className="input"
            style={{ fontSize: '0.8rem', padding: '8px 12px', background: '#f8fafc' }}
          />
        </div>
      </div>

      {/* 2. Swiggy Tip Selector & No-Contact Checkbox */}
      <div className="card" style={{ padding: 16, marginBottom: 14 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 14 }}>
          <input
            type="checkbox"
            checked={noContactDelivery}
            onChange={e => setNoContactDelivery(e.target.checked)}
            style={{ width: 16, height: 16, accentColor: 'var(--primary)' }}
          />
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 800 }}>
              🚪 {locale === 'te' ? 'నో-కాంటాక్ట్ డెలివరీ' : 'Opt-in for No-Contact Delivery'}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Delivery partner will leave food safely at your doorstep
            </div>
          </div>
        </label>

        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800 }}>
              🚴 {locale === 'te' ? 'డెలివరీ పార్టనర్‌కు చిట్కా ఇవ్వండి' : 'Tip your delivery partner'}
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              100% goes to rider
            </span>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            {[10, 20, 30, 50].map(tip => (
              <button
                key={tip}
                onClick={() => setTipAmount(tipAmount === tip ? 0 : tip)}
                style={{
                  flex: 1,
                  padding: '6px 0',
                  borderRadius: 'var(--radius-sm)',
                  border: tipAmount === tip ? '1.5px solid var(--primary)' : '1px solid #e2e8f0',
                  background: tipAmount === tip ? '#fff7ed' : '#ffffff',
                  color: tipAmount === tip ? '#c2410c' : 'var(--text-main)',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                ₹{tip}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Coupons & Offers Card */}
      <div className="card" style={{ padding: 16, marginBottom: 14 }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: 10 }}>
          🏷️ {locale === 'te' ? 'కూపన్లు & ఆఫర్లు' : 'Coupons & Savings'}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            placeholder="ENTER COUPON CODE"
            value={couponCode}
            onChange={e => setCouponCode(e.target.value.toUpperCase())}
            disabled={!!appliedCoupon}
            className="input"
            style={{ fontSize: '0.85rem', padding: '8px 12px', textTransform: 'uppercase', fontWeight: 800 }}
          />
          {appliedCoupon ? (
            <button
              onClick={handleRemoveCoupon}
              style={{
                padding: '0 16px',
                borderRadius: 'var(--radius-md)',
                background: '#fee2e2',
                color: '#b91c1c',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.78rem',
                cursor: 'pointer',
              }}
            >
              Remove
            </button>
          ) : (
            <button
              onClick={() => handleApplyCoupon()}
              className="btn-primary"
              style={{ padding: '0 18px', fontSize: '0.82rem' }}
            >
              Apply
            </button>
          )}
        </div>

        {couponError && (
          <p style={{ color: '#ef4444', fontSize: '0.72rem', margin: '6px 0 0', fontWeight: 600 }}>
            {couponError}
          </p>
        )}

        {appliedCoupon && (
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #86efac',
            color: '#15803d',
            borderRadius: 'var(--radius-sm)',
            padding: '7px 10px',
            fontSize: '0.78rem',
            fontWeight: 800,
            marginTop: 8,
          }}>
            ✓ '{appliedCoupon}' applied! You saved ₹{discountAmount.toFixed(0)}
          </div>
        )}

        {!appliedCoupon && (
          <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
            {coupons.map(c => (
              <button
                key={c.code}
                onClick={() => handleApplyCoupon(c.code)}
                style={{
                  background: '#f8fafc',
                  border: '1px dashed #cbd5e1',
                  color: 'var(--primary)',
                  borderRadius: 'var(--radius-full)',
                  padding: '4px 10px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                + {c.code}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 4. Delivery Address Selector with Add Modal */}
      <div className="card" style={{ padding: 16, marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>
            📍 {locale === 'te' ? 'డెలివరీ చిరునామా ఎంచుకోండి' : 'Delivery Address'}
          </span>
          <button
            onClick={() => setShowAddAddressModal(true)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary)',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            + ADD NEW
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {savedAddresses.map(addr => {
            const isSelected = selectedAddressId === addr.id;
            return (
              <div
                key={addr.id}
                onClick={() => setSelectedAddressId(addr.id)}
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: isSelected ? '2px solid var(--primary)' : '1px solid #e2e8f0',
                  background: isSelected ? '#fff7ed' : '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>
                      {addr.type === 'Home' ? '🏠' : addr.type === 'Work' ? '💼' : '📍'} {addr.label}
                    </span>
                    {addr.isDefault && (
                      <span className="badge badge-saffron" style={{ fontSize: '0.6rem' }}>DEFAULT</span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                    {addr.flat}, {addr.landmark ? addr.landmark + ', ' : ''}{addr.area}
                  </div>
                </div>
                {isSelected && (
                  <span style={{ color: 'var(--primary)', fontWeight: 900 }}>✓</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Add Address Modal */}
        {showAddAddressModal && (
          <form onSubmit={handleSaveNewAddress} style={{
            marginTop: 12,
            padding: 12,
            background: '#f8fafc',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800 }}>Add New Delivery Address</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['Home', 'Work', 'Other'] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setNewType(t)}
                  style={{
                    flex: 1,
                    padding: '6px 0',
                    borderRadius: 'var(--radius-sm)',
                    border: newType === t ? '1.5px solid var(--primary)' : '1px solid #cbd5e1',
                    background: newType === t ? '#fff7ed' : '#ffffff',
                    color: newType === t ? '#c2410c' : 'var(--text-main)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="House / Flat / Block No."
              value={newFlat}
              onChange={e => setNewFlat(e.target.value)}
              required
              className="input"
              style={{ fontSize: '0.8rem', padding: '6px 10px' }}
            />
            <input
              type="text"
              placeholder="Landmark (e.g. Near Clock Tower)"
              value={newLandmark}
              onChange={e => setNewLandmark(e.target.value)}
              className="input"
              style={{ fontSize: '0.8rem', padding: '6px 10px' }}
            />
            <select
              value={newArea}
              onChange={e => setNewArea(e.target.value)}
              className="input"
              style={{ fontSize: '0.8rem', padding: '6px 10px' }}
            >
              <option value="Gandhi Nagar">Gandhi Nagar</option>
              <option value="Collectorate Road">Collectorate Road</option>
              <option value="RTC Complex">RTC Complex</option>
            </select>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <button
                type="button"
                onClick={() => setShowAddAddressModal(false)}
                className="btn-secondary"
                style={{ flex: 1, padding: '6px 0', fontSize: '0.78rem' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                style={{ flex: 1, padding: '6px 0', fontSize: '0.78rem' }}
              >
                Save Address
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 5. Payment Method Selector */}
      <div className="card" style={{ padding: 16, marginBottom: 14 }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: 10 }}>
          💳 {locale === 'te' ? 'చెల్లింపు విధానం' : 'Payment Method'}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 12px',
            borderRadius: 'var(--radius-md)',
            border: paymentMethod === 'cod' ? '2px solid var(--primary)' : '1px solid #e2e8f0',
            background: paymentMethod === 'cod' ? '#fff7ed' : '#ffffff',
            cursor: 'pointer',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input
                type="radio"
                name="pay"
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
                style={{ accentColor: 'var(--primary)' }}
              />
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>
                  💵 {locale === 'te' ? 'డెలివరీ సమయంలో చెల్లించండి (క్యాష్ / UPI)' : 'Pay on Delivery (Cash / UPI QR)'}
                </span>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  Pay cash or scan rider's UPI QR code at your door
                </div>
              </div>
            </div>
            <span className="badge badge-herb" style={{ fontSize: '0.65rem' }}>RECOMMENDED</span>
          </label>
        </div>
      </div>

      {/* 6. Itemized Bill Summary */}
      <div className="card" style={{ padding: 16, marginBottom: 14 }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: 12 }}>
          🧾 {locale === 'te' ? 'బిల్లు వివరాలు' : 'Bill Summary'}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.82rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
            <span>Item Total</span>
            <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>₹{subtotal.toFixed(2)}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
            <span>Delivery Partner Fee</span>
            <span>₹{baseDeliveryFee.toFixed(2)}</span>
          </div>

          {surgeFee > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#1d4ed8', fontWeight: 700 }}>
              <span>Rain / Rush Surge Fee</span>
              <span>+₹{surgeFee.toFixed(2)}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
            <span>Platform Fee</span>
            <span>₹{platformFee.toFixed(2)}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
            <span>GST & Packaging (5%)</span>
            <span>₹{taxAmount.toFixed(2)}</span>
          </div>

          {tipAmount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Delivery Partner Tip</span>
              <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>₹{tipAmount.toFixed(2)}</span>
            </div>
          )}

          {discountAmount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a', fontWeight: 800 }}>
              <span>Coupon Discount ({appliedCoupon})</span>
              <span>-₹{discountAmount.toFixed(2)}</span>
            </div>
          )}

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: '1px solid #e2e8f0',
            paddingTop: 10,
            marginTop: 4,
            fontWeight: 900,
            fontSize: '1.05rem',
          }}>
            <span>TO PAY</span>
            <span style={{ color: 'var(--primary)' }}>₹{grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* 7. Fixed Bottom Pay Action */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 680,
        background: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        padding: '12px 16px',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Total to pay
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--primary)' }}>
              ₹{grandTotal.toFixed(2)}
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isPlacing}
            className="btn-primary"
            style={{ flex: 1, padding: '14px 20px', fontSize: '0.95rem' }}
          >
            {isPlacing ? (
              <span>Placing Order... ⏳</span>
            ) : (
              <span>Place Order (Pay on Delivery) →</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
