export const FORMAT_TYPES = {
  billboard: { label: 'Espectacular', icon: 'Billboard', color: 'blue' },
  digital: { label: 'Pantalla digital', icon: 'Monitor', color: 'purple' },
  mupi: { label: 'Mupi', icon: 'Square', color: 'green' },
  indoor_screen: { label: 'Pantalla interior', icon: 'Tv', color: 'orange' },
  wall: { label: 'Valla', icon: 'LayoutPanelLeft', color: 'red' },
  canvas: { label: 'Lona', icon: 'Image', color: 'yellow' },
  rooftop: { label: 'Azotea', icon: 'Building', color: 'gray' },
  other: { label: 'Otro', icon: 'MoreHorizontal', color: 'slate' },
} as const

export const AVAILABILITY_STATUS = {
  available: { label: 'Disponible', color: 'green' },
  occupied: { label: 'Ocupado', color: 'red' },
  upcoming: { label: 'Próximamente', color: 'yellow' },
} as const

export const LEAD_STATUS = {
  new: { label: 'Nuevo', color: 'blue' },
  read: { label: 'Leído', color: 'gray' },
  contacted: { label: 'Contactado', color: 'yellow' },
  negotiating: { label: 'En negociación', color: 'orange' },
  won: { label: 'Cerrado (ganado)', color: 'green' },
  lost: { label: 'Cerrado (perdido)', color: 'red' },
} as const

export const SUBSCRIPTION_PLANS = {
  basic: {
    name: 'Básico',
    price: 599,
    annualPrice: 5750,
    currency: 'MXN',
    screens_limit: 3,
    photos_per_screen: 3,
    features: ['Perfil público', 'Recibir leads', 'Estadísticas básicas (30 días)'],
  },
  standard: {
    name: 'Estándar',
    price: 1199,
    annualPrice: 11510,
    currency: 'MXN',
    screens_limit: 15,
    photos_per_screen: 5,
    features: [
      'Todo lo del Básico',
      'Destacado en búsqueda',
      'Estadísticas completas (90 días)',
      'Botón de WhatsApp',
      'Soporte WhatsApp',
    ],
  },
  pro: {
    name: 'Pro',
    price: 2399,
    annualPrice: 23030,
    currency: 'MXN',
    screens_limit: Infinity,
    photos_per_screen: 10,
    features: [
      'Todo lo del Estándar',
      'Pantallas ilimitadas',
      'Prioridad máxima en búsqueda',
      'Estadísticas + exportar (12 meses)',
      'Cotizaciones automáticas',
      'Soporte prioritario',
    ],
  },
} as const

export const CITIES = [
  { name: 'Mexicali', state: 'Baja California', slug: 'mexicali', lat: 32.6245, lng: -115.4523, active: true },
  { name: 'Tijuana', state: 'Baja California', slug: 'tijuana', lat: 32.5149, lng: -117.0382, active: true },
  { name: 'Ensenada', state: 'Baja California', slug: 'ensenada', lat: 31.8667, lng: -116.5964, active: false },
  { name: 'Rosarito', state: 'Baja California', slug: 'rosarito', lat: 32.3659, lng: -117.0617, active: false },
] as const

export type FormatType = keyof typeof FORMAT_TYPES
export type AvailabilityStatus = keyof typeof AVAILABILITY_STATUS
export type LeadStatus = keyof typeof LEAD_STATUS
export type SubscriptionPlan = keyof typeof SUBSCRIPTION_PLANS
