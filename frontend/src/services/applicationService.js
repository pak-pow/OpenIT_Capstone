import { apiClient } from './apiClient';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const applicationService = {
  /**
   * Apply for a scholarship
   */
  apply: async (applicationData) => {
    if (USE_MOCK) {
      await delay(500);
      return { success: true, message: 'Application submitted (Mock)' };
    }
    return await apiClient.post('/applications', applicationData);
  },

  /**
   * Fetch applications for a specific user
   */
  getUserApplications: async (userId) => {
    if (USE_MOCK) {
      await delay(400);
      return []; // Return empty for mock as we manage state locally in Context
    }
    return await apiClient.get(`/applications/user/${userId}`);
  },

  /**
   * Update application status (Admin/System action)
   */
  updateStatus: async (applicationId, status) => {
    if (USE_MOCK) {
      await delay(300);
      return { success: true };
    }
    return await apiClient.put(`/applications/${applicationId}/status`, { status });
  }
};
