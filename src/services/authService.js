import { apiRequest } from './api'

// Authentication service for Cargo360 API
export const authService = {
  // Login user (admin role)
  login: async (email, password) => {
    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: {
          email,
          password,
        },
      })

      // Store tokens in localStorage

      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)
      localStorage.setItem('user', JSON.stringify(response.user))


      return {
        success: true,
        data: response,
        message: response.message || 'Login successful',
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Login failed',
      }
    }
  },

  // Get current user profile
  getProfile: async () => {
    try {
      const response = await apiRequest('/auth/me', {
        method: 'GET',
      })

      return {
        success: true,
        data: response.user,
        message: 'Profile fetched successfully',
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to fetch profile',
      }
    }
  },

  // Refresh access token
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await apiRequest('/auth/refresh', {
        method: 'POST',
        body: {
          refreshToken,
        },
      })

      // Update tokens
      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)

      return {
        success: true,
        data: response,
        message: 'Token refreshed successfully',
      }
    } catch (error) {
      // Clear tokens on refresh failure
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')

      return {
        success: false,
        error: error.message,
        message: 'Token refresh failed',
      }
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')

    return {
      success: true,
      message: 'Logged out successfully',
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('accessToken')
    const user = localStorage.getItem('user')
    return !!(token && user)
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },
}
