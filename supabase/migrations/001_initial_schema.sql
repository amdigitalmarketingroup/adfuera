-- Pantallas MX — Initial Schema
-- Marketplace de publicidad exterior en México

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- Cities
CREATE TABLE cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  latitude DECIMAL(10,7),
  longitude DECIMAL(10,7),
  screens_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Media Owners (screen providers)
CREATE TABLE media_owners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  years_experience INT,
  cities_operating TEXT[] DEFAULT '{}',
  address TEXT,
  rfc TEXT,
  subscription_plan TEXT DEFAULT 'free' CHECK (subscription_plan IN ('free','basic','standard','pro')),
  subscription_status TEXT DEFAULT 'trial' CHECK (subscription_status IN ('active','trial','past_due','cancelled')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  trial_ends_at TIMESTAMPTZ,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Screens (advertising spaces)
CREATE TABLE screens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  media_owner_id UUID REFERENCES media_owners(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  format_type TEXT NOT NULL CHECK (format_type IN ('billboard','digital','mupi','indoor_screen','wall','canvas','rooftop','other')),
  latitude DECIMAL(10,7) NOT NULL,
  longitude DECIMAL(10,7) NOT NULL,
  address TEXT,
  city TEXT NOT NULL,
  zone_neighborhood TEXT,
  dimensions_width DECIMAL(5,2),
  dimensions_height DECIMAL(5,2),
  material TEXT CHECK (material IN ('canvas','vinyl','led','lcd','backlight','other')),
  illumination TEXT CHECK (illumination IN ('none','front','backlight','led_own')),
  orientation TEXT,
  faces_count INT DEFAULT 1,
  price_monthly DECIMAL(10,2),
  price_range_min DECIMAL(10,2),
  price_range_max DECIMAL(10,2),
  min_contract_period TEXT DEFAULT 'negotiable' CHECK (min_contract_period IN ('1_month','3_months','6_months','1_year','negotiable')),
  availability_status TEXT DEFAULT 'available' CHECK (availability_status IN ('available','occupied','upcoming')),
  availability_date DATE,
  estimated_traffic INT,
  traffic_unit TEXT CHECK (traffic_unit IN ('vehicles_day','people_day')),
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  is_approved BOOLEAN DEFAULT FALSE,
  views_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Screen Photos
CREATE TABLE screen_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  screen_id UUID REFERENCES screens(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  position INT DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads (advertiser inquiries)
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  screen_id UUID REFERENCES screens(id) ON DELETE SET NULL,
  media_owner_id UUID REFERENCES media_owners(id) ON DELETE CASCADE,
  advertiser_name TEXT NOT NULL,
  advertiser_company TEXT,
  advertiser_phone TEXT NOT NULL,
  advertiser_email TEXT NOT NULL,
  message TEXT,
  desired_start_date DATE,
  desired_end_date DATE,
  estimated_budget DECIMAL(10,2),
  status TEXT DEFAULT 'new' CHECK (status IN ('new','read','contacted','negotiating','won','lost')),
  internal_notes TEXT,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Page Views (analytics)
CREATE TABLE page_views (
  id BIGSERIAL PRIMARY KEY,
  screen_id UUID REFERENCES screens(id) ON DELETE SET NULL,
  page_type TEXT NOT NULL CHECK (page_type IN ('home','search','screen_detail','owner_profile')),
  city TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_screens_city ON screens(city);
CREATE INDEX idx_screens_format ON screens(format_type);
CREATE INDEX idx_screens_availability ON screens(availability_status);
CREATE INDEX idx_screens_location ON screens(latitude, longitude);
CREATE INDEX idx_screens_media_owner ON screens(media_owner_id);
CREATE INDEX idx_screens_slug ON screens(slug);
CREATE INDEX idx_screens_price ON screens(price_range_min, price_range_max);
CREATE INDEX idx_leads_media_owner ON leads(media_owner_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created ON leads(created_at DESC);
CREATE INDEX idx_page_views_screen ON page_views(screen_id);
CREATE INDEX idx_media_owners_slug ON media_owners(slug);
CREATE INDEX idx_media_owners_user ON media_owners(user_id);
CREATE INDEX idx_cities_slug ON cities(slug);

-- ============================================
-- RLS POLICIES
-- ============================================

-- Cities: public read
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read cities" ON cities FOR SELECT USING (true);

-- Media Owners: public read, owner manages own
ALTER TABLE media_owners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read media owners" ON media_owners FOR SELECT USING (true);
CREATE POLICY "Owner updates own" ON media_owners FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owner inserts own" ON media_owners FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Screens: public read active+approved, owner manages own
ALTER TABLE screens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active screens" ON screens FOR SELECT USING (is_active = true AND is_approved = true);
CREATE POLICY "Owner manages own screens" ON screens FOR ALL USING (
  media_owner_id IN (SELECT id FROM media_owners WHERE user_id = auth.uid())
);

-- Screen Photos: public read, owner manages via screen ownership
ALTER TABLE screen_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read photos" ON screen_photos FOR SELECT USING (true);
CREATE POLICY "Owner manages photos" ON screen_photos FOR ALL USING (
  screen_id IN (SELECT id FROM screens WHERE media_owner_id IN (SELECT id FROM media_owners WHERE user_id = auth.uid()))
);

-- Leads: anyone creates, owner views/updates own
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone creates leads" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Owner views own leads" ON leads FOR SELECT USING (
  media_owner_id IN (SELECT id FROM media_owners WHERE user_id = auth.uid())
);
CREATE POLICY "Owner updates own leads" ON leads FOR UPDATE USING (
  media_owner_id IN (SELECT id FROM media_owners WHERE user_id = auth.uid())
);

-- Page Views: anyone inserts
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone inserts views" ON page_views FOR INSERT WITH CHECK (true);

-- ============================================
-- SEED DATA
-- ============================================

INSERT INTO cities (name, state, slug, latitude, longitude, is_active) VALUES
  ('Mexicali', 'Baja California', 'mexicali', 32.6245, -115.4523, true),
  ('Tijuana', 'Baja California', 'tijuana', 32.5149, -117.0382, true),
  ('Ensenada', 'Baja California', 'ensenada', 31.8667, -116.5964, false),
  ('Rosarito', 'Baja California', 'rosarito', 32.3659, -117.0617, false);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_media_owners_updated
  BEFORE UPDATE ON media_owners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_screens_updated
  BEFORE UPDATE ON screens
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_leads_updated
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Update city screens count
CREATE OR REPLACE FUNCTION update_city_screens_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE cities SET screens_count = (
    SELECT COUNT(*) FROM screens WHERE city = NEW.city AND is_active = true AND is_approved = true
  ) WHERE name = NEW.city;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_screens_city_count
  AFTER INSERT OR UPDATE OR DELETE ON screens
  FOR EACH ROW EXECUTE FUNCTION update_city_screens_count();
