'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n/context';
import { usePlatform } from '@/lib/store/platform-store';
import type { Restaurant, Zone, Coupon, Order, MenuItem, DeliveryPilot } from '@/lib/mock-data';

export default function AdminPage() {
  const { locale } = useTranslation();
  const {
    orders,
    restaurants,
    approveRestaurant,
    rejectRestaurant,
    updateCommissionRate,
    updateRestaurant,
    addNewRestaurant,
    deleteRestaurant,
    zones,
    updateZoneFee,
    toggleZoneActive,
    addNewZone,
    updateZone,
    deleteZone,
    surgePricing,
    toggleSurgePricing,
    surgeFeeAmount,
    setSurgeFeeAmount,
    coupons,
    addNewCoupon,
    updateCoupon,
    deleteCoupon,
    toggleCouponActive,
    adminUpdateOrderStatus,
    adminReassignRider,
    adminCancelOrder,
    adminEditOrderCustomer,
    platformSettings,
    updatePlatformSettings,
    pilots,
    addNewPilot,
    updatePilot,
    deletePilot,
    resetPilotCash,
    togglePilotDuty,
    menuItems,
    updateMenuItem,
    addNewMenuItem,
    deleteMenuItem,
    toggleItemStock,
    updateItemPrice,
  } = usePlatform();

  const [activeTab, setActiveTab] = useState<'kpis' | 'orders' | 'restaurants' | 'pilots' | 'zones' | 'coupons' | 'settings'>('kpis');
  const [orderFilter, setOrderFilter] = useState<string>('all');

  // New coupon form state
  const [newCode, setNewCode] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newVal, setNewVal] = useState('20');
  const [newType, setNewType] = useState<'percentage' | 'flat'>('percentage');
  const [newMin, setNewMin] = useState('150');
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  // New Restaurant modal state
  const [showAddRestModal, setShowAddRestModal] = useState(false);
  const [newRestName, setNewRestName] = useState('');
  const [newRestNameTe, setNewRestNameTe] = useState('');
  const [newRestDesc, setNewRestDesc] = useState('');
  const [newRestPhone, setNewRestPhone] = useState('+91 98765 43299');
  const [newRestAddress, setNewRestAddress] = useState('Gandhi Nagar, Main Road');
  const [newRestCuisines, setNewRestCuisines] = useState('Andhra, Biryani');
  const [newRestCostForTwo, setNewRestCostForTwo] = useState(300);
  const [newRestPrepTime, setNewRestPrepTime] = useState(20);
  const [newRestCommission, setNewRestCommission] = useState(15);
  const [newRestCoverPhoto, setNewRestCoverPhoto] = useState('https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80');

  // Edit Restaurant modal state
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);

  // Zone modals
  const [showAddZoneModal, setShowAddZoneModal] = useState(false);
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneNameTe, setNewZoneNameTe] = useState('');
  const [newZoneSlug, setNewZoneSlug] = useState('');
  const [newZoneFee, setNewZoneFee] = useState(25);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);

  // Order intervention modals
  const [reassignOrder, setReassignOrder] = useState<Order | null>(null);
  const [newRiderName, setNewRiderName] = useState('Suresh Pilot');
  const [newRiderPhone, setNewRiderPhone] = useState('+91 98765 00112');

  const [statusChangeOrder, setStatusChangeOrder] = useState<Order | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<Order['status']>('preparing');

  // Edit Order Customer Drop Location & Notes
  const [editingOrderCustomer, setEditingOrderCustomer] = useState<Order | null>(null);
  const [editOrderAddress, setEditOrderAddress] = useState('');
  const [editOrderInstructions, setEditOrderInstructions] = useState('');

  // Delivery Pilots Fleet management state
  const [showAddPilotModal, setShowAddPilotModal] = useState(false);
  const [newPilotName, setNewPilotName] = useState('');
  const [newPilotPhone, setNewPilotPhone] = useState('+91 98765 43210');
  const [newPilotVehicleNum, setNewPilotVehicleNum] = useState('AP 16 AB 5544');
  const [newPilotVehicleType, setNewPilotVehicleType] = useState('Hero Splendor Plus');
  const [editingPilot, setEditingPilot] = useState<DeliveryPilot | null>(null);

  // Global Platform Settings Form State
  const [adminPlatformFee, setAdminPlatformFee] = useState<number>(platformSettings?.platform_fee ?? 5);
  const [adminGstRate, setAdminGstRate] = useState<number>(platformSettings?.gst_rate_percent ?? 5);
  const [adminFreeDelivery, setAdminFreeDelivery] = useState<number>(platformSettings?.free_delivery_above ?? 500);
  const [adminSurgeActive, setAdminSurgeActive] = useState<boolean>(platformSettings?.surge_pricing_active ?? false);
  const [adminSurgeFee, setAdminSurgeFee] = useState<number>(platformSettings?.surge_fee ?? 15);
  const [adminSurgeReason, setAdminSurgeReason] = useState<string>(platformSettings?.surge_reason ?? 'High Demand / Rain');
  const [adminAnnouncement, setAdminAnnouncement] = useState<string>(platformSettings?.announcement_ticker ?? '🌧️ Monsoon Fast Delivery active in Vijayawada & Guntur!');
  const [adminAnnouncementActive, setAdminAnnouncementActive] = useState<boolean>(platformSettings?.announcement_active ?? true);
  const [settingsSuccessMsg, setSettingsSuccessMsg] = useState(false);

  // Super Admin Restaurant Menu Management State
  const [managingRestMenuId, setManagingRestMenuId] = useState<string | null>(null);
  const [adminEditingDish, setAdminEditingDish] = useState<MenuItem | null>(null);
  const [adminShowAddDishModal, setAdminShowAddDishModal] = useState(false);
  const [adminNewDishName, setAdminNewDishName] = useState('');
  const [adminNewDishNameTe, setAdminNewDishNameTe] = useState('');
  const [adminNewDishCategory, setAdminNewDishCategory] = useState('Biryani');
  const [adminNewDishPrice, setAdminNewDishPrice] = useState(220);
  const [adminNewDishPrepTime, setAdminNewDishPrepTime] = useState(15);
  const [adminNewDishIsVeg, setAdminNewDishIsVeg] = useState(false);
  const [adminNewDishIsBestseller, setAdminNewDishIsBestseller] = useState(false);
  const [adminNewDishDesc, setAdminNewDishDesc] = useState('');
  const [adminNewDishImage, setAdminNewDishImage] = useState('https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80');

  // Dynamic KPI Calculations from live store
  const deliveredOrders = orders.filter(o => o.status === 'delivered');
  const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');
  const totalGMV = deliveredOrders.reduce((sum, o) => sum + o.total_amount, 0) + 148200;
  const totalOrdersCount = orders.length + 142;
  const netCommissionRevenue = Math.round(totalGMV * 0.12);

  // Pending restaurants
  const pendingRestaurants = restaurants.filter(r => r.approval_status === 'pending');

  // Filter orders for live monitor
  const filteredOrders = orderFilter === 'all'
    ? orders
    : orders.filter(o => o.status === orderFilter);

  // Handle Add Coupon
  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    addNewCoupon({
      code: newCode.toUpperCase().trim(),
      description: newDesc || `${newVal}${newType === 'percentage' ? '%' : '₹'} off on your order`,
      discount_type: newType,
      discount_value: Number(newVal),
      min_order_amount: Number(newMin),
      is_active: true,
    });

    setNewCode('');
    setNewDesc('');
    setShowCouponModal(false);
  };

  // Handle Save Edited Coupon
  const handleSaveEditedCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCoupon) return;
    updateCoupon(editingCoupon.id, {
      code: editingCoupon.code.toUpperCase(),
      description: editingCoupon.description,
      discount_type: editingCoupon.discount_type,
      discount_value: Number(editingCoupon.discount_value),
      min_order_amount: Number(editingCoupon.min_order_amount),
    });
    setEditingCoupon(null);
  };

  // Handle Create Restaurant
  const handleCreateRestaurant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRestName.trim()) return;

    addNewRestaurant({
      owner_id: `owner-${Date.now()}`,
      name: newRestName.trim(),
      name_te: newRestNameTe.trim() || newRestName.trim(),
      slug: newRestName.toLowerCase().replace(/\s+/g, '-'),
      phone: newRestPhone.trim(),
      description: newRestDesc || 'Authentic Andhra restaurant serving hot curries and delicacies.',
      description_te: 'రుచికరమైన ఆంధ్ర వంటకాలు.',
      zone_id: 'zone-1',
      address_text: newRestAddress,
      area: newRestAddress.split(',')[0] || 'Gandhi Nagar',
      cover_photo_url: newRestCoverPhoto,
      logo_url: newRestCoverPhoto,
      is_open: true,
      is_holiday: false,
      opening_time: '07:00',
      closing_time: '23:00',
      avg_prep_time: Number(newRestPrepTime) || 20,
      min_order_amount: 100,
      commission_rate: Number(newRestCommission) || 15,
      rating: 4.8,
      total_ratings: 1,
      approval_status: 'approved',
      is_featured: false,
      cuisines: newRestCuisines.split(',').map(c => c.trim()).filter(Boolean),
      cost_for_two: Number(newRestCostForTwo) || 300,
      distance: '2.1 km',
      delivery_time_range: '25-30 mins',
    });

    setNewRestName('');
    setNewRestNameTe('');
    setShowAddRestModal(false);
  };

  // Handle Save Edited Restaurant
  const handleSaveEditedRestaurant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRestaurant) return;

    updateRestaurant(editingRestaurant.id, {
      name: editingRestaurant.name,
      name_te: editingRestaurant.name_te,
      description: editingRestaurant.description,
      phone: editingRestaurant.phone,
      address_text: editingRestaurant.address_text,
      commission_rate: Number(editingRestaurant.commission_rate),
      rating: Number(editingRestaurant.rating),
      cost_for_two: Number(editingRestaurant.cost_for_two),
      approval_status: editingRestaurant.approval_status,
      is_featured: editingRestaurant.is_featured,
      cuisines: Array.isArray(editingRestaurant.cuisines)
        ? editingRestaurant.cuisines
        : String(editingRestaurant.cuisines).split(',').map(c => c.trim()),
    });

    setEditingRestaurant(null);
  };

  // Handle Create Zone
  const handleCreateZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newZoneName.trim()) return;

    addNewZone({
      name: newZoneName.trim(),
      name_te: newZoneNameTe.trim() || newZoneName.trim(),
      slug: newZoneSlug.trim().toLowerCase() || newZoneName.toLowerCase().replace(/\s+/g, '-'),
      base_delivery_fee: Number(newZoneFee) || 25,
      is_active: true,
    });

    setNewZoneName('');
    setNewZoneNameTe('');
    setNewZoneSlug('');
    setShowAddZoneModal(false);
  };

  // Handle Save Edited Zone
  const handleSaveEditedZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingZone) return;

    updateZone(editingZone.id, {
      name: editingZone.name,
      name_te: editingZone.name_te,
      slug: editingZone.slug,
      base_delivery_fee: Number(editingZone.base_delivery_fee),
    });

    setEditingZone(null);
  };

  // Handle Confirm Reassign Rider
  const handleConfirmReassignRider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reassignOrder) return;
    adminReassignRider(reassignOrder.id, newRiderName.trim(), newRiderPhone.trim());
    setReassignOrder(null);
  };

  // Handle Confirm Order Status Change
  const handleConfirmStatusChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusChangeOrder) return;
    adminUpdateOrderStatus(statusChangeOrder.id, selectedStatus);
    setStatusChangeOrder(null);
  };

  // Handle Save Customer Order Address & Instructions
  const handleSaveOrderCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrderCustomer) return;
    adminEditOrderCustomer(editingOrderCustomer.id, {
      deliveryAddress: editOrderAddress,
      specialInstructions: editOrderInstructions,
    });
    setEditingOrderCustomer(null);
  };

  // Handle Save Global Platform Settings
  const handleSavePlatformSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlatformSettings({
      platform_fee: Number(adminPlatformFee),
      gst_rate_percent: Number(adminGstRate),
      free_delivery_above: Number(adminFreeDelivery),
      surge_pricing_active: adminSurgeActive,
      surge_fee: Number(adminSurgeFee),
      surge_reason: adminSurgeReason,
      announcement_ticker: adminAnnouncement,
      announcement_active: adminAnnouncementActive,
    });
    setSettingsSuccessMsg(true);
    setTimeout(() => setSettingsSuccessMsg(false), 3000);
  };

  // Handle Create Pilot
  const handleCreatePilot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPilotName.trim()) return;
    addNewPilot({
      name: newPilotName.trim(),
      phone: newPilotPhone.trim(),
      vehicle_number: newPilotVehicleNum.trim().toUpperCase(),
      vehicle_type: newPilotVehicleType.trim(),
      rating: 4.8,
      total_trips: 0,
      cash_collected: 0,
      is_active: true,
      is_online: true,
    });
    setNewPilotName('');
    setShowAddPilotModal(false);
  };

  // Handle Save Edited Pilot
  const handleSaveEditedPilot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPilot) return;
    updatePilot(editingPilot.id, {
      name: editingPilot.name,
      phone: editingPilot.phone,
      vehicle_number: editingPilot.vehicle_number,
      vehicle_type: editingPilot.vehicle_type,
      rating: Number(editingPilot.rating),
    });
    setEditingPilot(null);
  };

  // Handle Admin Create Dish for Selected Restaurant
  const handleAdminCreateDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!managingRestMenuId || !adminNewDishName.trim()) return;
    addNewMenuItem({
      restaurant_id: managingRestMenuId,
      name: adminNewDishName.trim(),
      name_te: adminNewDishNameTe.trim() || adminNewDishName.trim(),
      category: adminNewDishCategory.trim() || 'Specials',
      price: Number(adminNewDishPrice),
      prep_time: Number(adminNewDishPrepTime),
      is_veg: adminNewDishIsVeg,
      is_available: true,
      is_bestseller: adminNewDishIsBestseller,
      description: adminNewDishDesc.trim() || 'Delicious freshly prepared dish.',
      description_te: 'రుచికరమైన తాజా వంటకం.',
      photo_url: adminNewDishImage,
      rating: 4.8,
      rating_count: 1,
    });
    setAdminNewDishName('');
    setAdminNewDishNameTe('');
    setAdminNewDishDesc('');
    setAdminShowAddDishModal(false);
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '16px' }}>
      {/* Header Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 16,
      }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0, color: '#0f172a' }}>
            {locale === 'te' ? 'సిటీ ఆపరేషన్స్ కంట్రోల్ సెంటర్' : 'City Logistics & Admin Operations'}
          </h1>
          <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0' }}>
            Full editing authority: customize restaurants, menus, surge fee amounts, zones, vouchers & live orders
          </p>
        </div>

        {/* Dynamic Surge Price Controller */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: surgePricing ? '#fef3c7' : '#f1f5f9',
          border: '1.5px solid ' + (surgePricing ? '#f59e0b' : '#cbd5e1'),
          padding: '6px 14px',
          borderRadius: 24,
        }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: surgePricing ? '#b45309' : '#475569' }}>
            {surgePricing ? `⚡ Weather Surge Active (+₹${surgeFeeAmount || 15})` : '🌤️ Normal Weather'}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Fee: ₹</span>
            <input
              type="number"
              min={5}
              max={100}
              value={surgeFeeAmount || 15}
              onChange={(e) => setSurgeFeeAmount(Number(e.target.value))}
              style={{
                width: 44,
                padding: '2px 4px',
                borderRadius: 4,
                border: '1px solid #cbd5e1',
                fontSize: '0.75rem',
                fontWeight: 800,
                textAlign: 'center',
              }}
              title="Edit surge fee amount in Rupees"
            />
          </div>

          <button
            onClick={toggleSurgePricing}
            style={{
              padding: '4px 10px',
              borderRadius: 20,
              background: surgePricing ? '#f59e0b' : '#94a3b8',
              color: '#fff',
              border: 'none',
              fontSize: '0.7rem',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            {surgePricing ? 'Turn OFF' : 'Activate Surge'}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        background: '#e2e8f0',
        borderRadius: 12,
        padding: 4,
        marginBottom: 18,
        overflowX: 'auto',
      }}>
        <button
          onClick={() => setActiveTab('kpis')}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: 10,
            border: 'none',
            fontSize: '0.82rem',
            fontWeight: 800,
            whiteSpace: 'nowrap',
            background: activeTab === 'kpis' ? '#fff' : 'transparent',
            color: activeTab === 'kpis' ? '#0f172a' : '#64748b',
            boxShadow: activeTab === 'kpis' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
            cursor: 'pointer',
          }}
        >
          📊 Operations Overview
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: 10,
            border: 'none',
            fontSize: '0.82rem',
            fontWeight: 800,
            whiteSpace: 'nowrap',
            background: activeTab === 'orders' ? '#fff' : 'transparent',
            color: activeTab === 'orders' ? '#0f172a' : '#64748b',
            boxShadow: activeTab === 'orders' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <span>🛎️ Live City Orders</span>
          {activeOrders.length > 0 && (
            <span style={{
              background: '#ef4444',
              color: '#fff',
              fontSize: '0.65rem',
              fontWeight: 800,
              padding: '1px 6px',
              borderRadius: 10,
            }}>
              {activeOrders.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('restaurants')}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: 10,
            border: 'none',
            fontSize: '0.82rem',
            fontWeight: 800,
            whiteSpace: 'nowrap',
            background: activeTab === 'restaurants' ? '#fff' : 'transparent',
            color: activeTab === 'restaurants' ? '#0f172a' : '#64748b',
            boxShadow: activeTab === 'restaurants' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <span>🏪 Restaurants ({restaurants.length})</span>
          {pendingRestaurants.length > 0 && (
            <span style={{
              background: '#f97316',
              color: '#fff',
              fontSize: '0.65rem',
              fontWeight: 800,
              padding: '1px 6px',
              borderRadius: 10,
            }}>
              {pendingRestaurants.length} Pending
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('pilots')}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: 10,
            border: 'none',
            fontSize: '0.82rem',
            fontWeight: 800,
            whiteSpace: 'nowrap',
            background: activeTab === 'pilots' ? '#fff' : 'transparent',
            color: activeTab === 'pilots' ? '#0f172a' : '#64748b',
            boxShadow: activeTab === 'pilots' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
            cursor: 'pointer',
          }}
        >
          🛵 Delivery Fleet ({pilots.length})
        </button>

        <button
          onClick={() => setActiveTab('zones')}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: 10,
            border: 'none',
            fontSize: '0.82rem',
            fontWeight: 800,
            whiteSpace: 'nowrap',
            background: activeTab === 'zones' ? '#fff' : 'transparent',
            color: activeTab === 'zones' ? '#0f172a' : '#64748b',
            boxShadow: activeTab === 'zones' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
            cursor: 'pointer',
          }}
        >
          📍 Delivery Zones ({zones.length})
        </button>

        <button
          onClick={() => setActiveTab('coupons')}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: 10,
            border: 'none',
            fontSize: '0.82rem',
            fontWeight: 800,
            whiteSpace: 'nowrap',
            background: activeTab === 'coupons' ? '#fff' : 'transparent',
            color: activeTab === 'coupons' ? '#0f172a' : '#64748b',
            boxShadow: activeTab === 'coupons' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
            cursor: 'pointer',
          }}
        >
          🏷️ Promo Engine ({coupons.length})
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: 10,
            border: 'none',
            fontSize: '0.82rem',
            fontWeight: 800,
            whiteSpace: 'nowrap',
            background: activeTab === 'settings' ? '#fff' : 'transparent',
            color: activeTab === 'settings' ? '#0f172a' : '#64748b',
            boxShadow: activeTab === 'settings' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
            cursor: 'pointer',
          }}
        >
          ⚙️ Global Settings
        </button>
      </div>

      {/* ======================================================================= */}
      {/* TAB 1: OPERATIONS OVERVIEW KPIS                                         */}
      {/* ======================================================================= */}
      {activeTab === 'kpis' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Top KPI Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 12,
          }}>
            <div style={{ background: '#fff', padding: 18, borderRadius: 14, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                Citywide Food GMV (Today)
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#059669', marginTop: 2 }}>
                ₹{totalGMV.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#047857', fontWeight: 700, marginTop: 4 }}>
                ↑ +24.5% vs last week
              </div>
            </div>

            <div style={{ background: '#fff', padding: 18, borderRadius: 14, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                Platform Take Rate & Comm.
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#f97316', marginTop: 2 }}>
                ₹{netCommissionRevenue.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 4 }}>
                Average 12.0% merchant take rate
              </div>
            </div>

            <div style={{ background: '#fff', padding: 18, borderRadius: 14, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                Total Orders Placed
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', marginTop: 2 }}>
                {totalOrdersCount}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 700, marginTop: 4 }}>
                {activeOrders.length} currently in transit
              </div>
            </div>

            <div style={{ background: '#fff', padding: 18, borderRadius: 14, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                Active Delivery Fleet
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', marginTop: 2 }}>
                24 Pilots
              </div>
              <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 700, marginTop: 4 }}>
                98.8% on-time delivery SLA
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* TAB 2: LIVE ORDERS MONITOR WITH ADMIN INTERVENTIONS                     */}
      {/* ======================================================================= */}
      {activeTab === 'orders' && (
        <div>
          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 14, overflowX: 'auto', paddingBottom: 4 }}>
            {[
              { id: 'all', label: 'All Orders' },
              { id: 'placed', label: '🔴 Placed' },
              { id: 'preparing', label: '🍳 Preparing' },
              { id: 'ready_for_pickup', label: '📦 Ready' },
              { id: 'out_for_delivery', label: '🛵 On The Way' },
              { id: 'delivered', label: '✓ Delivered' },
              { id: 'cancelled', label: '✕ Cancelled' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setOrderFilter(f.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  border: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  background: orderFilter === f.id ? '#0f172a' : '#fff',
                  color: orderFilter === f.id ? '#fff' : '#64748b',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  cursor: 'pointer',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Orders Table with Action Controls */}
          <div style={{
            background: '#fff',
            borderRadius: 16,
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid #e2e8f0', color: '#64748b', fontWeight: 800 }}>
                    <th style={{ padding: '12px 16px' }}>Order ID</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                    <th style={{ padding: '12px 16px' }}>Restaurant</th>
                    <th style={{ padding: '12px 16px' }}>Drop Location</th>
                    <th style={{ padding: '12px 16px' }}>Assigned Pilot</th>
                    <th style={{ padding: '12px 16px' }}>Bill</th>
                    <th style={{ padding: '12px 16px' }}>Admin Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: '32px 16px', textAlign: 'center', color: '#94a3b8' }}>
                        No orders match the selected filter.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map(order => (
                      <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 800, color: '#0f172a' }}>
                          #{order.order_code}
                          <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 500 }}>
                            {new Date(order.created_at || order.placed_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: 6,
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            background:
                              order.status === 'delivered' ? '#ecfdf5' :
                              (order.status === 'out_for_delivery' || order.status === 'picked_up') ? '#eff6ff' :
                              order.status === 'cancelled' ? '#fef2f2' :
                              order.status === 'placed' ? '#fef2f2' : '#ffedd5',
                            color:
                              order.status === 'delivered' ? '#047857' :
                              (order.status === 'out_for_delivery' || order.status === 'picked_up') ? '#1d4ed8' :
                              order.status === 'cancelled' ? '#dc2626' :
                              order.status === 'placed' ? '#b91c1c' : '#c2410c',
                          }}>
                            {order.status.replace(/_/g, ' ').toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 700, color: '#1e293b' }}>
                          {order.restaurant_name}
                        </td>
                        <td style={{ padding: '12px 16px', color: '#64748b' }}>
                          {order.delivery_address || 'Gandhi Nagar'}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          {order.rider_name ? (
                            <span style={{ fontWeight: 700, color: '#059669' }}>
                              🛵 {order.rider_name}
                            </span>
                          ) : (
                            <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Unassigned</span>
                          )}
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 800, color: '#0f172a' }}>
                          ₹{order.total_amount}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button
                              onClick={() => {
                                setStatusChangeOrder(order);
                                setSelectedStatus(order.status);
                              }}
                              style={{
                                background: '#eff6ff',
                                color: '#1d4ed8',
                                border: '1px solid #bfdbfe',
                                borderRadius: 6,
                                padding: '3px 8px',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              ⚡ Status
                            </button>
                            <button
                              onClick={() => {
                                setReassignOrder(order);
                                setNewRiderName(order.rider_name || 'Venkat Reddy');
                              }}
                              style={{
                                background: '#f8fafc',
                                color: '#334155',
                                border: '1px solid #cbd5e1',
                                borderRadius: 6,
                                padding: '3px 8px',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              🛵 Rider
                            </button>
                            <button
                              onClick={() => {
                                setEditingOrderCustomer(order);
                                setEditOrderAddress(order.delivery_address || '');
                                setEditOrderInstructions(order.special_instructions || '');
                              }}
                              style={{
                                background: '#fef3c7',
                                color: '#b45309',
                                border: '1px solid #fde68a',
                                borderRadius: 6,
                                padding: '3px 8px',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                              title="Edit customer drop location and instructions"
                            >
                              ✏️ Drop
                            </button>
                            {order.status !== 'cancelled' && order.status !== 'delivered' && (
                              <button
                                onClick={() => {
                                  if (confirm(`Cancel Order #${order.order_code}?`)) {
                                    adminCancelOrder(order.id, 'Admin operations intervention');
                                  }
                                }}
                                style={{
                                  background: '#fff',
                                  color: '#dc2626',
                                  border: '1px solid #fecaca',
                                  borderRadius: 6,
                                  padding: '3px 6px',
                                  fontSize: '0.7rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                }}
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* TAB 3: RESTAURANTS (FULL ADD, EDIT & DELETE PARTNER RESTAURANTS)        */}
      {/* ======================================================================= */}
      {activeTab === 'restaurants' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Partner Restaurant Outlets
              </h3>
              <p style={{ fontSize: '0.76rem', color: '#64748b', margin: '2px 0 0' }}>
                Onboard new restaurants, modify commission agreements, ratings, addresses or approval statuses
              </p>
            </div>

            <button
              onClick={() => setShowAddRestModal(true)}
              style={{
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                color: '#fff',
                border: 'none',
                padding: '10px 18px',
                borderRadius: 10,
                fontSize: '0.84rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(249,115,22,0.25)',
              }}
            >
              + Onboard New Restaurant
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {restaurants.map(rest => (
              <div
                key={rest.id}
                style={{
                  background: '#fff',
                  borderRadius: 14,
                  padding: '16px 18px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                        {locale === 'te' && rest.name_te ? rest.name_te : rest.name}
                      </h3>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: 4,
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        background:
                          rest.approval_status === 'approved' ? '#ecfdf5' :
                          rest.approval_status === 'pending' ? '#ffedd5' : '#fee2e2',
                        color:
                          rest.approval_status === 'approved' ? '#047857' :
                          rest.approval_status === 'pending' ? '#c2410c' : '#b91c1c',
                      }}>
                        {rest.approval_status.toUpperCase()}
                      </span>
                      {rest.is_featured && (
                        <span style={{ fontSize: '0.65rem', background: '#fef3c7', color: '#b45309', padding: '1px 6px', borderRadius: 4, fontWeight: 800 }}>
                          FEATURED
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 2 }}>
                      📍 {rest.address_text || rest.area || 'Gandhi Nagar'} • Phone: {rest.phone} • Rating: ★ {rest.rating}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#334155', marginTop: 4 }}>
                      Cuisines: {rest.cuisines?.join(', ')} • Cost for two: ₹{rest.cost_for_two}
                    </div>
                  </div>

                  {/* Edit & Delete Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      background: '#f8fafc',
                      padding: '4px 10px',
                      borderRadius: 8,
                      border: '1px solid #e2e8f0',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}>
                      <span>Commission:</span>
                      <input
                        type="number"
                        min={5}
                        max={30}
                        defaultValue={rest.commission_rate || 15}
                        onBlur={(e) => updateCommissionRate(rest.id, Number(e.target.value))}
                        style={{ width: 44, padding: '2px 4px', borderRadius: 4, border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 800 }}
                      />
                      <span>%</span>
                    </div>

                    <button
                      onClick={() => setManagingRestMenuId(rest.id)}
                      style={{
                        background: '#f0fdf4',
                        color: '#16a34a',
                        border: '1px solid #bbf7d0',
                        padding: '6px 12px',
                        borderRadius: 8,
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                      title="Manage menu dishes for this restaurant"
                    >
                      <span>🍽️ Dishes</span>
                      <span style={{ background: '#22c55e', color: '#fff', fontSize: '0.65rem', padding: '1px 5px', borderRadius: 10 }}>
                        {menuItems.filter(m => m.restaurant_id === rest.id).length}
                      </span>
                    </button>

                    <button
                      onClick={() => setEditingRestaurant({ ...rest })}
                      style={{
                        background: '#eff6ff',
                        color: '#2563eb',
                        border: '1px solid #bfdbfe',
                        padding: '6px 12px',
                        borderRadius: 8,
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      ✏️ Edit
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Delete ${rest.name} and its entire menu permanently?`)) {
                          deleteRestaurant(rest.id);
                        }
                      }}
                      style={{
                        background: '#fef2f2',
                        color: '#dc2626',
                        border: '1px solid #fecaca',
                        padding: '6px 10px',
                        borderRadius: 8,
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {/* Pending Actions */}
                {rest.approval_status === 'pending' && (
                  <div style={{ display: 'flex', gap: 10, marginTop: 12, paddingTop: 10, borderTop: '1px solid #f1f5f9' }}>
                    <button
                      onClick={() => rejectRestaurant(rest.id)}
                      style={{ flex: 1, padding: '6px 0', borderRadius: 8, border: '1.5px solid #fca5a5', background: '#fff', color: '#dc2626', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}
                    >
                      ✕ Reject Application
                    </button>
                    <button
                      onClick={() => approveRestaurant(rest.id)}
                      style={{ flex: 2, padding: '6px 0', borderRadius: 8, border: 'none', background: '#16a34a', color: '#fff', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}
                    >
                      ✓ Approve Partner
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* TAB 4: DELIVERY ZONES & TARIFFS (FULL CRUD)                             */}
      {/* ======================================================================= */}
      {activeTab === 'zones' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Delivery Zones & City Logistics Tariffs
              </h3>
              <p style={{ fontSize: '0.76rem', color: '#64748b', margin: '2px 0 0' }}>
                Add new logistics delivery zones, update flat base delivery fees, or toggle coverage
              </p>
            </div>

            <button
              onClick={() => setShowAddZoneModal(true)}
              style={{
                background: 'linear-gradient(135deg, #059669, #047857)',
                color: '#fff',
                border: 'none',
                padding: '10px 18px',
                borderRadius: 10,
                fontSize: '0.84rem',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              + Add Delivery Zone
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {zones.map(zone => (
              <div
                key={zone.id}
                style={{
                  background: '#fff',
                  borderRadius: 14,
                  padding: '16px 18px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      {locale === 'te' && zone.name_te ? zone.name_te : zone.name}
                    </h3>
                    <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: 2 }}>
                      Zone slug: {zone.slug} • Coverage: ~5 km
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      onClick={() => setEditingZone({ ...zone })}
                      style={{
                        background: '#eff6ff',
                        color: '#2563eb',
                        border: '1px solid #bfdbfe',
                        padding: '4px 10px',
                        borderRadius: 8,
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      ✏️ Edit
                    </button>

                    <button
                      onClick={() => toggleZoneActive(zone.id)}
                      style={{
                        padding: '5px 12px',
                        borderRadius: 20,
                        border: 'none',
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        background: zone.is_active ? '#ecfdf5' : '#fee2e2',
                        color: zone.is_active ? '#047857' : '#b91c1c',
                        cursor: 'pointer',
                      }}
                    >
                      {zone.is_active ? 'ACTIVE' : 'DISABLED'}
                    </button>

                    {zones.length > 1 && (
                      <button
                        onClick={() => {
                          if (confirm(`Delete zone "${zone.name}"?`)) {
                            deleteZone(zone.id);
                          }
                        }}
                        style={{
                          background: '#fef2f2',
                          color: '#dc2626',
                          border: '1px solid #fecaca',
                          padding: '4px 8px',
                          borderRadius: 8,
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                        }}
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: 10,
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
                    Base Customer Delivery Fee:
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontWeight: 800 }}>₹</span>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      defaultValue={zone.base_delivery_fee}
                      onBlur={(e) => updateZoneFee(zone.id, Number(e.target.value))}
                      style={{ width: 60, padding: '4px 8px', borderRadius: 6, border: '1px solid #cbd5e1', fontWeight: 800, textAlign: 'center' }}
                    />
                    <span style={{ fontSize: '0.74rem', color: '#64748b' }}>flat per trip</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* TAB 5: PROMO ENGINE & COUPONS (FULL CRUD)                               */}
      {/* ======================================================================= */}
      {activeTab === 'coupons' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Discount Vouchers & Promotions
              </h3>
              <p style={{ fontSize: '0.76rem', color: '#64748b', margin: '2px 0 0' }}>
                Add, edit discount values, adjust min order thresholds, or delete coupon vouchers
              </p>
            </div>

            <button
              onClick={() => setShowCouponModal(true)}
              style={{
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                color: '#fff',
                border: 'none',
                padding: '10px 18px',
                borderRadius: 10,
                fontSize: '0.84rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(249,115,22,0.25)',
              }}
            >
              + Create Voucher Code
            </button>
          </div>

          {/* Coupons List */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
            {coupons.map(coupon => (
              <div
                key={coupon.id}
                style={{
                  background: '#fff',
                  borderRadius: 14,
                  padding: '16px 18px',
                  border: coupon.is_active ? '1px solid #e2e8f0' : '1px dashed #cbd5e1',
                  opacity: coupon.is_active ? 1 : 0.6,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '1.05rem', fontWeight: 900, letterSpacing: '0.04em', color: '#f97316' }}>
                      {coupon.code}
                    </span>
                    <div style={{ fontSize: '0.78rem', color: '#334155', marginTop: 2 }}>
                      {coupon.description}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 4 }}>
                      Min order: ₹{coupon.min_order_amount} • {coupon.discount_type === 'flat' ? `₹${coupon.discount_value}` : `${coupon.discount_value}%`} off
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button
                      onClick={() => setEditingCoupon({ ...coupon })}
                      style={{
                        background: '#eff6ff',
                        color: '#2563eb',
                        border: '1px solid #bfdbfe',
                        padding: '4px 8px',
                        borderRadius: 6,
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      ✏️
                    </button>

                    <button
                      onClick={() => toggleCouponActive(coupon.id)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 20,
                        border: 'none',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        background: coupon.is_active ? '#ecfdf5' : '#fee2e2',
                        color: coupon.is_active ? '#047857' : '#b91c1c',
                        cursor: 'pointer',
                      }}
                    >
                      {coupon.is_active ? 'ON' : 'OFF'}
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Delete coupon "${coupon.code}"?`)) {
                          deleteCoupon(coupon.id);
                        }
                      }}
                      style={{
                        background: '#fef2f2',
                        color: '#dc2626',
                        border: '1px solid #fecaca',
                        padding: '4px 6px',
                        borderRadius: 6,
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* TAB 4: DELIVERY FLEET & PILOTS MANAGEMENT                                */}
      {/* ======================================================================= */}
      {activeTab === 'pilots' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Top Fleet Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
            background: '#fff',
            padding: '16px 20px',
            borderRadius: 16,
            border: '1px solid #e2e8f0',
          }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                🛵 City Delivery Pilots Fleet ({pilots.length})
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0' }}>
                Manage on-duty status, cash float deposits, vehicle allocations, and rider performance ratings.
              </p>
            </div>

            <button
              onClick={() => setShowAddPilotModal(true)}
              style={{
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                color: '#fff',
                border: 'none',
                padding: '9px 18px',
                borderRadius: 10,
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 2px 8px rgba(249,115,22,0.3)',
              }}
            >
              + Register New Pilot
            </button>
          </div>

          {/* Fleet Metrics Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            <div style={{ background: '#fff', padding: 14, borderRadius: 12, border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>ACTIVE ONLINE PILOTS</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#059669', marginTop: 2 }}>
                {pilots.filter(p => p.is_online).length} of {pilots.length} Pilots
              </div>
            </div>

            <div style={{ background: '#fff', padding: 14, borderRadius: 12, border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>TOTAL TRIPS COMPLETED</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', marginTop: 2 }}>
                {pilots.reduce((sum, p) => sum + p.total_trips, 0) + 1380}
              </div>
            </div>

            <div style={{ background: '#fff', padding: 14, borderRadius: 12, border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>TOTAL CASH IN HAND WITH PILOTS</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#b45309', marginTop: 2 }}>
                ₹{pilots.reduce((sum, p) => sum + (p.cash_collected || 0), 0).toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Pilots Table */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid #e2e8f0', color: '#64748b', fontWeight: 800 }}>
                    <th style={{ padding: '12px 16px' }}>Pilot Name</th>
                    <th style={{ padding: '12px 16px' }}>Duty Status</th>
                    <th style={{ padding: '12px 16px' }}>Vehicle Details</th>
                    <th style={{ padding: '12px 16px' }}>Rating & Trips</th>
                    <th style={{ padding: '12px 16px' }}>Cash Float Collected</th>
                    <th style={{ padding: '12px 16px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pilots.map(pilot => (
                    <tr key={pilot.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 800, color: '#0f172a' }}>{pilot.name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{pilot.phone}</div>
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        <button
                          onClick={() => togglePilotDuty(pilot.id)}
                          style={{
                            padding: '3px 10px',
                            borderRadius: 20,
                            border: 'none',
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            background: pilot.is_online ? '#ecfdf5' : '#f1f5f9',
                            color: pilot.is_online ? '#047857' : '#64748b',
                            cursor: 'pointer',
                          }}
                        >
                          {pilot.is_online ? '🟢 ON DUTY' : '⚪ OFF DUTY'}
                        </button>
                      </td>

                      <td style={{ padding: '12px 16px', color: '#334155' }}>
                        <span style={{ fontWeight: 700 }}>{pilot.vehicle_number}</span>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{pilot.vehicle_type}</div>
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontWeight: 800, color: '#0f172a' }}>★ {pilot.rating}</span>
                        <span style={{ fontSize: '0.72rem', color: '#64748b', marginLeft: 6 }}>({pilot.total_trips} trips)</span>
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontWeight: 800, color: pilot.cash_collected > 2000 ? '#dc2626' : '#0f172a' }}>
                            ₹{pilot.cash_collected || 0}
                          </span>
                          {(pilot.cash_collected || 0) > 0 && (
                            <button
                              onClick={() => {
                                if (confirm(`Confirm cash deposit of ₹${pilot.cash_collected} collected from ${pilot.name} at hub?`)) {
                                  resetPilotCash(pilot.id);
                                }
                              }}
                              style={{
                                background: '#ecfdf5',
                                color: '#047857',
                                border: '1px solid #a7f3d0',
                                padding: '2px 6px',
                                borderRadius: 6,
                                fontSize: '0.68rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                              }}
                              title="Reset cash balance after deposit"
                            >
                              Clear Float
                            </button>
                          )}
                        </div>
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            onClick={() => setEditingPilot({ ...pilot })}
                            style={{
                              background: '#eff6ff',
                              color: '#2563eb',
                              border: '1px solid #bfdbfe',
                              padding: '4px 8px',
                              borderRadius: 6,
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            ✏️ Edit
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Remove ${pilot.name} from the active delivery fleet?`)) {
                                deletePilot(pilot.id);
                              }
                            }}
                            style={{
                              background: '#fef2f2',
                              color: '#dc2626',
                              border: '1px solid #fecaca',
                              padding: '4px 6px',
                              borderRadius: 6,
                              fontSize: '0.72rem',
                              cursor: 'pointer',
                            }}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* TAB 5: GLOBAL PLATFORM PRICING & ANNOUNCEMENT SETTINGS                  */}
      {/* ======================================================================= */}
      {activeTab === 'settings' && (
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                ⚙️ Global Platform Settings & Pricing Controls
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0' }}>
                All fee, tax, threshold, and banner changes update the customer cart, bill calculations, and home page instantly.
              </p>
            </div>
            {settingsSuccessMsg && (
              <span style={{
                background: '#ecfdf5',
                color: '#047857',
                border: '1px solid #a7f3d0',
                padding: '6px 14px',
                borderRadius: 20,
                fontSize: '0.76rem',
                fontWeight: 800,
              }}>
                ✓ Platform Settings Saved Live!
              </span>
            )}
          </div>

          <form onSubmit={handleSavePlatformSettings} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Core Pricing Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                  Platform Convenience Fee (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={adminPlatformFee}
                  onChange={(e) => setAdminPlatformFee(Number(e.target.value))}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                />
                <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Added per order (Swiggy/Zomato style)</span>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                  GST / Restaurant Tax Rate (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={28}
                  value={adminGstRate}
                  onChange={(e) => setAdminGstRate(Number(e.target.value))}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                />
                <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Applied to food subtotal (standard: 5%)</span>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                  Free Delivery Threshold (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  step={50}
                  value={adminFreeDelivery}
                  onChange={(e) => setAdminFreeDelivery(Number(e.target.value))}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                />
                <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Orders above this qualify for 100% Free Delivery</span>
              </div>
            </div>

            {/* Dynamic Weather Surge Pricing */}
            <div style={{
              background: '#f8fafc',
              padding: '16px',
              borderRadius: 12,
              border: '1.5px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
                    ⚡ Weather & High-Demand Surge Pricing
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    Temporarily add surge fees to delivery orders during monsoons, peak festivals, or pilot shortages.
                  </div>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={adminSurgeActive}
                    onChange={(e) => setAdminSurgeActive(e.target.checked)}
                    style={{ width: 18, height: 18, accentColor: '#f97316' }}
                  />
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: adminSurgeActive ? '#b45309' : '#64748b' }}>
                    {adminSurgeActive ? 'SURGE ACTIVE' : 'SURGE DISABLED'}
                  </span>
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                    Surge Fee (₹)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={100}
                    value={adminSurgeFee}
                    onChange={(e) => setAdminSurgeFee(Number(e.target.value))}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                    Surge Reason / Customer Display Note
                  </label>
                  <input
                    type="text"
                    value={adminSurgeReason}
                    onChange={(e) => setAdminSurgeReason(e.target.value)}
                    placeholder="e.g. Heavy Rain Rush in Vijayawada"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            </div>

            {/* Citywide Announcement Ticker Banner */}
            <div style={{
              background: '#fff7ed',
              padding: '16px',
              borderRadius: 12,
              border: '1.5px solid #fed7aa',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#9a3412' }}>
                    📢 Citywide Announcement Ticker
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#c2410c' }}>
                    Displays dynamically at the very top of customer search and home feed.
                  </div>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={adminAnnouncementActive}
                    onChange={(e) => setAdminAnnouncementActive(e.target.checked)}
                    style={{ width: 18, height: 18, accentColor: '#f97316' }}
                  />
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: adminAnnouncementActive ? '#9a3412' : '#64748b' }}>
                    {adminAnnouncementActive ? 'SHOW BANNER' : 'HIDDEN'}
                  </span>
                </label>
              </div>

              <div>
                <input
                  type="text"
                  value={adminAnnouncement}
                  onChange={(e) => setAdminAnnouncement(e.target.value)}
                  placeholder="e.g. 🌧️ Heavy rains in Vijayawada: Fast delivery with waterproof bags!"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #fed7aa', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                marginTop: 8,
                padding: '12px 24px',
                borderRadius: 10,
                border: 'none',
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                color: '#fff',
                fontSize: '0.9rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(249,115,22,0.3)',
                alignSelf: 'flex-start',
              }}
            >
              ✓ Save Global Platform Settings
            </button>
          </form>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL: ONBOARD NEW RESTAURANT                                           */}
      {/* ======================================================================= */}
      {showAddRestModal && (
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
            maxWidth: 520,
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: 24,
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                + Onboard New Partner Restaurant
              </h3>
              <button
                onClick={() => setShowAddRestModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#94a3b8' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRestaurant} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                    Restaurant Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Godavari Kitchen"
                    value={newRestName}
                    onChange={(e) => setNewRestName(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                    Restaurant Name (Telugu)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. గోదావరి కిచెన్"
                    value={newRestNameTe}
                    onChange={(e) => setNewRestNameTe(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={newRestPhone}
                    onChange={(e) => setNewRestPhone(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                    Address / Area *
                  </label>
                  <input
                    type="text"
                    required
                    value={newRestAddress}
                    onChange={(e) => setNewRestAddress(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                    Commission (%)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={30}
                    value={newRestCommission}
                    onChange={(e) => setNewRestCommission(Number(e.target.value))}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                    Cost for Two (₹)
                  </label>
                  <input
                    type="number"
                    min={50}
                    value={newRestCostForTwo}
                    onChange={(e) => setNewRestCostForTwo(Number(e.target.value))}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                    Prep Time (mins)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={60}
                    value={newRestPrepTime}
                    onChange={(e) => setNewRestPrepTime(Number(e.target.value))}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                  Cuisines (Comma-separated)
                </label>
                <input
                  type="text"
                  value={newRestCuisines}
                  onChange={(e) => setNewRestCuisines(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                  Cover Photo URL
                </label>
                <input
                  type="url"
                  value={newRestCoverPhoto}
                  onChange={(e) => setNewRestCoverPhoto(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.8rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowAddRestModal(false)}
                  style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff', color: '#64748b', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 2, padding: '10px 0', borderRadius: 8, border: 'none', background: '#f97316', color: '#fff', fontWeight: 800, cursor: 'pointer' }}
                >
                  Save & Onboard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL: EDIT RESTAURANT DETAILS                                          */}
      {/* ======================================================================= */}
      {editingRestaurant && (
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
            maxWidth: 520,
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: 24,
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                ✏️ Edit Restaurant: {editingRestaurant.name}
              </h3>
              <button
                onClick={() => setEditingRestaurant(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#94a3b8' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditedRestaurant} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                    Name (English)
                  </label>
                  <input
                    type="text"
                    required
                    value={editingRestaurant.name}
                    onChange={(e) => setEditingRestaurant({ ...editingRestaurant, name: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                    Name (Telugu)
                  </label>
                  <input
                    type="text"
                    value={editingRestaurant.name_te || ''}
                    onChange={(e) => setEditingRestaurant({ ...editingRestaurant, name_te: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={editingRestaurant.phone}
                    onChange={(e) => setEditingRestaurant({ ...editingRestaurant, phone: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                    Address Text
                  </label>
                  <input
                    type="text"
                    value={editingRestaurant.address_text || editingRestaurant.area || ''}
                    onChange={(e) => setEditingRestaurant({ ...editingRestaurant, address_text: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                    Commission (%)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={30}
                    value={editingRestaurant.commission_rate}
                    onChange={(e) => setEditingRestaurant({ ...editingRestaurant, commission_rate: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                    Rating (★)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min={1}
                    max={5}
                    value={editingRestaurant.rating}
                    onChange={(e) => setEditingRestaurant({ ...editingRestaurant, rating: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                    Status
                  </label>
                  <select
                    value={editingRestaurant.approval_status}
                    onChange={(e) => setEditingRestaurant({ ...editingRestaurant, approval_status: e.target.value as any })}
                    style={{ width: '100%', padding: '8px 6px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  >
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={editingRestaurant.is_featured || false}
                    onChange={(e) => setEditingRestaurant({ ...editingRestaurant, is_featured: e.target.checked })}
                  />
                  <span>Feature on Customer Home Carousel 🌟</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setEditingRestaurant(null)}
                  style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff', color: '#64748b', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 2, padding: '10px 0', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 800, cursor: 'pointer' }}
                >
                  ✓ Save Restaurant Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL: ADD / EDIT ZONE                                                  */}
      {/* ======================================================================= */}
      {showAddZoneModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 400, padding: 22 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 14px' }}>+ Add Delivery Zone</h3>
            <form onSubmit={handleCreateZone} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Zone Name (English) *</label>
                <input type="text" required placeholder="e.g. Ring Road Suburbs" value={newZoneName} onChange={e => setNewZoneName(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Zone Name (Telugu)</label>
                <input type="text" placeholder="e.g. రింగ్ రోడ్ ప్రాంతం" value={newZoneNameTe} onChange={e => setNewZoneNameTe(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Base Delivery Fee (₹) *</label>
                <input type="number" required min={0} value={newZoneFee} onChange={e => setNewZoneFee(Number(e.target.value))} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button type="button" onClick={() => setShowAddZoneModal(false)} style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff', color: '#64748b', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 2, padding: '10px 0', borderRadius: 8, border: 'none', background: '#059669', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>Save Zone</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingZone && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 400, padding: 22 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 14px' }}>✏️ Edit Zone: {editingZone.name}</h3>
            <form onSubmit={handleSaveEditedZone} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Zone Name</label>
                <input type="text" required value={editingZone.name} onChange={e => setEditingZone({ ...editingZone, name: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Base Delivery Fee (₹)</label>
                <input type="number" required min={0} value={editingZone.base_delivery_fee} onChange={e => setEditingZone({ ...editingZone, base_delivery_fee: Number(e.target.value) })} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button type="button" onClick={() => setEditingZone(null)} style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff', color: '#64748b', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 2, padding: '10px 0', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>✓ Save Zone</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL: ADD / EDIT COUPON                                                */}
      {/* ======================================================================= */}
      {showCouponModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 440, padding: 22 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 14px' }}>+ Create Discount Coupon</h3>
            <form onSubmit={handleAddCoupon} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Code *</label>
                  <input type="text" required placeholder="e.g. SPECIAL30" value={newCode} onChange={e => setNewCode(e.target.value.toUpperCase())} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Type</label>
                  <select value={newType} onChange={e => setNewType(e.target.value as any)} style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}>
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Cash (₹)</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Discount Value *</label>
                  <input type="number" required min={1} value={newVal} onChange={e => setNewVal(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Min Order (₹)</label>
                  <input type="number" min={0} value={newMin} onChange={e => setNewMin(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Description</label>
                <input type="text" placeholder="e.g. 30% off on all weekend orders" value={newDesc} onChange={e => setNewDesc(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button type="button" onClick={() => setShowCouponModal(false)} style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff', color: '#64748b', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 2, padding: '10px 0', borderRadius: 8, border: 'none', background: '#f97316', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>Save Coupon</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingCoupon && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 440, padding: 22 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 14px' }}>✏️ Edit Coupon: {editingCoupon.code}</h3>
            <form onSubmit={handleSaveEditedCoupon} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Code</label>
                  <input type="text" required value={editingCoupon.code} onChange={e => setEditingCoupon({ ...editingCoupon, code: e.target.value.toUpperCase() })} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Type</label>
                  <select value={editingCoupon.discount_type} onChange={e => setEditingCoupon({ ...editingCoupon, discount_type: e.target.value as any })} style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}>
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Cash (₹)</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Discount Value</label>
                  <input type="number" required min={1} value={editingCoupon.discount_value} onChange={e => setEditingCoupon({ ...editingCoupon, discount_value: Number(e.target.value) })} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Min Order (₹)</label>
                  <input type="number" min={0} value={editingCoupon.min_order_amount} onChange={e => setEditingCoupon({ ...editingCoupon, min_order_amount: Number(e.target.value) })} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Description</label>
                <input type="text" value={editingCoupon.description} onChange={e => setEditingCoupon({ ...editingCoupon, description: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button type="button" onClick={() => setEditingCoupon(null)} style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff', color: '#64748b', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 2, padding: '10px 0', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>✓ Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL: REASSIGN RIDER                                                   */}
      {/* ======================================================================= */}
      {reassignOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 400, padding: 22 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 8px' }}>🛵 Reassign Delivery Pilot</h3>
            <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 14px' }}>Order #{reassignOrder.order_code} ({reassignOrder.restaurant_name})</p>
            <form onSubmit={handleConfirmReassignRider} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Pilot Name</label>
                <input type="text" required value={newRiderName} onChange={e => setNewRiderName(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Pilot Phone</label>
                <input type="text" required value={newRiderPhone} onChange={e => setNewRiderPhone(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button type="button" onClick={() => setReassignOrder(null)} style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff', color: '#64748b', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 2, padding: '10px 0', borderRadius: 8, border: 'none', background: '#059669', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>Confirm Pilot Assignment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL: FORCE ORDER STATUS CHANGE                                        */}
      {/* ======================================================================= */}
      {statusChangeOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 400, padding: 22 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 8px' }}>⚡ Force Order Status Update</h3>
            <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 14px' }}>Order #{statusChangeOrder.order_code}</p>
            <form onSubmit={handleConfirmStatusChange} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Select New Stage</label>
                <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value as any)} style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}>
                  <option value="placed">Placed (Awaiting Kitchen)</option>
                  <option value="preparing">Preparing (In Kitchen)</option>
                  <option value="ready_for_pickup">Ready for Pickup</option>
                  <option value="out_for_delivery">Out for Delivery (On Bike)</option>
                  <option value="delivered">Delivered (Completed)</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button type="button" onClick={() => setStatusChangeOrder(null)} style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff', color: '#64748b', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 2, padding: '10px 0', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>Update Stage</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL: EDIT CUSTOMER DROP LOCATION & INSTRUCTIONS                       */}
      {/* ======================================================================= */}
      {editingOrderCustomer && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 460, padding: 22 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 4px', color: '#0f172a' }}>
              ✏️ Edit Customer Drop Location & Notes
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 14px' }}>
              Order #{editingOrderCustomer.order_code} • {editingOrderCustomer.restaurant_name}
            </p>
            <form onSubmit={handleSaveOrderCustomer} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                  Delivery Address / Drop Point *
                </label>
                <textarea
                  rows={2}
                  required
                  value={editOrderAddress}
                  onChange={(e) => setEditOrderAddress(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                  Special Cooking & Drop Instructions
                </label>
                <textarea
                  rows={2}
                  value={editOrderInstructions}
                  onChange={(e) => setEditOrderInstructions(e.target.value)}
                  placeholder="e.g. Leave at door, extra spicy salan, call on arrival"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button
                  type="button"
                  onClick={() => setEditingOrderCustomer(null)}
                  style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff', color: '#64748b', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 2, padding: '10px 0', borderRadius: 8, border: 'none', background: '#f59e0b', color: '#fff', fontWeight: 800, cursor: 'pointer' }}
                >
                  ✓ Update Drop Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL: REGISTER NEW DELIVERY PILOT                                      */}
      {/* ======================================================================= */}
      {showAddPilotModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 440, padding: 22 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 14px', color: '#0f172a' }}>
              🛵 Register New Delivery Pilot
            </h3>
            <form onSubmit={handleCreatePilot} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Kumar"
                    value={newPilotName}
                    onChange={(e) => setNewPilotName(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={newPilotPhone}
                    onChange={(e) => setNewPilotPhone(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Vehicle Registration #</label>
                  <input
                    type="text"
                    required
                    value={newPilotVehicleNum}
                    onChange={(e) => setNewPilotVehicleNum(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Vehicle Model</label>
                  <input
                    type="text"
                    required
                    value={newPilotVehicleType}
                    onChange={(e) => setNewPilotVehicleType(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button
                  type="button"
                  onClick={() => setShowAddPilotModal(false)}
                  style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff', color: '#64748b', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 2, padding: '10px 0', borderRadius: 8, border: 'none', background: '#f97316', color: '#fff', fontWeight: 800, cursor: 'pointer' }}
                >
                  Register Pilot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL: EDIT DELIVERY PILOT                                              */}
      {/* ======================================================================= */}
      {editingPilot && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 440, padding: 22 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 14px', color: '#0f172a' }}>
              ✏️ Edit Pilot: {editingPilot.name}
            </h3>
            <form onSubmit={handleSaveEditedPilot} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Full Name</label>
                  <input
                    type="text"
                    required
                    value={editingPilot.name}
                    onChange={(e) => setEditingPilot({ ...editingPilot, name: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Phone</label>
                  <input
                    type="text"
                    required
                    value={editingPilot.phone}
                    onChange={(e) => setEditingPilot({ ...editingPilot, phone: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Vehicle Number</label>
                  <input
                    type="text"
                    required
                    value={editingPilot.vehicle_number}
                    onChange={(e) => setEditingPilot({ ...editingPilot, vehicle_number: e.target.value.toUpperCase() })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Rating (★)</label>
                  <input
                    type="number"
                    step="0.1"
                    min={1}
                    max={5}
                    value={editingPilot.rating}
                    onChange={(e) => setEditingPilot({ ...editingPilot, rating: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button
                  type="button"
                  onClick={() => setEditingPilot(null)}
                  style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff', color: '#64748b', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 2, padding: '10px 0', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 800, cursor: 'pointer' }}
                >
                  ✓ Save Pilot Info
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL: SUPER ADMIN RESTAURANT MENU DISHES MANAGER                       */}
      {/* ======================================================================= */}
      {managingRestMenuId && (() => {
        const targetRest = restaurants.find(r => r.id === managingRestMenuId);
        const dishes = menuItems.filter(m => m.restaurant_id === managingRestMenuId);

        return (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, backdropFilter: 'blur(4px)' }}>
            <div style={{ background: '#fff', borderRadius: 18, width: '100%', maxWidth: 760, maxHeight: '90vh', overflowY: 'auto', padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.25)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid #e2e8f0', paddingBottom: 12 }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                    🍽️ Manage Menu: {targetRest?.name || 'Restaurant'}
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0' }}>
                    Super Admin Direct Menu Authority • {dishes.length} Items Listed
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    onClick={() => setAdminShowAddDishModal(true)}
                    style={{
                      background: '#059669',
                      color: '#fff',
                      border: 'none',
                      padding: '8px 14px',
                      borderRadius: 8,
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    + Add Dish
                  </button>
                  <button
                    onClick={() => setManagingRestMenuId(null)}
                    style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: '#94a3b8' }}
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Dishes List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {dishes.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 32, color: '#94a3b8' }}>
                    No menu items currently added for this restaurant. Click "+ Add Dish" above.
                  </div>
                ) : (
                  dishes.map(dish => (
                    <div
                      key={dish.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        background: '#f8fafc',
                        borderRadius: 12,
                        border: '1px solid #e2e8f0',
                        gap: 12,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: '1rem' }}>{dish.is_veg ? '🟢' : '🔴'}</span>
                        <div>
                          <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.88rem' }}>
                            {dish.name}
                            {dish.is_bestseller && (
                              <span style={{ marginLeft: 6, fontSize: '0.65rem', background: '#fef3c7', color: '#b45309', padding: '1px 6px', borderRadius: 4, fontWeight: 800 }}>
                                ★ BESTSELLER
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            {dish.category || 'Specials'} • Prep: {dish.prep_time}m
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {/* Inline Price */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>₹</span>
                          <input
                            type="number"
                            min={10}
                            defaultValue={dish.price}
                            onBlur={(e) => updateItemPrice(dish.id, Number(e.target.value))}
                            style={{
                              width: 58,
                              padding: '3px 6px',
                              borderRadius: 6,
                              border: '1px solid #cbd5e1',
                              fontSize: '0.82rem',
                              fontWeight: 800,
                              textAlign: 'center',
                            }}
                            title="Edit dish price directly"
                          />
                        </div>

                        {/* Stock toggle */}
                        <button
                          onClick={() => toggleItemStock(dish.id)}
                          style={{
                            padding: '3px 8px',
                            borderRadius: 12,
                            border: 'none',
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            background: dish.is_available ? '#ecfdf5' : '#fee2e2',
                            color: dish.is_available ? '#047857' : '#b91c1c',
                            cursor: 'pointer',
                          }}
                        >
                          {dish.is_available ? 'IN STOCK' : 'OUT'}
                        </button>

                        {/* Edit Dish */}
                        <button
                          onClick={() => setAdminEditingDish({ ...dish })}
                          style={{
                            background: '#eff6ff',
                            color: '#2563eb',
                            border: '1px solid #bfdbfe',
                            padding: '3px 8px',
                            borderRadius: 6,
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          ✏️ Edit
                        </button>

                        {/* Delete Dish */}
                        <button
                          onClick={() => {
                            if (confirm(`Delete "${dish.name}" from menu?`)) {
                              deleteMenuItem(dish.id);
                            }
                          }}
                          style={{
                            background: '#fef2f2',
                            color: '#dc2626',
                            border: '1px solid #fecaca',
                            padding: '3px 6px',
                            borderRadius: 6,
                            fontSize: '0.72rem',
                            cursor: 'pointer',
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ======================================================================= */}
      {/* MODAL: SUPER ADMIN EDIT DISH                                            */}
      {/* ======================================================================= */}
      {adminEditingDish && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 480, padding: 22, maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 14px', color: '#0f172a' }}>
              ✏️ Edit Dish: {adminEditingDish.name}
            </h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              updateMenuItem(adminEditingDish.id, { ...adminEditingDish });
              setAdminEditingDish(null);
            }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Dish Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={adminEditingDish.name}
                    onChange={(e) => setAdminEditingDish({ ...adminEditingDish, name: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Dish Name (Telugu)</label>
                  <input
                    type="text"
                    value={adminEditingDish.name_te || ''}
                    onChange={(e) => setAdminEditingDish({ ...adminEditingDish, name_te: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Category</label>
                  <input
                    type="text"
                    value={adminEditingDish.category || 'Specials'}
                    onChange={(e) => setAdminEditingDish({ ...adminEditingDish, category: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Price (₹) *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={adminEditingDish.price}
                    onChange={(e) => setAdminEditingDish({ ...adminEditingDish, price: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Prep (mins)</label>
                  <input
                    type="number"
                    min={2}
                    value={adminEditingDish.prep_time}
                    onChange={(e) => setAdminEditingDish({ ...adminEditingDish, prep_time: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 16 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={adminEditingDish.is_veg}
                    onChange={(e) => setAdminEditingDish({ ...adminEditingDish, is_veg: e.target.checked })}
                  />
                  <span>Pure Veg 🟢</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={adminEditingDish.is_bestseller || false}
                    onChange={(e) => setAdminEditingDish({ ...adminEditingDish, is_bestseller: e.target.checked })}
                  />
                  <span>Bestseller Star 🌟</span>
                </label>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Photo URL</label>
                <input
                  type="url"
                  value={adminEditingDish.photo_url || ''}
                  onChange={(e) => setAdminEditingDish({ ...adminEditingDish, photo_url: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.8rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button
                  type="button"
                  onClick={() => setAdminEditingDish(null)}
                  style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff', color: '#64748b', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 2, padding: '10px 0', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 800, cursor: 'pointer' }}
                >
                  ✓ Save Dish Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL: SUPER ADMIN ADD DISH TO RESTAURANT                               */}
      {/* ======================================================================= */}
      {adminShowAddDishModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 480, padding: 22, maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 14px', color: '#0f172a' }}>
              + Add New Dish to Outlet
            </h3>
            <form onSubmit={handleAdminCreateDish} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Dish Name (English) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gongura Mutton Biryani"
                    value={adminNewDishName}
                    onChange={(e) => setAdminNewDishName(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Dish Name (Telugu)</label>
                  <input
                    type="text"
                    placeholder="e.g. గోంగూర మటన్ బిర్యానీ"
                    value={adminNewDishNameTe}
                    onChange={(e) => setAdminNewDishNameTe(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Category</label>
                  <input
                    type="text"
                    value={adminNewDishCategory}
                    onChange={(e) => setAdminNewDishCategory(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Price (₹) *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={adminNewDishPrice}
                    onChange={(e) => setAdminNewDishPrice(Number(e.target.value))}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Prep (mins)</label>
                  <input
                    type="number"
                    min={2}
                    value={adminNewDishPrepTime}
                    onChange={(e) => setAdminNewDishPrepTime(Number(e.target.value))}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 16 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={adminNewDishIsVeg}
                    onChange={(e) => setAdminNewDishIsVeg(e.target.checked)}
                  />
                  <span>Pure Veg 🟢</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={adminNewDishIsBestseller}
                    onChange={(e) => setAdminNewDishIsBestseller(e.target.checked)}
                  />
                  <span>Bestseller Star 🌟</span>
                </label>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Description</label>
                <input
                  type="text"
                  placeholder="e.g. Tender mutton cooked with authentic Andhra gongura paste."
                  value={adminNewDishDesc}
                  onChange={(e) => setAdminNewDishDesc(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Photo URL</label>
                <input
                  type="url"
                  value={adminNewDishImage}
                  onChange={(e) => setAdminNewDishImage(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.8rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button
                  type="button"
                  onClick={() => setAdminShowAddDishModal(false)}
                  style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff', color: '#64748b', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 2, padding: '10px 0', borderRadius: 8, border: 'none', background: '#059669', color: '#fff', fontWeight: 800, cursor: 'pointer' }}
                >
                  Add Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
