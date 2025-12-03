/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { shipmentsService } from '../services/shipmentsService'
import LocationSelect from '../components/LocationSelect.jsx'

const vehicleTypes = [
  { id: 'shahzor_9ft_open', name: 'Shahzor-9Ft Open', capacity: 'Up to 1.5 tons' },
  { id: 'mazda_12_14ft', name: 'Mazda- 12/14 Ft', capacity: 'Up to 3 tons' },
  { id: 'mazda_16_17_18ft_open', name: 'Mazda-16/17/18 Ft Open', capacity: 'Up to 5 tons' },
  { id: 'mazda_19_20ft_open', name: 'Mazda-19/20Ft Open', capacity: 'Up to 6 tons' },
  { id: 'mazda_flat_bed_25x8', name: 'Mazda Flat Bed-25 x 8 (LHR only)', capacity: 'Up to 8 tons' },
  { id: 'mazda_14_16_containerized', name: 'Mazda-14/16(Containerized)', capacity: 'Up to 4 tons' },
  { id: 'mazda_17ft_containerized', name: 'Mazda-17Ft (Containerized)', capacity: 'Up to 5 tons' },
  { id: 'flat_bed_20ft_6wheeler', name: 'Flat Bed-20Ft (6 Wheeler)', capacity: 'Up to 10 tons' },
  { id: 'flat_bed_40ft_14wheeler', name: 'Flat Bed-40Ft (14 Wheeler)', capacity: 'Up to 25 tons' },
  { id: 'boom_truck_16ft', name: 'Boom Truck-16Ft', capacity: 'Up to 5 tons' },
  { id: 'container_20ft_standard', name: '20Ft Container-Standard', capacity: 'Up to 20 tons' },
  { id: 'container_40ft_standard', name: '40Ft Container- Standard', capacity: 'Up to 30 tons' },
  { id: 'wheeler_22_half_body', name: '22 Wheeler (Half Body)', capacity: 'Up to 35 tons' },
  { id: 'mazda_12ton', name: 'Mazda - 12Ton', capacity: 'Up to 12 tons' },
  { id: 'wheeler_10_open_body', name: '10 Wheeler Open Body', capacity: 'Up to 15 tons' },
  { id: 'flat_bed_40ft_18wheeler', name: 'Flat Bed-40Ft (18 Wheeler)', capacity: 'Up to 30 tons' },
  { id: 'flat_bed_40ft_22wheeler', name: 'Flat Bed-40Ft (22 Wheeler)', capacity: 'Up to 35 tons' },
  { id: 'low_bed_25ft_10wheeler', name: 'Low Bed- 25Ft (10 wheeler)', capacity: 'Up to 20 tons' },
  { id: 'single_hino_6wheeler', name: 'Single Hino (6 Wheeler) [6 Natti]', capacity: 'Up to 8 tons' },
  { id: 'mazda_20ft_containerized', name: 'Mazda-20Ft (Containerized)', capacity: 'Up to 6 tons' },
  { id: 'mazda_22ft_containerized', name: 'Mazda-22Ft (Containerized)', capacity: 'Up to 7 tons' },
  { id: 'container_40ft_hc', name: '40Ft HC Container', capacity: 'Up to 30 tons' },
  { id: 'low_bed_40ft_22wheeler', name: 'Low Bed- 40Ft (22 wheeler)', capacity: 'Up to 40 tons' },
  { id: 'mazda_32ft_container', name: 'Mazda - 32Ft Container (Punjab&KPK)', capacity: 'Up to 10 tons' },
  { id: 'shahzor_9ft_container', name: 'Shahzor- 9ft Container', capacity: 'Up to 1.5 tons' },
  { id: 'ravi_pickup_open', name: 'Ravi Pick Up (Open)', capacity: 'Up to 1 ton' },
  { id: 'dumper_10wheeler', name: 'Dumper - 10 Wheeler', capacity: 'Up to 15 tons' },
  { id: 'trailer_40ft_single', name: '40Ft single Trailer', capacity: 'Up to 30 tons' },
  { id: 'trailer_40ft_double_20', name: '40Ft - Double 20 Trailer', capacity: 'Up to 40 tons' },
  { id: 'truck_20ft_single', name: '20Ft Single Truck', capacity: 'Up to 10 tons' },
  { id: 'low_bed_30ft_10wheeler', name: 'Low Bed- 30Ft (10 wheeler)', capacity: 'Up to 25 tons' },
  { id: 'mazda_17ft_container', name: '17Ft Mazda Container', capacity: 'Up to 5 tons' },
  { id: 'mazda_24ft_container', name: '24Ft Mazda Container', capacity: 'Up to 8 tons' },
  { id: 'mazda_16_18ft_tow_truck', name: 'Mazda 16/18Ft Tow Truck', capacity: 'Up to 5 tons' },
  { id: 'mazda_26ft_container', name: 'Mazda 26Ft Container', capacity: 'Up to 9 tons' },
  { id: 'crane_25ton', name: 'Crane -25 Ton', capacity: 'Up to 25 tons' },
  { id: 'container_50ft_hc', name: '50ft HC Container', capacity: 'Up to 35 tons' },
  { id: 'container_45ft_hc', name: '45ft HC Container', capacity: 'Up to 32 tons' },
  { id: 'container_20ft_reefer', name: '20Ft Reefer Container', capacity: 'Up to 20 tons' },
  { id: 'other', name: 'Other (Please Specify)', capacity: 'Custom' }
]

const EditShipmentModal = ({ shipment, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    pickupLocation: '',
    dropLocation: '',
    cargoType: '',
    description: '',
    vehicleType: '',
    customVehicleType: '',
    cargoWeight: '',
    numberOfVehicles: '',
    budget: '',
    companyName: '',
    deliveryDate: '',
    clearingAgentNum: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [deliveryDateDisplay, setDeliveryDateDisplay] = useState('')
  const [bookingDateISO, setBookingDateISO] = useState('')

  // Convert date to DD/MM/YYYY format
  // Handles both ISO (YYYY-MM-DD) and DD/MM/YYYY formats
  const convertToDisplay = (dateValue) => {
    if (!dateValue) return ''
    
    // If already in DD/MM/YYYY format, return as is
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateValue)) {
      return dateValue
    }
    
    // Try to parse as ISO format (YYYY-MM-DD)
    try {
      const date = new Date(dateValue)
      if (!isNaN(date.getTime())) {
        const dd = String(date.getDate()).padStart(2, '0')
        const mm = String(date.getMonth() + 1).padStart(2, '0')
        const yyyy = date.getFullYear()
        return `${dd}/${mm}/${yyyy}`
      }
    } catch (e) {
      console.error('Error converting date:', e)
    }
    
    return ''
  }
  
  // Convert DD/MM/YYYY to ISO format (YYYY-MM-DD)
  const convertDDMMYYYYToISO = (ddmmyyyy) => {
    if (!ddmmyyyy) return ''
    const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(ddmmyyyy)
    if (match) {
      const [, dd, mm, yyyy] = match
      return `${yyyy}-${mm}-${dd}`
    }
    return ''
  }

  useEffect(() => {
    if (shipment) {
      const existingVehicleType = shipment.shipmentData?.vehicleType || ''
      const isCustomVehicle = existingVehicleType && !vehicleTypes.find(v => v.id === existingVehicleType)

      // Get booking date (createdAt) - this is the booking date
      const bookingDate = shipment.shipmentData?.createdAt || shipment.createdAt
      // Check multiple possible locations for deliveryDate
      // Backend returns deliveryDate as DD/MM/YYYY format, so we need to handle that
      const deliveryDate = shipment.shipmentData?.deliveryDate || shipment.deliveryDate || shipment.shipmentData?.Shipment?.deliveryDate
      
      // Debug logging
      console.log('EditShipmentModal - shipment:', shipment)
      console.log('EditShipmentModal - deliveryDate:', deliveryDate)
      console.log('EditShipmentModal - shipment.shipmentData?.deliveryDate:', shipment.shipmentData?.deliveryDate)
      console.log('EditShipmentModal - shipment.deliveryDate:', shipment.deliveryDate)

      // Format dates
      let formattedDeliveryDateISO = ''
      let formattedDeliveryDateDisplay = ''
      let formattedBookingDateISO = ''

      if (bookingDate) {
        const bDate = new Date(bookingDate)
        if (!isNaN(bDate.getTime())) {
          formattedBookingDateISO = bDate.toISOString().split('T')[0]
          setBookingDateISO(formattedBookingDateISO)
        } else {
          const today = new Date()
          formattedBookingDateISO = today.toISOString().split('T')[0]
          setBookingDateISO(formattedBookingDateISO)
        }
      } else {
        const today = new Date()
        formattedBookingDateISO = today.toISOString().split('T')[0]
        setBookingDateISO(formattedBookingDateISO)
      }

      if (deliveryDate) {
        // Check if it's already in DD/MM/YYYY format (from backend)
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(deliveryDate)) {
          formattedDeliveryDateDisplay = deliveryDate
          formattedDeliveryDateISO = convertDDMMYYYYToISO(deliveryDate)
        } else {
          // Try to parse as ISO format
          const dDate = new Date(deliveryDate)
          if (!isNaN(dDate.getTime())) {
            formattedDeliveryDateISO = dDate.toISOString().split('T')[0]
            formattedDeliveryDateDisplay = convertToDisplay(deliveryDate)
          }
        }
      }

      setDeliveryDateDisplay(formattedDeliveryDateDisplay)

      setFormData({
        pickupLocation: shipment.shipmentData?.pickupLocation || '',
        dropLocation: shipment.shipmentData?.dropLocation || '',
        cargoType: shipment.shipmentData?.cargoType || '',
        description: shipment.shipmentData?.description || '',
        vehicleType: isCustomVehicle ? 'other' : existingVehicleType,
        customVehicleType: isCustomVehicle ? existingVehicleType : '',
        cargoWeight: shipment.shipmentData?.cargoWeight || '',
        numberOfVehicles: shipment.shipmentData?.numberOfVehicles || '',
        budget: shipment.shipmentData?.budget || '',
        companyName: shipment.shipmentData?.Customer?.company || shipment.Customer?.company || '',
        deliveryDate: formattedDeliveryDateISO,
        clearingAgentNum: shipment.shipmentData?.clearingAgentNum || ''
      })
    }
  }, [shipment])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear custom vehicle type if switching away from "other"
    if (name === 'vehicleType' && value !== 'other') {
      setFormData(prev => ({
        ...prev,
        vehicleType: value,
        customVehicleType: ''
      }))
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // New handler for LocationSelect
  const handleLocationChange = (value, name) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear error when user selects
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Format user input (DD/MM/YYYY) and limit to valid day/month
  const formatDateInput = (value) => {
    const digits = value.replace(/[^\d/]/g, '')
    
    if (digits.length < value.length) {
      return digits
    }

    const numbers = digits.replace(/\D/g, '')
    
    if (numbers.length === 1) {
      return numbers
    }
    
    const limited = numbers.slice(0, 8)
    
    let day = limited.slice(0, 2)
    let month = limited.slice(2, 4)
    let year = limited.slice(4, 8)

    if (day.length === 2 && parseInt(day) > 31) day = '31'
    if (day.length === 2 && parseInt(day) < 1) day = '01'

    if (month.length === 2 && parseInt(month) > 12) month = '12'
    if (month.length === 2 && parseInt(month) < 1) month = '01'

    const currentYear = new Date().getFullYear()
    const minYear = currentYear
    const maxYear = currentYear + 2

    if (year && year.length === 4) {
      const parsedYear = parseInt(year)
      if (parsedYear < minYear || parsedYear > maxYear) {
        year = String(currentYear)
      }
    }

    let formatted = day
    
    if (day.length === 2) {
      formatted += '/'
      if (month) {
        formatted += month
      }
      if (month.length === 2) {
        formatted += '/'
        if (year) {
          formatted += year
        }
      }
    }

    return formatted
  }

  const validateAndConvertDate = (formatted, key) => {
    const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(formatted)
    if (match) {
      const [, day, month, year] = match
      const d = parseInt(day, 10)
      const m = parseInt(month, 10)
      const y = parseInt(year, 10)

      if (m >= 1 && m <= 12 && d >= 1 && d <= 31) {
        const iso = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
        setFormData(prev => ({ ...prev, [key]: iso }))
        return true
      }
    }
    setFormData(prev => ({ ...prev, [key]: '' }))
    return false
  }

  const convertFormattedToISO = (formatted) => {
    const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(formatted)
    if (!match) return null
    const [, day, month, year] = match
    return `${year}-${month}-${day}`
  }

  const handleDeliveryDateChange = (e) => {
    const formatted = formatDateInput(e.target.value)
    setDeliveryDateDisplay(formatted)

    const isValid = validateAndConvertDate(formatted, 'deliveryDate')

    if (isValid) {
      const deliveryISO = convertFormattedToISO(formatted)
      if (deliveryISO) {
        const bookingDateForValidation = bookingDateISO || new Date().toISOString().split('T')[0]
        const bDate = new Date(bookingDateForValidation)
        bDate.setHours(0, 0, 0, 0)
        const dDate = new Date(deliveryISO)
        dDate.setHours(0, 0, 0, 0)

        if (dDate < bDate) {
          setErrors(prev => ({
            ...prev,
            deliveryDate: 'Delivery date cannot be before booking date'
          }))
        } else {
          setErrors(prev => ({ ...prev, deliveryDate: '' }))
        }
      }
    } else if (!isValid && formatted.length > 0) {
      setErrors(prev => ({
        ...prev,
        deliveryDate: 'Please enter a valid date in DD/MM/YYYY format'
      }))
    } else {
      setErrors(prev => ({ ...prev, deliveryDate: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (formData.pickupLocation && (formData.pickupLocation.length < 5 || formData.pickupLocation.length > 500)) {
      newErrors.pickupLocation = 'Pickup location must be between 5-500 characters'
    }

    if (formData.dropLocation && (formData.dropLocation.length < 5 || formData.dropLocation.length > 500)) {
      newErrors.dropLocation = 'Drop location must be between 5-500 characters'
    }

    if (formData.cargoType && (formData.cargoType.length < 2 || formData.cargoType.length > 100)) {
      newErrors.cargoType = 'Cargo type must be between 2-100 characters'
    }

    if (formData.description && (formData.description.length < 10 || formData.description.length > 1000)) {
      newErrors.description = 'Description must be between 10-1000 characters'
    }

    if (formData.cargoWeight && (isNaN(formData.cargoWeight) || Number(formData.cargoWeight) < 1)) {
      newErrors.cargoWeight = 'Cargo weight must be a number greater than 0'
    }

    if (formData.numberOfVehicles && (isNaN(formData.numberOfVehicles) || Number(formData.numberOfVehicles) < 1)) {
      newErrors.numberOfVehicles = 'Number of vehicles must be greater than 0'
    }

    if (formData.budget && (isNaN(formData.budget) || Number(formData.budget) < 0)) {
      newErrors.budget = 'Budget must be a number greater than or equal to 0'
    }

    if (formData.vehicleType === 'other' && !formData.customVehicleType.trim()) {
      newErrors.customVehicleType = 'Please specify the custom vehicle type'
    }

    if (formData.customVehicleType && (formData.customVehicleType.length < 2 || formData.customVehicleType.length > 100)) {
      newErrors.customVehicleType = 'Custom vehicle type must be between 2-100 characters'
    }

    if (formData.companyName && (formData.companyName.length < 2 || formData.companyName.length > 200)) {
      newErrors.companyName = 'Company name must be between 2-200 characters'
    }

    if (formData.clearingAgentNum && formData.clearingAgentNum.length > 100) {
      newErrors.clearingAgentNum = 'Clearing agent number must be maximum 100 characters'
    }

    if (!formData.deliveryDate) {
      newErrors.deliveryDate = 'Please enter a delivery date'
    } else {
      const date = new Date(formData.deliveryDate)
      if (isNaN(date.getTime())) {
        newErrors.deliveryDate = 'Please enter a valid date in DD/MM/YYYY format'
      } else {
        const bookingDateForValidation = bookingDateISO || new Date().toISOString().split('T')[0]
        const bDate = new Date(bookingDateForValidation)
        bDate.setHours(0, 0, 0, 0)
        const dDate = new Date(formData.deliveryDate)
        dDate.setHours(0, 0, 0, 0)
        
        if (dDate < bDate) {
          newErrors.deliveryDate = 'Delivery date cannot be before booking date'
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Prepare update data - only include non-empty fields
      const updateData = {}

      Object.keys(formData).forEach(key => {
        const value = formData[key]
        const allowEmptyString = key === 'deliveryDate' || key === 'clearingAgentNum'
        
        if ((value !== '' && value !== null && value !== undefined) || (allowEmptyString && value === '')) {
          // Handle vehicle type - use custom type if "other" is selected
          if (key === 'vehicleType') {
            if (value === 'other' && formData.customVehicleType) {
              updateData[key] = formData.customVehicleType
            } else if (value !== 'other') {
              updateData[key] = value
            }
          }
          // Skip customVehicleType and companyName as they're handled separately
          else if (key !== 'customVehicleType' && key !== 'companyName') {
            // Convert numeric fields
            if (key === 'cargoWeight' || key === 'budget' || key === 'numberOfVehicles') {
              updateData[key] = Number(value)
            } else {
              updateData[key] = value === '' && allowEmptyString ? '' : value
            }
          }
        }
      })

      // Handle company name separately - update customer if provided
      if (formData.companyName !== undefined && formData.companyName !== null) {
        updateData.companyName = formData.companyName.trim()
      }

      const result = await shipmentsService.adminUpdateShipment(shipment.shipmentId, updateData)

      if (result.success) {
        toast.success('Shipment updated successfully')
        onUpdate(result.data.shipment)
        onClose()
      } else {
        toast.error(result.message || 'Failed to update shipment')
      }
    } catch (error) {
      console.error('Error updating shipment:', error)
      toast.error('An error occurred while updating the shipment')
    } finally {
      setLoading(false)
    }
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
          <h2 className="modal-heading text-center flex-1">Edit Shipment</h2>
          <div className="w-12"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Shipment Info */}
          <div className="input-border px-[20px] py-[15px]">
            <div className="text-sm mb-4">
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

          {/* Company & Additional Info */}
          <div>
            <h3 className="text-blueBrand-dark modal-heading mb-[15px]">Company & Additional Details</h3>
            <div className="input-border px-[20px] py-[15px] space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-blueBrand-lighter form-label block mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    placeholder="Enter company name"
                  />
                  {errors.companyName && (
                    <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>
                  )}
                </div>

                <div>
                  <label className="text-blueBrand-lighter form-label block mb-2">
                    Delivery Date *
                  </label>
                  <input
                    type="text"
                    name="deliveryDate"
                    value={deliveryDateDisplay}
                    onChange={handleDeliveryDateChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    placeholder="DD/MM/YYYY"
                  />
                  {errors.deliveryDate && (
                    <p className="text-red-500 text-xs mt-1">{errors.deliveryDate}</p>
                  )}
                </div>

                <div>
                  <label className="text-blueBrand-lighter form-label block mb-2">
                    Clearing Agent Number
                  </label>
                  <input
                    type="text"
                    name="clearingAgentNum"
                    value={formData.clearingAgentNum}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    placeholder="Enter clearing agent number"
                  />
                  {errors.clearingAgentNum && (
                    <p className="text-red-500 text-xs mt-1">{errors.clearingAgentNum}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Location Fields */}
          <div>
            <h3 className="text-blueBrand-dark modal-heading mb-[15px]">Location Details</h3>
            <div className="input-border px-[20px] py-[15px] space-y-4">
              <LocationSelect
                value={formData.pickupLocation}
                onChange={handleLocationChange}
                name="pickupLocation"
                label="Pickup Location"
                error={errors.pickupLocation}
              />

              <LocationSelect
                value={formData.dropLocation}
                onChange={handleLocationChange}
                name="dropLocation"
                label="Drop Location"
                error={errors.dropLocation}
              />
            </div>
          </div>

          {/* Cargo Details */}
          <div>
            <h3 className="text-blueBrand-dark modal-heading mb-[15px]">Cargo Details</h3>
            <div className="input-border px-[20px] py-[15px] space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-blueBrand-lighter form-label block mb-2">
                    Cargo Type
                  </label>
                  <input
                    type="text"
                    name="cargoType"
                    value={formData.cargoType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    placeholder="Enter cargo type"
                  />
                  {errors.cargoType && (
                    <p className="text-red-500 text-xs mt-1">{errors.cargoType}</p>
                  )}
                </div>

                <div>
                  <label className="text-blueBrand-lighter form-label block mb-2">
                    Vehicle Type
                  </label>
                  <select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select vehicle type</option>
                    {vehicleTypes.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.name} - {vehicle.capacity}
                      </option>
                    ))}
                  </select>
                  {errors.vehicleType && (
                    <p className="text-red-500 text-xs mt-1">{errors.vehicleType}</p>
                  )}
                </div>

                {/* Custom Vehicle Type Input - Show when "Other" is selected */}
                {formData.vehicleType === 'other' && (
                  <div>
                    <label className="text-blueBrand-lighter form-label block mb-2">
                      Custom Vehicle Type *
                    </label>
                    <input
                      type="text"
                      name="customVehicleType"
                      value={formData.customVehicleType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      placeholder="Please specify the vehicle type"
                    />
                    {errors.customVehicleType && (
                      <p className="text-red-500 text-xs mt-1">{errors.customVehicleType}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-blueBrand-lighter form-label block mb-2">
                    Cargo Weight (kg)
                  </label>
                  <input
                    type="number"
                    name="cargoWeight"
                    value={formData.cargoWeight}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    placeholder="Enter weight in kg"
                  />
                  {errors.cargoWeight && (
                    <p className="text-red-500 text-xs mt-1">{errors.cargoWeight}</p>
                  )}
                </div>

                <div>
                  <label className="text-blueBrand-lighter form-label block mb-2">
                    No. of Containers/Vehicles
                  </label>
                  <input
                    type="number"
                    name="numberOfVehicles"
                    value={formData.numberOfVehicles}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    placeholder="Enter number of containers/vehicles"
                  />
                  {errors.numberOfVehicles && (
                    <p className="text-red-500 text-xs mt-1">{errors.numberOfVehicles}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-blueBrand-lighter form-label block mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Enter cargo description"
                  rows={3}
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                )}
              </div>

              <div>
                <label className="text-blueBrand-lighter form-label block mb-2">
                  Budget (PKR)
                </label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Enter budget"
                />
                {errors.budget && (
                  <p className="text-red-500 text-xs mt-1">{errors.budget}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {loading ? 'Updating...' : 'Update Shipment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditShipmentModal
