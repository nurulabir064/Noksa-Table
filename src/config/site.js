// Public restaurant settings for one client deployment.
// Select a profile at build time with VITE_RESTAURANT_ID.
// Never put API keys, database credentials, or private customer data here.

const restaurantProfiles = {
  'noksha-table': {
    id: 'noksha-table',
    brandName: 'NOKSHA TABLE',
    brandMark: 'ন',
    descriptor: 'MULTI-CUISINE DINING HOUSE',
    tagline: 'A world of flavour, thoughtfully brought to your table.',
    siteUrl: 'https://noksa-table.vercel.app',
    locationLabel: 'Dhaka, Bangladesh · Concept location',
    openingHoursLabel: 'Opening hours not yet specified',
    publicPhone: '',
    whatsappNumber: '+8801304302201',
    publicEmail: '',
    whatsappMessage: 'Hello, I found NOKSHA TABLE online and would like to know more about the menu.',
    mapUrl: '',
    instagramUrl: '',
    contentMode: 'demo',
    features: {
      menu: true,
      whatsappOrdering: true,
      gallery: true,
      story: true,
      contact: true,
      reservationRequests: false,
    },
  },
}

const requestedRestaurantId = import.meta.env?.VITE_RESTAURANT_ID || 'noksha-table'
const selectedProfile = restaurantProfiles[requestedRestaurantId]

if (!selectedProfile) {
  throw new Error(
    'Unknown VITE_RESTAURANT_ID "' + requestedRestaurantId +
    '". Add a restaurant profile in src/config/site.js before building.',
  )
}

if (!['demo', 'live'].includes(selectedProfile.contentMode)) {
  throw new Error('Restaurant contentMode must be either "demo" or "live".')
}

export const siteConfig = Object.freeze({
  ...selectedProfile,
  features: Object.freeze({ ...selectedProfile.features }),
})

export const isDemoContent = siteConfig.contentMode === 'demo'
