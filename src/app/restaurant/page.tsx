'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n/context';
import { usePlatform } from '@/lib/store/platform-store';
import type { MenuItem } from '@/lib/mock-data';
import Image from 'next/image';

export default function RestaurantDashboard() {
  const { locale } = useTranslation();
  const {
    orders,
    restaurants,
    menuItems,
    restaurantAcceptOrder,
    restaurantRejectOrder,
    restaurantMarkReady,
    toggleItemStock,
    updateItemPrice,
    updateMenuItem,
    addNewMenuItem,
    deleteMenuItem,
    updateRestaurant,
  } = usePlatform();

  // Active restaurant selection (default to Sri Sai Tiffins)
  const [selectedRestId, setSelectedRestId] = useState<string>('rest-1');
  const currentRestaurant = restaurants.find(r => r.id === selectedRestId) || restaurants[0];

  // Active dashboard tab
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'profile' | 'payouts'>('orders');
  const [orderSubTab, setOrderSubTab] = useState<'incoming' | 'kitchen' | 'ready' | 'history'>('incoming');

  // Menu category filter
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // State for Add Dish modal
  const [showAddDishModal, setShowAddDishModal] = useState<boolean>(false);
  const [newDishName, setNewDishName] = useState<string>('');
  const [newDishNameTe, setNewDishNameTe] = useState<string>('');
  const [newDishCategory, setNewDishCategory] = useState<string>('Tiffins');
  const [newDishPrice, setNewDishPrice] = useState<number>(90);
  const [newDishPrepTime, setNewDishPrepTime] = useState<number>(12);
  const [newDishIsVeg, setNewDishIsVeg] = useState<boolean>(true);
  const [newDishIsBestseller, setNewDishIsBestseller] = useState<boolean>(false);
  const [newDishDesc, setNewDishDesc] = useState<string>('');
  const [newDishDescTe, setNewDishDescTe] = useState<string>('');
  const [newDishImage, setNewDishImage] = useState<string>(
    'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80'
  );

  // State for Edit Dish modal
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);

  // State for Outlet Profile form
  const [outletName, setOutletName] = useState(currentRestaurant?.name || '');
  const [outletNameTe, setOutletNameTe] = useState(currentRestaurant?.name_te || '');
  const [outletDesc, setOutletDesc] = useState(currentRestaurant?.description || '');
  const [outletPhone, setOutletPhone] = useState(currentRestaurant?.phone || '');
  const [outletAddress, setOutletAddress] = useState(currentRestaurant?.address_text || currentRestaurant?.area || '');
  const [outletOpening, setOutletOpening] = useState(currentRestaurant?.opening_time || '07:00');
  const [outletClosing, setOutletClosing] = useState(currentRestaurant?.closing_time || '23:00');
  const [outletPrepTime, setOutletPrepTime] = useState(currentRestaurant?.avg_prep_time || 15);
  const [outletMinOrder, setOutletMinOrder] = useState(currentRestaurant?.min_order_amount || 100);
  const [outletCostForTwo, setOutletCostForTwo] = useState(currentRestaurant?.cost_for_two || 250);
  const [outletCuisines, setOutletCuisines] = useState(currentRestaurant?.cuisines?.join(', ') || 'Andhra, South Indian');
  const [outletCoverPhoto, setOutletCoverPhoto] = useState(currentRestaurant?.cover_photo_url || '');
  const [outletDiscountTag, setOutletDiscountTag] = useState(currentRestaurant?.discount_tag || 'FLAT 20% OFF');
  const [outletNotice, setOutletNotice] = useState(currentRestaurant?.notice_message || '');
  const [outletIsPaused, setOutletIsPaused] = useState(currentRestaurant?.is_paused || false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState(false);

  // Settlement Bank & UPI Details State
  const [settlementUpi, setSettlementUpi] = useState(currentRestaurant?.settlement_upi || 'srisai@oksbi');
  const [accountHolder, setAccountHolder] = useState(currentRestaurant?.account_holder_name || currentRestaurant?.name || 'Sri Sai Kitchens');
  const [bankName, setBankName] = useState(currentRestaurant?.bank_name || 'State Bank of India');
  const [accountNumber, setAccountNumber] = useState(currentRestaurant?.bank_account_number || '39820199482');
  const [ifscCode, setIfscCode] = useState(currentRestaurant?.bank_ifsc || 'SBIN0001234');
  const [bankSuccessMsg, setBankSuccessMsg] = useState(false);

  // Custom Categories State
  const [customCategories, setCustomCategories] = useState<string[]>(['Tiffins', 'Meals', 'Biryani', 'Snacks', 'Beverages', 'Desserts']);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // State for inline price editing
  const [editingPriceItemId, setEditingPriceItemId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);

  // State for rejection modal
  const [rejectOrderId, setRejectOrderId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('Kitchen busy / high backlog');

  // Audio simulation state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Filter orders for the selected restaurant
  const restOrders = orders.filter(o => o.restaurant_id === currentRestaurant.id);
  const incomingOrders = restOrders.filter(o => o.status === 'placed');
  const kitchenOrders = restOrders.filter(o => o.status === 'confirmed' || o.status === 'preparing');
  const readyOrders = restOrders.filter(o => o.status === 'ready_for_pickup');
  const pastOrders = restOrders.filter(o => o.status === 'delivered' || o.status === 'cancelled');

  // Filter menu items for this restaurant
  const restMenuItems = menuItems.filter(m => m.restaurant_id === currentRestaurant.id);
  const derivedCategories = Array.from(new Set(restMenuItems.map(m => m.category || m.category_id || 'Specials')));
  const categories = ['all', ...Array.from(new Set([...customCategories, ...derivedCategories]))];
  const displayedMenuItems = selectedCategory === 'all'
    ? restMenuItems
    : restMenuItems.filter(m => (m.category || m.category_id || 'Specials').toLowerCase() === selectedCategory.toLowerCase());

  // Financial calculations
  const totalGMV = pastOrders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + o.total_amount, 0);
  const platformCommissionRate = (currentRestaurant.commission_rate || 15) / 100;
  const netEarnings = Math.round(totalGMV * (1 - platformCommissionRate));
  const pendingPayout = Math.round(netEarnings * 0.9);

  // Sync profile form when selected restaurant changes
  const handleSelectRestaurant = (restId: string) => {
    setSelectedRestId(restId);
    const target = restaurants.find(r => r.id === restId);
    if (target) {
      setOutletName(target.name);
      setOutletNameTe(target.name_te || '');
      setOutletDesc(target.description || '');
      setOutletPhone(target.phone || '');
      setOutletAddress(target.address_text || target.area || '');
      setOutletOpening(target.opening_time || '07:00');
      setOutletClosing(target.closing_time || '23:00');
      setOutletPrepTime(target.avg_prep_time || 15);
      setOutletMinOrder(target.min_order_amount || 100);
      setOutletCostForTwo(target.cost_for_two || 250);
      setOutletCuisines(target.cuisines?.join(', ') || 'Andhra, South Indian');
      setOutletCoverPhoto(target.cover_photo_url || '');
      setOutletDiscountTag(target.discount_tag || 'FLAT 20% OFF');
      setOutletNotice(target.notice_message || '');
      setOutletIsPaused(target.is_paused || false);
      setSettlementUpi(target.settlement_upi || 'srisai@oksbi');
      setAccountHolder(target.account_holder_name || target.name);
      setBankName(target.bank_name || 'State Bank of India');
      setAccountNumber(target.bank_account_number || '39820199482');
      setIfscCode(target.bank_ifsc || 'SBIN0001234');
    }
  };

  // Handle Save Outlet Profile
  const handleSaveOutletProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateRestaurant(currentRestaurant.id, {
      name: outletName,
      name_te: outletNameTe,
      description: outletDesc,
      phone: outletPhone,
      address_text: outletAddress,
      area: outletAddress.split(',')[0] || 'Gandhi Nagar',
      opening_time: outletOpening,
      closing_time: outletClosing,
      avg_prep_time: Number(outletPrepTime),
      min_order_amount: Number(outletMinOrder),
      cost_for_two: Number(outletCostForTwo),
      cuisines: outletCuisines.split(',').map(c => c.trim()).filter(Boolean),
      cover_photo_url: outletCoverPhoto || currentRestaurant.cover_photo_url,
      discount_tag: outletDiscountTag,
      notice_message: outletNotice,
      is_paused: outletIsPaused,
    });
    setProfileSuccessMsg(true);
    setTimeout(() => setProfileSuccessMsg(false), 3000);
  };

  // Handle Save Bank Settlement Details
  const handleSaveBankDetails = (e: React.FormEvent) => {
    e.preventDefault();
    updateRestaurant(currentRestaurant.id, {
      settlement_upi: settlementUpi.trim(),
      account_holder_name: accountHolder.trim(),
      bank_name: bankName.trim(),
      bank_account_number: accountNumber.trim(),
      bank_ifsc: ifscCode.trim().toUpperCase(),
    });
    setBankSuccessMsg(true);
    setTimeout(() => setBankSuccessMsg(false), 3000);
  };

  // Handle Add Category
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const cat = newCategoryName.trim();
    if (!customCategories.includes(cat)) {
      setCustomCategories(prev => [...prev, cat]);
      setSelectedCategory(cat);
    }
    setNewCategoryName('');
    setShowAddCategoryModal(false);
  };

  // Handle Add Item Submit
  const handleCreateDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName.trim()) return;

    addNewMenuItem({
      restaurant_id: currentRestaurant.id,
      name: newDishName.trim(),
      name_te: newDishNameTe.trim() || newDishName.trim(),
      description: newDishDesc || `${newDishName} prepared fresh in authentic style with homemade masalas.`,
      description_te: newDishDescTe || `${newDishNameTe || newDishName} ప్రత్యేకమైన శైలిలో తయారుచేయబడింది.`,
      price: Number(newDishPrice) || 80,
      category: newDishCategory,
      is_veg: newDishIsVeg,
      is_bestseller: newDishIsBestseller,
      is_available: true,
      prep_time: Number(newDishPrepTime) || 12,
      spicy_level: 2,
      image_url: newDishImage,
      photo_url: newDishImage,
    });

    setNewDishName('');
    setNewDishNameTe('');
    setNewDishDesc('');
    setNewDishDescTe('');
    setShowAddDishModal(false);
  };

  // Handle Save Edited Dish
  const handleSaveEditedDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDish) return;

    updateMenuItem(editingDish.id, {
      name: editingDish.name,
      name_te: editingDish.name_te,
      description: editingDish.description,
      description_te: editingDish.description_te,
      price: Number(editingDish.price),
      category: editingDish.category,
      is_veg: editingDish.is_veg,
      is_bestseller: editingDish.is_bestseller,
      is_available: editingDish.is_available,
      prep_time: Number(editingDish.prep_time),
      image_url: editingDish.image_url || editingDish.photo_url,
      photo_url: editingDish.photo_url || editingDish.image_url,
    });

    setEditingDish(null);
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '16px' }}>
      {/* Top Controls: Restaurant Switcher & Status Strip */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        background: '#fff',
        padding: '12px 18px',
        borderRadius: 14,
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        border: '1px solid #f1f5f9',
        marginBottom: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>
            {locale === 'te' ? 'రెస్టారెంట్ ఎంపిక:' : 'Active Kitchen Outlet:'}
          </span>
          <select
            value={selectedRestId}
            onChange={(e) => handleSelectRestaurant(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              border: '1.5px solid #e2e8f0',
              fontWeight: 800,
              fontSize: '0.86rem',
              color: '#0f172a',
              background: '#f8fafc',
              cursor: 'pointer',
            }}
          >
            {restaurants.map(r => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.address_text || r.area || 'Gandhi Nagar'})
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: soundEnabled ? '#ecfdf5' : '#f1f5f9',
              color: soundEnabled ? '#059669' : '#64748b',
              border: '1px solid ' + (soundEnabled ? '#a7f3d0' : '#e2e8f0'),
              padding: '6px 12px',
              borderRadius: 20,
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <span>{soundEnabled ? '🔔 Sound ON' : '🔕 Mute Alerts'}</span>
          </button>
          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
            <strong>{restMenuItems.length}</strong> items • <strong>{restOrders.length}</strong> total orders
          </div>
        </div>
      </div>

      {/* KPI Stats Banner */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 12,
        marginBottom: 18,
      }}>
        <div style={{
          background: '#fff',
          padding: '14px 16px',
          borderRadius: 14,
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
            {locale === 'te' ? 'కొత్త ఆర్డర్‌లు' : 'Pending Action'}
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: incomingOrders.length > 0 ? '#ef4444' : '#0f172a', marginTop: 2 }}>
            {incomingOrders.length}
          </div>
          <div style={{ fontSize: '0.7rem', color: incomingOrders.length > 0 ? '#dc2626' : '#94a3b8', fontWeight: 600 }}>
            {incomingOrders.length > 0 ? '⚠️ Immediate attention needed' : 'All orders accepted'}
          </div>
        </div>

        <div style={{
          background: '#fff',
          padding: '14px 16px',
          borderRadius: 14,
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
            {locale === 'te' ? 'వంటల్లో ఉన్నాయి' : 'In Kitchen'}
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#f97316', marginTop: 2 }}>
            {kitchenOrders.length}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
            Avg prep target: {currentRestaurant.avg_prep_time || 15} mins
          </div>
        </div>

        <div style={{
          background: '#fff',
          padding: '14px 16px',
          borderRadius: 14,
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
            {locale === 'te' ? 'పికప్‌కి సిద్ధం' : 'Ready for Pickup'}
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#059669', marginTop: 2 }}>
            {readyOrders.length}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
            Awaiting rider verification
          </div>
        </div>

        <div style={{
          background: '#fff',
          padding: '14px 16px',
          borderRadius: 14,
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
            {locale === 'te' ? 'నేటి విక్రయాలు' : 'Gross GMV'}
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', marginTop: 2 }}>
            ₹{totalGMV.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 700 }}>
            ₹{netEarnings} net payout
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div style={{
        display: 'flex',
        background: '#e2e8f0',
        borderRadius: 12,
        padding: 4,
        marginBottom: 20,
        overflowX: 'auto',
      }}>
        <button
          onClick={() => setActiveTab('orders')}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: 10,
            border: 'none',
            fontSize: '0.85rem',
            fontWeight: 800,
            whiteSpace: 'nowrap',
            background: activeTab === 'orders' ? '#fff' : 'transparent',
            color: activeTab === 'orders' ? '#f97316' : '#64748b',
            boxShadow: activeTab === 'orders' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <span>🛎️ Live Kitchen Orders</span>
          {(incomingOrders.length + kitchenOrders.length + readyOrders.length) > 0 && (
            <span style={{
              background: '#ef4444',
              color: '#fff',
              fontSize: '0.68rem',
              fontWeight: 800,
              padding: '1px 7px',
              borderRadius: 20,
            }}>
              {incomingOrders.length + kitchenOrders.length + readyOrders.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('menu')}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: 10,
            border: 'none',
            fontSize: '0.85rem',
            fontWeight: 800,
            whiteSpace: 'nowrap',
            background: activeTab === 'menu' ? '#fff' : 'transparent',
            color: activeTab === 'menu' ? '#f97316' : '#64748b',
            boxShadow: activeTab === 'menu' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <span>📋 Menu & Stock Control</span>
          <span style={{
            background: '#f1f5f9',
            color: '#475569',
            fontSize: '0.68rem',
            fontWeight: 700,
            padding: '1px 7px',
            borderRadius: 20,
          }}>
            {restMenuItems.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: 10,
            border: 'none',
            fontSize: '0.85rem',
            fontWeight: 800,
            whiteSpace: 'nowrap',
            background: activeTab === 'profile' ? '#fff' : 'transparent',
            color: activeTab === 'profile' ? '#f97316' : '#64748b',
            boxShadow: activeTab === 'profile' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
            cursor: 'pointer',
          }}
        >
          🏪 Outlet Settings & Timings
        </button>

        <button
          onClick={() => setActiveTab('payouts')}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: 10,
            border: 'none',
            fontSize: '0.85rem',
            fontWeight: 800,
            whiteSpace: 'nowrap',
            background: activeTab === 'payouts' ? '#fff' : 'transparent',
            color: activeTab === 'payouts' ? '#f97316' : '#64748b',
            boxShadow: activeTab === 'payouts' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
            cursor: 'pointer',
          }}
        >
          💰 Payouts & Commission
        </button>
      </div>

      {/* ======================================================================= */}
      {/* TAB 1: LIVE ORDERS DASHBOARD                                            */}
      {/* ======================================================================= */}
      {activeTab === 'orders' && (
        <div>
          {/* Orders Sub-filter pills */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }}>
            <button
              onClick={() => setOrderSubTab('incoming')}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: 700,
                background: orderSubTab === 'incoming' ? '#ef4444' : '#fff',
                color: orderSubTab === 'incoming' ? '#fff' : '#64748b',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span>🔴 Incoming</span>
              <span style={{
                background: orderSubTab === 'incoming' ? 'rgba(255,255,255,0.3)' : '#fee2e2',
                color: orderSubTab === 'incoming' ? '#fff' : '#b91c1c',
                padding: '1px 6px',
                borderRadius: 10,
                fontSize: '0.7rem',
              }}>
                {incomingOrders.length}
              </span>
            </button>

            <button
              onClick={() => setOrderSubTab('kitchen')}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: 700,
                background: orderSubTab === 'kitchen' ? '#f97316' : '#fff',
                color: orderSubTab === 'kitchen' ? '#fff' : '#64748b',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span>🍳 In Kitchen</span>
              <span style={{
                background: orderSubTab === 'kitchen' ? 'rgba(255,255,255,0.3)' : '#ffedd5',
                color: orderSubTab === 'kitchen' ? '#fff' : '#c2410c',
                padding: '1px 6px',
                borderRadius: 10,
                fontSize: '0.7rem',
              }}>
                {kitchenOrders.length}
              </span>
            </button>

            <button
              onClick={() => setOrderSubTab('ready')}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: 700,
                background: orderSubTab === 'ready' ? '#059669' : '#fff',
                color: orderSubTab === 'ready' ? '#fff' : '#64748b',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span>📦 Ready for Pickup</span>
              <span style={{
                background: orderSubTab === 'ready' ? 'rgba(255,255,255,0.3)' : '#d1fae5',
                color: orderSubTab === 'ready' ? '#fff' : '#047857',
                padding: '1px 6px',
                borderRadius: 10,
                fontSize: '0.7rem',
              }}>
                {readyOrders.length}
              </span>
            </button>

            <button
              onClick={() => setOrderSubTab('history')}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: 700,
                background: orderSubTab === 'history' ? '#0f172a' : '#fff',
                color: orderSubTab === 'history' ? '#fff' : '#64748b',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                cursor: 'pointer',
              }}
            >
              📜 Order History ({pastOrders.length})
            </button>
          </div>

          {/* Sub-tab 1: Incoming Orders */}
          {orderSubTab === 'incoming' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {incomingOrders.length === 0 ? (
                <div style={{
                  background: '#fff',
                  borderRadius: 16,
                  padding: '48px 20px',
                  textAlign: 'center',
                  border: '1px solid #e2e8f0',
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: 12 }}>🛎️</div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
                    {locale === 'te' ? 'కొత్త ఆర్డర్‌లు ఏవీ లేవు' : 'No Incoming Orders Right Now'}
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', maxWidth: 420, margin: '0 auto 16px' }}>
                    {locale === 'te'
                      ? 'కస్టమర్ యాప్ నుండి ఆర్డర్ వచ్చిన వెంటనే ఇక్కడ రింగ్ అవుతుంది మరియు కనిపిస్తుంది.'
                      : 'When a customer places an order from the customer portal, it rings and appears here in real time with full order breakdown.'}
                  </p>
                </div>
              ) : (
                incomingOrders.map(order => (
                  <div
                    key={order.id}
                    style={{
                      background: '#fff',
                      borderRadius: 16,
                      border: '2px solid #ef4444',
                      boxShadow: '0 8px 24px rgba(239,68,68,0.12)',
                      overflow: 'hidden',
                      animation: 'fadeIn 0.3s ease',
                    }}
                  >
                    {/* Header Bar */}
                    <div style={{
                      background: 'linear-gradient(90deg, #fee2e2 0%, #fef2f2 100%)',
                      padding: '12px 18px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid #fecaca',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{
                          background: '#ef4444',
                          color: '#fff',
                          fontWeight: 900,
                          fontSize: '0.72rem',
                          padding: '3px 8px',
                          borderRadius: 6,
                          letterSpacing: '0.04em',
                        }}>
                          NEW ORDER
                        </span>
                        <strong style={{ fontSize: '1rem', color: '#0f172a' }}>#{order.order_code}</strong>
                        <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                          • {new Date(order.created_at || order.placed_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          background: order.payment_method === 'cod' ? '#fef3c7' : '#ecfdf5',
                          color: order.payment_method === 'cod' ? '#b45309' : '#047857',
                          padding: '3px 8px',
                          borderRadius: 6,
                        }}>
                          {order.payment_method === 'cod' ? '💵 Pay on Delivery' : '✓ Pre-Paid'}
                        </span>
                        <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>
                          ₹{order.total_amount}
                        </span>
                      </div>
                    </div>

                    {/* Order Details Body */}
                    <div style={{ padding: '16px 18px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                            Customer: {order.delivery_address?.split(',')[0] || 'Customer'}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
                            📍 Deliver to: {order.delivery_address || 'Gandhi Nagar'}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Pickup Code</span>
                          <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#f97316' }}>
                            {order.pickup_code}
                          </div>
                        </div>
                      </div>

                      {/* Items Ordered List */}
                      <div style={{
                        background: '#f8fafc',
                        borderRadius: 12,
                        padding: '12px 14px',
                        marginBottom: 14,
                        border: '1px solid #e2e8f0',
                      }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 6 }}>
                          Items to Prepare ({order.items.length})
                        </div>
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '6px 0',
                              borderBottom: idx < order.items.length - 1 ? '1px dashed #e2e8f0' : 'none',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span className={item.is_veg ? 'veg-icon' : 'nonveg-icon'} />
                              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
                                {item.quantity} ×
                              </span>
                              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>
                                {locale === 'te' && item.item_name_te ? item.item_name_te : item.item_name}
                              </span>
                            </div>
                            <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>
                              ₹{item.total_price}
                            </span>
                          </div>
                        ))}

                        {order.special_instructions && (
                          <div style={{
                            marginTop: 10,
                            padding: '8px 10px',
                            background: '#fffbeb',
                            borderRadius: 8,
                            border: '1px solid #fef3c7',
                            fontSize: '0.78rem',
                            color: '#92400e',
                            display: 'flex',
                            gap: 6,
                          }}>
                            <span>📝</span>
                            <span><strong>Cooking Note:</strong> {order.special_instructions}</span>
                          </div>
                        )}
                      </div>

                      {/* Decision Buttons */}
                      <div style={{ display: 'flex', gap: 10 }}>
                        <button
                          onClick={() => setRejectOrderId(order.id)}
                          style={{
                            flex: 1,
                            padding: '12px 0',
                            borderRadius: 10,
                            border: '1.5px solid #fca5a5',
                            background: '#fff',
                            color: '#dc2626',
                            fontSize: '0.86rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                          }}
                        >
                          ✕ Reject Order
                        </button>

                        <button
                          onClick={() => restaurantAcceptOrder(order.id)}
                          style={{
                            flex: 2,
                            padding: '12px 0',
                            borderRadius: 10,
                            border: 'none',
                            background: 'linear-gradient(135deg, #16a34a, #15803d)',
                            color: '#fff',
                            fontSize: '0.9rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(22,163,74,0.3)',
                          }}
                        >
                          ✓ Accept & Start Cooking ({currentRestaurant.avg_prep_time || 15} mins)
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Sub-tab 2: In Kitchen Cooking */}
          {orderSubTab === 'kitchen' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {kitchenOrders.length === 0 ? (
                <div style={{
                  background: '#fff',
                  borderRadius: 16,
                  padding: '48px 20px',
                  textAlign: 'center',
                  border: '1px solid #e2e8f0',
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: 12 }}>🍳</div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
                    Kitchen is clear
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    No orders currently cooking on the stoves.
                  </p>
                </div>
              ) : (
                kitchenOrders.map(order => (
                  <div
                    key={order.id}
                    style={{
                      background: '#fff',
                      borderRadius: 16,
                      border: '1px solid #fed7aa',
                      boxShadow: '0 4px 14px rgba(249,115,22,0.08)',
                      padding: '16px 18px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{
                            background: '#ffedd5',
                            color: '#c2410c',
                            fontWeight: 800,
                            fontSize: '0.72rem',
                            padding: '3px 8px',
                            borderRadius: 6,
                          }}>
                            COOKING NOW
                          </span>
                          <strong style={{ fontSize: '1.05rem', color: '#0f172a' }}>#{order.order_code}</strong>
                        </div>
                        <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: 4 }}>
                          Target prep: {currentRestaurant.avg_prep_time || 15} mins • Rider: {order.rider_name || 'Assigning nearest rider...'}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>PICKUP CODE</span>
                        <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#f97316' }}>
                          {order.pickup_code}
                        </div>
                      </div>
                    </div>

                    {/* Summary of Items */}
                    <div style={{
                      background: '#f8fafc',
                      borderRadius: 10,
                      padding: '10px 14px',
                      fontSize: '0.84rem',
                      color: '#334155',
                      marginBottom: 14,
                      border: '1px solid #e2e8f0',
                    }}>
                      {order.items.map(it => `${it.quantity}x ${it.item_name}`).join(' • ')}
                      {order.special_instructions && (
                        <div style={{ fontSize: '0.75rem', color: '#d97706', marginTop: 6, fontWeight: 600 }}>
                          Note: {order.special_instructions}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => restaurantMarkReady(order.id)}
                      style={{
                        width: '100%',
                        padding: '12px 0',
                        borderRadius: 10,
                        border: 'none',
                        background: 'linear-gradient(135deg, #059669, #047857)',
                        color: '#fff',
                        fontSize: '0.9rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(5,150,105,0.25)',
                      }}
                    >
                      📦 Mark Food Ready & Packed for Rider
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Sub-tab 3: Ready for Pickup */}
          {readyOrders.length > 0 && orderSubTab === 'ready' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {readyOrders.map(order => (
                <div
                  key={order.id}
                  style={{
                    background: '#fff',
                    borderRadius: 16,
                    border: '2px solid #059669',
                    padding: '18px 20px',
                    boxShadow: '0 4px 16px rgba(5,150,105,0.1)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{
                          background: '#d1fae5',
                          color: '#047857',
                          fontWeight: 800,
                          fontSize: '0.72rem',
                          padding: '3px 8px',
                          borderRadius: 6,
                        }}>
                          READY FOR DISPATCH
                        </span>
                        <strong style={{ fontSize: '1.1rem', color: '#0f172a' }}>#{order.order_code}</strong>
                      </div>
                      <div style={{ fontSize: '0.84rem', color: '#334155', marginTop: 6 }}>
                        🛵 Rider Assigned: <strong>{order.rider_name || 'Venkat Reddy'}</strong>
                        {order.rider_phone && ` (${order.rider_phone})`}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: 2 }}>
                        {order.items.length} items packed in bag • Destination: {order.delivery_address || 'Gandhi Nagar'}
                      </div>
                    </div>

                    {/* Prominent Verification Pickup Code */}
                    <div style={{
                      background: '#ecfdf5',
                      border: '1.5px solid #a7f3d0',
                      borderRadius: 12,
                      padding: '10px 16px',
                      textAlign: 'center',
                    }}>
                      <div style={{ fontSize: '0.66rem', fontWeight: 800, color: '#047857', letterSpacing: '0.06em' }}>
                        VERIFY PICKUP CODE
                      </div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#047857', letterSpacing: '0.08em' }}>
                        {order.pickup_code}
                      </div>
                      <div style={{ fontSize: '0.62rem', color: '#64748b' }}>
                        Ask rider for this code
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sub-tab 4: Order History */}
          {orderSubTab === 'history' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {pastOrders.map(order => (
                <div
                  key={order.id}
                  style={{
                    background: '#fff',
                    borderRadius: 12,
                    padding: '12px 16px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 10,
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <strong>#{order.order_code}</strong>
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: 4,
                        background: order.status === 'delivered' ? '#ecfdf5' : '#fee2e2',
                        color: order.status === 'delivered' ? '#047857' : '#b91c1c',
                      }}>
                        {order.status === 'delivered' ? '✓ DELIVERED' : 'CANCELLED'}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        • {new Date(order.created_at || order.placed_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: 2 }}>
                      {order.items.map(it => `${it.quantity}x ${it.item_name}`).join(', ')}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                      ₹{order.total_amount}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 600 }}>
                      +₹{Math.round(order.total_amount * (1 - platformCommissionRate))} Net
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================================= */}
      {/* TAB 2: MENU & INVENTORY MANAGEMENT (FULL DISH CRUD)                      */}
      {/* ======================================================================= */}
      {activeTab === 'menu' && (
        <div>
          {/* Header Action Bar */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            marginBottom: 16,
          }}>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {locale === 'te' ? 'మెనూ మరియు ఇన్వెంటరీ నియంత్రణ' : 'Menu & Inventory Management'}
              </h2>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0' }}>
                Add dishes, edit names, descriptions, prep time, photos, or toggle out-of-stock. Changes update immediately!
              </p>
            </div>

            <button
              onClick={() => setShowAddDishModal(true)}
              style={{
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                padding: '10px 18px',
                fontSize: '0.84rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 4px 12px rgba(249,115,22,0.3)',
              }}
            >
              <span>+ Add New Dish</span>
            </button>
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  border: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textTransform: 'capitalize',
                  background: selectedCategory === cat ? '#0f172a' : '#fff',
                  color: selectedCategory === cat ? '#fff' : '#64748b',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  cursor: 'pointer',
                }}
              >
                {cat}
              </button>
            ))}

            <button
              onClick={() => setShowAddCategoryModal(true)}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                border: '1.5px dashed #f97316',
                fontSize: '0.78rem',
                fontWeight: 800,
                background: '#fff7ed',
                color: '#c2410c',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              + Add Category
            </button>
          </div>

          {/* Items List */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
            {displayedMenuItems.map(item => (
              <div
                key={item.id}
                style={{
                  background: '#fff',
                  borderRadius: 14,
                  border: item.is_available ? '1px solid #e2e8f0' : '1.5px dashed #cbd5e1',
                  padding: 14,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  opacity: item.is_available ? 1 : 0.65,
                  display: 'flex',
                  gap: 12,
                  position: 'relative',
                }}
              >
                {/* Dish Thumbnail */}
                <div style={{
                  position: 'relative',
                  width: 80,
                  height: 80,
                  borderRadius: 10,
                  overflow: 'hidden',
                  flexShrink: 0,
                  background: '#f1f5f9',
                }}>
                  <Image
                    src={item.photo_url || item.image_url || 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80'}
                    alt={item.name}
                    fill
                    sizes="80px"
                    style={{ objectFit: 'cover' }}
                  />
                  {!item.is_available && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0,0,0,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      textAlign: 'center',
                    }}>
                      SOLD OUT
                    </div>
                  )}
                </div>

                {/* Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginBottom: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span className={item.is_veg ? 'veg-icon' : 'nonveg-icon'} />
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#f97316', textTransform: 'uppercase' }}>
                        {item.category || item.category_id || 'Dish'}
                      </span>
                      {item.is_bestseller && (
                        <span style={{ fontSize: '0.62rem', background: '#fef3c7', color: '#b45309', padding: '1px 5px', borderRadius: 4, fontWeight: 800 }}>
                          BESTSELLER
                        </span>
                      )}
                    </div>

                    {/* Edit Full Dish Button */}
                    <button
                      onClick={() => setEditingDish({ ...item })}
                      style={{
                        background: '#eff6ff',
                        color: '#2563eb',
                        border: '1px solid #bfdbfe',
                        borderRadius: 6,
                        padding: '2px 8px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      ✏️ Edit
                    </button>
                  </div>

                  <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', margin: '0 0 2px' }}>
                    {locale === 'te' && item.name_te ? item.name_te : item.name}
                  </h4>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: 8 }}>
                    ⏱ Prep: {item.prep_time} mins • {item.description?.slice(0, 45)}...
                  </div>

                  {/* Price & Inline Edit */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {editingPriceItemId === item.id ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>₹</span>
                        <input
                          type="number"
                          value={tempPrice}
                          onChange={(e) => setTempPrice(Number(e.target.value))}
                          style={{
                            width: 60,
                            padding: '2px 6px',
                            borderRadius: 6,
                            border: '1px solid #f97316',
                            fontSize: '0.85rem',
                            fontWeight: 800,
                          }}
                        />
                        <button
                          onClick={() => {
                            updateItemPrice(item.id, tempPrice);
                            setEditingPriceItemId(null);
                          }}
                          style={{
                            padding: '3px 8px',
                            borderRadius: 6,
                            background: '#059669',
                            color: '#fff',
                            border: 'none',
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                          }}
                        >
                          ✓
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          setEditingPriceItemId(item.id);
                          setTempPrice(item.price);
                        }}
                        style={{
                          fontSize: '0.95rem',
                          fontWeight: 900,
                          color: '#0f172a',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                        title="Click to inline edit price"
                      >
                        <span>₹{item.price}</span>
                        <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>✏️</span>
                      </div>
                    )}

                    {/* Stock Switcher & Delete */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        color: item.is_available ? '#059669' : '#dc2626',
                      }}>
                        {item.is_available ? 'IN STOCK' : 'OUT'}
                      </span>
                      <button
                        onClick={() => toggleItemStock(item.id)}
                        style={{
                          width: 44,
                          height: 24,
                          borderRadius: 12,
                          background: item.is_available ? '#22c55e' : '#cbd5e1',
                          position: 'relative',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'background 0.2s',
                        }}
                      >
                        <div style={{
                          width: 18,
                          height: 18,
                          borderRadius: '50%',
                          background: '#fff',
                          position: 'absolute',
                          top: 3,
                          left: item.is_available ? 22 : 4,
                          transition: 'left 0.2s',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                        }} />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Delete "${item.name}" from your menu permanently?`)) {
                            deleteMenuItem(item.id);
                          }
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#94a3b8',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          padding: '2px 4px',
                        }}
                        title="Delete item"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* TAB 3: OUTLET PROFILE & TIMINGS (FULL EDITABLE RESTAURANT SETTINGS)     */}
      {/* ======================================================================= */}
      {activeTab === 'profile' && (
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                🏪 Edit Outlet Profile & Service Timings
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0' }}>
                All changes saved here reflect instantly on the customer-facing restaurant page and search results.
              </p>
            </div>
            {profileSuccessMsg && (
              <span style={{
                background: '#ecfdf5',
                color: '#047857',
                border: '1px solid #a7f3d0',
                padding: '6px 14px',
                borderRadius: 20,
                fontSize: '0.76rem',
                fontWeight: 800,
              }}>
                ✓ Store Changes Saved Live!
              </span>
            )}
          </div>

          <form onSubmit={handleSaveOutletProfile} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                  Restaurant Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={outletName}
                  onChange={(e) => setOutletName(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                  Restaurant Name (Telugu)
                </label>
                <input
                  type="text"
                  value={outletNameTe}
                  onChange={(e) => setOutletNameTe(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                Tagline / Description
              </label>
              <textarea
                rows={2}
                value={outletDesc}
                onChange={(e) => setOutletDesc(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                  Contact Phone Number *
                </label>
                <input
                  type="text"
                  required
                  value={outletPhone}
                  onChange={(e) => setOutletPhone(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                  Kitchen Address / Area *
                </label>
                <input
                  type="text"
                  required
                  value={outletAddress}
                  onChange={(e) => setOutletAddress(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                  Opening Hour
                </label>
                <input
                  type="time"
                  value={outletOpening}
                  onChange={(e) => setOutletOpening(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                  Closing Hour
                </label>
                <input
                  type="time"
                  value={outletClosing}
                  onChange={(e) => setOutletClosing(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                  Avg Prep (mins)
                </label>
                <input
                  type="number"
                  min={5}
                  max={60}
                  value={outletPrepTime}
                  onChange={(e) => setOutletPrepTime(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                  Cost for Two (₹)
                </label>
                <input
                  type="number"
                  min={50}
                  value={outletCostForTwo}
                  onChange={(e) => setOutletCostForTwo(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                  Min Order (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  value={outletMinOrder}
                  onChange={(e) => setOutletMinOrder(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                  Cuisines (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Andhra, Biryani, Rayalaseema, Chinese"
                  value={outletCuisines}
                  onChange={(e) => setOutletCuisines(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                  Cover Banner Image URL
                </label>
                <input
                  type="url"
                  value={outletCoverPhoto}
                  onChange={(e) => setOutletCoverPhoto(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {/* Promotional Offer Badge & Kitchen Pause Operations */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                  Outlet Promotional Badge Tag
                </label>
                <input
                  type="text"
                  placeholder="e.g. FLAT 20% OFF or Free Sweet above ₹349"
                  value={outletDiscountTag}
                  onChange={(e) => setOutletDiscountTag(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
                <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Displays on your outlet card across customer search and recommendations</span>
              </div>

              <div style={{
                background: '#f8fafc',
                padding: '10px 14px',
                borderRadius: 10,
                border: '1.5px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>
                    Kitchen Orders Acceptance
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                    {outletIsPaused ? '🔴 Paused: Not accepting new orders' : '🟢 Active: Accepting incoming orders'}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setOutletIsPaused(!outletIsPaused)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 20,
                    border: 'none',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    background: outletIsPaused ? '#fee2e2' : '#ecfdf5',
                    color: outletIsPaused ? '#dc2626' : '#047857',
                    cursor: 'pointer',
                  }}
                >
                  {outletIsPaused ? 'Resume Orders' : 'Pause Orders'}
                </button>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                Live Customer Notice Banner (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. We are experiencing heavy rush during lunch. Please allow an extra 10 minutes for your order."
                value={outletNotice}
                onChange={(e) => setOutletNotice(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
              />
              <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Appears as an alert banner to customers viewing your restaurant menu</span>
            </div>

            <button
              type="submit"
              style={{
                marginTop: 10,
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
              ✓ Save Outlet Profile Changes
            </button>
          </form>
        </div>
      )}

      {/* ======================================================================= */}
      {/* TAB 4: PAYOUTS & REVENUE SETTLEMENT                                      */}
      {/* ======================================================================= */}
      {activeTab === 'payouts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Revenue Overview Card */}
          <div style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: '#fff',
            borderRadius: 16,
            padding: '24px 28px',
            boxShadow: '0 10px 25px rgba(15,23,42,0.15)',
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Total Net Payout Balance
                </span>
                <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#38bdf8', marginTop: 4 }}>
                  ₹{pendingPayout.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '0.76rem', color: '#cbd5e1', marginTop: 4 }}>
                  Next automatic bank cycle: <strong>Tomorrow at 06:00 AM</strong> to {bankName} A/C ending {accountNumber.slice(-4) || '4912'}
                </div>
              </div>

              <button
                onClick={() => {
                  alert(`⚡ Instant Settlement Payout of ₹${pendingPayout.toLocaleString('en-IN')} initiated successfully!\n\nDestination: ${bankName} A/C ****${accountNumber.slice(-4)}\nBeneficiary: ${accountHolder}\nUPI: ${settlementUpi}\nRef: MR-PARTNER-${Date.now().toString().slice(-6)}\nFunds will reflect in your account within 15 minutes.`);
                }}
                style={{
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 22px',
                  borderRadius: 12,
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(34,197,94,0.3)',
                }}
              >
                ⚡ Request Instant Settlement
              </button>
            </div>
          </div>

          {/* Financial Breakdown Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 12,
          }}>
            <div style={{ background: '#fff', padding: 16, borderRadius: 14, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Gross Food Bill Value</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginTop: 2 }}>
                ₹{totalGMV.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Delivered orders only</div>
            </div>

            <div style={{ background: '#fff', padding: 16, borderRadius: 14, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Platform Commission ({(platformCommissionRate * 100).toFixed(0)}%)</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ef4444', marginTop: 2 }}>
                -₹{Math.round(totalGMV * platformCommissionRate).toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Agreed merchant rate</div>
            </div>

            <div style={{ background: '#fff', padding: 16, borderRadius: 14, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>GST & TCS Deducted (5%)</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#64748b', marginTop: 2 }}>
                -₹{Math.round(totalGMV * 0.05).toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Govt compliant taxes</div>
            </div>

            <div style={{ background: '#fff', padding: 16, borderRadius: 14, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Customer Ratings Average</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#059669', marginTop: 2 }}>
                ★ {currentRestaurant.rating || 4.8} / 5.0
              </div>
              <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600 }}>Top 5% in Gandhi Nagar</div>
            </div>
          </div>

          {/* Bank & Settlement Account Details Card */}
          <div style={{
            background: '#fff',
            borderRadius: 16,
            padding: 22,
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  🏦 Registered Settlement Bank & UPI Account
                </h4>
                <p style={{ fontSize: '0.76rem', color: '#64748b', margin: '2px 0 0' }}>
                  Weekly payouts and instant transfers are credited directly to this verified destination.
                </p>
              </div>

              {bankSuccessMsg && (
                <span style={{
                  background: '#ecfdf5',
                  color: '#047857',
                  border: '1px solid #a7f3d0',
                  padding: '4px 12px',
                  borderRadius: 16,
                  fontSize: '0.74rem',
                  fontWeight: 800,
                }}>
                  ✓ Bank Account Saved!
                </span>
              )}
            </div>

            <form onSubmit={handleSaveBankDetails} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                    Settlement UPI ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={settlementUpi}
                    onChange={(e) => setSettlementUpi(e.target.value)}
                    placeholder="e.g. restaurant@oksbi"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                    Account Holder Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                    Bank Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="e.g. State Bank of India"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                    Bank Account Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                    IFSC Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{
                  alignSelf: 'flex-start',
                  marginTop: 4,
                  padding: '9px 18px',
                  borderRadius: 8,
                  border: 'none',
                  background: '#059669',
                  color: '#fff',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(5,150,105,0.25)',
                }}
              >
                💾 Save Settlement Account
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL: ADD NEW MENU ITEM                                                */}
      {/* ======================================================================= */}
      {showAddDishModal && (
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
                + Add New Dish to Menu
              </h3>
              <button
                onClick={() => setShowAddDishModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#94a3b8' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDish} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                    Dish Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ghee Karam Dosa"
                    value={newDishName}
                    onChange={(e) => setNewDishName(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                    Dish Name (Telugu)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. నెయ్యి కారం దోశ"
                    value={newDishNameTe}
                    onChange={(e) => setNewDishNameTe(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                    Category
                  </label>
                  <select
                    value={newDishCategory}
                    onChange={(e) => setNewDishCategory(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  >
                    <option value="Tiffins">Tiffins</option>
                    <option value="Biryani">Biryani</option>
                    <option value="Meals">Meals</option>
                    <option value="Starters">Starters</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Sweets">Sweets</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={10}
                    value={newDishPrice}
                    onChange={(e) => setNewDishPrice(Number(e.target.value))}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                    Prep Time (mins)
                  </label>
                  <input
                    type="number"
                    min={3}
                    max={60}
                    value={newDishPrepTime}
                    onChange={(e) => setNewDishPrepTime(Number(e.target.value))}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                    Food Type
                  </label>
                  <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                    <button
                      type="button"
                      onClick={() => setNewDishIsVeg(true)}
                      style={{
                        flex: 1,
                        padding: '6px 8px',
                        borderRadius: 6,
                        border: '1.5px solid ' + (newDishIsVeg ? '#22c55e' : '#cbd5e1'),
                        background: newDishIsVeg ? '#f0fdf4' : '#fff',
                        color: newDishIsVeg ? '#15803d' : '#64748b',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      🌱 Veg
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewDishIsVeg(false)}
                      style={{
                        flex: 1,
                        padding: '6px 8px',
                        borderRadius: 6,
                        border: '1.5px solid ' + (!newDishIsVeg ? '#ef4444' : '#cbd5e1'),
                        background: !newDishIsVeg ? '#fef2f2' : '#fff',
                        color: !newDishIsVeg ? '#b91c1c' : '#64748b',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      🍗 Non-Veg
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={newDishIsBestseller}
                    onChange={(e) => setNewDishIsBestseller(e.target.checked)}
                  />
                  <span>Mark as Chef's Bestseller Special 🌟</span>
                </label>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                  Photo URL
                </label>
                <input
                  type="url"
                  value={newDishImage}
                  onChange={(e) => setNewDishImage(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.8rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowAddDishModal(false)}
                  style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff', color: '#64748b', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 2, padding: '10px 0', borderRadius: 8, border: 'none', background: '#f97316', color: '#fff', fontWeight: 800, cursor: 'pointer' }}
                >
                  Save & Publish to App
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL: EDIT EXISTING DISH                                               */}
      {/* ======================================================================= */}
      {editingDish && (
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
                ✏️ Edit Dish: {editingDish.name}
              </h3>
              <button
                onClick={() => setEditingDish(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#94a3b8' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditedDish} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                    Dish Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingDish.name}
                    onChange={(e) => setEditingDish({ ...editingDish, name: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                    Dish Name (Telugu)
                  </label>
                  <input
                    type="text"
                    value={editingDish.name_te || ''}
                    onChange={(e) => setEditingDish({ ...editingDish, name_te: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editingDish.description || ''}
                  onChange={(e) => setEditingDish({ ...editingDish, description: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.82rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                    Category
                  </label>
                  <select
                    value={editingDish.category || 'Tiffins'}
                    onChange={(e) => setEditingDish({ ...editingDish, category: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  >
                    <option value="Tiffins">Tiffins</option>
                    <option value="Biryani">Biryani</option>
                    <option value="Meals">Meals</option>
                    <option value="Starters">Starters</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Sweets">Sweets</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={10}
                    value={editingDish.price}
                    onChange={(e) => setEditingDish({ ...editingDish, price: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                    Prep Time (mins)
                  </label>
                  <input
                    type="number"
                    min={3}
                    max={60}
                    value={editingDish.prep_time}
                    onChange={(e) => setEditingDish({ ...editingDish, prep_time: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                    Food Type
                  </label>
                  <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                    <button
                      type="button"
                      onClick={() => setEditingDish({ ...editingDish, is_veg: true })}
                      style={{
                        flex: 1,
                        padding: '6px 8px',
                        borderRadius: 6,
                        border: '1.5px solid ' + (editingDish.is_veg ? '#22c55e' : '#cbd5e1'),
                        background: editingDish.is_veg ? '#f0fdf4' : '#fff',
                        color: editingDish.is_veg ? '#15803d' : '#64748b',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      🌱 Veg
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingDish({ ...editingDish, is_veg: false })}
                      style={{
                        flex: 1,
                        padding: '6px 8px',
                        borderRadius: 6,
                        border: '1.5px solid ' + (!editingDish.is_veg ? '#ef4444' : '#cbd5e1'),
                        background: !editingDish.is_veg ? '#fef2f2' : '#fff',
                        color: !editingDish.is_veg ? '#b91c1c' : '#64748b',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      🍗 Non-Veg
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 16 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={editingDish.is_bestseller || false}
                    onChange={(e) => setEditingDish({ ...editingDish, is_bestseller: e.target.checked })}
                  />
                  <span>Bestseller Star 🌟</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={editingDish.is_available}
                    onChange={(e) => setEditingDish({ ...editingDish, is_available: e.target.checked })}
                  />
                  <span>Available in Stock</span>
                </label>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                  Photo URL
                </label>
                <input
                  type="url"
                  value={editingDish.photo_url || editingDish.image_url || ''}
                  onChange={(e) => setEditingDish({ ...editingDish, photo_url: e.target.value, image_url: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.8rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setEditingDish(null)}
                  style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff', color: '#64748b', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 2, padding: '10px 0', borderRadius: 8, border: 'none', background: '#059669', color: '#fff', fontWeight: 800, cursor: 'pointer' }}
                >
                  ✓ Save Dish Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL: REJECT ORDER REASON                                              */}
      {/* ======================================================================= */}
      {rejectOrderId && (
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
            borderRadius: 16,
            width: '100%',
            maxWidth: 400,
            padding: 20,
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#dc2626', margin: '0 0 8px' }}>
              Decline Order
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 14px' }}>
              Select a reason to inform the customer and customer support:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {[
                'Kitchen busy / high backlog',
                'Item out of stock',
                'Restaurant closing for the day',
                'Power / equipment issue',
              ].map(reason => (
                <label
                  key={reason}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: '1px solid ' + (rejectReason === reason ? '#f87171' : '#e2e8f0'),
                    background: rejectReason === reason ? '#fef2f2' : '#fff',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                  }}
                >
                  <input
                    type="radio"
                    name="rejectReason"
                    checked={rejectReason === reason}
                    onChange={() => setRejectReason(reason)}
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setRejectOrderId(null)}
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
                onClick={() => {
                  restaurantRejectOrder(rejectOrderId, rejectReason);
                  setRejectOrderId(null);
                }}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  borderRadius: 8,
                  border: 'none',
                  background: '#dc2626',
                  color: '#fff',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL: ADD MENU CATEGORY                                                */}
      {/* ======================================================================= */}
      {showAddCategoryModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 380, padding: 22 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 8px', color: '#0f172a' }}>
              + Create New Menu Category
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 14px' }}>
              Add a custom category section to organize your dishes.
            </p>
            <form onSubmit={handleAddCategory} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Starters, Tiffin Combos, Desserts"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button
                  type="button"
                  onClick={() => setShowAddCategoryModal(false)}
                  style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff', color: '#64748b', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 2, padding: '10px 0', borderRadius: 8, border: 'none', background: '#f97316', color: '#fff', fontWeight: 800, cursor: 'pointer' }}
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
