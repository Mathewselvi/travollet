import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
console.log('API Base URL:', api.defaults.baseURL);


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized error if needed
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  googleLogin: (credential) => api.post('/auth/google', { token: credential }),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const userAPI = {

  getStaysByCategory: (category, config) => api.get(`/user/stays/${category}`, config),
  getStayDetails: (id) => api.get(`/user/stays/details/${id}`),


  getTransportation: (config) => api.get('/user/transportation', config),
  getTransportationDetails: (id) => api.get(`/user/transportation/details/${id}`),


  getSightseeing: (config) => api.get('/user/sightseeing', config),
  getSightseeingDetails: (id) => api.get(`/user/sightseeing/details/${id}`),


  getDestinations: () => api.get('/user/destinations'),
  getDestination: (id) => api.get(`/user/destinations/${id}`),


  getAirportTransfers: () => api.get('/user/airport-transfers'),


  calculatePrice: (data) => api.post('/user/calculate-price', data),


  createPackage: (packageData) => api.post('/packages', packageData),
  getUserPackages: () => api.get('/packages/user'),
  getPackage: (id) => api.get(`/packages/${id}`),

};

export const tourPackageAPI = {
  getTourPackages: (params) => api.get('/tour-packages', { params }),
  getTourPackage: (id) => api.get(`/tour-packages/${id}`),
  bookTourPackage: (data) => api.post(`/tour-packages/${data.packageId}/book`, data),
};

export const chatAPI = {
  getMyHistory: () => api.get('/chat/my-history'),
  getConversations: () => api.get('/chat/conversations'),
  getMessages: (conversationId) => api.get(`/chat/conversations/${conversationId}/messages`),
  sendMessage: (conversationId, content) => api.post(`/chat/conversations/${conversationId}/messages`, { content }),
  startConversation: () => api.post('/chat/conversations'),
};

const apiUrl = import.meta.env.VITE_API_URL || '/api';
export const SOCKET_URL = apiUrl.startsWith('http') ? apiUrl.replace('/api', '') : '/';

export const packageAPI = {
  createPackage: (packageData) => api.post('/packages/create', packageData),
  getUserPackages: () => api.get('/packages/my-packages'),
  getPackage: (id) => api.get(`/packages/${id}`),
  getPackageDetails: (id) => api.get(`/packages/${id}`),
  updatePackage: (id, data) => api.put(`/packages/${id}`, data),
  cancelPackage: (id) => api.put(`/packages/${id}/cancel`),
  payPackage: (id) => api.put(`/packages/${id}/pay`),
  createRazorpayOrder: (id) => api.post(`/packages/${id}/create-order`),
  verifyRazorpayPayment: (id, paymentData) => api.post(`/packages/${id}/verify-payment`, paymentData),
  checkAvailability: (params) => api.get('/packages/check-availability', { params }),
};

export const adminAPI = {

  getDashboard: () => api.get('/admin/dashboard'),


  getAllStays: () => api.get('/admin/stays'),
  createStay: (data) => api.post('/admin/stays', data),
  updateStay: (id, data) => api.put(`/admin/stays/${id}`, data),
  deleteStay: (id) => api.delete(`/admin/stays/${id}`),


  getAllTransportation: () => api.get('/admin/transportation'),
  createTransportation: (data) => api.post('/admin/transportation', data),
  updateTransportation: (id, data) => api.put(`/admin/transportation/${id}`, data),
  deleteTransportation: (id) => api.delete(`/admin/transportation/${id}`),


  getAllSightseeing: () => api.get('/admin/sightseeing'),
  createSightseeing: (data) => api.post('/admin/sightseeing', data),
  updateSightseeing: (id, data) => api.put(`/admin/sightseeing/${id}`, data),
  deleteSightseeing: (id) => api.delete(`/admin/sightseeing/${id}`),


  getAllDestinations: () => api.get('/admin/destinations'),
  createDestination: (data) => api.post('/admin/destinations', data),
  updateDestination: (id, data) => api.put(`/admin/destinations/${id}`, data),
  deleteDestination: (id) => api.delete(`/admin/destinations/${id}`),


  getAllTourPackages: () => api.get('/admin/tour-packages'),
  createTourPackage: (data) => api.post('/admin/tour-packages', data),
  updateTourPackage: (id, data) => api.put(`/admin/tour-packages/${id}`, data),
  deleteTourPackage: (id) => api.delete(`/admin/tour-packages/${id}`),


  getAllBookings: () => api.get('/admin/packages'),
  updateBookingStatus: (id, status) => api.put(`/admin/packages/${id}/status`, { status }),
  deleteBooking: (id) => api.delete(`/admin/packages/${id}`),
  refundBooking: (id) => api.put(`/admin/packages/${id}/refund`),


  getAllAirportTransfers: () => api.get('/admin/airport-transfers'),
  createAirportTransfer: (data) => api.post('/admin/airport-transfers', data),
  updateAirportTransfer: (id, data) => api.put(`/admin/airport-transfers/${id}`, data),
  deleteAirportTransfer: (id) => api.delete(`/admin/airport-transfers/${id}`),


  getAllConversations: () => api.get('/chat/conversations'),
  getConversationMessages: (userId) => api.get(`/chat/history/${userId}`),
  deleteConversation: (userId) => api.delete(`/chat/conversation/${userId}`),
  sendAdminMessage: (conversationId, content) => api.post(`/chat/conversations/${conversationId}/messages`, { content }),


  uploadImage: (formData) => api.post('/gallery', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadFile: (formData) => api.post('/admin/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteImage: (id) => api.delete(`/gallery/${id}`),
};

export const galleryAPI = {
  getAllImages: () => api.get('/gallery'),
};

export const contentAPI = {
  getAllContent: () => api.get('/content'),
  updateContent: (key, formData) => api.put(`/content/${key}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export default api;