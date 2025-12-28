import { apiRequest } from './api'

// Mobile app configuration service
export const mobileConfigService = {
  // Get all mobile app configurations
  getAllConfigs: async () => {
    try {
      const response = await apiRequest('/admin/mobile-config', {
        method: 'GET',
      })

      return {
        success: true,
        data: response.configs,
        message: 'Mobile app configurations fetched successfully',
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to fetch mobile app configurations',
        data: [],
      }
    }
  },

  // Get mobile app configuration for a specific platform
  getConfig: async (platform) => {
    try {
      const response = await apiRequest(`/admin/mobile-config/${platform}`, {
        method: 'GET',
      })

      return {
        success: true,
        data: response.config,
        message: 'Mobile app configuration fetched successfully',
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to fetch mobile app configuration',
        data: null,
      }
    }
  },

  // Update mobile app configuration for a specific platform
  updateConfig: async (platform, updateData) => {
    try {
      const response = await apiRequest(`/admin/mobile-config/${platform}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      return {
        success: true,
        data: response.config,
        message: response.message || 'Mobile app configuration updated successfully',
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to update mobile app configuration',
        data: null,
      }
    }
  },
}

