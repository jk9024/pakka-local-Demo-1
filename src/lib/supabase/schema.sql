-- =============================================================
-- Mana Ruchulu (మన రుచులు) — Complete Database Schema
-- Version: 1.0.0 | Phase 1
-- Run this in your Supabase SQL Editor
-- =============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================
-- ENUMS
-- =============================================================

CREATE TYPE user_role AS ENUM ('customer', 'restaurant_owner', 'rider', 'admin', 'support_agent');
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE order_status AS ENUM ('placed', 'accepted', 'preparing', 'ready_for_pickup', 'picked_up', 'delivered', 'cancelled');
CREATE TYPE rider_availability AS ENUM ('online', 'offline', 'busy');
CREATE TYPE vehicle_type AS ENUM ('bicycle', 'motorcycle', 'auto');
CREATE TYPE discount_type AS ENUM ('percentage', 'flat');
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved');
CREATE TYPE rider_request_status AS ENUM ('pending', 'accepted', 'rejected', 'expired');
CREATE TYPE ledger_entry_type AS ENUM ('collection', 'deposit', 'adjustment');
CREATE TYPE payout_status AS ENUM ('pending', 'processing', 'completed');

-- =============================================================
-- 1. ZONES
-- =============================================================
CREATE TABLE zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  name_te TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  base_delivery_fee NUMERIC(8,2) NOT NULL DEFAULT 20.00,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================
-- 2. PROFILES
-- =============================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT,
  role user_role NOT NULL DEFAULT 'customer',
  avatar_url TEXT,
  language TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'te')),
  referral_code TEXT UNIQUE,
  referred_by UUID REFERENCES profiles(id),
  is_blocked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================
-- 3. ADDRESSES
-- =============================================================
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  zone_id UUID NOT NULL REFERENCES zones(id),
  label TEXT NOT NULL DEFAULT 'Home',
  house_no TEXT NOT NULL DEFAULT '',
  street TEXT NOT NULL DEFAULT '',
  landmark TEXT NOT NULL DEFAULT '',
  full_address TEXT GENERATED ALWAYS AS (
    CASE
      WHEN house_no != '' AND street != '' AND landmark != ''
        THEN house_no || ', ' || street || ', Near ' || landmark
      WHEN house_no != '' AND street != ''
        THEN house_no || ', ' || street
      ELSE house_no || ' ' || street || ' ' || landmark
    END
  ) STORED,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================
-- 4. RESTAURANTS
-- =============================================================
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_te TEXT NOT NULL DEFAULT '',
  slug TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  description TEXT DEFAULT '',
  description_te TEXT DEFAULT '',
  fssai_number TEXT DEFAULT '',
  zone_id UUID NOT NULL REFERENCES zones(id),
  address_text TEXT NOT NULL DEFAULT '',
  landmark TEXT DEFAULT '',
  cover_photo_url TEXT,
  logo_url TEXT,
  is_open BOOLEAN NOT NULL DEFAULT false,
  is_holiday BOOLEAN NOT NULL DEFAULT false,
  opening_time TIME DEFAULT '08:00',
  closing_time TIME DEFAULT '22:00',
  avg_prep_time INTEGER NOT NULL DEFAULT 25,
  min_order_amount NUMERIC(8,2) NOT NULL DEFAULT 0,
  commission_rate NUMERIC(5,2) NOT NULL DEFAULT 10.00,
  rating NUMERIC(3,2) NOT NULL DEFAULT 0,
  total_ratings INTEGER NOT NULL DEFAULT 0,
  approval_status approval_status NOT NULL DEFAULT 'pending',
  rejection_reason TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================
-- 5. CATEGORIES
-- =============================================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_te TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================
-- 6. MENU_ITEMS
-- =============================================================
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_te TEXT NOT NULL DEFAULT '',
  description TEXT DEFAULT '',
  description_te TEXT DEFAULT '',
  price NUMERIC(8,2) NOT NULL,
  photo_url TEXT,
  is_veg BOOLEAN NOT NULL DEFAULT true,
  is_available BOOLEAN NOT NULL DEFAULT true,
  is_bestseller BOOLEAN NOT NULL DEFAULT false,
  prep_time INTEGER DEFAULT 15,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================
-- 7. ITEM_VARIANTS
-- =============================================================
CREATE TABLE item_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_te TEXT NOT NULL DEFAULT '',
  price NUMERIC(8,2) NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- =============================================================
-- 8. ADDONS
-- =============================================================
CREATE TABLE addons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_te TEXT NOT NULL DEFAULT '',
  price NUMERIC(8,2) NOT NULL DEFAULT 0,
  is_available BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- =============================================================
-- 9. CARTS
-- =============================================================
CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE SET NULL,
  special_instructions TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES item_variants(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  item_notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE cart_item_addons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_item_id UUID NOT NULL REFERENCES cart_items(id) ON DELETE CASCADE,
  addon_id UUID NOT NULL REFERENCES addons(id) ON DELETE CASCADE
);

-- =============================================================
-- 10. ORDERS
-- =============================================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_code TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES profiles(id),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id),
  rider_id UUID REFERENCES profiles(id),
  address_id UUID REFERENCES addresses(id),
  zone_id UUID NOT NULL REFERENCES zones(id),
  status order_status NOT NULL DEFAULT 'placed',
  items_total NUMERIC(10,2) NOT NULL DEFAULT 0,
  delivery_fee NUMERIC(8,2) NOT NULL DEFAULT 0,
  discount_amount NUMERIC(8,2) NOT NULL DEFAULT 0,
  tax_amount NUMERIC(8,2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  commission_amount NUMERIC(8,2) NOT NULL DEFAULT 0,
  restaurant_payout NUMERIC(10,2) NOT NULL DEFAULT 0,
  coupon_id UUID REFERENCES coupons(id),
  special_instructions TEXT DEFAULT '',
  delivery_otp TEXT NOT NULL DEFAULT lpad(floor(random() * 10000)::text, 4, '0'),
  pickup_code TEXT NOT NULL DEFAULT lpad(floor(random() * 10000)::text, 4, '0'),
  prep_time INTEGER,
  rejection_reason TEXT,
  cancelled_by UUID REFERENCES profiles(id),
  cancel_reason TEXT,
  delivery_address_snapshot JSONB,
  placed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  accepted_at TIMESTAMPTZ,
  preparing_at TIMESTAMPTZ,
  ready_at TIMESTAMPTZ,
  picked_up_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================
-- 11. ORDER_ITEMS
-- =============================================================
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES menu_items(id),
  item_name TEXT NOT NULL,
  item_name_te TEXT DEFAULT '',
  variant_name TEXT,
  variant_price NUMERIC(8,2),
  base_price NUMERIC(8,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  total_price NUMERIC(8,2) NOT NULL,
  is_veg BOOLEAN NOT NULL DEFAULT true,
  item_notes TEXT DEFAULT '',
  addons_snapshot JSONB DEFAULT '[]'
);

-- =============================================================
-- 12. ORDER_STATUS_LOG
-- =============================================================
CREATE TABLE order_status_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status order_status NOT NULL,
  changed_by UUID REFERENCES profiles(id),
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================
-- 13. RIDERS
-- =============================================================
CREATE TABLE riders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  vehicle_type vehicle_type NOT NULL DEFAULT 'motorcycle',
  vehicle_number TEXT DEFAULT '',
  id_document_url TEXT,
  id_document_type TEXT DEFAULT 'Aadhaar',
  approval_status approval_status NOT NULL DEFAULT 'pending',
  rejection_reason TEXT,
  rating NUMERIC(3,2) NOT NULL DEFAULT 0,
  total_ratings INTEGER NOT NULL DEFAULT 0,
  total_deliveries INTEGER NOT NULL DEFAULT 0,
  max_cod_limit NUMERIC(10,2) NOT NULL DEFAULT 5000.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================
-- 14. RIDER_STATUS
-- =============================================================
CREATE TABLE rider_status (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rider_id UUID UNIQUE NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
  status rider_availability NOT NULL DEFAULT 'offline',
  current_zone_id UUID REFERENCES zones(id),
  active_order_id UUID REFERENCES orders(id),
  last_ping TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================
-- 15. RIDER_REQUESTS
-- =============================================================
CREATE TABLE rider_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  rider_id UUID NOT NULL REFERENCES riders(id),
  status rider_request_status NOT NULL DEFAULT 'pending',
  sequence_rank INTEGER NOT NULL DEFAULT 1,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '30 seconds'),
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================
-- 16. COUPONS
-- =============================================================
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  description TEXT DEFAULT '',
  discount_type discount_type NOT NULL DEFAULT 'percentage',
  discount_value NUMERIC(8,2) NOT NULL,
  min_order_amount NUMERIC(8,2) NOT NULL DEFAULT 0,
  max_discount NUMERIC(8,2),
  max_uses INTEGER DEFAULT NULL,
  used_count INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  valid_from TIMESTAMPTZ NOT NULL DEFAULT now(),
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================
-- 17. OFFERS
-- =============================================================
CREATE TABLE offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  title_te TEXT DEFAULT '',
  description TEXT DEFAULT '',
  discount_type discount_type NOT NULL DEFAULT 'percentage',
  discount_value NUMERIC(8,2) NOT NULL,
  min_order_amount NUMERIC(8,2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  valid_from TIMESTAMPTZ NOT NULL DEFAULT now(),
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================
-- 18. REVIEWS
-- =============================================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id),
  user_id UUID NOT NULL REFERENCES profiles(id),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id),
  rider_id UUID REFERENCES riders(id),
  restaurant_rating INTEGER CHECK (restaurant_rating BETWEEN 1 AND 5),
  delivery_rating INTEGER CHECK (delivery_rating BETWEEN 1 AND 5),
  food_rating INTEGER CHECK (food_rating BETWEEN 1 AND 5),
  comment TEXT DEFAULT '',
  restaurant_reply TEXT,
  is_moderated BOOLEAN NOT NULL DEFAULT false,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================
-- 19. FAVORITES
-- =============================================================
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, restaurant_id),
  CHECK (restaurant_id IS NOT NULL OR menu_item_id IS NOT NULL)
);

-- =============================================================
-- 20. NOTIFICATIONS
-- =============================================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  title_te TEXT DEFAULT '',
  body TEXT NOT NULL,
  body_te TEXT DEFAULT '',
  type TEXT NOT NULL DEFAULT 'general',
  data JSONB DEFAULT '{}',
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================
-- 21. PUSH_SUBSCRIPTIONS
-- =============================================================
CREATE TABLE push_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth_key TEXT NOT NULL,
  user_agent TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, endpoint)
);

-- =============================================================
-- 22. SUPPORT_TICKETS
-- =============================================================
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  order_id UUID REFERENCES orders(id),
  subject TEXT NOT NULL,
  status ticket_status NOT NULL DEFAULT 'open',
  assigned_to UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE ticket_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================
-- 23. CASH_LEDGER
-- =============================================================
CREATE TABLE cash_ledger (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rider_id UUID NOT NULL REFERENCES riders(id),
  order_id UUID REFERENCES orders(id),
  entry_type ledger_entry_type NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  running_balance NUMERIC(10,2) NOT NULL DEFAULT 0,
  notes TEXT DEFAULT '',
  recorded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================
-- 24. PAYOUT_LEDGER
-- =============================================================
CREATE TABLE payout_ledger (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id),
  order_id UUID REFERENCES orders(id),
  gross_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  commission_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  net_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  payout_status payout_status NOT NULL DEFAULT 'pending',
  notes TEXT DEFAULT '',
  settled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================
-- 25. BANNERS
-- =============================================================
CREATE TABLE banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  title_te TEXT DEFAULT '',
  image_url TEXT NOT NULL,
  link_url TEXT DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  zone_id UUID REFERENCES zones(id),
  starts_at TIMESTAMPTZ DEFAULT now(),
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================
-- 26. APP_SETTINGS
-- =============================================================
CREATE TABLE app_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================
-- INDEXES
-- =============================================================

CREATE INDEX idx_profiles_phone ON profiles(phone);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_addresses_user ON addresses(user_id);
CREATE INDEX idx_restaurants_zone ON restaurants(zone_id);
CREATE INDEX idx_restaurants_slug ON restaurants(slug);
CREATE INDEX idx_restaurants_approval ON restaurants(approval_status);
CREATE INDEX idx_categories_restaurant ON categories(restaurant_id);
CREATE INDEX idx_menu_items_restaurant ON menu_items(restaurant_id);
CREATE INDEX idx_menu_items_category ON menu_items(category_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_restaurant ON orders(restaurant_id);
CREATE INDEX idx_orders_rider ON orders(rider_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_code ON orders(order_code);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_status_log_order ON order_status_log(order_id);
CREATE INDEX idx_rider_status_zone ON rider_status(current_zone_id);
CREATE INDEX idx_rider_requests_order ON rider_requests(order_id);
CREATE INDEX idx_rider_requests_rider ON rider_requests(rider_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_reviews_restaurant ON reviews(restaurant_id);
CREATE INDEX idx_cash_ledger_rider ON cash_ledger(rider_id);
CREATE INDEX idx_payout_ledger_restaurant ON payout_ledger(restaurant_id);

-- =============================================================
-- FUNCTIONS
-- =============================================================

-- Generate unique order code like MR-0001
CREATE OR REPLACE FUNCTION generate_order_code()
RETURNS TRIGGER AS $$
DECLARE
  next_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_code FROM 4) AS INTEGER)), 0) + 1
    INTO next_num
    FROM orders;
  NEW.order_code := 'MR-' || lpad(next_num::text, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generate_order_code
  BEFORE INSERT ON orders
  FOR EACH ROW
  WHEN (NEW.order_code IS NULL OR NEW.order_code = '')
  EXECUTE FUNCTION generate_order_code();

-- Auto-log order status changes
CREATE OR REPLACE FUNCTION log_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO order_status_log (order_id, status, changed_by)
    VALUES (NEW.id, NEW.status, NEW.rider_id);

    -- Update timestamp columns based on status
    CASE NEW.status
      WHEN 'accepted' THEN NEW.accepted_at := now();
      WHEN 'preparing' THEN NEW.preparing_at := now();
      WHEN 'ready_for_pickup' THEN NEW.ready_at := now();
      WHEN 'picked_up' THEN NEW.picked_up_at := now();
      WHEN 'delivered' THEN NEW.delivered_at := now();
      WHEN 'cancelled' THEN NEW.cancelled_at := now();
      ELSE NULL;
    END CASE;
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_order_status_log
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION log_order_status_change();

-- Atomic rider assignment: first rider to accept wins
CREATE OR REPLACE FUNCTION accept_ride_request(
  p_request_id UUID,
  p_rider_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  v_order_id UUID;
  v_updated INTEGER;
BEGIN
  -- Try to claim the request atomically
  UPDATE rider_requests
  SET status = 'accepted', responded_at = now()
  WHERE id = p_request_id
    AND rider_id = p_rider_id
    AND status = 'pending'
    AND expires_at > now();

  GET DIAGNOSTICS v_updated = ROW_COUNT;

  IF v_updated = 0 THEN
    RETURN false; -- Already taken or expired
  END IF;

  -- Get the order
  SELECT order_id INTO v_order_id FROM rider_requests WHERE id = p_request_id;

  -- Assign rider to order
  UPDATE orders SET rider_id = (SELECT user_id FROM riders WHERE id = p_rider_id)
  WHERE id = v_order_id AND rider_id IS NULL;

  GET DIAGNOSTICS v_updated = ROW_COUNT;

  IF v_updated = 0 THEN
    -- Another rider already got it, rollback our request
    UPDATE rider_requests SET status = 'expired' WHERE id = p_request_id;
    RETURN false;
  END IF;

  -- Expire all other pending requests for this order
  UPDATE rider_requests
  SET status = 'expired', responded_at = now()
  WHERE order_id = v_order_id AND id != p_request_id AND status = 'pending';

  -- Mark rider as busy
  UPDATE rider_status
  SET status = 'busy', active_order_id = v_order_id, updated_at = now()
  WHERE rider_id = p_rider_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Auto-update restaurant rating on new review
CREATE OR REPLACE FUNCTION update_restaurant_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE restaurants
  SET rating = (
    SELECT COALESCE(AVG(restaurant_rating), 0)
    FROM reviews
    WHERE restaurant_id = NEW.restaurant_id AND is_visible = true
  ),
  total_ratings = (
    SELECT COUNT(*)
    FROM reviews
    WHERE restaurant_id = NEW.restaurant_id AND is_visible = true
  ),
  updated_at = now()
  WHERE id = NEW.restaurant_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_restaurant_rating
  AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_restaurant_rating();

-- Updated_at auto-updater
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to relevant tables
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY[
    'zones', 'profiles', 'restaurants', 'menu_items',
    'carts', 'riders', 'rider_status', 'reviews',
    'support_tickets'
  ]) LOOP
    EXECUTE format(
      'CREATE TRIGGER trg_updated_at_%s BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at()',
      tbl, tbl
    );
  END LOOP;
END $$;

-- =============================================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_item_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE riders ENABLE ROW LEVEL SECURITY;
ALTER TABLE rider_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE rider_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE payout_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Helper: check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('admin', 'support_agent')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper: check if user owns restaurant
CREATE OR REPLACE FUNCTION owns_restaurant(restaurant_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM restaurants
    WHERE id = restaurant_uuid AND owner_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PROFILES
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (id = auth.uid() OR is_admin());
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Service role can insert profiles" ON profiles FOR INSERT WITH CHECK (true);

-- ADDRESSES
CREATE POLICY "Users manage own addresses" ON addresses FOR ALL USING (user_id = auth.uid());

-- ZONES (public read)
CREATE POLICY "Anyone can read zones" ON zones FOR SELECT USING (true);
CREATE POLICY "Admins manage zones" ON zones FOR ALL USING (is_admin());

-- RESTAURANTS (public read for approved, owner manage, admin manage)
CREATE POLICY "Anyone can read approved restaurants" ON restaurants FOR SELECT USING (approval_status = 'approved' OR owner_id = auth.uid() OR is_admin());
CREATE POLICY "Owners can update own restaurant" ON restaurants FOR UPDATE USING (owner_id = auth.uid() OR is_admin());
CREATE POLICY "Anyone can apply as restaurant" ON restaurants FOR INSERT WITH CHECK (owner_id = auth.uid());

-- CATEGORIES (public read, owner/admin write)
CREATE POLICY "Anyone can read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Restaurant owners manage categories" ON categories FOR ALL USING (owns_restaurant(restaurant_id) OR is_admin());

-- MENU_ITEMS (public read, owner/admin write)
CREATE POLICY "Anyone can read menu items" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Restaurant owners manage items" ON menu_items FOR ALL USING (owns_restaurant(restaurant_id) OR is_admin());

-- ITEM_VARIANTS (public read)
CREATE POLICY "Anyone can read variants" ON item_variants FOR SELECT USING (true);
CREATE POLICY "Owners manage variants" ON item_variants FOR ALL USING (
  EXISTS (SELECT 1 FROM menu_items mi WHERE mi.id = menu_item_id AND owns_restaurant(mi.restaurant_id)) OR is_admin()
);

-- ADDONS (public read)
CREATE POLICY "Anyone can read addons" ON addons FOR SELECT USING (true);
CREATE POLICY "Owners manage addons" ON addons FOR ALL USING (
  EXISTS (SELECT 1 FROM menu_items mi WHERE mi.id = menu_item_id AND owns_restaurant(mi.restaurant_id)) OR is_admin()
);

-- CARTS
CREATE POLICY "Users manage own cart" ON carts FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users manage own cart items" ON cart_items FOR ALL USING (
  EXISTS (SELECT 1 FROM carts c WHERE c.id = cart_id AND c.user_id = auth.uid())
);
CREATE POLICY "Users manage own cart addons" ON cart_item_addons FOR ALL USING (
  EXISTS (SELECT 1 FROM cart_items ci JOIN carts c ON c.id = ci.cart_id WHERE ci.id = cart_item_id AND c.user_id = auth.uid())
);

-- ORDERS
CREATE POLICY "Users see own orders" ON orders FOR SELECT USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM restaurants r WHERE r.id = restaurant_id AND r.owner_id = auth.uid())
  OR rider_id = auth.uid()
  OR is_admin()
);
CREATE POLICY "Users create orders" ON orders FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Authorized users update orders" ON orders FOR UPDATE USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM restaurants r WHERE r.id = restaurant_id AND r.owner_id = auth.uid())
  OR rider_id = auth.uid()
  OR is_admin()
);

-- ORDER_ITEMS
CREATE POLICY "Order participants see items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders o WHERE o.id = order_id AND (
    o.user_id = auth.uid() OR o.rider_id = auth.uid()
    OR EXISTS (SELECT 1 FROM restaurants r WHERE r.id = o.restaurant_id AND r.owner_id = auth.uid())
    OR is_admin()
  ))
);
CREATE POLICY "Users create order items" ON order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM orders o WHERE o.id = order_id AND o.user_id = auth.uid())
);

-- ORDER_STATUS_LOG
CREATE POLICY "Order participants see logs" ON order_status_log FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders o WHERE o.id = order_id AND (
    o.user_id = auth.uid() OR o.rider_id = auth.uid()
    OR EXISTS (SELECT 1 FROM restaurants r WHERE r.id = o.restaurant_id AND r.owner_id = auth.uid())
    OR is_admin()
  ))
);

-- RIDERS
CREATE POLICY "Riders see own record" ON riders FOR SELECT USING (user_id = auth.uid() OR is_admin());
CREATE POLICY "Riders update own record" ON riders FOR UPDATE USING (user_id = auth.uid() OR is_admin());
CREATE POLICY "Anyone can apply as rider" ON riders FOR INSERT WITH CHECK (user_id = auth.uid());

-- RIDER_STATUS
CREATE POLICY "Rider manages own status" ON rider_status FOR ALL USING (
  EXISTS (SELECT 1 FROM riders r WHERE r.id = rider_id AND r.user_id = auth.uid()) OR is_admin()
);

-- RIDER_REQUESTS
CREATE POLICY "Rider sees own requests" ON rider_requests FOR SELECT USING (
  EXISTS (SELECT 1 FROM riders r WHERE r.id = rider_id AND r.user_id = auth.uid()) OR is_admin()
);
CREATE POLICY "System manages requests" ON rider_requests FOR ALL USING (is_admin());

-- COUPONS (public read active, admin manage)
CREATE POLICY "Anyone reads active coupons" ON coupons FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "Admins manage coupons" ON coupons FOR ALL USING (is_admin());

-- OFFERS (public read active)
CREATE POLICY "Anyone reads active offers" ON offers FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "Restaurant owners manage offers" ON offers FOR ALL USING (owns_restaurant(restaurant_id) OR is_admin());

-- REVIEWS
CREATE POLICY "Anyone reads visible reviews" ON reviews FOR SELECT USING (is_visible = true OR user_id = auth.uid() OR is_admin());
CREATE POLICY "Users create reviews" ON reviews FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users and admins update reviews" ON reviews FOR UPDATE USING (user_id = auth.uid() OR is_admin());

-- FAVORITES
CREATE POLICY "Users manage own favorites" ON favorites FOR ALL USING (user_id = auth.uid());

-- NOTIFICATIONS
CREATE POLICY "Users see own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "System creates notifications" ON notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users update own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());

-- PUSH_SUBSCRIPTIONS
CREATE POLICY "Users manage own subscriptions" ON push_subscriptions FOR ALL USING (user_id = auth.uid());

-- SUPPORT_TICKETS
CREATE POLICY "Users manage own tickets" ON support_tickets FOR ALL USING (user_id = auth.uid() OR is_admin());
CREATE POLICY "Ticket participants see messages" ON ticket_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM support_tickets st WHERE st.id = ticket_id AND (st.user_id = auth.uid() OR is_admin()))
);
CREATE POLICY "Ticket participants send messages" ON ticket_messages FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM support_tickets st WHERE st.id = ticket_id AND (st.user_id = auth.uid() OR is_admin()))
);

-- CASH_LEDGER (rider sees own, admin sees all)
CREATE POLICY "Riders see own ledger" ON cash_ledger FOR SELECT USING (
  EXISTS (SELECT 1 FROM riders r WHERE r.id = rider_id AND r.user_id = auth.uid()) OR is_admin()
);
CREATE POLICY "Admins manage cash ledger" ON cash_ledger FOR ALL USING (is_admin());

-- PAYOUT_LEDGER (owner sees own restaurant, admin sees all)
CREATE POLICY "Owners see own payouts" ON payout_ledger FOR SELECT USING (
  owns_restaurant(restaurant_id) OR is_admin()
);
CREATE POLICY "Admins manage payout ledger" ON payout_ledger FOR ALL USING (is_admin());

-- BANNERS (public read active)
CREATE POLICY "Anyone reads active banners" ON banners FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "Admins manage banners" ON banners FOR ALL USING (is_admin());

-- APP_SETTINGS (public read, admin write)
CREATE POLICY "Anyone reads settings" ON app_settings FOR SELECT USING (true);
CREATE POLICY "Admins manage settings" ON app_settings FOR ALL USING (is_admin());

-- =============================================================
-- SEED DATA
-- =============================================================

-- Zones
INSERT INTO zones (id, name, name_te, slug, base_delivery_fee) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-111111111111', 'Gandhi Nagar', 'గాంధీ నగర్', 'gandhi-nagar', 20.00),
  ('a1b2c3d4-e5f6-7890-abcd-222222222222', 'Collectorate Road', 'కలెక్టరేట్ రోడ్', 'collectorate-road', 25.00),
  ('a1b2c3d4-e5f6-7890-abcd-333333333333', 'RTC Complex', 'ఆర్టీసీ కాంప్లెక్స్', 'rtc-complex', 30.00);

-- App Settings
INSERT INTO app_settings (key, value, description) VALUES
  ('default_commission', '10', 'Default restaurant commission percentage'),
  ('maintenance_mode', 'false', 'Global maintenance mode toggle'),
  ('contact_phone', '+919876543210', 'Platform support phone number'),
  ('referral_reward', '50', 'Referral reward amount in INR'),
  ('min_rider_payout', '500', 'Minimum amount for rider cash deposit'),
  ('platform_name', 'Mana Ruchulu', 'Platform display name'),
  ('platform_name_te', 'మన రుచులు', 'Platform display name in Telugu');

-- Banners
INSERT INTO banners (title, title_te, image_url, link_url, sort_order) VALUES
  ('Welcome to Mana Ruchulu!', 'మన రుచులుకు స్వాగతం!', '/images/banner-welcome.jpg', '/app', 1),
  ('Free Delivery on First Order', 'మొదటి ఆర్డర్‌పై ఉచిత డెలివరీ', '/images/banner-free-delivery.jpg', '/app/offers', 2),
  ('Try Our Biryani Specials', 'మా బిర్యానీ స్పెషల్స్ ట్రై చేయండి', '/images/banner-biryani.jpg', '/app', 3);

-- Coupons
INSERT INTO coupons (code, description, discount_type, discount_value, min_order_amount, max_discount) VALUES
  ('MANA10', '10% off on your order', 'percentage', 10, 150, 50),
  ('FIRST50', '₹50 off on first order', 'flat', 50, 100, 50),
  ('BIRYANI20', '20% off on Biryani orders', 'percentage', 20, 200, 100);
