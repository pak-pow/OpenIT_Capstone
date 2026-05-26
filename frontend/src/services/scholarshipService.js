import { apiClient } from './apiClient';
import { scholarships as mockScholarships } from '../mockdata';

// Helper to simulate network latency for mock data
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const scholarshipService = {
  /**
   * Fetch all scholarships
   */
  getAllScholarships: async () => {
    if (USE_MOCK) {
      await delay(400); // Simulate network delay
      return mockScholarships;
    }
    return await apiClient.get('/scholarships');
  },

  /**
   * Fetch a single scholarship by ID
   */
  getScholarshipById: async (id) => {
    if (USE_MOCK) {
      await delay(300);
      return mockScholarships.find(s => s.id === id);
    }
    return await apiClient.get(`/scholarships/${id}`);
  }
};
