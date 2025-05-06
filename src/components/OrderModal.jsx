/* eslint-disable react/prop-types */
import React from 'react'

import productImage from '../assets/images/product-image.png'

const OrderModal = ({ order, onClose }) => {
  if (!order) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-[900px] relative">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-sm flex items-center gap-1"
          >
            ←
          </button>
          <h2 className="text-lg font-semibold text-center flex-1">
            View Order
          </h2>
          <div className="w-12"></div> {/* Spacer to balance the layout */}
        </div>

        <div className="w-[60%] m-auto">
          <div className="border rounded p-4 mb-4">
            <div className="flex justify-between text-sm font-semibold">
              <div className="flex flex-col gap-[10px]">
                <span className="text-blueBrand-lighter">Order ID</span>
                <span>{order.orderId}</span>
              </div>
              <div className="flex flex-col gap-[10px]">
                <span className="text-blueBrand-lighter">Customer</span>
                <span>{order.customer}</span>
              </div>
              <div className="flex flex-col gap-[10px]">
                <span className="text-blueBrand-lighter">Total</span>
                <span className="font-medium">${order.total}</span>
              </div>
            </div>
          </div>

          <h3 className="text-sm font-semibold mb-2">Ordered Items</h3>
          <div className="border rounded p-4 flex items-center gap-3 mb-8">
            <img
              src={productImage}
              alt="Product"
              className="h-12 w-12 rounded object-cover"
            />
            <div className="text-sm flex flex-col w-100">
              <div className="flex flex-row justify-between">
                <div>{order.orderId}</div>
                <div className="font-semibold">
                  ${order.itemPrice.toFixed(2)}
                </div>
              </div>
              <div className="flex flex-row justify-between">
                <div className="text-gray-500">
                  Commission: ${order.commission}
                </div>
                <div className="text-gray-500">Qty: {order.qty}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderModal
