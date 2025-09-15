/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { shipmentsService } from '../services/shipmentsService'
import { geocodingService } from '../services/geocodingService'

const DriverLocationPage = () => {
  const { shipmentId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [shipmentData, setShipmentData] = useState(null)
  const [locationData, setLocationData] = useState(null)
  const [addressData, setAddressData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Get token from URL params and set it in localStorage if provided
  const urlToken = searchParams.get('token')

  useEffect(() => {
    // If token is provided in URL, store it in localStorage for API calls
    if (urlToken) {
      localStorage.setItem('token', urlToken)
    }

    if (shipmentId) {
      fetchShipmentData()
    } else {
      setError('Shipment ID is required')
      setLoading(false)
    }
  }, [shipmentId, urlToken])

  const fetchShipmentData = async () => {
    setLoading(true)
    setError(null)

    try {
      // Fetch shipment details - this will validate access automatically via the API
      const shipmentResult = await shipmentsService.getShipmentById(shipmentId)

      if (!shipmentResult.success) {
        if (shipmentResult.error?.includes('404') || shipmentResult.error?.includes('unauthorized')) {
          setError('Shipment not found or you are not authorized to view this shipment')
        } else {
          setError(shipmentResult.message || 'Failed to fetch shipment data')
        }
        setLoading(false)
        return
      }

      setShipmentData(shipmentResult.data)

      // Fetch current location - this also validates access automatically
      await fetchCurrentLocation()

    } catch (error) {
      console.error('Error fetching shipment data:', error)
      if (error.message?.includes('401') || error.message?.includes('403')) {
        setError('Access denied: You are not authorized to view this shipment')
      } else {
        setError('An error occurred while loading shipment data')
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchCurrentLocation = async () => {
    try {
      const result = await shipmentsService.getCurrentLocation(shipmentId)

      if (result.success) {
        setLocationData(result.data)
        
        // If location data has coordinates, fetch the address
        if (result.data?.currentLocation?.latitude && result.data?.currentLocation?.longitude) {
          const addressResult = await geocodingService.reverseGeocode(
            result.data.currentLocation.latitude,
            result.data.currentLocation.longitude
          )
          
          if (addressResult.success) {
            setAddressData(addressResult.data)
          }
        }
      } else {
        console.warn('Failed to fetch current location:', result.message)
      }
    } catch (error) {
      console.error('Error fetching current location:', error)
    }
  }

  const refreshLocation = async () => {
    setLoading(true)
    await fetchCurrentLocation()
    setLoading(false)
    toast.success('Location refreshed successfully')
  }

  const getGoogleMapsUrl = () => {
    if (!locationData?.currentLocation || !shipmentData) return null

    const { latitude, longitude } = locationData.currentLocation
    const pickup = encodeURIComponent(shipmentData.pickupLocation || '')
    const drop = encodeURIComponent(shipmentData.dropLocation || '')

    return `https://www.google.com/maps/dir/${pickup}/${latitude},${longitude}/${drop}`
  }

  const getDirectionsUrl = () => {
    if (!shipmentData) return null

    const pickup = encodeURIComponent(shipmentData.pickupLocation || '')
    const drop = encodeURIComponent(shipmentData.dropLocation || '')

    if (locationData?.currentLocation) {
      const { latitude, longitude } = locationData.currentLocation
      return `https://www.google.com/maps/dir/${pickup}/${latitude},${longitude}/${drop}`
    }

    return `https://www.google.com/maps/dir/${pickup}/${drop}`
  }

  const formatDateTime = (dateString) => {
    try {
      return new Date(dateString).toLocaleString()
    } catch {
      return 'Invalid date'
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-100',
      accepted: 'text-blue-600 bg-blue-100',
      in_transit: 'text-green-600 bg-green-100',
      picked_up: 'text-purple-600 bg-purple-100',
      delivered: 'text-green-800 bg-green-200',
      cancelled: 'text-red-600 bg-red-100'
    }
    return colors[status] || 'text-gray-600 bg-gray-100'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading shipment tracking data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!shipmentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No shipment data available</p>
        </div>
      </div>
    )
  }

  const isTrackable = ['in_transit', 'picked_up'].includes(shipmentData.status)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Shipment Tracking</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(shipmentData.status)}`}>
              {shipmentData.status?.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500 block">Shipment ID</span>
              <span className="font-medium">{shipmentData.shipmentId || shipmentId}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Customer</span>
              <span className="font-medium">{shipmentData.customer || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Created Date</span>
              <span className="font-medium">{formatDateTime(shipmentData.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Route Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Route Information</h2>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <div>
                <span className="text-gray-500 text-sm block">Pickup Location</span>
                <span className="font-medium">{shipmentData.pickupLocation || 'Not specified'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <div>
                <span className="text-gray-500 text-sm block">Drop Location</span>
                <span className="font-medium">{shipmentData.dropLocation || 'Not specified'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Assignment Information */}
        {(shipmentData.assignedTrucker || shipmentData.assignedDriver) && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Assignment Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {shipmentData.assignedTrucker && (
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Assigned Trucker</h3>
                  <div className="text-sm space-y-1">
                    <div>Name: {shipmentData.assignedTrucker.name}</div>
                    <div>Email: {shipmentData.assignedTrucker.email}</div>
                    {shipmentData.assignedTrucker.phone && (
                      <div>Phone: {shipmentData.assignedTrucker.phone}</div>
                    )}
                  </div>
                </div>
              )}

              {shipmentData.assignedDriver && (
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Assigned Driver</h3>
                  <div className="text-sm space-y-1">
                    <div>Name: {shipmentData.assignedDriver.name}</div>
                    <div>Email: {shipmentData.assignedDriver.email}</div>
                    {shipmentData.assignedDriver.phone && (
                      <div>Phone: {shipmentData.assignedDriver.phone}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Current Location */}
        {isTrackable && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Current Location</h2>
              <button
                onClick={refreshLocation}
                disabled={loading}
                className="bg-gray-600 text-white px-4 py-2 rounded text-sm hover:bg-gray-700 disabled:bg-gray-400"
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>

            {locationData?.currentLocation ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-blue-600"
                    >
                      <path
                        d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm block">Driver Location</span>
                    <span className="font-medium">
                      {addressData ? geocodingService.formatAddressFull(addressData) : 
                       `${locationData.currentLocation.latitude.toFixed(6)}, ${locationData.currentLocation.longitude.toFixed(6)}`}
                    </span>
                    {addressData && (
                      <div className="text-xs text-gray-400 mt-1">
                        Coordinates: {locationData.currentLocation.latitude.toFixed(6)}, {locationData.currentLocation.longitude.toFixed(6)}
                      </div>
                    )}
                  </div>
                </div>

                {locationData.currentLocation.driver && (
                  <div className="bg-gray-50 p-4 rounded">
                    <span className="text-gray-700 font-medium block mb-2">Driver Information</span>
                    <div className="text-sm space-y-1">
                      <div>Name: {locationData.currentLocation.driver.name}</div>
                      <div>Phone: {locationData.currentLocation.driver.phone}</div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  {locationData.currentLocation.speed && (
                    <div>
                      <span className="text-gray-500 block">Speed</span>
                      <span className="font-medium">{locationData.currentLocation.speed} km/h</span>
                    </div>
                  )}
                  {locationData.currentLocation.heading && (
                    <div>
                      <span className="text-gray-500 block">Heading</span>
                      <span className="font-medium">{locationData.currentLocation.heading}°</span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-500 block">Last Updated</span>
                    <span className="font-medium">
                      {formatDateTime(locationData.currentLocation.timestamp)}
                    </span>
                  </div>
                  {locationData.currentLocation.accuracy && (
                    <div>
                      <span className="text-gray-500 block">Accuracy</span>
                      <span className="font-medium">{locationData.currentLocation.accuracy}m</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-500">No location data available for this shipment</div>
              </div>
            )}
          </div>
        )}

        {/* Map Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Map Actions</h2>

          <div className="flex flex-col sm:flex-row gap-3">
            {locationData?.currentLocation && (
              <a
                href={getGoogleMapsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded text-center hover:bg-blue-700"
              >
                View Complete Route with Current Location
              </a>
            )}
            <a
              href={getDirectionsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-green-600 text-white py-3 px-4 rounded text-center hover:bg-green-700"
            >
              View Directions Only
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DriverLocationPage
