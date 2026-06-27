const siteConfig = {
  name: 'Alpha iStore',
  description: "Ghana's #1 Premium Phone Store",
  colors: {
    primary: {
      DEFAULT: '#006989',
      dark: '#004d63',
      light: '#e8f4f8',
    },
  },
  contact: {
    address: 'Adum P.Z, Kumasi, Ghana',
    phone: '+233 575 453 086',
    email: 'info@alphaistore.com',
    whatsappNumber: '233575453086',
  },
  admin: {
    email: 'neon2755@gmail.com',
    password: 'admin123',
  },
  apiEndpoint: process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:5000/api',
};

export default siteConfig;
