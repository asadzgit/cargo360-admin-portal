/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { shipmentsService } from '../services/shipmentsService'
import { geocodingService } from '../services/geocodingService'

const LocationModal = ({ shipment, onClose }) => {
  const [locationData, setLocationData] = useState(null)
  const [addressData, setAddressData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (shipment?.shipmentId) {
      fetchLocation()
    }
  }, [shipment])

  const fetchLocation = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await shipmentsService.getCurrentLocation(shipment.shipmentId)
      
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
        setError(result.message || 'Failed to fetch location data')
        toast.error(result.message || 'Failed to fetch location data')
      }
    } catch (error) {
      setError('Error fetching location data')
      toast.error('Error fetching location data')
    } finally {
      setLoading(false)
    }
  }

  const getGoogleMapsUrl = () => {
    if (!locationData?.currentLocation || !shipment?.shipmentData) return null
    
    const { latitude, longitude } = locationData.currentLocation
    const pickup = encodeURIComponent(shipment.shipmentData.pickupLocation || '')
    const drop = encodeURIComponent(shipment.shipmentData.dropLocation || '')
    
    // Create a multi-marker Google Maps URL with pickup, current location, and destination
    return `https://www.google.com/maps/dir/${pickup}/${latitude},${longitude}/${drop}`
  }

  const getDirectionsUrl = () => {
    if (!shipment?.shipmentData) return null
    
    const pickup = encodeURIComponent(shipment.shipmentData.pickupLocation || '')
    const drop = encodeURIComponent(shipment.shipmentData.dropLocation || '')
    
    if (locationData?.currentLocation) {
      const { latitude, longitude } = locationData.currentLocation
      return `https://www.google.com/maps/dir/${pickup}/${latitude},${longitude}/${drop}`
    }
    
    return `https://www.google.com/maps/dir/${pickup}/${drop}`
  }

  if (!shipment) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-[800px] max-h-[90vh] overflow-y-auto pt-[30px] pb-[30px] px-[40px] relative">
        <div className="flex items-center justify-between mb-[25px]">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-sm flex items-center gap-1 absolute top-[24px] left-[30px]"
          >
            ←
          </button>
          <h2 className="modal-heading text-center flex-1">Shipment Location</h2>
          <div className="w-12"></div>
        </div>

        <div className="space-y-6">
          {/* Shipment Info */}
          <div className="input-border px-[20px] py-[15px]">
            <div className="text-sm">
              <div className="flex justify-between mb-2">
                <span className="text-blueBrand-lighter form-label">Shipment ID:</span>
                <span className="form-subheading">{shipment.orderId}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-blueBrand-lighter form-label">Status:</span>
                <span className="form-subheading">{shipment.status?.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blueBrand-lighter form-label">Customer:</span>
                <span className="form-subheading">{shipment.customer}</span>
              </div>
            </div>
          </div>

          {/* Route Information */}
          <div>
            <h3 className="text-blueBrand-dark modal-heading mb-[15px]">
              Route Information
            </h3>
            <div className="input-border px-[20px] py-[15px]">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <span className="text-blueBrand-lighter form-label block">Pickup Location</span>
                    <span className="form-subheading">{shipment.shipmentData?.pickupLocation || 'Not specified'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div>
                    <span className="text-blueBrand-lighter form-label block">Drop Location</span>
                    <span className="form-subheading">{shipment.shipmentData?.dropLocation || 'Not specified'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Current Location */}
          <div>
            <h3 className="text-blueBrand-dark modal-heading mb-[15px]">
              Current Location
            </h3>
            <div className="input-border px-[20px] py-[15px]">
              {loading ? (
                <div className="text-center py-4">
                  <div className="text-gray-500">Loading location data...</div>
                </div>
              ) : error ? (
                <div className="text-center py-4">
                  <div className="text-red-500 mb-2">{error}</div>
                  <button
                    onClick={fetchLocation}
                    className="text-purple-600 hover:underline text-sm"
                  >
                    Retry
                  </button>
                </div>
              ) : locationData?.currentLocation ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <svg 
                        width="20" 
                        height="20" 
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
                      <span className="text-blueBrand-lighter form-label block">Driver Location</span>
                      <span className="form-subheading">
                        {addressData ? geocodingService.formatAddressFull(addressData) : 
                         `${locationData.currentLocation.latitude.toFixed(6)}, ${locationData.currentLocation.longitude.toFixed(6)}`}
                      </span>
                      {addressData && (
                        <div className="text-xs text-gray-500 mt-1">
                          Coordinates: {locationData.currentLocation.latitude.toFixed(6)}, {locationData.currentLocation.longitude.toFixed(6)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {locationData.currentLocation.driver && (
                    <div className="bg-gray-50 p-3 rounded">
                      <span className="text-blueBrand-lighter form-label block mb-1">Driver Information</span>
                      <div className="text-sm">
                        <div>Name: {locationData.currentLocation.driver.name}</div>
                        <div>Phone: {locationData.currentLocation.driver.phone}</div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {locationData.currentLocation.speed && (
                      <div>
                        <span className="text-blueBrand-lighter form-label block">Speed</span>
                        <span className="form-subheading">{locationData.currentLocation.speed} km/h</span>
                      </div>
                    )}
                    {locationData.currentLocation.heading && (
                      <div>
                        <span className="text-blueBrand-lighter form-label block">Heading</span>
                        <span className="form-subheading">{locationData.currentLocation.heading}°</span>
                      </div>
                    )}
                    <div>
                      <span className="text-blueBrand-lighter form-label block">Last Updated</span>
                      <span className="form-subheading">
                        {new Date(locationData.currentLocation.timestamp).toLocaleString()}
                      </span>
                    </div>
                    {locationData.currentLocation.accuracy && (
                      <div>
                        <span className="text-blueBrand-lighter form-label block">Accuracy</span>
                        <span className="form-subheading">{locationData.currentLocation.accuracy}m</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="text-gray-500">No location data available for this shipment</div>
                </div>
              )}
            </div>
          </div>

          {/* Map Actions */}
          <div className="flex gap-3">
            {locationData?.currentLocation && (
              <a
                href={getGoogleMapsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded text-center hover:bg-blue-700"
              >
                View Complete Route with Current Location
              </a>
            )}
            <a
              href={getDirectionsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded text-center hover:bg-green-700"
            >
              View Directions Only
            </a>
          </div>

          {/* Refresh Button */}
          <div className="text-center">
            <button
              onClick={fetchLocation}
              disabled={loading}
              className="bg-gray-600 text-white py-2 px-6 rounded hover:bg-gray-700 disabled:bg-gray-400"
            >
              {loading ? 'Refreshing...' : 'Refresh Location'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LocationModal
