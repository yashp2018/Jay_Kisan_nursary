import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token if available
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Request Error:', error.request);
      return Promise.reject({ message: 'No response from server' });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Error:', error.message);
      return Promise.reject({ message: error.message });
    }
  }
);

// Booking Service
const bookingService = {
  // Get all bookings with optional filters
  getBookings: async (params = {}) => {
    try {
      const response = await api.get('/bookings', { params });
      
      // Transform the API response to match the expected format
      const bookings = Array.isArray(response.bookings) ? response.bookings : [];
      
      return bookings.map(booking => ({
        _id: booking._id,
        farmerName: booking.farmer?.fullName || 'Unknown Farmer',
        phoneNumber: booking.farmer?.phone || 'N/A',
        varietyName: booking.varieties?.[0]?.name || 'Unknown Variety',
        groupName: booking.cropGroup?.name || 'N/A',
        lotNumber: booking.lotNumber || 'N/A',
        sowingDate: booking.sowingDate || new Date().toISOString(),
        quantity: booking.quantity || 0,
        status: booking.status || 'pending',
        notificationSent: booking.notificationSent || false,
        lastNotification: booking.lastNotification || null
      }));
    } catch (error) {
      console.error('Error fetching bookings:', error);
      
      // In development, return sample data if API fails
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Using sample data as fallback');
        return this.getSampleData();
      }
      
      throw error;
    }
  },

  // Get a single booking by ID
  getBookingById: async (id) => {
    try {
      const response = await api.get(`/bookings/${id}`);
      return response.booking || null;
    } catch (error) {
      console.error(`Error fetching booking ${id}:`, error);
      throw error;
    }
  },

  // Send notification for a booking
  sendNotification: async (bookingId, type = 'sms') => {
    try {
      const response = await api.post(`/bookings/${bookingId}/notify`, { type });
      return response;
    } catch (error) {
      console.error(`Error sending ${type} notification for booking ${bookingId}:`, error);
      throw error;
    }
  },

  // Generate sample data for development
  getSampleData: () => {
    // This function should be removed in production
    if (process.env.NODE_ENV === 'production') {
      console.warn('Sample data generation is not available in production');
      return [];
    }
    
    // Generate sample data for development
    const sampleBookings = [];
    const statuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    const today = new Date();
    
    for (let i = 1; i <= 20; i++) {
      const daysToAdd = Math.floor(Math.random() * 30) - 15; // -15 to +15 days
      const sowingDate = new Date(today);
      sowingDate.setDate(today.getDate() + daysToAdd);
      
      sampleBookings.push({
        _id: `sample-${i}`,
        farmerName: `Farmer ${i}`,
        phoneNumber: `98765${Math.floor(10000 + Math.random() * 90000)}`,
        varietyName: `Variety ${String.fromCharCode(65 + (i % 5))}`,
        groupName: `Group ${(i % 3) + 1}`,
        lotNumber: `LOT-${1000 + i}`,
        sowingDate: sowingDate.toISOString(),
        status: statuses[i % statuses.length],
        notificationSent: Math.random() > 0.5,
        lastNotification: Math.random() > 0.7 ? new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString() : null,
      });
    }
    
    return sampleBookings;
  }
};

export { api, bookingService };
export default bookingService;
