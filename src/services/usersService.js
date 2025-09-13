import { apiRequest } from './api'

// Users service for Cargo360 API (Admin operations)
export const usersService = {
  // Get all users (Admin only)
  getAllUsers: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams()
      
      if (filters.role) {
        queryParams.append('role', filters.role)
      }
      if (filters.isApproved !== undefined) {
        queryParams.append('isApproved', filters.isApproved)
      }

      const endpoint = `/admin/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      
      const response = await apiRequest(endpoint, {
        method: 'GET',
      })

      return {
        success: true,
        data: response.users || [],
        message: 'Users fetched successfully',
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to fetch users',
        data: [],
      }
    }
  },

  // Get single user by ID
  getUserById: async (userId) => {
    try {
      const response = await apiRequest(`/users/${userId}`, {
        method: 'GET',
      })

      return {
        success: true,
        data: response.data?.user || response.user,
        message: 'User fetched successfully',
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to fetch user',
        data: null,
      }
    }
  },

  // Delete user (Admin only)
  deleteUser: async (userId) => {
    try {
      const response = await apiRequest(`/users/${userId}`, {
        method: 'DELETE',
      })

      return {
        success: true,
        data: response,
        message: response.message || 'User deleted successfully',
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to delete user',
      }
    }
  },

  // Update user role (Admin only)
  updateUserRole: async (userId, role) => {
    try {
      const response = await apiRequest(`/users/${userId}/role`, {
        method: 'PATCH',
        body: {
          role,
        },
      })

      return {
        success: true,
        data: response.data?.user || response.user,
        message: response.message || 'User role updated successfully',
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to update user role',
      }
    }
  },

  // Approve/Block user (Admin only)
  updateUserApproval: async (userId, isApproved) => {
    try {
      const response = await apiRequest(`/users/${userId}/approval`, {
        method: 'PATCH',
        body: {
          isApproved,
        },
      })

      return {
        success: true,
        data: response.data?.user || response.user,
        message: response.message || `User ${isApproved ? 'approved' : 'blocked'} successfully`,
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: `Failed to ${isApproved ? 'approve' : 'block'} user`,
      }
    }
  },

  // Create new user (Admin only)
  createUser: async (userData) => {
    try {
      const response = await apiRequest('/auth/signup', {
        method: 'POST',
        body: userData,
      })

      return {
        success: true,
        data: response.user,
        message: response.message || 'User created successfully',
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to create user',
      }
    }
  },

  // Get user statistics (for dashboard)
  getUserStats: async () => {
    try {
      const response = await apiRequest('/users', {
        method: 'GET',
      })

      const users = response.data?.users || response.users || []
      const stats = {
        total: users.length,
        customers: users.filter(u => u.role === 'customer').length,
        truckers: users.filter(u => u.role === 'trucker').length,
        drivers: users.filter(u => u.role === 'driver').length,
        admins: users.filter(u => u.role === 'admin').length,
        approved: users.filter(u => u.isApproved).length,
        pending: users.filter(u => !u.isApproved).length,
        verified: users.filter(u => u.isEmailVerified).length,
      }

      return {
        success: true,
        data: stats,
        message: 'User statistics calculated successfully',
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to fetch user statistics',
        data: {
          total: 0,
          customers: 0,
          truckers: 0,
          drivers: 0,
          admins: 0,
          approved: 0,
          pending: 0,
          verified: 0,
        },
      }
    }
  },
}
