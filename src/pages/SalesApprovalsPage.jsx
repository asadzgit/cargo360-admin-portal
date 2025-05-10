import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import payoutsIcon from '../assets/images/payouts-icon.svg'
import OrderModal from '../components/OrderModal.jsx'

const SalesApprovalsPage = () => {
  const { username } = useParams()
  const navigate = useNavigate()

  const [statusFilter, setStatusFilter] = useState('Pending')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [approvalStatus, setApprovalStatus] = useState({})
  const [dateFilter, setDateFilter] = useState('Recent Requests')
  const [requests, setRequests] = useState([
    {
      orderId: 'TXN-20250407-AB39KZ82',
      userName: 'Sarah',
      productName: 'Pain Away Gel',
      payout: 2000,
      receiptUrl: '#',
      dateTime: 'May 6, 2025 07:45 PM',
      status: 'Pending',
    },
    {
      orderId: 'TXN-20250407-XF73JLM21',
      userName: 'Talia',
      productName: 'Flexi Relief',
      payout: 2000,
      receiptUrl: '#',
      dateTime: 'Apr 21, 2025 07:45 PM',
      status: 'Pending',
    },
    {
      orderId: 'TXN-20250407-ZP18VY65',
      userName: 'Sarah',
      productName: 'Artho Ease',
      payout: 2000,
      receiptUrl: '#',
      dateTime: 'Apr 1, 2024 07:45 PM',
      status: 'Pending',
    },
    {
      orderId: 'TXN-20250407-MQ45RE94',
      userName: 'Sarah',
      productName: 'Soothi Patch',
      payout: 2000,
      receiptUrl: '#',
      dateTime: 'Jan 1, 2024 07:45 PM',
      status: 'Pending',
    },
    {
      orderId: 'TXN-20250407-LN92DC73',
      userName: 'Talia',
      productName: 'Thermo Flex',
      payout: 2000,
      receiptUrl: '#',
      dateTime: 'Apr 6, 2024 07:45 PM',
      status: 'Pending',
    },
    {
      orderId: 'TXN-20250407-ZP18VY65-2',
      userName: 'Talia',
      productName: 'Thera Vita',
      payout: 2000,
      receiptUrl: '#',
      dateTime: 'Apr 6, 2024 07:45 PM',
      status: 'Pending',
    },
  ])

  const filteredRequests = requests.filter((req) => {
    const matchesStatus =
      statusFilter === 'Pending' ||
      statusFilter === 'Approved' ||
      statusFilter === 'Rejected'
        ? req.status === statusFilter
        : true

    const matchesUser = username
      ? req.userName.toLowerCase() === username.toLowerCase()
      : true

    let matchesDate = true
    if (dateFilter === 'Last 15 Days' || dateFilter === 'Last 30 Days') {
      const days = dateFilter === 'Last 15 Days' ? 15 : 30
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - days)
      const reqDate = new Date(req.dateTime)
      matchesDate = reqDate >= cutoffDate
    }

    return matchesUser && matchesDate && matchesStatus
  })

  const handleAccept = (orderId) => {
    setRequests((prevRequests) =>
      prevRequests.map((req) =>
        req.orderId === orderId ? { ...req, status: 'Approved' } : req
      )
    )
  }

  const handleDecline = (orderId) => {
    setRequests((prevRequests) =>
      prevRequests.map((req) =>
        req.orderId === orderId ? { ...req, status: 'Rejected' } : req
      )
    )
  }

  const handleRowClick = (userName) => {
    navigate(`/approvals/${userName}`)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 px-[94px] py-[30px]">
        <div className="flex justify-between px-[12px]">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            {username && (
              <button
                onClick={() => navigate('/approvals')}
                className="text-gray-600 hover:text-black"
              >
                ←
              </button>
            )}
            <span className="text-purple-600">
              <img src={payoutsIcon} alt="icon" />
            </span>
            <span className="modal-heading">
              {username ? `Payout Requests (${username})` : 'Payout Requests'}
            </span>
          </h2>

          <div className="flex gap-[20px] mb-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded px-[14px] py-[10px] filter-button filter-button-border focus:outline-none"
            >
              <option>Pending</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="border rounded px-[14px] py-[10px] filter-button filter-button-border focus:outline-none"
            >
              <option>Recent Requests</option>
              <option>Last 15 Days</option>
              <option>Last 30 Days</option>
            </select>
            {!username && (
              <button
                className="text-blueBrand-normal filter-button"
                onClick={() => {
                  setStatusFilter('Pending')
                  setDateFilter('Recent Requests')
                  navigate('/approvals') // optional
                }}
              >
                View All
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-[#F6F5F6] text-blueBrand-normal text-xs font-semibold">
              <tr className="filter-button leading-[18px]">
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">User Name</th>
                <th className="px-4 py-3">Product Name</th>
                <th className="px-4 py-3">Payout</th>
                <th className="px-4 py-3">Receipt</th>
                {username && <th className="px-4 py-3">Orders</th>}
                <th className="px-4 py-3">Date & Time</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="text-blueBrand-dark">
              {filteredRequests.map((req) => (
                <tr
                  key={req.orderId}
                  className={`border-t cursor-pointer ${
                    req.status === 'Approved'
                      ? 'bg-[#ABEFC6]'
                      : req.status === 'Rejected'
                        ? 'bg-[#FDECEC]'
                        : 'hover:bg-gray-50'
                  }`}
                  onClick={() => !username && handleRowClick(req.userName)}
                >
                  <td className="px-[24px] py-[16px] form-subheading">
                    {req.orderId}
                  </td>
                  <td className="px-[24px] py-[16px] form-subheading">
                    {req.userName}
                  </td>
                  <td className="px-[24px] py-[16px] form-subheading">
                    {req.productName}
                  </td>
                  <td className="px-[24px] py-[16px] form-subheading text-green-600 text-[12px]">
                    <button
                      style={{
                        borderRadius: '4px',
                        border: '0.5px solid #ABEFC6',
                        background: '#ECFDF3',
                        padding: '2px 8px',
                      }}
                    >
                      ${` ${req.payout}`}
                    </button>
                  </td>
                  <td className="px-[24px] py-[16px] form-subheading">
                    <a
                      href={req.receiptUrl}
                      className="text-purple-600 underline"
                    >
                      View Receipt
                    </a>
                  </td>
                  {username && (
                    <td className="px-[24px] py-[16px]">
                      <button
                        className="text-purple-600 underline text-sm"
                        onClick={() =>
                          setSelectedOrder({
                            orderId: req.orderId,
                            customer: req.userName,
                            total: 240,
                            commission: 11,
                            qty: 2,
                            itemPrice: 40,
                          })
                        }
                      >
                        View Order
                      </button>
                    </td>
                  )}
                  <td
                    className="px-[24px] py-[16px] text-blueBrand-normal form-subheading"
                    style={{ lineHeight: '20px' }}
                  >
                    {req.dateTime.split(/(?<=\d{4})\s/).map((part, i) => (
                      <div key={i}>{part}</div>
                    ))}
                  </td>
                  <td className="px-[24px] py-[16px]">
                    {req.status === 'Approved' && (
                      <span className="text-green-700 font-semibold">
                        Approved
                      </span>
                    )}
                    {req.status === 'Rejected' && (
                      <span className="text-red-700 font-semibold">
                        Rejected
                      </span>
                    )}
                    {req.status === 'Pending' && (
                      <div className="flex gap-8">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDecline(req.orderId)
                          }}
                          className="action-button text-[#DC3434] hover:underline"
                        >
                          Decline
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleAccept(req.orderId)
                          }}
                          className="action-button text-[#17B26A] hover:underline"
                        >
                          Accept
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-[100px] text-right">
          <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-100">
            &lt; Back
          </button>
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              className={`px-3 py-1 m-1 border rounded ${page === 2 ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {page}
            </button>
          ))}
          <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-100">
            Next &gt;
          </button>
        </div>
      </main>

      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  )
}

export default SalesApprovalsPage
