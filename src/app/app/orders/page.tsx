'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/context';
import { SAMPLE_ORDERS, RESTAURANTS, type Order } from '@/lib/mock-data';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function OrdersPage() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('mana-ruchulu-custom-orders');
      const customOrders: Order[] = stored ? JSON.parse(stored) : [];
      setOrders([...customOrders, ...SAMPLE_ORDERS]);
    } catch {
      setOrders(SAMPLE_ORDERS);
    }
  }, []);

  const activeOrders = orders.filter(
    o => o.status !== 'delivered' && o.status !== 'cancelled'
  );
  const pastOrders = orders.filter(
    o => o.status === 'delivered' || o.status === 'cancelled'
  );

  const displayedOrders = activeTab === 'active' ? activeOrders : pastOrders;

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'placed':
        return <span className="badge badge-saffron">⏳ {locale === 'te' ? 'ఆర్డర్ అందింది' : 'Order Placed'}</span>;
      case 'accepted':
        return <span className="badge badge-saffron">✓ {locale === 'te' ? 'ఆమోదించబడింది' : 'Accepted'}</span>;
      case 'preparing':
        return <span className="badge badge-saffron">🍳 {locale === 'te' ? 'తయారవుతోంది' : 'Preparing'}</span>;
      case 'ready_for_pickup':
        return <span className="badge badge-herb">📦 {locale === 'te' ? 'సిద్ధంగా ఉంది' : 'Food Ready'}</span>;
      case 'picked_up':
        return <span className="badge badge-saffron">🛵 {locale === 'te' ? 'డెలివరీలో ఉంది' : 'On the Way'}</span>;
      case 'delivered':
        return <span className="badge badge-herb">✓ {locale === 'te' ? 'డెలివరీ పూర్తయింది' : 'Delivered'}</span>;
      case 'cancelled':
        return <span className="badge badge-spice">✕ {locale === 'te' ? 'రద్దు చేయబడింది' : 'Cancelled'}</span>;
    }
  };

  return (
    <div style={{ padding: '16px 16px 90px', background: '#f8fafc', minHeight: '100dvh' }}>
      {/* Title */}
      <h1 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: 16, letterSpacing: '-0.02em' }}>
        {locale === 'te' ? 'నా ఆర్డర్‌లు' : 'My Orders'}
      </h1>

      {/* Swiggy Style Segmented Tabs */}
      <div style={{
        display: 'flex',
        background: '#e2e8f0',
        borderRadius: 'var(--radius-full)',
        padding: 4,
        marginBottom: 20,
      }}>
        <button
          onClick={() => setActiveTab('active')}
          style={{
            flex: 1,
            padding: '9px 16px',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            fontSize: '0.85rem',
            fontWeight: 800,
            background: activeTab === 'active' ? '#ffffff' : 'transparent',
            color: activeTab === 'active' ? 'var(--text-main)' : 'var(--text-secondary)',
            boxShadow: activeTab === 'active' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {locale === 'te' ? 'సక్రియ ఆర్డర్‌లు' : 'Active Orders'} ({activeOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('past')}
          style={{
            flex: 1,
            padding: '9px 16px',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            fontSize: '0.85rem',
            fontWeight: 800,
            background: activeTab === 'past' ? '#ffffff' : 'transparent',
            color: activeTab === 'past' ? 'var(--text-main)' : 'var(--text-secondary)',
            boxShadow: activeTab === 'past' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {locale === 'te' ? 'గత ఆర్డర్‌లు' : 'Past Orders'} ({pastOrders.length})
        </button>
      </div>

      {/* Orders List */}
      {displayedOrders.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: 'var(--text-muted)',
          background: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid #e2e8f0',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>📦</div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 6, color: 'var(--text-main)' }}>
            {activeTab === 'active'
              ? (locale === 'te' ? 'సక్రియ ఆర్డర్‌లు లేవు' : 'No active orders')
              : (locale === 'te' ? 'గత ఆర్డర్‌లు లేవు' : 'No past orders')}
          </h3>
          <p style={{ fontSize: '0.82rem', marginBottom: 20 }}>
            {locale === 'te'
              ? 'రుచికరమైన ఆహారాన్ని ఆర్డర్ చేయండి మరియు ఇక్కడ ట్రాక్ చేయండి!'
              : 'Browse our popular restaurants and enjoy hot, fresh delivery!'}
          </p>
          <Link href="/app" className="btn-primary" style={{ padding: '12px 24px' }}>
            {locale === 'te' ? 'రెస్టారెంట్లను అన్వేషించండి' : 'Browse Restaurants'}
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {displayedOrders.map(order => {
            const formattedDate = new Date(order.placed_at || order.created_at || Date.now()).toLocaleDateString(
              locale === 'te' ? 'te-IN' : 'en-IN',
              { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }
            );

            const restaurant = RESTAURANTS.find(r => r.id === order.restaurant_id);

            return (
              <div
                key={order.id}
                className="card"
                style={{ padding: 18 }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      background: '#e2e8f0',
                      flexShrink: 0,
                    }}>
                      <img
                        src={restaurant?.cover_photo_url || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200'}
                        alt={order.restaurant_name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 900, margin: 0 }}>
                        {order.restaurant_name}
                      </h3>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
                        {order.order_code} • {formattedDate}
                      </div>
                    </div>
                  </div>
                  <div>
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                {/* Items Summary */}
                <div style={{
                  padding: '10px 14px',
                  background: '#f8fafc',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.82rem',
                  color: 'var(--text-secondary)',
                  marginBottom: 14,
                }}>
                  {order.items.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', margin: '3px 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div className={item.is_veg ? 'veg-icon' : 'nonveg-icon'} style={{ width: 12, height: 12 }} />
                        <span>{item.quantity}x {locale === 'te' ? item.item_name_te : item.item_name}</span>
                      </div>
                      <span style={{ fontWeight: 700 }}>₹{item.total_price}</span>
                    </div>
                  ))}
                </div>

                {/* Footer with Price and Track Action */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: 12,
                }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Total Bill
                    </span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-main)' }}>
                      ₹{order.total_amount.toFixed(0)}
                    </div>
                  </div>

                  <button
                    onClick={() => router.push(`/app/order/${order.id}`)}
                    className={order.status !== 'delivered' ? 'btn-primary' : 'btn-secondary'}
                    style={{ padding: '8px 20px', fontSize: '0.85rem' }}
                  >
                    {order.status !== 'delivered'
                      ? (locale === 'te' ? 'ట్రాక్ చేయండి →' : 'Track Live 🛵')
                      : (locale === 'te' ? 'మళ్లీ ఆర్డర్ చేయండి' : 'Reorder 🔁')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
