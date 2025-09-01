/* eslint-disable react/prop-types */
import React from 'react'

import truckImage from '../assets/images/truck.png'

const OrderModal = ({ order, onClose }) => {
  if (!order) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-[900px] h-[382px] pt-[30px] pb-[67px] px-[215px] relative">
        <div className="flex items-center justify-between mb-[25.5px]">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-sm flex items-center gap-1 absolute top-[24px] left-[30px]"
          >
            ←
          </button>
          <h2 className="modal-heading text-center flex-1">View Order</h2>
          <div className="w-12"></div> {/* Spacer to balance the layout */}
        </div>

        <div>
          <div className="input-border px-[20px] py-[13px]">
            <div className="flex justify-between text-sm font-semibold">
              <div className="flex flex-col gap-[10px]">
                <span className="text-blueBrand-lighter form-label">
                  Order ID
                </span>
                <span
                  className="form-subheading"
                  style={{ lineHeight: '20px' }}
                >
                  {order.orderId}
                </span>
              </div>
              <div className="flex flex-col gap-[10px]">
                <span className="text-blueBrand-lighter form-label">
                  Customer
                </span>
                <span
                  className="form-subheading"
                  style={{ lineHeight: '20px' }}
                >
                  {order.customer}
                </span>
              </div>
              <div className="flex flex-col gap-[10px]">
                <span className="text-blueBrand-lighter form-label">Total</span>
                <span
                  className="form-subheading"
                  style={{ lineHeight: '20px' }}
                >
                  ${order.total}
                </span>
              </div>
            </div>
          </div>

          <h3 className="text-blueBrand-dark modal-heading mb-[20px] mt-[25px]">
            Ordered Items
          </h3>
          <div className="input-border px-[20px] py-[13px] mb-4 flex items-center gap-3">
            <img
              src={truckImage}
              alt="Product"
              className="h-12 w-12 rounded object-cover"
            />
            <div className="text-sm flex flex-col gap-[10px] w-100">
              <div className="flex flex-row justify-between">
                <div className="form-subheading" style={{ lineHeight: '20px' }}>
                  {order.orderId}
                </div>
                <div className="form-subheading" style={{ lineHeight: '20px' }}>
                  ${order.itemPrice.toFixed(2)}
                </div>
              </div>
              <div className="flex flex-row justify-between">
                <div className="product-header" style={{ lineHeight: '20px' }}>
                  Commission: ${order.commission}
                </div>
                <div className="product-header">Qty: {order.qty}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderModal
