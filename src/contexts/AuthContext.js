import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { authService } from '../services/authService'
import { APP_STATE_STORAGE_KEY } from './AppContext'

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
}

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  CLEAR_ERROR: 'CLEAR_ERROR',
}

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload.error,
      }
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      }
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      }
    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: !!action.payload.user,
        isLoading: false,
      }
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      }
    default:
      return state
  }
}

// Create context
const AuthContext = createContext()

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Check authentication status on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true })

      try {
        if (authService.isAuthenticated()) {
          const user = authService.getCurrentUser()

          // If we have a user in localStorage, set it immediately
          if (user) {
            dispatch({
              type: AUTH_ACTIONS.SET_USER,
              payload: { user },
            })
          } else {
            // No user data, clear everything
            authService.logout()
            dispatch({ type: AUTH_ACTIONS.LOGOUT })
          }
        } else {
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false })
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        authService.logout()
        dispatch({ type: AUTH_ACTIONS.LOGOUT })
      }
    }

    checkAuthStatus()
  }, [])

  // Login function
  const login = async (email, password) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START })

    try {
      const result = await authService.login(email, password)

      if (result.success) {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user: result.data.user },
        })
        return result
      } else {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_FAILURE,
          payload: { error: result.error },
        })
        return result
      }
    } catch (error) {
      const errorMessage = error.message || 'Login failed'
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: { error: errorMessage },
      })
      return {
        success: false,
        error: errorMessage,
        message: 'Login failed',
      }
    }
  }

  // Logout function
  const logout = () => {
    authService.logout()
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(APP_STATE_STORAGE_KEY)
    }
    dispatch({ type: AUTH_ACTIONS.LOGOUT })
  }

  // Clear error function
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR })
  }

  // Refresh token function
  const refreshToken = async () => {
    try {
      const result = await authService.refreshToken()
      if (result.success) {
        const profileResult = await authService.getProfile()
        if (profileResult.success) {
          dispatch({
            type: AUTH_ACTIONS.SET_USER,
            payload: { user: profileResult.data },
          })
        }
      }
      return result
    } catch (error) {
      logout()
      return { success: false, error: error.message }
    }
  }

  const value = {
    ...state,
    login,
    logout,
    clearError,
    refreshToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
