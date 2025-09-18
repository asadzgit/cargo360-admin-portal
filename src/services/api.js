import axios from 'axios'

// Base API configuration for Cargo360
const API_BASE_URL = 'https://cargo360-api.onrender.com/'

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add response interceptor for automatic token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const refreshToken = localStorage.getItem('refreshToken')
        const response = await axios.post(`${API_BASE_URL}auth/refresh`, { refreshToken })
        const { accessToken, refreshToken: newRefreshToken } = response.data

        // Update stored tokens
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', newRefreshToken)

        // Retry original request
        error.config.headers.Authorization = `Bearer ${accessToken}`
        return axiosInstance.request(error.config)
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        window.location.href = '/signin'
      }
    }
    return Promise.reject(error)
  }
)

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// API request wrapper with authentication (maintains fetch-like interface)
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await axiosInstance({
      url: endpoint,
      method: options.method || 'GET',
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
      data: options.body,
    })
    return response.data
  } catch (error) {
    // Extract error message from axios error structure
    const errorMessage = error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'An error occurred'
    throw new Error(errorMessage)
  }
}

export { apiRequest, API_BASE_URL }
