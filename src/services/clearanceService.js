import { apiRequest } from './api'

// Clearance service for Cargo360 API (Admin operations)
export const clearanceService = {
  // Get all clearance requests (Admin can see all)
  getAllClearanceRequests: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams()
      
      if (filters.requestType) {
        queryParams.append('requestType', filters.requestType)
      }
      if (filters.status) {
        queryParams.append('status', filters.status)
      }
      if (filters.city) {
        queryParams.append('city', filters.city)
      }
      if (filters.containerType) {
        queryParams.append('containerType', filters.containerType)
      }
      if (filters.limit) {
        queryParams.append('limit', filters.limit)
      }
      if (filters.offset) {
        queryParams.append('offset', filters.offset)
      }

      const endpoint = `/clearance-requests${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      
      const response = await apiRequest(endpoint, {
        method: 'GET',
      })

      return {
        success: true,
        data: response.data?.requests || response.requests || [],
        count: response.data?.count || 0,
        message: 'Clearance requests fetched successfully',
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to fetch clearance requests',
        data: [],
        count: 0,
      }
    }
  },

  // Get single clearance request by ID
  getClearanceRequestById: async (requestId) => {
    try {
      const response = await apiRequest(`/clearance-requests/${requestId}`, {
        method: 'GET',
      })

      return {
        success: true,
        data: response.data?.request || response.request || response,
        message: 'Clearance request fetched successfully',
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to fetch clearance request',
        data: null,
      }
    }
  },

  // Update clearance request status (Admin only)
  updateClearanceStatus: async (requestId, status, reviewNotes = null) => {
    try {
      const response = await apiRequest(`/clearance-requests/${requestId}/status`, {
        method: 'PUT',
        body: {
          status,
          reviewNotes,
        },
      })

      return {
        success: true,
        data: response.data?.request || response.request || response,
        message: 'Clearance request status updated successfully',
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to update clearance request status',
      }
    }
  },

  // Delete clearance request (Admin only)
  deleteClearanceRequest: async (requestId) => {
    try {
      const response = await apiRequest(`/clearance-requests/${requestId}`, {
        method: 'DELETE',
      })

      return {
        success: true,
        data: response,
        message: response.message || 'Clearance request deleted successfully',
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to delete clearance request',
      }
    }
  },
}

