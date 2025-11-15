import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react'
import { shipmentsService } from '../services/shipmentsService'
import { usersService } from '../services/usersService'
import { useAuth } from './AuthContext'

const APP_STATE_STORAGE_KEY = 'cargo360_app_state_v1'

// Base state for app-wide data
const baseState = {
  shipments: [],
  users: [],
  loading: {
    shipments: false,
    users: false,
  },
  error: {
    shipments: null,
    users: null,
  },
  filters: {
    shipments: {
      status: '',
      vehicleType: '',
    },
    users: {
      role: '',
      isApproved: null,
    },
  },
}

const loadPersistedState = () => {
  if (typeof window === 'undefined') {
    return baseState
  }

  try {
    const stored = window.localStorage.getItem(APP_STATE_STORAGE_KEY)
    if (!stored) {
      return baseState
    }
    const parsed = JSON.parse(stored)
    return {
      ...baseState,
      shipments: Array.isArray(parsed?.shipments) ? parsed.shipments : [],
      users: Array.isArray(parsed?.users) ? parsed.users : [],
    }
  } catch (error) {
    console.warn('Failed to parse persisted app state', error)
    return baseState
  }
}

const initialState = loadPersistedState()

// Action types
const APP_ACTIONS = {
  // Shipments actions
  SET_SHIPMENTS_LOADING: 'SET_SHIPMENTS_LOADING',
  SET_SHIPMENTS_SUCCESS: 'SET_SHIPMENTS_SUCCESS',
  SET_SHIPMENTS_ERROR: 'SET_SHIPMENTS_ERROR',
  DELETE_SHIPMENT: 'DELETE_SHIPMENT',
  UPDATE_SHIPMENT: 'UPDATE_SHIPMENT',
  SET_SHIPMENTS_FILTER: 'SET_SHIPMENTS_FILTER',

  // Users actions
  SET_USERS_LOADING: 'SET_USERS_LOADING',
  SET_USERS_SUCCESS: 'SET_USERS_SUCCESS',
  SET_USERS_ERROR: 'SET_USERS_ERROR',
  DELETE_USER: 'DELETE_USER',
  UPDATE_USER: 'UPDATE_USER',
  ADD_USER: 'ADD_USER',
  SET_USERS_FILTER: 'SET_USERS_FILTER',

  // Clear errors
  CLEAR_SHIPMENTS_ERROR: 'CLEAR_SHIPMENTS_ERROR',
  CLEAR_USERS_ERROR: 'CLEAR_USERS_ERROR',
}

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    // Shipments cases
    case APP_ACTIONS.SET_SHIPMENTS_LOADING:
      return {
        ...state,
        loading: { ...state.loading, shipments: action.payload },
        error: { ...state.error, shipments: null },
      }
    case APP_ACTIONS.SET_SHIPMENTS_SUCCESS:
      return {
        ...state,
        shipments: action.payload,
        loading: { ...state.loading, shipments: false },
        error: { ...state.error, shipments: null },
      }
    case APP_ACTIONS.SET_SHIPMENTS_ERROR:
      return {
        ...state,
        loading: { ...state.loading, shipments: false },
        error: { ...state.error, shipments: action.payload },
      }
    case APP_ACTIONS.DELETE_SHIPMENT:
      return {
        ...state,
        shipments: state.shipments.filter(shipment => shipment.id !== action.payload),
      }
    case APP_ACTIONS.UPDATE_SHIPMENT:
      return {
        ...state,
        shipments: state.shipments.map(shipment =>
          shipment.id === action.payload.id ? { ...shipment, ...action.payload } : shipment
        ),
      }
    case APP_ACTIONS.SET_SHIPMENTS_FILTER:
      return {
        ...state,
        filters: {
          ...state.filters,
          shipments: { ...state.filters.shipments, ...action.payload },
        },
      }

    // Users cases
    case APP_ACTIONS.SET_USERS_LOADING:
      return {
        ...state,
        loading: { ...state.loading, users: action.payload },
        error: { ...state.error, users: null },
      }
    case APP_ACTIONS.SET_USERS_SUCCESS:
      return {
        ...state,
        users: action.payload,
        loading: { ...state.loading, users: false },
        error: { ...state.error, users: null },
      }
    case APP_ACTIONS.SET_USERS_ERROR:
      return {
        ...state,
        loading: { ...state.loading, users: false },
        error: { ...state.error, users: action.payload },
      }
    case APP_ACTIONS.DELETE_USER:
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload),
      }
    case APP_ACTIONS.UPDATE_USER:
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.id ? { ...user, ...action.payload } : user
        ),
      }
    case APP_ACTIONS.ADD_USER:
      return {
        ...state,
        users: [...state.users, action.payload],
      }
    case APP_ACTIONS.SET_USERS_FILTER:
      return {
        ...state,
        filters: {
          ...state.filters,
          users: { ...state.filters.users, ...action.payload },
        },
      }

    // Clear errors
    case APP_ACTIONS.CLEAR_SHIPMENTS_ERROR:
      return {
        ...state,
        error: { ...state.error, shipments: null },
      }
    case APP_ACTIONS.CLEAR_USERS_ERROR:
      return {
        ...state,
        error: { ...state.error, users: null },
      }

    default:
      return state
  }
}

// Create context
const AppContext = createContext()

// App provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)
  const { isAuthenticated } = useAuth()

  const persistState = useCallback((shipments, users) => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(
        APP_STATE_STORAGE_KEY,
        JSON.stringify({
          shipments,
          users,
          timestamp: Date.now(),
        })
      )
    } catch (error) {
      console.warn('Failed to persist app state', error)
    }
  }, [])

  useEffect(() => {
    persistState(state.shipments, state.users)
  }, [state.shipments, state.users, persistState])

  const refreshShipments = useCallback(async () => {
    dispatch({ type: APP_ACTIONS.SET_SHIPMENTS_LOADING, payload: true })
    try {
      const result = await shipmentsService.getAllShipments()
      if (result.success) {
        dispatch({ type: APP_ACTIONS.SET_SHIPMENTS_SUCCESS, payload: result.data })
      } else {
        dispatch({ type: APP_ACTIONS.SET_SHIPMENTS_ERROR, payload: result.error || result.message })
      }
    } catch (error) {
      dispatch({ type: APP_ACTIONS.SET_SHIPMENTS_ERROR, payload: error.message })
    }
  }, [])

  const refreshUsers = useCallback(async () => {
    dispatch({ type: APP_ACTIONS.SET_USERS_LOADING, payload: true })
    try {
      const result = await usersService.getAllUsers()
      if (result.success) {
        dispatch({ type: APP_ACTIONS.SET_USERS_SUCCESS, payload: result.data })
      } else {
        dispatch({ type: APP_ACTIONS.SET_USERS_ERROR, payload: result.error || result.message })
      }
    } catch (error) {
      dispatch({ type: APP_ACTIONS.SET_USERS_ERROR, payload: error.message })
    }
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return

    if (state.shipments.length === 0) {
      refreshShipments()
    }

    if (state.users.length === 0) {
      refreshUsers()
    }
  }, [isAuthenticated, state.shipments.length, state.users.length, refreshShipments, refreshUsers])

  const value = {
    ...state,
    dispatch,
    actions: APP_ACTIONS,
    refreshShipments,
    refreshUsers,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// Custom hook to use app context
export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

export { APP_STATE_STORAGE_KEY }
export default AppContext
