/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { shipmentsService } from '../services/shipmentsService'

import truckImage from '../assets/images/truck.png'
import LocationModal from './LocationModal.jsx'

// Converts numbers to words (simple PKR format)
const numberToWords = (num) => {
  if (num === 0) return "Zero Only";

  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven",
    "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen",
    "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];
  const b = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
  ];

  const numToWords = (n) => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
    if (n < 1000)
      return a[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + numToWords(n % 100) : "");
    if (n < 1000000)
      return numToWords(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + numToWords(n % 1000) : "");
    if (n < 1000000000)
      return numToWords(Math.floor(n / 1000000)) + " Million" + (n % 1000000 ? " " + numToWords(n % 1000000) : "");
    return num.toString();
  };

  return numToWords(num) + " Only";
};

// Helper function to get platform display value
const getPlatformDisplay = (shipmentData) => {
  // Check multiple possible field names from backend
  const platformValue = shipmentData?.platform ||
    shipmentData?.source ||
    shipmentData?.submittedFrom ||
    shipmentData?.bookingPlatform ||
    shipmentData?.bookingSource ||
    shipmentData?.submissionPlatform;

  if (!platformValue || platformValue === null || platformValue === undefined) {
    return { text: 'N/A', isMobile: false };
  }

  const platformLower = platformValue.toString().toLowerCase().trim();

  // Check for mobile app variations
  const isMobile = platformLower === 'mobile' ||
    platformLower === 'app' ||
    platformLower === 'cargo360-client-app' ||
    platformLower === 'android' ||
    platformLower === 'ios';

  // Check for web portal variations
  const isWeb = platformLower === 'web' ||
    platformLower === 'portal' ||
    platformLower === 'cargo360-client-portal' ||
    platformLower === 'website';

  if (isMobile) return { text: 'Mobile', isMobile: true };
  if (isWeb) return { text: 'Web', isMobile: false };

  // If value exists but doesn't match known patterns, display as-is
  return { text: platformValue, isMobile: false };
};

const OrderModal = ({ order, onClose }) => {
  const [showLocationModal, setShowLocationModal] = useState(false)

  if (!order) return null

  const shipmentData = order.shipmentData || {}

  // Check if shipment is trackable (in_transit or picked_up)
  const isTrackable = shipmentData.status === 'in_transit' || shipmentData.status === 'picked_up'

  // Get platform display information
  const platformDisplay = getPlatformDisplay(shipmentData)

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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${shipmentData.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    shipmentData.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                      shipmentData.status === 'in_transit' ? 'bg-yellow-100 text-yellow-800' :
                        shipmentData.status === 'picked_up' ? 'bg-orange-100 text-orange-800' :
                          shipmentData.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                    }`}>
                    {shipmentData.status?.replace('_', ' ').toUpperCase() || 'PENDING'}
                  </span>
                </span>
              </div>
              <div className="flex flex-col gap-[10px]">
                <span className="text-blueBrand-lighter form-label">
                  Platform
                </span>
                <span className="form-subheading" style={{ lineHeight: '20px' }}>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${platformDisplay.isMobile
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-blue-100 text-blue-800'
                    }`}>
                    {platformDisplay.text}
                  </span>
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
                    No. of Containers/Vehicles
                  </span>
                  <span className="form-subheading" style={{ lineHeight: '20px' }}>
                    {shipmentData.numberOfVehicles || 'Not specified'}
                  </span>
                </div>
                <div className="flex flex-col gap-[10px]">
                  <span className="text-blueBrand-lighter form-label">
                    Estimated budget
                  </span>
                  <span className="form-subheading" style={{ lineHeight: '20px' }}>
                    {shipmentData.budget?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'Not specified'}
                  </span>
                </div>
              </div>
              {shipmentData.DiscountRequest && (
                <div className="flex flex-col gap-[10px]" style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', width: '50%', marginBottom: '16px' }}>
                  <span className="text-blueBrand-lighter form-label" style={{ marginBottom: '8px' }}>
                    Discount Request
                  </span>
                  <div className="flex flex-col gap-[10px]">
                    <span className="form-subheading" style={{ lineHeight: '20px' }}>
                      Client want a discount of: {shipmentData.DiscountRequest.requestAmount}
                    </span>
                    <span className="form-subheading" style={{ lineHeight: '20px' }}>
                      Status: {shipmentData.DiscountRequest.status}
                    </span>
                    {shipmentData.budget && (
                      <>
                        <span className="form-subheading" style={{ lineHeight: '20px', marginTop: '10px', fontWeight: '600' }}>
                          Total Budget: PKR {shipmentData.totalAmount
                            ? (parseFloat(shipmentData.budget) - parseFloat(shipmentData.totalAmount)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                            : parseFloat(shipmentData.budget).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                          }
                        </span>
                        <span className="form-subheading" style={{ lineHeight: '20px', fontSize: '12px', color: '#666' }}>
                          {numberToWords(shipmentData.totalAmount
                            ? parseFloat(shipmentData.budget) - parseFloat(shipmentData.totalAmount)
                            : parseFloat(shipmentData.budget)
                          )}
                        </span>
                      </>
                    )}
                    {shipmentData.DiscountRequest.status === 'pending' && (
                      <div className="flex gap-[10px]">
                        <button
                          className="btn btn-primary transition-all duration-300"
                          style={{ backgroundColor: '#17B26A', color: '#fff', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer' }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#1dd876'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#17B26A'}
                          onClick={() => handleAcceptDiscountRequest(shipmentData.DiscountRequest.id, 'accept')}>
                          Accept
                        </button>
                        <button
                          className="btn btn-error transition-all duration-300"
                          style={{ backgroundColor: '#DC3434', color: '#fff', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer' }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#ff5252'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#DC3434'}
                          onClick={() => handleAcceptDiscountRequest(shipmentData.DiscountRequest.id, 'reject')}>
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {shipmentData.description && (
                <div className="flex flex-col gap-[10px]" style={{ marginTop: '16px' }}>
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
                      {shipmentData.Trucker.phone && (
                        <span className="text-xs text-gray-600">
                          Phone: {shipmentData.Trucker.phone}
                        </span>
                      )}
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
                      {shipmentData.Driver.phone && (
                        <span className="text-xs text-gray-600">
                          Phone: {shipmentData.Driver.phone}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Timestamps */}
          {(shipmentData.createdAt || shipmentData.updatedAt || shipmentData.deliveryDate || order.deliveryDate) && (
            <div>
              <h3 className="text-blueBrand-dark modal-heading mb-[15px]">
                Timeline
              </h3>
              <div className="input-border px-[20px] py-[15px]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  {(shipmentData.deliveryDate || order.deliveryDate) && (
                    <div className="flex flex-col gap-[10px]">
                      <span className="text-blueBrand-lighter form-label">
                        Delivery Date
                      </span>
                      <span className="form-subheading" style={{ lineHeight: '20px' }}>
                        {shipmentData.deliveryDate || order.deliveryDate}
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
