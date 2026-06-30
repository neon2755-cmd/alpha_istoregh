// frontend/config.js
// Single source of truth for site identity and design tokens.

const siteConfig = {
  name: 'AlphaiStore',
  description:
    "Ghana's trusted destination for new, UK-used, and Ghana-used smartphones.",
  apiEndpoint:
    process.env.NEXT_PUBLIC_API_ENDPOINT || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  frontendUrl:
    process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
  whatsappNumber:
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '233000000000',
  themeColor: '#2563EB',

  currency: {
    code: 'GHS',
    symbol: 'GH₵',
    locale: 'en-GH',
  },

  contact: {
    email: 'support@alphai-store.gh',
    phone: '+233 00 000 0000',
    address: '123 Tech Avenue, Accra, Ghana',
  },

  deliveryRegions: [
    'Greater Accra',
    'Ashanti',
    'Western',
    'Eastern',
    'Central',
    'Northern',
    'Volta',
    'Upper East',
    'Upper West',
    'Bono',
  ],

  social: {
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    instagram: 'https://instagram.com',
  },

  colors: {
    primary: {
      DEFAULT: '#2563EB',
      dark: '#1D4ED8',
      50: '#EFF6FF',
      100: '#DBEAFE',
    },
    text: '#0F172A',
    'text-muted': '#475569',
    border: '#E2E8F0',
    surface: '#FFFFFF',
    'surface-muted': '#F8FAFC',
    success: '#16A34A',
    warning: '#D97706',
    danger: '#DC2626',
  },
};

export default siteConfig;