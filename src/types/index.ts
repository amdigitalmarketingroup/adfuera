export interface MediaOwner {
  id: string
  user_id: string
  company_name: string
  slug: string
  description: string | null
  logo_url: string | null
  phone: string | null
  email: string | null
  website: string | null
  years_experience: number | null
  cities_operating: string[]
  address: string | null
  rfc: string | null
  subscription_plan: 'free' | 'basic' | 'standard' | 'pro'
  subscription_status: 'active' | 'trial' | 'past_due' | 'cancelled'
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  trial_ends_at: string | null
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface Screen {
  id: string
  media_owner_id: string
  name: string
  slug: string
  format_type: 'billboard' | 'digital' | 'mupi' | 'indoor_screen' | 'wall' | 'canvas' | 'rooftop' | 'other'
  latitude: number
  longitude: number
  address: string | null
  city: string
  zone_neighborhood: string | null
  dimensions_width: number | null
  dimensions_height: number | null
  material: 'canvas' | 'vinyl' | 'led' | 'lcd' | 'backlight' | 'other' | null
  illumination: 'none' | 'front' | 'backlight' | 'led_own' | null
  orientation: string | null
  faces_count: number
  price_monthly: number | null
  price_range_min: number | null
  price_range_max: number | null
  min_contract_period: '1_month' | '3_months' | '6_months' | '1_year' | 'negotiable'
  availability_status: 'available' | 'occupied' | 'upcoming'
  availability_date: string | null
  estimated_traffic: number | null
  traffic_unit: 'vehicles_day' | 'people_day' | null
  description: string | null
  is_active: boolean
  is_approved: boolean
  views_count: number
  created_at: string
  updated_at: string
  // Joined
  photos?: ScreenPhoto[]
  media_owner?: MediaOwner
}

export interface ScreenPhoto {
  id: string
  screen_id: string
  photo_url: string
  position: number
  is_primary: boolean
  created_at: string
}

export interface Lead {
  id: string
  screen_id: string | null
  media_owner_id: string
  advertiser_name: string
  advertiser_company: string | null
  advertiser_phone: string
  advertiser_email: string
  message: string | null
  desired_start_date: string | null
  desired_end_date: string | null
  estimated_budget: number | null
  status: 'new' | 'read' | 'contacted' | 'negotiating' | 'won' | 'lost'
  internal_notes: string | null
  responded_at: string | null
  created_at: string
  updated_at: string
  // Joined
  screen?: Screen
}

export interface City {
  id: string
  name: string
  state: string
  slug: string
  latitude: number | null
  longitude: number | null
  screens_count: number
  is_active: boolean
}
