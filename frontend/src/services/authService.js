import { apiClient } from './apiClient';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const authService = {
  /**
   * Register a new student
   */
  registerStudent: async (userData) => {
    if (USE_MOCK) {
      return { success: true, user: { ...userData, id: Date.now(), role: 'student' } };
    }
    return await apiClient.post('/auth/register', userData);
  },

  /**
   * Login user
   */
  login: async (credentials) => {
    if (USE_MOCK) {
      // Mock login always succeeds for demo
      return { success: true, user: { email: credentials.email, role: 'student' } };
    }
    return await apiClient.post('/auth/login', credentials);
  }
};
