import { apiRequest } from './api'

// Shipments service for Cargo360 API (Admin operations)
export const shipmentsService = {
  // Get all shipments (Admin only)
  getAllShipments: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams()

      if (filters.status) {
        queryParams.append('status', filters.status)
      }
      if (filters.vehicleType) {
        queryParams.append('vehicleType', filters.vehicleType)
      }

      const endpoint = `/shipments${queryParams.toString() ? `?${queryParams.toString()}` : ''}`

      const response = await apiRequest(endpoint, {
        method: 'GET',
      })

      return {
        success: true,
        data: response.data.shipments,
        message: 'Shipments fetched successfully',
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to fetch shipments',
        data: [],
      }
    }
  },

  // Get single shipment by ID
  getShipmentById: async (shipmentId) => {
    try {
      const response = await apiRequest(`/shipments/${shipmentId}`, {
        method: 'GET',
      })

      return {
        success: true,
        data: response.data.shipment,
        message: 'Shipment fetched successfully',
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to fetch shipment',
        data: null,
      }
    }
  },

  // Delete shipment (Admin only) - can include cancelReason for decline
  deleteShipment: async (shipmentId, cancelReason = null) => {
    try {
      const body = {};
      if (cancelReason && typeof cancelReason === 'string' && cancelReason.trim() !== '') {
        body.cancelReason = cancelReason.trim();
      }
      
      const response = await apiRequest(`/shipments/${shipmentId}`, {
        method: 'DELETE',
        body: Object.keys(body).length > 0 ? body : undefined,
      })

      return {
        success: true,
        data: response,
        message: response.message || 'Shipment declined successfully',
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to decline shipment',
      }
    }
  },

  // Update shipment status (Admin only)
  updateShipmentStatus: async (shipmentId, status) => {
    try {
      const response = await apiRequest(`/shipments/${shipmentId}/status`, {
        method: 'PATCH',
        body: {
          status,
        },
      })

      return {
        success: true,
        data: response.data?.shipment || response.shipment,
        message: response.message || 'Shipment status updated successfully',
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to update shipment status',
      }
    }
  },

  // Assign shipment to trucker or driver (Admin only)
  assignShipment: async (shipmentId, assignment, userId) => {
    try {
      const response = await apiRequest(`/admin/shipments/${shipmentId}/assign`, {
        method: 'PATCH',
        body: {
          assignment,
          userId,
        },
      })

      return {
        success: true,
        data: response.data?.shipment || response.shipment,
        message: response.message || `Shipment assigned to ${assignment} successfully`,
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: `Failed to assign shipment to ${assignment}`,
      }
    }
  },

  // Get current location of a shipment
  getCurrentLocation: async (shipmentId) => {
    try {
      const response = await apiRequest(`/location/shipments/${shipmentId}/current`, {
        method: 'GET',
      })

      return {
        success: true,
        data: response.data,
        message: 'Current location retrieved successfully',
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve current location',
        data: null,
      }
    }
  },

  // Get shipment audit logs (Admin only)
  getShipmentLogs: async (shipmentId, limit = 100) => {
    try {
      const safeLimit = Math.max(1, Math.min(limit || 100, 500))
      const response = await apiRequest(`/shipments/${shipmentId}/logs?limit=${safeLimit}`, {
        method: 'GET',
      })

      return {
        success: response.success ?? true,
        data: response.data?.logs || [],
        metadata: response.data || {},
        message: response.message || 'Shipment logs fetched successfully',
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to fetch shipment logs',
        data: [],
      }
    }
  },

  // Get shipment details by ID (for tracking page)
  getShipmentById: async (shipmentId) => {
    try {
      const response = await apiRequest(`/shipments/${shipmentId}`, {
        method: 'GET',
      })

      return {
        success: true,
        data: response.data,
        message: 'Shipment details retrieved successfully',
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve shipment details',
        data: null,
      }
    }
  },

  // Admin update shipment
  adminUpdateShipment: async (shipmentId, updateData) => {
    try {
      const response = await apiRequest(`/admin/shipments/${shipmentId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      return {
        success: true,
        data: response.data,
        message: 'Shipment updated successfully by admin',
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to update shipment',
        data: null,
      }
    }
  },

  // Get shipment statistics (for dashboard)
  getShipmentStats: async () => {
    try {
      // This would be a custom endpoint for admin dashboard stats
      // For now, we'll fetch all shipments and calculate stats client-side
      const response = await apiRequest('/shipments', {
        method: 'GET',
      })

      const shipments = response.data.shipments
      const stats = {
        total: shipments.length,
        pending: shipments.filter(s => s.status === 'pending').length,
        accepted: shipments.filter(s => s.status === 'accepted').length,
        inTransit: shipments.filter(s => s.status === 'in_transit').length,
        delivered: shipments.filter(s => s.status === 'delivered').length,
        cancelled: shipments.filter(s => s.status === 'cancelled').length,
      }

      return {
        success: true,
        data: stats,
        message: 'Shipment statistics calculated successfully',
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to fetch shipment statistics',
        data: {
          total: 0,
          pending: 0,
          accepted: 0,
          inTransit: 0,
          delivered: 0,
          cancelled: 0,
        },
      }
    }
  },
  // Decide discount request (Admin only)
  decideDiscountRequest: async (discountRequestId, action) => {
    try {
      const response = await apiRequest(`/discount-requests/${discountRequestId}`, {
        method: 'PATCH',
        body: { action },
      })

      return {
        success: true,
        data: response.data?.discountRequest || response.discountRequest,
        message: response.message || 'Decision recorded',
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to decide discount request',
        data: null,
      }
    }
  },
}
