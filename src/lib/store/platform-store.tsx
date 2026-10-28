'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  RESTAURANTS,
  MENU_ITEMS,
  ZONES,
  COUPONS,
  SAMPLE_ORDERS,
  INITIAL_PILOTS,
  DEFAULT_PLATFORM_SETTINGS,
  type Restaurant,
  type MenuItem,
  type Zone,
  type Coupon,
  type Order,
  type DeliveryPilot,
  type PlatformSettings,
} from '@/lib/mock-data';

export interface SavedAddress {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  label: string;
  flat: string;
  landmark: string;
  area: string;
  isDefault: boolean;
}

export interface OrderRating {
  orderId: string;
  foodRating: number;
  riderRating: number;
  review: string;
  createdAt: string;
}

interface PlatformContextType {
  // Orders
  orders: Order[];
  placeOrder: (orderData: {
    restaurantId: string;
    restaurantName: string;
    itemsTotal: number;
    deliveryFee: number;
    discountAmount: number;
    taxAmount: number;
    totalAmount: number;
    specialInstructions: string;
    isCOD: boolean;
    deliveryAddress: string;
    items: {
      id: string;
      item_name: string;
      item_name_te: string;
      base_price: number;
      quantity: number;
      total_price: number;
      is_veg: boolean;
    }[];
  }) => Order;
  restaurantAcceptOrder: (orderId: string) => void;
  restaurantRejectOrder: (orderId: string, reason?: string) => void;
  restaurantMarkReady: (orderId: string) => void;
  riderAcceptOrder: (orderId: string, riderInfo?: { name: string; phone: string; vehicle: string }) => void;
  riderConfirmPickup: (orderId: string, enteredCode: string) => { success: boolean; message: string };
  riderDeliverOrder: (orderId: string, enteredOtp: string) => { success: boolean; message: string };
  customerRateOrder: (orderId: string, foodRating: number, riderRating: number, review: string) => void;
  ratings: Record<string, OrderRating>;

  // Restaurants
  restaurants: Restaurant[];
  toggleRestaurantOpen: (restaurantId: string) => void;
  approveRestaurant: (restaurantId: string) => void;
  rejectRestaurant: (restaurantId: string) => void;
  updateCommissionRate: (restaurantId: string, rate: number) => void;
  updateRestaurant: (restaurantId: string, updates: Partial<Restaurant>) => void;
  addNewRestaurant: (rest: Omit<Restaurant, 'id'>) => Restaurant;
  deleteRestaurant: (restaurantId: string) => void;

  // Menu items
  menuItems: MenuItem[];
  toggleItemStock: (itemId: string) => void;
  updateItemPrice: (itemId: string, newPrice: number) => void;
  updateMenuItem: (itemId: string, updates: Partial<MenuItem>) => void;
  addNewMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  deleteMenuItem: (itemId: string) => void;

  // Zones & Logistics
  zones: Zone[];
  updateZoneFee: (zoneId: string, fee: number) => void;
  toggleZoneActive: (zoneId: string) => void;
  addNewZone: (zone: Omit<Zone, 'id'>) => void;
  updateZone: (zoneId: string, updates: Partial<Zone>) => void;
  deleteZone: (zoneId: string) => void;
  surgePricing: boolean;
  toggleSurgePricing: () => void;
  surgeFeeAmount: number;
  setSurgeFeeAmount: (amount: number) => void;

  // Coupons
  coupons: Coupon[];
  addNewCoupon: (coupon: Omit<Coupon, 'id'>) => void;
  updateCoupon: (couponId: string, updates: Partial<Coupon>) => void;
  deleteCoupon: (couponId: string) => void;
  toggleCouponActive: (couponId: string) => void;

  // Admin Order Controls
  adminUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  adminReassignRider: (orderId: string, riderName: string, riderPhone?: string) => void;
  adminCancelOrder: (orderId: string, reason?: string) => void;
  adminEditOrderCustomer: (orderId: string, updates: { deliveryAddress?: string; specialInstructions?: string }) => void;

  // Platform Global Settings
  platformSettings: PlatformSettings;
  updatePlatformSettings: (updates: Partial<PlatformSettings>) => void;

  // Delivery Pilots Fleet
  pilots: DeliveryPilot[];
  addNewPilot: (pilot: Omit<DeliveryPilot, 'id'>) => void;
  updatePilot: (pilotId: string, updates: Partial<DeliveryPilot>) => void;
  deletePilot: (pilotId: string) => void;
  resetPilotCash: (pilotId: string) => void;
  togglePilotDuty: (pilotId: string) => void;

  // Saved Addresses
  savedAddresses: SavedAddress[];
  addSavedAddress: (address: Omit<SavedAddress, 'id'>) => void;
  deleteSavedAddress: (addressId: string) => void;

  // Rider Cash & Duty
  riderCashInHand: number;
  riderDepositCash: (amount: number) => void;
  isRiderOnDuty: boolean;
  toggleRiderDuty: () => void;
}

const PlatformContext = createContext<PlatformContextType | null>(null);

const STORAGE_KEYS = {
  ORDERS: 'mr_platform_orders_v2',
  RESTAURANTS: 'mr_platform_restaurants_v2',
  MENU_ITEMS: 'mr_platform_menu_items_v2',
  ZONES: 'mr_platform_zones_v2',
  COUPONS: 'mr_platform_coupons_v2',
  ADDRESSES: 'mr_platform_addresses_v2',
  RATINGS: 'mr_platform_ratings_v2',
  RIDER_CASH: 'mr_platform_rider_cash_v2',
  RIDER_DUTY: 'mr_platform_rider_duty_v2',
  SURGE: 'mr_platform_surge_v2',
  SETTINGS: 'mr_platform_settings_v2',
  PILOTS: 'mr_platform_pilots_v2',
};

const DEFAULT_ADDRESSES: SavedAddress[] = [
  {
    id: 'addr-1',
    type: 'Home',
    label: 'Home',
    flat: 'Flat 402, Sai Residency',
    landmark: 'Near Gandhi Statue',
    area: 'Gandhi Nagar',
    isDefault: true,
  },
  {
    id: 'addr-2',
    type: 'Work',
    label: 'Office',
    flat: 'Cabin 12, Tech Hub, 3rd Floor',
    landmark: 'Opp. Collectorate Office',
    area: 'Collectorate Road',
    isDefault: false,
  },
];

export function PlatformProvider({ children }: { children: React.ReactNode }) {
  // State initialization
  const [orders, setOrders] = useState<Order[]>(SAMPLE_ORDERS);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(RESTAURANTS);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [zones, setZones] = useState<Zone[]>(ZONES);
  const [coupons, setCoupons] = useState<Coupon[]>(COUPONS);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(DEFAULT_ADDRESSES);
  const [ratings, setRatings] = useState<Record<string, OrderRating>>({});
  const [riderCashInHand, setRiderCashInHand] = useState<number>(1240);
  const [isRiderOnDuty, setIsRiderOnDuty] = useState<boolean>(true);
  const [surgePricing, setSurgePricing] = useState<boolean>(false);
  const [surgeFeeAmount, setSurgeFeeAmount] = useState<number>(15);
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(DEFAULT_PLATFORM_SETTINGS);
  const [pilots, setPilots] = useState<DeliveryPilot[]>(INITIAL_PILOTS);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const storedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (storedOrders) setOrders(JSON.parse(storedOrders));

      const storedRests = localStorage.getItem(STORAGE_KEYS.RESTAURANTS);
      if (storedRests) setRestaurants(JSON.parse(storedRests));

      const storedItems = localStorage.getItem(STORAGE_KEYS.MENU_ITEMS);
      if (storedItems) setMenuItems(JSON.parse(storedItems));

      const storedZones = localStorage.getItem(STORAGE_KEYS.ZONES);
      if (storedZones) setZones(JSON.parse(storedZones));

      const storedCoupons = localStorage.getItem(STORAGE_KEYS.COUPONS);
      if (storedCoupons) setCoupons(JSON.parse(storedCoupons));

      const storedAddresses = localStorage.getItem(STORAGE_KEYS.ADDRESSES);
      if (storedAddresses) setSavedAddresses(JSON.parse(storedAddresses));

      const storedRatings = localStorage.getItem(STORAGE_KEYS.RATINGS);
      if (storedRatings) setRatings(JSON.parse(storedRatings));

      const storedCash = localStorage.getItem(STORAGE_KEYS.RIDER_CASH);
      if (storedCash) setRiderCashInHand(Number(storedCash));

      const storedDuty = localStorage.getItem(STORAGE_KEYS.RIDER_DUTY);
      if (storedDuty) setIsRiderOnDuty(storedDuty === 'true');

      const storedSurge = localStorage.getItem(STORAGE_KEYS.SURGE);
      if (storedSurge) setSurgePricing(storedSurge === 'true');

      const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (storedSettings) {
        const parsed = JSON.parse(storedSettings);
        setPlatformSettings(parsed);
        if (parsed.surge_pricing_active !== undefined) setSurgePricing(parsed.surge_pricing_active);
        if (parsed.surge_fee !== undefined) setSurgeFeeAmount(parsed.surge_fee);
      }

      const storedPilots = localStorage.getItem(STORAGE_KEYS.PILOTS);
      if (storedPilots) setPilots(JSON.parse(storedPilots));
    } catch (e) {
      console.error('Error loading platform state from storage', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Sync state to localStorage on updates
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) { console.error(e); }
  }, [orders, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEYS.RESTAURANTS, JSON.stringify(restaurants));
    } catch (e) { console.error(e); }
  }, [restaurants, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(menuItems));
    } catch (e) { console.error(e); }
  }, [menuItems, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEYS.ZONES, JSON.stringify(zones));
    } catch (e) { console.error(e); }
  }, [zones, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
    } catch (e) { console.error(e); }
  }, [coupons, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEYS.ADDRESSES, JSON.stringify(savedAddresses));
    } catch (e) { console.error(e); }
  }, [savedAddresses, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEYS.RATINGS, JSON.stringify(ratings));
    } catch (e) { console.error(e); }
  }, [ratings, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEYS.RIDER_CASH, String(riderCashInHand));
    } catch (e) { console.error(e); }
  }, [riderCashInHand, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEYS.RIDER_DUTY, String(isRiderOnDuty));
    } catch (e) { console.error(e); }
  }, [isRiderOnDuty, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(platformSettings));
    } catch (e) { console.error(e); }
  }, [platformSettings, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEYS.PILOTS, JSON.stringify(pilots));
    } catch (e) { console.error(e); }
  }, [pilots, isInitialized]);

  // ============================================================
  // Order Actions
  // ============================================================
  const placeOrder = useCallback((orderData: {
    restaurantId: string;
    restaurantName: string;
    itemsTotal: number;
    deliveryFee: number;
    discountAmount: number;
    taxAmount: number;
    totalAmount: number;
    specialInstructions: string;
    isCOD: boolean;
    deliveryAddress: string;
    items: {
      id: string;
      item_name: string;
      item_name_te: string;
      base_price: number;
      quantity: number;
      total_price: number;
      is_veg: boolean;
    }[];
  }) => {
    const orderId = `order-${Date.now()}`;
    const orderCode = `MR-${Math.floor(1000 + Math.random() * 9000)}`;
    const deliveryOtp = String(Math.floor(1000 + Math.random() * 9000));
    const pickupCode = String(Math.floor(1000 + Math.random() * 9000));

    const newOrder: Order = {
      id: orderId,
      order_code: orderCode,
      user_id: 'demo-customer-001',
      restaurant_id: orderData.restaurantId,
      restaurant_name: orderData.restaurantName,
      status: 'placed',
      items_total: orderData.itemsTotal,
      delivery_fee: orderData.deliveryFee,
      discount_amount: orderData.discountAmount,
      tax_amount: orderData.taxAmount,
      total_amount: orderData.totalAmount,
      delivery_otp: deliveryOtp,
      pickup_code: pickupCode,
      special_instructions: orderData.specialInstructions,
      delivery_address: orderData.deliveryAddress,
      payment_method: orderData.isCOD ? 'cod' : 'prepaid',
      placed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      items: orderData.items,
    };

    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  }, []);

  const restaurantAcceptOrder = useCallback((orderId: string) => {
    setOrders(prev =>
      prev.map(o =>
        o.id === orderId
          ? {
              ...o,
              status: 'preparing',
              accepted_at: new Date().toISOString(),
              preparing_at: new Date().toISOString(),
            }
          : o
      )
    );
  }, []);

  const restaurantRejectOrder = useCallback((orderId: string, reason?: string) => {
    setOrders(prev =>
      prev.map(o =>
        o.id === orderId
          ? {
              ...o,
              status: 'cancelled',
              cancelled_at: new Date().toISOString(),
              special_instructions: `${o.special_instructions} [Rejected: ${reason || 'Kitchen overloaded'}]`.trim(),
            }
          : o
      )
    );
  }, []);

  const restaurantMarkReady = useCallback((orderId: string) => {
    setOrders(prev =>
      prev.map(o =>
        o.id === orderId
          ? {
              ...o,
              status: 'ready_for_pickup',
              ready_at: new Date().toISOString(),
            }
          : o
      )
    );
  }, []);

  const riderAcceptOrder = useCallback((orderId: string, riderInfo?: { name: string; phone: string; vehicle: string }) => {
    setOrders(prev =>
      prev.map(o =>
        o.id === orderId
          ? {
              ...o,
              rider_id: 'demo-rider-001',
              rider_name: riderInfo?.name || 'Venkat Reddy',
              rider_phone: riderInfo?.phone || '+91 98765 43210',
              rider_vehicle: riderInfo?.vehicle || 'Bajaj Pulsar AP 05 AB 1234',
            }
          : o
      )
    );
  }, []);

  const riderConfirmPickup = useCallback((orderId: string, enteredCode: string) => {
    const target = orders.find(o => o.id === orderId);
    if (!target) return { success: false, message: 'Order not found' };
    if (target.pickup_code !== enteredCode.trim()) {
      return { success: false, message: 'Invalid pickup code. Check with kitchen.' };
    }

    setOrders(prev =>
      prev.map(o =>
        o.id === orderId
          ? {
              ...o,
              status: 'out_for_delivery',
              picked_up_at: new Date().toISOString(),
              rider_id: 'demo-rider-001',
              rider_name: 'Venkat Reddy',
              rider_phone: '+91 98765 43210',
              rider_vehicle: 'Bajaj Pulsar AP 05 AB 1234',
            }
          : o
      )
    );
    return { success: true, message: 'Pickup confirmed! Food is on the way.' };
  }, [orders]);

  const riderDeliverOrder = useCallback((orderId: string, enteredOtp: string) => {
    const target = orders.find(o => o.id === orderId);
    if (!target) return { success: false, message: 'Order not found' };
    if (target.delivery_otp !== enteredOtp.trim()) {
      return { success: false, message: 'Incorrect OTP! Ask customer for 4-digit code.' };
    }

    setOrders(prev =>
      prev.map(o =>
        o.id === orderId
          ? {
              ...o,
              status: 'delivered',
              delivered_at: new Date().toISOString(),
            }
          : o
      )
    );

    // If COD, add to rider cash float
    setRiderCashInHand(prev => prev + target.total_amount);

    return { success: true, message: 'Order delivered successfully!' };
  }, [orders]);

  const customerRateOrder = useCallback((orderId: string, foodRating: number, riderRating: number, review: string) => {
    setRatings(prev => ({
      ...prev,
      [orderId]: {
        orderId,
        foodRating,
        riderRating,
        review,
        createdAt: new Date().toISOString(),
      },
    }));
  }, []);

  // ============================================================
  // Restaurant Actions
  // ============================================================
  const toggleRestaurantOpen = useCallback((restaurantId: string) => {
    setRestaurants(prev =>
      prev.map(r => (r.id === restaurantId ? { ...r, is_open: !r.is_open } : r))
    );
  }, []);

  const approveRestaurant = useCallback((restaurantId: string) => {
    setRestaurants(prev =>
      prev.map(r => (r.id === restaurantId ? { ...r, approval_status: 'approved' } : r))
    );
  }, []);

  const rejectRestaurant = useCallback((restaurantId: string) => {
    setRestaurants(prev =>
      prev.map(r => (r.id === restaurantId ? { ...r, approval_status: 'rejected' } : r))
    );
  }, []);

  const updateCommissionRate = useCallback((restaurantId: string, rate: number) => {
    setRestaurants(prev =>
      prev.map(r => (r.id === restaurantId ? { ...r, commission_rate: rate } : r))
    );
  }, []);

  const updateRestaurant = useCallback((restaurantId: string, updates: Partial<Restaurant>) => {
    setRestaurants(prev =>
      prev.map(r => (r.id === restaurantId ? { ...r, ...updates } : r))
    );
  }, []);

  const addNewRestaurant = useCallback((rest: Omit<Restaurant, 'id'>) => {
    const newRest: Restaurant = {
      ...rest,
      id: `rest-${Date.now()}`,
    };
    setRestaurants(prev => [newRest, ...prev]);
    return newRest;
  }, []);

  const deleteRestaurant = useCallback((restaurantId: string) => {
    setRestaurants(prev => prev.filter(r => r.id !== restaurantId));
    setMenuItems(prev => prev.filter(m => m.restaurant_id !== restaurantId));
  }, []);

  // ============================================================
  // Menu Actions
  // ============================================================
  const toggleItemStock = useCallback((itemId: string) => {
    setMenuItems(prev =>
      prev.map(item => (item.id === itemId ? { ...item, is_available: !item.is_available } : item))
    );
  }, []);

  const updateItemPrice = useCallback((itemId: string, newPrice: number) => {
    setMenuItems(prev =>
      prev.map(item => (item.id === itemId ? { ...item, price: newPrice } : item))
    );
  }, []);

  const updateMenuItem = useCallback((itemId: string, updates: Partial<MenuItem>) => {
    setMenuItems(prev =>
      prev.map(item => (item.id === itemId ? { ...item, ...updates } : item))
    );
  }, []);

  const addNewMenuItem = useCallback((item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...item,
      id: `item-${Date.now()}`,
    };
    setMenuItems(prev => [newItem, ...prev]);
  }, []);

  const deleteMenuItem = useCallback((itemId: string) => {
    setMenuItems(prev => prev.filter(i => i.id !== itemId));
  }, []);

  // ============================================================
  // Zones & Logistics
  // ============================================================
  const updateZoneFee = useCallback((zoneId: string, fee: number) => {
    setZones(prev =>
      prev.map(z => (z.id === zoneId ? { ...z, base_delivery_fee: fee } : z))
    );
  }, []);

  const toggleZoneActive = useCallback((zoneId: string) => {
    setZones(prev =>
      prev.map(z => (z.id === zoneId ? { ...z, is_active: !z.is_active } : z))
    );
  }, []);

  const addNewZone = useCallback((zone: Omit<Zone, 'id'>) => {
    const newZone: Zone = {
      ...zone,
      id: `zone-${Date.now()}`,
    };
    setZones(prev => [...prev, newZone]);
  }, []);

  const updateZone = useCallback((zoneId: string, updates: Partial<Zone>) => {
    setZones(prev =>
      prev.map(z => (z.id === zoneId ? { ...z, ...updates } : z))
    );
  }, []);

  const deleteZone = useCallback((zoneId: string) => {
    setZones(prev => prev.filter(z => z.id !== zoneId));
  }, []);

  const toggleSurgePricing = useCallback(() => {
    setSurgePricing(prev => !prev);
  }, []);

  // ============================================================
  // Coupons
  // ============================================================
  const addNewCoupon = useCallback((coupon: Omit<Coupon, 'id'>) => {
    const newCoupon: Coupon = {
      ...coupon,
      id: `coupon-${Date.now()}`,
    };
    setCoupons(prev => [newCoupon, ...prev]);
  }, []);

  const updateCoupon = useCallback((couponId: string, updates: Partial<Coupon>) => {
    setCoupons(prev =>
      prev.map(c => (c.id === couponId ? { ...c, ...updates } : c))
    );
  }, []);

  const deleteCoupon = useCallback((couponId: string) => {
    setCoupons(prev => prev.filter(c => c.id !== couponId));
  }, []);

  const toggleCouponActive = useCallback((couponId: string) => {
    setCoupons(prev =>
      prev.map(c => (c.id === couponId ? { ...c, is_active: !c.is_active } : c))
    );
  }, []);

  // ============================================================
  // Admin Order Controls
  // ============================================================
  const adminUpdateOrderStatus = useCallback((orderId: string, status: Order['status']) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status } : o))
    );
  }, []);

  const adminReassignRider = useCallback((orderId: string, riderName: string, riderPhone?: string) => {
    setOrders(prev =>
      prev.map(o =>
        o.id === orderId
          ? {
              ...o,
              rider_name: riderName,
              rider_phone: riderPhone || '+91 98765 43210',
            }
          : o
      )
    );
  }, []);

  const adminCancelOrder = useCallback((orderId: string, reason?: string) => {
    setOrders(prev =>
      prev.map(o =>
        o.id === orderId
          ? {
              ...o,
              status: 'cancelled',
              cancelled_at: new Date().toISOString(),
              special_instructions: `${o.special_instructions} [Admin Cancelled: ${reason || 'Operational adjustment'}]`.trim(),
            }
          : o
      )
    );
  }, []);

  const adminEditOrderCustomer = useCallback((orderId: string, updates: { deliveryAddress?: string; specialInstructions?: string }) => {
    setOrders(prev =>
      prev.map(o =>
        o.id === orderId
          ? {
              ...o,
              ...(updates.deliveryAddress !== undefined ? { delivery_address: updates.deliveryAddress } : {}),
              ...(updates.specialInstructions !== undefined ? { special_instructions: updates.specialInstructions } : {}),
            }
          : o
      )
    );
  }, []);

  // ============================================================
  // Platform Settings Actions
  // ============================================================
  const updatePlatformSettings = useCallback((updates: Partial<PlatformSettings>) => {
    setPlatformSettings(prev => {
      const next = { ...prev, ...updates };
      if (updates.surge_pricing_active !== undefined) setSurgePricing(updates.surge_pricing_active);
      if (updates.surge_fee !== undefined) setSurgeFeeAmount(updates.surge_fee);
      return next;
    });
  }, []);

  // ============================================================
  // Pilots Fleet Actions
  // ============================================================
  const addNewPilot = useCallback((pilot: Omit<DeliveryPilot, 'id'>) => {
    const newPilot: DeliveryPilot = {
      ...pilot,
      id: `pilot-${Date.now()}`,
    };
    setPilots(prev => [...prev, newPilot]);
  }, []);

  const updatePilot = useCallback((pilotId: string, updates: Partial<DeliveryPilot>) => {
    setPilots(prev =>
      prev.map(p => (p.id === pilotId ? { ...p, ...updates } : p))
    );
  }, []);

  const deletePilot = useCallback((pilotId: string) => {
    setPilots(prev => prev.filter(p => p.id !== pilotId));
  }, []);

  const resetPilotCash = useCallback((pilotId: string) => {
    setPilots(prev =>
      prev.map(p => (p.id === pilotId ? { ...p, cash_collected: 0 } : p))
    );
  }, []);

  const togglePilotDuty = useCallback((pilotId: string) => {
    setPilots(prev =>
      prev.map(p => (p.id === pilotId ? { ...p, is_online: !p.is_online } : p))
    );
  }, []);

  // ============================================================
  // Saved Addresses
  // ============================================================
  const addSavedAddress = useCallback((addr: Omit<SavedAddress, 'id'>) => {
    const newAddr: SavedAddress = {
      ...addr,
      id: `addr-${Date.now()}`,
    };
    setSavedAddresses(prev => [newAddr, ...prev]);
  }, []);

  const deleteSavedAddress = useCallback((addressId: string) => {
    setSavedAddresses(prev => prev.filter(a => a.id !== addressId));
  }, []);

  // ============================================================
  // Rider Cash & Duty
  // ============================================================
  const riderDepositCash = useCallback((amount: number) => {
    setRiderCashInHand(prev => Math.max(0, prev - amount));
  }, []);

  const toggleRiderDuty = useCallback(() => {
    setIsRiderOnDuty(prev => !prev);
  }, []);

  return (
    <PlatformContext.Provider
      value={{
        orders,
        placeOrder,
        restaurantAcceptOrder,
        restaurantRejectOrder,
        restaurantMarkReady,
        riderAcceptOrder,
        riderConfirmPickup,
        riderDeliverOrder,
        customerRateOrder,
        ratings,
        restaurants,
        toggleRestaurantOpen,
        approveRestaurant,
        rejectRestaurant,
        updateCommissionRate,
        updateRestaurant,
        addNewRestaurant,
        deleteRestaurant,
        menuItems,
        toggleItemStock,
        updateItemPrice,
        updateMenuItem,
        addNewMenuItem,
        deleteMenuItem,
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
        savedAddresses,
        addSavedAddress,
        deleteSavedAddress,
        riderCashInHand,
        riderDepositCash,
        isRiderOnDuty,
        toggleRiderDuty,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
}

export function usePlatform() {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
}
