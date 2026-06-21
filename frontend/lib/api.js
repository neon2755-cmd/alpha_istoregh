// frontend/lib/api.js
import axios from 'axios';
import siteConfig from '../config';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: siteConfig.apiEndpoint || '/api', // Use API endpoint from config or default to /api
  headers: {
    'Content-Type': 'application/json',
    // Authorization header will be set dynamically if token exists
  },
  withCredentials: true, // Important for sending cookies (like JWT)
});

// Add a request interceptor to include JWT token if available
apiClient.interceptors.request.use(
  (config) => {
    // Try to get the token from localStorage or cookies
    // Note: For Next.js, accessing localStorage directly might require checks for 'window'
    // or it might be better to pass the token via headers from the server-side or context.
    // Here's a basic example assuming it might be available.
    let token = null;
    if (typeof window !== 'undefined') {
       token = localStorage.getItem('authToken');
    }

    if (token) {
      // Ensure the Authorization header is correctly formatted
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor for handling global errors or token refresh
apiClient.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data; // Return only the data part of the response
  },
  (error) => {
    // ANY status codes that falls outside the range of 2xx cause this function to trigger
    // Handle errors: e.g., redirect to login if 401 Unauthorized
    if (error.response && error.response.status === 401) {
      // Example: Redirect to login page
       if (typeof window !== 'undefined') {
         // localStorage.removeItem('authToken'); // Clear token
         // window.location.href = '/auth/login'; // Redirect to login
       }
       console.error('Authentication error (401). Redirecting to login...');
    } else if (error.response && error.response.status === 403) {
       console.error('Authorization error (403). User may not have required permissions.');
       // Handle forbidden errors specifically if needed
    } else {
        console.error('API Error:', error.response?.data?.message || error.message || 'Unknown error');
    }

    // You might want to return a more specific error object or type
    return Promise.reject(error.response?.data || error.message || 'An unexpected error occurred');
  }
);

// --- API Call Functions ---

// Authentication
export const registerUser = (userData) => apiClient.post('/auth/register', userData);
export const loginUser = (credentials) => apiClient.post('/auth/login', credentials);
export const logoutUser = () => apiClient.post('/auth/logout'); // Usually a POST to invalidate token server-side
export const getMe = () => apiClient.get('/auth/me'); // Get logged-in user info

// Products
export const getProducts = (params) => apiClient.get('/products', { params });
export const getProduct = (id) => apiClient.get(`/products/${id}`);
export const createProduct = (productData) => apiClient.post('/products', productData); // Admin
export const updateProduct = (id, productData) => apiClient.put(`/products/${id}`, productData); // Admin
export const deleteProduct = (id) => apiClient.delete(`/products/${id}`); // Admin
export const uploadProductImages = (formData) => apiClient.post('/upload/images', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
// Orders
export const createOrder = (orderData) => apiClient.post('/orders', orderData);
export const getMyOrders = () => apiClient.get('/orders/my');
export const trackOrder = (orderNumber) => apiClient.get(`/orders/track/${orderNumber}`);
export const getAllOrders = (params) => apiClient.get('/orders', { params }); // Admin
export const updateOrderStatus = (id, status) => apiClient.patch(`/orders/${id}/status`, { status }); // Admin
export const getDashboardStats = () => apiClient.get('/orders/dashboard-stats'); // Admin

// Settings
export const getSettings = () => apiClient.get('/settings');
export const updateSettings = (settingsData) => apiClient.put('/settings', settingsData); // Admin


// Generic fetch - can be used if specific functions aren't listed
export const fetchAPI = (endpoint, method = 'GET', data = null, params = null) => {
  return apiClient({
    url: endpoint,
    method,
    data,
    params,
  });
};

export default {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  createOrder,
  getMyOrders,
  trackOrder,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats,
  getSettings,
  updateSettings,
  fetchAPI,
};

export const authAPI = {
  login: loginUser,
  register: registerUser,
  logout: logoutUser,
  getMe,
};

export const ordersAPI = {
  create: createOrder,
  myOrders: getMyOrders,
  track: trackOrder,
  getAll: getAllOrders,
  updateStatus: updateOrderStatus,
  getStats: getDashboardStats,
};

export const productsAPI = {
  list: getProducts,
  get: getProduct,
  create: createProduct,
  update: updateProduct,
  delete: deleteProduct,
  upload: uploadProductImages,
};

export const settingsAPI = {
  get: getSettings,
  update: updateSettings,
};

export const uploadAPI = {
  images: uploadProductImages,
};