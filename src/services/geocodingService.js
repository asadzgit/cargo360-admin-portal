import { CONFIG } from '../constants/config'

export const geocodingService = {
  // Convert coordinates to detailed address using Geoapify reverse geocoding
  reverseGeocode: async (latitude, longitude) => {
    try {
      const url = `${CONFIG.GEOAPIFY_BASE_URL}?lat=${latitude}&lon=${longitude}&apiKey=${CONFIG.GEOAPIFY_API_KEY}`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.features && data.features.length > 0) {
        const address = data.features[0].properties
        
        // Format the address components
        const formattedAddress = {
          fullAddress: address.formatted || 'Address not available',
          street: address.street || address.housenumber ? 
            `${address.housenumber || ''} ${address.street || ''}`.trim() : '',
          city: address.city || address.town || address.village || '',
          state: address.state || address.county || '',
          country: address.country || '',
          postcode: address.postcode || '',
          // Additional details
          district: address.district || '',
          suburb: address.suburb || '',
          coordinates: `${latitude}, ${longitude}`
        }

        return {
          success: true,
          data: formattedAddress,
          message: 'Address retrieved successfully'
        }
      } else {
        return {
          success: false,
          data: {
            fullAddress: `${latitude}, ${longitude}`,
            coordinates: `${latitude}, ${longitude}`
          },
          message: 'No address found for these coordinates'
        }
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error)
      return {
        success: false,
        data: {
          fullAddress: `${latitude}, ${longitude}`,
          coordinates: `${latitude}, ${longitude}`
        },
        message: 'Failed to retrieve address',
        error: error.message
      }
    }
  },

  // Format address for display (short version)
  formatAddressShort: (addressData) => {
    if (!addressData) return 'Address not available'
    
    const parts = []
    if (addressData.street) parts.push(addressData.street)
    if (addressData.city) parts.push(addressData.city)
    if (addressData.state) parts.push(addressData.state)
    
    return parts.length > 0 ? parts.join(', ') : addressData.fullAddress
  },

  // Format address for display (full version)
  formatAddressFull: (addressData) => {
    if (!addressData) return 'Address not available'
    return addressData.fullAddress
  }
}
