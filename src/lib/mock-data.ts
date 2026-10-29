// Mock data for development — simulates Supabase responses
// Enriched with high-definition food photography for a premium Swiggy/Zomato style UI

export interface Zone {
  id: string;
  name: string;
  name_te: string;
  slug: string;
  base_delivery_fee: number;
  is_active: boolean;
}

export interface Restaurant {
  id: string;
  owner_id: string;
  name: string;
  name_te: string;
  slug: string;
  phone: string;
  description: string;
  description_te: string;
  zone_id: string;
  address_text: string;
  area?: string;
  cover_photo_url: string;
  logo_url: string;
  is_open: boolean;
  is_active?: boolean;
  is_holiday: boolean;
  opening_time: string;
  closing_time: string;
  avg_prep_time: number;
  min_order_amount: number;
  commission_rate: number;
  rating: number;
  total_ratings: number;
  approval_status: 'pending' | 'approved' | 'rejected';
  is_featured: boolean;
  cuisines: string[];
  cost_for_two: number;
  discount_tag?: string;
  distance: string;
  delivery_time_range: string;
  settlement_upi?: string;
  bank_account_number?: string;
  bank_ifsc?: string;
  bank_name?: string;
  account_holder_name?: string;
  notice_message?: string;
  is_paused?: boolean;
}

export interface DeliveryPilot {
  id: string;
  name: string;
  phone: string;
  vehicle_number: string;
  vehicle_type: string;
  rating: number;
  total_trips: number;
  cash_collected: number;
  is_active: boolean;
  is_online: boolean;
  current_order_id?: string;
}

export interface PlatformSettings {
  platform_fee: number;
  gst_rate_percent: number;
  free_delivery_above: number;
  announcement_ticker: string;
  announcement_active: boolean;
  surge_pricing_active: boolean;
  surge_fee: number;
  surge_reason: string;
}

export interface Category {
  id: string;
  restaurant_id: string;
  name: string;
  name_te: string;
  sort_order: number;
  is_active: boolean;
}

export interface MenuItem {
  id: string;
  category_id?: string;
  category?: string;
  restaurant_id: string;
  name: string;
  name_te: string;
  description: string;
  description_te: string;
  price: number;
  photo_url?: string;
  image_url?: string;
  is_veg: boolean;
  is_available: boolean;
  is_bestseller?: boolean;
  prep_time: number;
  sort_order?: number;
  rating?: number;
  rating_count?: number;
  spicy_level?: number;
}

export interface CartItem {
  id: string;
  menu_item: MenuItem;
  quantity: number;
  item_notes: string;
}

export interface Order {
  id: string;
  order_code: string;
  user_id: string;
  restaurant_id: string;
  restaurant_name: string;
  rider_id?: string;
  rider_name?: string;
  rider_phone?: string;
  rider_vehicle?: string;
  status: 'placed' | 'accepted' | 'confirmed' | 'preparing' | 'ready_for_pickup' | 'picked_up' | 'out_for_delivery' | 'delivered' | 'cancelled';
  items_total: number;
  delivery_fee: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
  delivery_otp: string;
  pickup_code: string;
  special_instructions: string;
  delivery_address?: string;
  payment_method?: 'cod' | 'prepaid' | 'online';
  placed_at?: string;
  created_at?: string;
  accepted_at?: string;
  preparing_at?: string;
  ready_at?: string;
  picked_up_at?: string;
  delivered_at?: string;
  cancelled_at?: string;
  rider_declined?: boolean;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  item_name: string;
  item_name_te: string;
  base_price: number;
  quantity: number;
  total_price: number;
  is_veg: boolean;
}

export interface Banner {
  id: string;
  title: string;
  title_te: string;
  subtitle?: string;
  subtitle_te?: string;
  image_url: string;
  link_url: string;
  discount_code?: string;
  sort_order: number;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discount_type: 'percentage' | 'flat';
  discount_value: number;
  min_order_amount: number;
  max_discount?: number;
  is_active: boolean;
}

export interface CuisineCircle {
  id: string;
  name: string;
  name_te: string;
  image_url: string;
  query: string;
}

// ============================================================
// "What's on your mind?" Circular Items (Swiggy Signature)
// ============================================================
export const CUISINE_CIRCLES: CuisineCircle[] = [
  {
    id: 'c-1',
    name: 'Biryani',
    name_te: 'బిర్యానీ',
    image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&auto=format&fit=crop&q=80',
    query: 'Biryani',
  },
  {
    id: 'c-2',
    name: 'Dosa',
    name_te: 'దోస',
    image_url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=300&auto=format&fit=crop&q=80',
    query: 'Dosa',
  },
  {
    id: 'c-3',
    name: 'Idli & Tiffins',
    name_te: 'ఇడ్లీ & టిఫిన్స్',
    image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300&auto=format&fit=crop&q=80',
    query: 'Idli',
  },
  {
    id: 'c-4',
    name: 'Telugu Thali',
    name_te: 'తెలుగు భోజనం',
    image_url: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=300&auto=format&fit=crop&q=80',
    query: 'Thali',
  },
  {
    id: 'c-5',
    name: 'Chicken 65',
    name_te: 'చికెన్ 65',
    image_url: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=300&auto=format&fit=crop&q=80',
    query: 'Chicken',
  },
  {
    id: 'c-6',
    name: 'Filter Coffee',
    name_te: 'ఫిల్టర్ కాఫీ',
    image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&auto=format&fit=crop&q=80',
    query: 'Coffee',
  },
  {
    id: 'c-7',
    name: 'Chaat & Snacks',
    name_te: 'చాట్ & స్నాక్స్',
    image_url: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=300&auto=format&fit=crop&q=80',
    query: 'Chat',
  },
  {
    id: 'c-8',
    name: 'Sweets & Cakes',
    name_te: 'స్వీట్లు & కేకులు',
    image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&auto=format&fit=crop&q=80',
    query: 'Sweet',
  },
];

// ============================================================
// Mock Data
// ============================================================

export const ZONES: Zone[] = [
  { id: 'zone-1', name: 'Gandhi Nagar', name_te: 'గాంధీ నగర్', slug: 'gandhi-nagar', base_delivery_fee: 20, is_active: true },
  { id: 'zone-2', name: 'Collectorate Road', name_te: 'కలెక్టరేట్ రోడ్', slug: 'collectorate-road', base_delivery_fee: 25, is_active: true },
  { id: 'zone-3', name: 'RTC Complex', name_te: 'ఆర్టీసీ కాంప్లెక్స్', slug: 'rtc-complex', base_delivery_fee: 30, is_active: true },
];

export const RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-2',
    owner_id: 'owner-2',
    name: 'Hyderabad Biryani House',
    name_te: 'హైదరాబాద్ బిర్యానీ హౌస్',
    slug: 'hyderabad-biryani-house',
    phone: '+919876543220',
    description: 'World-famous Hyderabadi Dum Biryani. Slow-cooked with aromatic spices, tender meat, and saffron.',
    description_te: 'ప్రపంచ ప్రసిద్ధ హైదరాబాదీ దమ్ బిర్యానీ. సుగంధ ద్రవ్యాలు మరియు కుంకుమపువ్వుతో వండినది.',
    zone_id: 'zone-1',
    address_text: '5-9-1, Near Clock Tower, Gandhi Nagar',
    cover_photo_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    logo_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=150&auto=format&fit=crop&q=80',
    is_open: true,
    is_holiday: false,
    opening_time: '11:00',
    closing_time: '23:00',
    avg_prep_time: 25,
    min_order_amount: 150,
    commission_rate: 12,
    rating: 4.8,
    total_ratings: 1420,
    approval_status: 'approved',
    is_featured: true,
    cuisines: ['Biryani', 'Mughlai', 'Andhra Starters'],
    cost_for_two: 350,
    discount_tag: '60% OFF UP TO ₹120',
    distance: '1.4 km',
    delivery_time_range: '20-25 mins',
  },
  {
    id: 'rest-1',
    owner_id: 'demo-restaurant-001',
    name: 'Sri Sai Tiffins & Cafe',
    name_te: 'శ్రీ సాయి టిఫిన్స్ & కేఫ్',
    slug: 'sri-sai-tiffins',
    phone: '+919876543211',
    description: 'Authentic South Indian morning tiffins. Famous for MLA Pesarattu, Ghee Karam Dosa, and filter coffee.',
    description_te: 'ప్రామాణిక దక్షిణ భారత అల్పాహారం. ఎమ్మెల్యే పెసరట్టు మరియు నెయ్యి కారం దోసకు ప్రసిద్ధి.',
    zone_id: 'zone-1',
    address_text: '12-5-3, Gandhi Nagar Main Road',
    cover_photo_url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80',
    logo_url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=150&auto=format&fit=crop&q=80',
    is_open: true,
    is_holiday: false,
    opening_time: '06:00',
    closing_time: '12:00',
    avg_prep_time: 15,
    min_order_amount: 50,
    commission_rate: 10,
    rating: 4.6,
    total_ratings: 540,
    approval_status: 'approved',
    is_featured: true,
    cuisines: ['South Indian', 'Tiffins', 'Dosas', 'Coffee'],
    cost_for_two: 150,
    discount_tag: 'FLAT ₹50 OFF',
    distance: '1.8 km',
    delivery_time_range: '15-20 mins',
  },
  {
    id: 'rest-3',
    owner_id: 'owner-3',
    name: 'Amma Vantillu Homestyle Meals',
    name_te: 'అమ్మ వంటిల్లు భోజనం',
    slug: 'amma-vantillu',
    phone: '+919876543221',
    description: 'Pure Andhra homestyle meals cooked with pure cow ghee, stone-ground podis, and fresh garden vegetables.',
    description_te: 'ఇంటి రుచి తెలుగు భోజనం. స్వచ్ఛమైన నెయ్యి మరియు రోటి పచ్చళ్ళతో అమ్మ వంట రుచి.',
    zone_id: 'zone-2',
    address_text: '8-3-2, Collectorate Road',
    cover_photo_url: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=800&auto=format&fit=crop&q=80',
    logo_url: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=150&auto=format&fit=crop&q=80',
    is_open: true,
    is_holiday: false,
    opening_time: '11:00',
    closing_time: '22:00',
    avg_prep_time: 20,
    min_order_amount: 100,
    commission_rate: 10,
    rating: 4.9,
    total_ratings: 980,
    approval_status: 'approved',
    is_featured: true,
    cuisines: ['Andhra Meals', 'Thali', 'Traditional'],
    cost_for_two: 250,
    discount_tag: 'FREE DELIVERY ON FIRST ORDER',
    distance: '2.5 km',
    delivery_time_range: '25-30 mins',
  },
  {
    id: 'rest-5',
    owner_id: 'owner-5',
    name: 'New Modern Bakehouse & Desserts',
    name_te: 'న్యూ మోడర్న్ బేకరీ & డెజర్ట్స్',
    slug: 'new-modern-bakery',
    phone: '+919876543223',
    description: 'Oven-fresh cakes, gourmet pastries, melt-in-mouth cookies, and artisan chocolate desserts.',
    description_te: 'తాజా కేకులు, పేస్ట్రీలు, కుకీలు మరియు చాక్లెట్ డెజర్ట్‌లు.',
    zone_id: 'zone-1',
    address_text: '15-2-7, Gandhi Nagar Circle',
    cover_photo_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80',
    logo_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=150&auto=format&fit=crop&q=80',
    is_open: true,
    is_holiday: false,
    opening_time: '08:00',
    closing_time: '22:30',
    avg_prep_time: 15,
    min_order_amount: 80,
    commission_rate: 10,
    rating: 4.4,
    total_ratings: 410,
    approval_status: 'approved',
    is_featured: false,
    cuisines: ['Bakery', 'Desserts', 'Snacks'],
    cost_for_two: 200,
    discount_tag: '20% OFF WITH BIRYANI20',
    distance: '2.1 km',
    delivery_time_range: '20-25 mins',
  },
  {
    id: 'rest-4',
    owner_id: 'owner-4',
    name: 'Raju Gari Chat & Pani Puri Corner',
    name_te: 'రాజు గారి చాట్ & పానీపూరి కార్నర్',
    slug: 'raju-gari-chat',
    phone: '+919876543222',
    description: 'Crispy Pani Puri with mint spiced water, creamy Dahi Puri, hot Samosa Ragda, and Bhel Puri.',
    description_te: 'క్రిస్పీ పానీపూరి, క్రీమీ దహీ పూరి మరియు సమోసా చాట్.',
    zone_id: 'zone-3',
    address_text: '3-1-5, RTC Complex Bus Stop',
    cover_photo_url: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=800&auto=format&fit=crop&q=80',
    logo_url: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=150&auto=format&fit=crop&q=80',
    is_open: true,
    is_holiday: false,
    opening_time: '14:00',
    closing_time: '22:00',
    avg_prep_time: 10,
    min_order_amount: 40,
    commission_rate: 8,
    rating: 4.5,
    total_ratings: 620,
    approval_status: 'approved',
    is_featured: false,
    cuisines: ['Street Food', 'Chaat', 'Snacks'],
    cost_for_two: 100,
    discount_tag: 'UP TO ₹40 OFF',
    distance: '3.2 km',
    delivery_time_range: '20-30 mins',
  },
];

export const CATEGORIES: Category[] = [
  // Sri Sai Tiffins
  { id: 'cat-1', restaurant_id: 'rest-1', name: 'Morning Tiffins', name_te: 'అల్పాహారాలు', sort_order: 0, is_active: true },
  { id: 'cat-2', restaurant_id: 'rest-1', name: 'Special Dosas', name_te: 'స్పెషల్ దోసలు', sort_order: 1, is_active: true },
  { id: 'cat-3', restaurant_id: 'rest-1', name: 'Hot Beverages', name_te: 'వేడి పానీయాలు', sort_order: 2, is_active: true },
  // Hyderabad Biryani House
  { id: 'cat-4', restaurant_id: 'rest-2', name: 'Dum Biryanis', name_te: 'దమ్ బిర్యానీలు', sort_order: 0, is_active: true },
  { id: 'cat-5', restaurant_id: 'rest-2', name: 'Sizzling Starters', name_te: 'స్టార్టర్లు', sort_order: 1, is_active: true },
  { id: 'cat-6', restaurant_id: 'rest-2', name: 'Rich Curries', name_te: 'కర్రీలు', sort_order: 2, is_active: true },
  // Amma Vantillu
  { id: 'cat-7', restaurant_id: 'rest-3', name: 'Full Meals & Thali', name_te: 'పూర్తి భోజనం', sort_order: 0, is_active: true },
  { id: 'cat-8', restaurant_id: 'rest-3', name: 'Flavoured Rice Items', name_te: 'వెరైటీ అన్నం', sort_order: 1, is_active: true },
  { id: 'cat-9', restaurant_id: 'rest-3', name: 'Pure Ghee Sweets', name_te: 'నెయ్యి స్వీట్లు', sort_order: 2, is_active: true },
];

export const MENU_ITEMS: MenuItem[] = [
  // Sri Sai Tiffins
  {
    id: 'item-1',
    category_id: 'cat-1',
    restaurant_id: 'rest-1',
    name: 'MLA Pesarattu with Upma',
    name_te: 'ఎమ్మెల్యే పెసరట్టు ఉప్మాతో',
    description: 'Golden whole green gram crepe filled with ghee upma, served with allam (ginger) and coconut pachadi.',
    description_te: 'నెయ్యి ఉప్మా నింపిన పెసర పిండి దోస, అల్లం చట్నీ మరియు కొబ్బరి చట్నీతో.',
    price: 65,
    photo_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&auto=format&fit=crop&q=80',
    is_veg: true,
    is_available: true,
    is_bestseller: true,
    prep_time: 10,
    sort_order: 0,
    rating: 4.9,
    rating_count: 248,
  },
  {
    id: 'item-2',
    category_id: 'cat-1',
    restaurant_id: 'rest-1',
    name: 'Guntur Steamed Idli (2 pcs)',
    name_te: 'గుంటూరు ఆవిరి ఇడ్లీ (2)',
    description: 'Cloud-soft steamed rice cakes topped with melting ghee, gunpowder podi, piping hot drumstick sambar.',
    description_te: 'నెయ్యి మరియు కారప్పొడితో మెత్తని ఇడ్లీలు, ములక్కాడ సాంబారుతో.',
    price: 40,
    photo_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&auto=format&fit=crop&q=80',
    is_veg: true,
    is_available: true,
    is_bestseller: false,
    prep_time: 8,
    sort_order: 1,
    rating: 4.7,
    rating_count: 180,
  },
  {
    id: 'item-4',
    category_id: 'cat-2',
    restaurant_id: 'rest-1',
    name: 'Ghee Karam Masala Dosa',
    name_te: 'నెయ్యి కారం మసాలా దోస',
    description: 'Crispy wafer-thin golden crepe coated with spicy Guntur red chilli paste, stuffed with potato masala.',
    description_te: 'ఎర్ర కారం పేస్ట్ మరియు బంగాళాదుంప మసాలాతో కాల్చిన క్రిస్పీ నెయ్యి దోస.',
    price: 75,
    photo_url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&auto=format&fit=crop&q=80',
    is_veg: true,
    is_available: true,
    is_bestseller: true,
    prep_time: 12,
    sort_order: 0,
    rating: 4.8,
    rating_count: 312,
  },
  {
    id: 'item-6',
    category_id: 'cat-3',
    restaurant_id: 'rest-1',
    name: 'Degree Filter Coffee',
    name_te: 'డిగ్రీ ఫిల్టర్ కాఫీ',
    description: 'Freshly decocted Arabica-Robusta brew whipped with frothy boiled whole milk in a traditional brass dabarah.',
    description_te: 'తాజా డికాక్షన్‌తో సంప్రదాయ ఇత్తడి గిన్నెలో ఫిల్టర్ కాఫీ.',
    price: 25,
    photo_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=80',
    is_veg: true,
    is_available: true,
    is_bestseller: true,
    prep_time: 5,
    sort_order: 0,
    rating: 4.9,
    rating_count: 420,
  },

  // Hyderabad Biryani House
  {
    id: 'item-8',
    category_id: 'cat-4',
    restaurant_id: 'rest-2',
    name: 'Special Chicken Dum Biryani',
    name_te: 'స్పెషల్ చికెన్ దమ్ బిర్యానీ',
    description: 'Fragrant long-grain aged Basmati rice layered with marinated succulent farm chicken, brown onions, mint, and boiled egg. Served with Mirchi ka Salan & creamy raita.',
    description_te: 'బాస్మతి బియ్యంతో నెమ్మదిగా ఉడికించిన చికెన్ దమ్ బిర్యానీ, మిర్చి కా సాలన్ మరియు రైతాతో.',
    price: 240,
    photo_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&auto=format&fit=crop&q=80',
    is_veg: false,
    is_available: true,
    is_bestseller: true,
    prep_time: 25,
    sort_order: 0,
    rating: 4.9,
    rating_count: 980,
  },
  {
    id: 'item-9',
    category_id: 'cat-4',
    restaurant_id: 'rest-2',
    name: 'Royal Shahi Mutton Dum Biryani',
    name_te: 'రాయల్ షాహీ మటన్ దమ్ బిర్యానీ',
    description: 'Tender baby lamb cuts steeped in rich saffron spices, slow dum-cooked in a sealed handi for 4 hours.',
    description_te: 'కుంకుమపువ్వు మరియు మసాలాలతో హండీలో ఉడికించిన అసలైన మటన్ బిర్యానీ.',
    price: 320,
    photo_url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&auto=format&fit=crop&q=80',
    is_veg: false,
    is_available: true,
    is_bestseller: true,
    prep_time: 30,
    sort_order: 1,
    rating: 4.8,
    rating_count: 650,
  },
  {
    id: 'item-10',
    category_id: 'cat-4',
    restaurant_id: 'rest-2',
    name: 'Nizami Paneer Veg Biryani',
    name_te: 'నిజామీ పనీర్ వెజ్ బిర్యానీ',
    description: 'Grilled cottage cheese cubes tossed with fresh garden peas, saffron basmati rice, and caramelized shallots.',
    description_te: 'పనీర్ ముక్కలు మరియు సుగంధ కూరగాయలతో నిజామీ వెజ్ బిర్యానీ.',
    price: 190,
    photo_url: 'https://images.unsplash.com/photo-1642821373181-696a54913e9a?w=400&auto=format&fit=crop&q=80',
    is_veg: true,
    is_available: true,
    is_bestseller: false,
    prep_time: 20,
    sort_order: 2,
    rating: 4.6,
    rating_count: 210,
  },
  {
    id: 'item-11',
    category_id: 'cat-5',
    restaurant_id: 'rest-2',
    name: 'Crispy Andhra Chicken 65',
    name_te: 'క్రిస్పీ ఆంధ్ర చికెన్ 65',
    description: 'Boneless tender chicken tossed in a fiery curd, curry leaves, and green chilli temper with a lemony crunch.',
    description_te: 'కరివేపాకు మరియు పచ్చిమిర్చితో వేయించిన బోన్‌లెస్ చికెన్ 65.',
    price: 190,
    photo_url: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=400&auto=format&fit=crop&q=80',
    is_veg: false,
    is_available: true,
    is_bestseller: true,
    prep_time: 15,
    sort_order: 0,
    rating: 4.8,
    rating_count: 530,
  },
  {
    id: 'item-12',
    category_id: 'cat-5',
    restaurant_id: 'rest-2',
    name: 'Clay Oven Paneer Tikka',
    name_te: 'క్లే ఓవెన్ పనీర్ టిక్కా',
    description: 'Malai paneer cubes marinated in Kashmiri deghi mirch, hung curd, and carom seeds, charred in tandoor.',
    description_te: 'మసాలా పెరుగులో నానబెట్టి తందూర్‌లో కాల్చిన పనీర్ టిక్కా.',
    price: 180,
    photo_url: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&auto=format&fit=crop&q=80',
    is_veg: true,
    is_available: true,
    is_bestseller: false,
    prep_time: 15,
    sort_order: 1,
    rating: 4.7,
    rating_count: 190,
  },

  // Amma Vantillu
  {
    id: 'item-15',
    category_id: 'cat-7',
    restaurant_id: 'rest-3',
    name: 'Kakinada Deluxe Veg Bhojanam',
    name_te: 'కాకినాడ డీలక్స్ వెజ్ భోజనం',
    description: 'Hot Sona Masoori rice, Ghee, Mudda Pappu, Avakaya pickle, Drumstick Sambar, Pepper Rasam, Dondakaya Fry, Curd & Crispy Appadam.',
    description_te: 'వేడి అన్నం, ముద్దపప్పు, ఆవకాయ, నెయ్యి, సాంబారు, రసం, వేపుడు, పెరుగు మరియు అప్పడం.',
    price: 140,
    photo_url: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=400&auto=format&fit=crop&q=80',
    is_veg: true,
    is_available: true,
    is_bestseller: true,
    prep_time: 15,
    sort_order: 0,
    rating: 4.9,
    rating_count: 740,
  },
  {
    id: 'item-17',
    category_id: 'cat-8',
    restaurant_id: 'rest-3',
    name: 'Gudi Tamarind Pulihora',
    name_te: 'గుడి చింతపండు పులిహోర',
    description: 'Temple-style tangy tamarind rice tempered with roasted peanuts, curry leaves, mustard seeds, and asafoetida.',
    description_te: 'పల్లీలు, ఆవాలు మరియు ఇంగువ తాళింపుతో సాంప్రదాయ చింతపండు పులిహోర.',
    price: 70,
    photo_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&auto=format&fit=crop&q=80',
    is_veg: true,
    is_available: true,
    is_bestseller: false,
    prep_time: 10,
    sort_order: 0,
    rating: 4.7,
    rating_count: 140,
  },
  {
    id: 'item-19',
    category_id: 'cat-9',
    restaurant_id: 'rest-3',
    name: 'Semiya Saggubiyyam Payasam',
    name_te: 'సేమియా సగ్గుబియ్యం పాయసం',
    description: 'Rich condensed milk payasam enriched with roasted cashews, golden raisins, cardamom, and saffron strands.',
    description_te: 'జీడిపప్పు మరియు కిస్‌మిస్‌లతో చేసిన తియ్యని సేమియా పాయసం.',
    price: 50,
    photo_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&auto=format&fit=crop&q=80',
    is_veg: true,
    is_available: true,
    is_bestseller: true,
    prep_time: 5,
    sort_order: 0,
    rating: 4.9,
    rating_count: 310,
  },
];

export const BANNERS: Banner[] = [
  {
    id: 'banner-1',
    title: 'Crave-Worthy Biryani Fiesta',
    title_te: 'రుచికరమైన బిర్యానీ ఉత్సవం',
    subtitle: 'FLAT 50% OFF up to ₹150 • Top Rated Pots',
    subtitle_te: 'ఫ్లాట్ 50% తగ్గింపు • బెస్ట్ రేటెడ్ బిర్యానీలు',
    image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    link_url: '/app',
    discount_code: 'BIRYANI20',
    sort_order: 1,
  },
  {
    id: 'banner-2',
    title: 'Ghee Tiffins & Hot Filter Coffee',
    title_te: 'నెయ్యి టిఫిన్లు & వేడి కాఫీ',
    subtitle: 'Free Delivery under 20 mins from Sri Sai Tiffins',
    subtitle_te: 'శ్రీ సాయి టిఫిన్స్ నుండి 20 నిమిషాల్లో ఉచిత డెలివరీ',
    image_url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80',
    link_url: '/app/restaurant/rest-1',
    discount_code: 'FIRST50',
    sort_order: 2,
  },
  {
    id: 'banner-3',
    title: 'Authentic Telugu Bhojanam',
    title_te: 'అసలైన తెలుగు భోజనం',
    subtitle: 'Unlimited Pure Ghee Meals starting ₹120',
    subtitle_te: 'స్వచ్ఛమైన నెయ్యి భోజనం కేవలం ₹120 నుండి',
    image_url: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=800&auto=format&fit=crop&q=80',
    link_url: '/app/restaurant/rest-3',
    discount_code: 'PAKKA10',
    sort_order: 3,
  },
];

export const COUPONS: Coupon[] = [
  { id: 'coupon-1', code: 'PAKKA10', description: '10% off on all Telugu delicacies', discount_type: 'percentage', discount_value: 10, min_order_amount: 150, max_discount: 50, is_active: true },
  { id: 'coupon-2', code: 'FIRST50', description: 'Flat ₹50 OFF on your first food order', discount_type: 'flat', discount_value: 50, min_order_amount: 100, max_discount: 50, is_active: true },
  { id: 'coupon-3', code: 'BIRYANI20', description: '20% Mega Savings on Dum Biryanis', discount_type: 'percentage', discount_value: 20, min_order_amount: 200, max_discount: 120, is_active: true },
];

export const SAMPLE_ORDERS: Order[] = [
  {
    id: 'order-1',
    order_code: 'PL-0001',
    user_id: 'demo-customer-001',
    restaurant_id: 'rest-2',
    restaurant_name: 'Hyderabad Biryani House',
    rider_id: 'demo-rider-001',
    rider_name: 'Venkat Reddy',
    status: 'preparing',
    items_total: 480,
    delivery_fee: 25,
    discount_amount: 50,
    tax_amount: 22.75,
    total_amount: 477.75,
    delivery_otp: '4829',
    pickup_code: '7312',
    special_instructions: 'Extra salan and crispy fried onions please',
    placed_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    accepted_at: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    preparing_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    items: [
      { id: 'oi-1', item_name: 'Special Chicken Dum Biryani', item_name_te: 'స్పెషల్ చికెన్ దమ్ బిర్యానీ', base_price: 240, quantity: 2, total_price: 480, is_veg: false },
    ],
  },
  {
    id: 'order-2',
    order_code: 'PL-0002',
    user_id: 'demo-customer-001',
    restaurant_id: 'rest-3',
    restaurant_name: 'Amma Vantillu Homestyle Meals',
    status: 'delivered',
    items_total: 280,
    delivery_fee: 20,
    discount_amount: 0,
    tax_amount: 15,
    total_amount: 315,
    delivery_otp: '9154',
    pickup_code: '2847',
    special_instructions: '',
    placed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    accepted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(),
    preparing_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 8 * 60 * 1000).toISOString(),
    ready_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 20 * 60 * 1000).toISOString(),
    picked_up_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 25 * 60 * 1000).toISOString(),
    delivered_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 40 * 60 * 1000).toISOString(),
    items: [
      { id: 'oi-3', item_name: 'Kakinada Deluxe Veg Bhojanam', item_name_te: 'కాకినాడ డీలక్స్ వెజ్ భోజనం', base_price: 140, quantity: 2, total_price: 280, is_veg: true },
    ],
  },
];

export const INITIAL_PILOTS: DeliveryPilot[] = [
  {
    id: 'pilot-1',
    name: 'Venkat Reddy',
    phone: '+91 98765 43210',
    vehicle_number: 'AP 16 CK 4022',
    vehicle_type: 'Honda Activa 6G',
    rating: 4.8,
    total_trips: 412,
    cash_collected: 1240,
    is_active: true,
    is_online: true,
    current_order_id: 'order-1',
  },
  {
    id: 'pilot-2',
    name: 'Suresh Pilot',
    phone: '+91 98765 00112',
    vehicle_number: 'AP 16 BE 8910',
    vehicle_type: 'Hero Splendor Plus',
    rating: 4.9,
    total_trips: 680,
    cash_collected: 450,
    is_active: true,
    is_online: true,
  },
  {
    id: 'pilot-3',
    name: 'Ramesh Naidu',
    phone: '+91 98765 77889',
    vehicle_number: 'AP 16 DN 1120',
    vehicle_type: 'TVS Jupiter',
    rating: 4.7,
    total_trips: 290,
    cash_collected: 0,
    is_active: true,
    is_online: false,
  },
];

export const DEFAULT_PLATFORM_SETTINGS: PlatformSettings = {
  platform_fee: 5,
  gst_rate_percent: 5,
  free_delivery_above: 500,
  announcement_ticker: '🌧️ Monsoon Delight: Fast deliveries with dedicated waterproof bags in Vijayawada & Guntur!',
  announcement_active: true,
  surge_pricing_active: false,
  surge_fee: 15,
  surge_reason: 'High Demand / Rain Rush',
};

