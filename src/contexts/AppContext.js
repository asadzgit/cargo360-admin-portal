import React, { createContext, useContext, useReducer } from 'react'

// Initial state for app-wide data
const initialState = {
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

  const value = {
    ...state,
    dispatch,
    actions: APP_ACTIONS,
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

export default AppContext
