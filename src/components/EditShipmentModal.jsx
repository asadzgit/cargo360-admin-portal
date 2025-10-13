/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { shipmentsService } from '../services/shipmentsService'

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
    cargoSize: '',
    budget: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (shipment) {
      const existingVehicleType = shipment.shipmentData?.vehicleType || ''
      const isCustomVehicle = existingVehicleType && !vehicleTypes.find(v => v.id === existingVehicleType)

      setFormData({
        pickupLocation: shipment.shipmentData?.pickupLocation || '',
        dropLocation: shipment.shipmentData?.dropLocation || '',
        cargoType: shipment.shipmentData?.cargoType || '',
        description: shipment.shipmentData?.description || '',
        vehicleType: isCustomVehicle ? 'other' : existingVehicleType,
        customVehicleType: isCustomVehicle ? existingVehicleType : '',
        cargoWeight: shipment.shipmentData?.cargoWeight || '',
        cargoSize: shipment.shipmentData?.cargoSize || '',
        budget: shipment.shipmentData?.budget || ''
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

    if (formData.cargoSize && formData.cargoSize.length > 50) {
      newErrors.cargoSize = 'Cargo size must be maximum 50 characters'
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
        if (value !== '' && value !== null && value !== undefined) {
          // Handle vehicle type - use custom type if "other" is selected
          if (key === 'vehicleType') {
            if (value === 'other' && formData.customVehicleType) {
              updateData[key] = formData.customVehicleType
            } else if (value !== 'other') {
              updateData[key] = value
            }
          }
          // Skip customVehicleType as it's handled above
          else if (key !== 'customVehicleType') {
            // Convert numeric fields
            if (key === 'cargoWeight' || key === 'budget') {
              updateData[key] = Number(value)
            } else {
              updateData[key] = value
            }
          }
        }
      })

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

          {/* Location Fields */}
          <div>
            <h3 className="text-blueBrand-dark modal-heading mb-[15px]">Location Details</h3>
            <div className="input-border px-[20px] py-[15px] space-y-4">
              <div>
                <label className="text-blueBrand-lighter form-label block mb-2">
                  Pickup Location
                </label>
                <input
                  type="text"
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Enter pickup location"
                />
                {errors.pickupLocation && (
                  <p className="text-red-500 text-xs mt-1">{errors.pickupLocation}</p>
                )}
              </div>

              <div>
                <label className="text-blueBrand-lighter form-label block mb-2">
                  Drop Location
                </label>
                <input
                  type="text"
                  name="dropLocation"
                  value={formData.dropLocation}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Enter drop location"
                />
                {errors.dropLocation && (
                  <p className="text-red-500 text-xs mt-1">{errors.dropLocation}</p>
                )}
              </div>
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
                    Cargo Size
                  </label>
                  <input
                    type="text"
                    name="cargoSize"
                    value={formData.cargoSize}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    placeholder="Enter cargo size"
                  />
                  {errors.cargoSize && (
                    <p className="text-red-500 text-xs mt-1">{errors.cargoSize}</p>
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
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Enter shipment description"
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
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Enter budget amount"
                />
                {errors.budget && (
                  <p className="text-red-500 text-xs mt-1">{errors.budget}</p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
              disabled={loading}
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
