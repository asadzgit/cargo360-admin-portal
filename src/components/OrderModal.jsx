/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { shipmentsService } from '../services/shipmentsService'

import truckImage from '../assets/images/truck.png'
import LocationModal from './LocationModal.jsx'

const OrderModal = ({ order, onClose }) => {
  const [showLocationModal, setShowLocationModal] = useState(false)

  if (!order) return null

  const shipmentData = order.shipmentData || {}

  // Check if shipment is trackable (in_transit or picked_up)
  const isTrackable = shipmentData.status === 'in_transit' || shipmentData.status === 'picked_up'

  // Accept/Reject discount request
  const handleAcceptDiscountRequest = async (discountRequestId, action) => {
    const result = await shipmentsService.decideDiscountRequest(discountRequestId, action)
    if (result.success) {
      window.alert(result.message || 'Decision recorded')
      onClose()
    } else {
      window.alert(result.error || result.message || 'Failed to decide discount request')
    }
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-[1000px] max-h-[90vh] overflow-y-auto pt-[30px] pb-[30px] px-[40px] relative">
        <div className="flex items-center justify-between mb-[25px]">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-sm flex items-center gap-1 absolute top-[24px] left-[30px]"
          >
            ←
          </button>
          <h2 className="modal-heading text-center flex-1">Shipment Details</h2>
          {isTrackable && (
            <button
              onClick={() => setShowLocationModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
            >
              View Location
            </button>
          )}
          <div className="w-12"></div> {/* Spacer to balance the layout */}
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="input-border px-[20px] py-[15px]">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex flex-col gap-[10px]">
                <span className="text-blueBrand-lighter form-label">
                  Shipment ID
                </span>
                <span className="form-subheading" style={{ lineHeight: '20px' }}>
                  {order.orderId}
                </span>
              </div>
              <div className="flex flex-col gap-[10px]">
                <span className="text-blueBrand-lighter form-label">
                  Customer
                </span>
                <span className="form-subheading" style={{ lineHeight: '20px' }}>
                  {order.customer}
                </span>
              </div>
              <div className="flex flex-col gap-[10px]">
                <span className="text-blueBrand-lighter form-label">Status</span>
                <span className="form-subheading" style={{ lineHeight: '20px' }}>
                  {shipmentData.status?.replace('_', ' ').toUpperCase() || 'PENDING'}
                </span>
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div>
            <h3 className="text-blueBrand-dark modal-heading mb-[15px]">
              Location Details
            </h3>
            <div className="input-border px-[20px] py-[15px]">
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-[10px]">
                  <span className="text-blueBrand-lighter form-label">
                    Pickup Location
                  </span>
                  <span className="form-subheading" style={{ lineHeight: '20px' }}>
                    {shipmentData.pickupLocation || 'Not specified'}
                  </span>
                </div>
                <div className="flex flex-col gap-[10px]">
                  <span className="text-blueBrand-lighter form-label">
                    Drop Location
                  </span>
                  <span className="form-subheading" style={{ lineHeight: '20px' }}>
                    {shipmentData.dropLocation || 'Not specified'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-blueBrand-dark modal-heading mb-[15px]">
              Customer Details
            </h3>
            <div className="input-border px-[20px] py-[15px]">
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-[10px]">
                  <span className="text-blueBrand-lighter form-label">
                    Customer Name
                  </span>
                  <span className="form-subheading" style={{ lineHeight: '20px' }}>
                    {shipmentData.Customer?.name || 'Not specified'}
                  </span>
                </div>
                <div className="flex flex-col gap-[10px]">
                  <span className="text-blueBrand-lighter form-label">
                    Customer Phone
                  </span>
                  <span className="form-subheading" style={{ lineHeight: '20px' }}>
                    {shipmentData.Customer?.phone || 'Not specified'}
                  </span>
                </div>
                <div className="flex flex-col gap-[10px]">
                  <span className="text-blueBrand-lighter form-label">
                    Company Name
                  </span>
                  <span className="form-subheading" style={{ lineHeight: '20px' }}>
                    {shipmentData.Customer?.company || 'Not specified'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Cargo Information */}
          <div>
            <h3 className="text-blueBrand-dark modal-heading mb-[15px]">
              Cargo Information
            </h3>
            <div className="input-border px-[20px] py-[15px]">
              <div className="grid grid-cols-2 gap-6 mb-4">
                <div className="flex flex-col gap-[10px]">
                  <span className="text-blueBrand-lighter form-label">
                    Cargo Type
                  </span>
                  <span className="form-subheading" style={{ lineHeight: '20px' }}>
                    {shipmentData.cargoType || 'Not specified'}
                  </span>
                </div>
                <div className="flex flex-col gap-[10px]">
                  <span className="text-blueBrand-lighter form-label">
                    Vehicle Type
                  </span>
                  <span className="form-subheading" style={{ lineHeight: '20px' }}>
                    {shipmentData.vehicleType || 'Not specified'}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 mb-4">
                <div className="flex flex-col gap-[10px]">
                  <span className="text-blueBrand-lighter form-label">
                    Cargo Weight
                  </span>
                  <span className="form-subheading" style={{ lineHeight: '20px' }}>
                    {shipmentData.cargoWeight ? `${shipmentData.cargoWeight} kg` : 'Not specified'}
                  </span>
                </div>
                <div className="flex flex-col gap-[10px]">
                  <span className="text-blueBrand-lighter form-label">
                    Cargo Size
                  </span>
                  <span className="form-subheading" style={{ lineHeight: '20px' }}>
                    {shipmentData.cargoSize || 'Not specified'}
                  </span>
                </div>
                <div className="flex flex-col gap-[10px]">
                  <span className="text-blueBrand-lighter form-label">
                    Budget (PKR)
                  </span>
                  <span className="form-subheading" style={{ lineHeight: '20px' }}>
                    {shipmentData.budget?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'Not specified'}
                  </span>
                </div>
              </div>
              {shipmentData.DiscountRequest && (
                <div className="flex flex-col gap-[10px]" style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', width: '50%' }}>
                  <span className="text-blueBrand-lighter form-label">
                    Discount Request
                  </span>
                  <div className="flex flex-col gap-[10px]">
                    <span className="form-subheading" style={{ lineHeight: '20px' }}>
                      Amount: {shipmentData.DiscountRequest.requestAmount}
                    </span>
                    <span className="form-subheading" style={{ lineHeight: '20px' }}>
                      Status: {shipmentData.DiscountRequest.status}
                    </span>
                    {shipmentData.DiscountRequest.status === 'pending' && (
                      <div className="flex gap-[10px]">
                        <button
                          className="btn btn-primary"
                          style={{ backgroundColor: '#FFB8B8', color: '#fff', padding: '1%', borderRadius: '5%' }}
                          onClick={() => handleAcceptDiscountRequest(shipmentData.DiscountRequest.id, 'accept')}>
                          Accept
                        </button>
                        <button
                          className="btn btn-error"
                          style={{ backgroundColor: 'teal', color: '#fff', padding: '1%', borderRadius: '5%' }}
                          onClick={() => handleAcceptDiscountRequest(shipmentData.DiscountRequest.id, 'reject')}>
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {shipmentData.description && (
                <div className="flex flex-col gap-[10px]">
                  <span className="text-blueBrand-lighter form-label">
                    Description
                  </span>
                  <span className="form-subheading" style={{ lineHeight: '20px' }}>
                    {shipmentData.description}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Financial Information */}
          {/* <div>
            <h3 className="text-blueBrand-dark modal-heading mb-[15px]">
              Financial Details
            </h3>
            <div className="input-border px-[20px] py-[15px] flex items-center gap-3">
              <img
                src={truckImage}
                alt="Shipment"
                className="h-12 w-12 rounded object-cover"
              />
              <div className="text-sm flex flex-col gap-[10px] flex-1">
                <div className="flex flex-row justify-between">
                  <div className="form-subheading" style={{ lineHeight: '20px' }}>
                    Shipment Budget
                  </div>
                  <div className="form-subheading" style={{ lineHeight: '20px' }}>
                    ${shipmentData.budget || '0.00'}
                  </div>
                </div>
                <div className="flex flex-row justify-between">
                  <div className="product-header" style={{ lineHeight: '20px' }}>
                    Service Type: {shipmentData.cargoType || 'Standard'}
                  </div>
                  <div className="product-header">
                    Created: {shipmentData.createdAt ? new Date(shipmentData.createdAt).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          {/* Assignment Information */}
          {(shipmentData.Trucker || shipmentData.Driver) && (
            <div>
              <h3 className="text-blueBrand-dark modal-heading mb-[15px]">
                Assignment Details
              </h3>
              <div className="input-border px-[20px] py-[15px]">
                <div className="grid grid-cols-2 gap-6">
                  {shipmentData.Trucker && (
                    <div className="flex flex-col gap-[10px]">
                      <span className="text-blueBrand-lighter form-label">
                        Assigned Trucker
                      </span>
                      <span className="form-subheading" style={{ lineHeight: '20px' }}>
                        {shipmentData.Trucker.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        ID: {shipmentData.Trucker.id} | {shipmentData.Trucker.email}
                      </span>
                    </div>
                  )}
                  {shipmentData.Driver && (
                    <div className="flex flex-col gap-[10px]">
                      <span className="text-blueBrand-lighter form-label">
                        Assigned Driver
                      </span>
                      <span className="form-subheading" style={{ lineHeight: '20px' }}>
                        {shipmentData.Driver.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        ID: {shipmentData.Driver.id} | {shipmentData.Driver.email}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Timestamps */}
          {(shipmentData.createdAt || shipmentData.updatedAt) && (
            <div>
              <h3 className="text-blueBrand-dark modal-heading mb-[15px]">
                Timeline
              </h3>
              <div className="input-border px-[20px] py-[15px]">
                <div className="grid grid-cols-2 gap-6">
                  {shipmentData.createdAt && (
                    <div className="flex flex-col gap-[10px]">
                      <span className="text-blueBrand-lighter form-label">
                        Created At
                      </span>
                      <span className="form-subheading" style={{ lineHeight: '20px' }}>
                        {new Date(shipmentData.createdAt).toLocaleString()}
                      </span>
                    </div>
                  )}
                  {shipmentData.updatedAt && (
                    <div className="flex flex-col gap-[10px]">
                      <span className="text-blueBrand-lighter form-label">
                        Last Updated
                      </span>
                      <span className="form-subheading" style={{ lineHeight: '20px' }}>
                        {new Date(shipmentData.updatedAt).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Location Modal */}
      {showLocationModal && (
        <LocationModal
          shipment={{
            orderId: order.orderId,
            shipmentId: order.orderId.replace('C360-PK-', ''),
            customer: order.customer,
            status: shipmentData.status,
            shipmentData: shipmentData
          }}
          onClose={() => setShowLocationModal(false)}
        />
      )}
    </div>
  )
}

export default OrderModal
