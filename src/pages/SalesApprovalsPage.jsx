import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaTimes } from 'react-icons/fa'

import { useApp } from '../contexts/AppContext'
import { useAuth } from '../contexts/AuthContext'
import { shipmentsService } from '../services/shipmentsService'
import OrderModal from '../components/OrderModal.jsx'
import AssignmentModal from '../components/AssignmentModal.jsx'
import EditShipmentModal from '../components/EditShipmentModal.jsx'
import ShipmentLogsDrawer from '../components/ShipmentLogsDrawer.jsx'
import payoutsIcon from '../assets/images/payouts-icon.svg'
import { exportToCSV } from '../utils/csvExport'

const SalesApprovalsPage = () => {
  const { username, role } = useParams()
  const navigate = useNavigate()
  const { shipments, loading, error, dispatch, actions } = useApp()
  const { user } = useAuth()

  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [assignmentOrder, setAssignmentOrder] = useState(null)
  const [editOrder, setEditOrder] = useState(null)
  const [dateFilter, setDateFilter] = useState('Recent Requests')
  const [logsDrawer, setLogsDrawer] = useState({ open: false, shipmentId: null })
  
  // Decline reason modal state
  const [showDeclineModal, setShowDeclineModal] = useState(false)
  const [declineOrderId, setDeclineOrderId] = useState(null)
  const [selectedReason, setSelectedReason] = useState('')
  const [customReason, setCustomReason] = useState('')
  const [isDeclining, setIsDeclining] = useState(false)

  // Check if current user is admin
  const isAdmin = user?.email == 'muhammad.asad@cargo360pk.com' || user?.id == 126;

  // Fetch shipments on component mount
  useEffect(() => {
    fetchShipments()
  }, [])

  // Auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchShipments();
    }, 60000); // 10 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);


  const fetchShipments = async () => {
    dispatch({ type: actions.SET_SHIPMENTS_LOADING, payload: true })

    try {
      const result = await shipmentsService.getAllShipments()

      if (result.success) {
        dispatch({ type: actions.SET_SHIPMENTS_SUCCESS, payload: result.data })
      } else {
        dispatch({ type: actions.SET_SHIPMENTS_ERROR, payload: result.error })
        toast.error(result.message || 'Failed to fetch shipments')
      }
    } catch (error) {
      dispatch({ type: actions.SET_SHIPMENTS_ERROR, payload: error.message })
      toast.error('An error occurred while fetching shipments')
    }
  }

  // Transform shipments data to match the UI format
  const transformedShipments = shipments.map(shipment => ({
    orderId: `C360-PK-${shipment.id}`,
    userName: shipment.Customer?.name || 'Unknown Customer',
    productName: shipment.cargoType || 'Cargo',
    payout: shipment.budget || 0,
    receiptUrl: '#',
    dateTime: new Date(shipment.createdAt).toLocaleString(),
    status: shipment.status,
    shipmentData: shipment, // Keep original data for reference
  }))

  const filteredRequests = transformedShipments.filter((req) => {
    console.log(req.shipmentData?.Trucker?.name.toLowerCase())
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter

    let matchesUser = true
    if (username && role) {
      // Filter based on role
      if (role === 'customer') {
        // Show orders where this user is the customer
        matchesUser = req.userName.toLowerCase() === username.toLowerCase()
      } else if (role === 'trucker') {
        // Show orders where this user is the assigned trucker/broker
        matchesUser = req.shipmentData?.Trucker?.name.toLowerCase() === username.toLowerCase()
      } else if (role === 'driver') {
        // Show orders where this user is the assigned driver
        matchesUser = req.shipmentData?.Driver?.name.toLowerCase() === username.toLowerCase()
      } else {
        // For other roles, show both customer and trucker matches
        matchesUser = req.userName.toLowerCase() === username.toLowerCase() ||
          req.shipmentData?.Trucker?.name.toLowerCase() === username.toLowerCase() ||
          req.shipmentData?.Driver?.name.toLowerCase() === username.toLowerCase()
      }
    }

    let matchesDate = true
    if (dateFilter === 'Last 15 Days' || dateFilter === 'Last 30 Days') {
      const days = dateFilter === 'Last 15 Days' ? 15 : 30
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - days)
      const reqDate = new Date(req.shipmentData.createdAt)
      matchesDate = reqDate >= cutoffDate
    }

    return matchesUser && matchesDate && matchesStatus
  })

  const handleAccept = async (orderId) => {
    const shipmentId = orderId.replace('C360-PK-', '')

    try {
      const result = await shipmentsService.updateShipmentStatus(shipmentId, 'accepted')

      if (result.success) {
        dispatch({ type: actions.UPDATE_SHIPMENT, payload: result.data })
        toast.success('Shipment accepted successfully')
      } else {
        toast.error(result.message || 'Failed to accept shipment')
      }
    } catch (error) {
      toast.error('An error occurred while accepting shipment')
    }
  }

  const handleDecline = (orderId) => {
    setDeclineOrderId(orderId)
    setShowDeclineModal(true)
    setSelectedReason('')
    setCustomReason('')
  }

  const handleCloseDeclineModal = () => {
    setShowDeclineModal(false)
    setDeclineOrderId(null)
    setSelectedReason('')
    setCustomReason('')
  }

  const handleSubmitDecline = async () => {
    if (!selectedReason) {
      toast.error('Please select a decline reason')
      return
    }

    if (selectedReason === 'Others' && !customReason.trim()) {
      toast.error('Please enter your decline reason')
      return
    }

    if (!declineOrderId) return

    const shipmentId = declineOrderId.replace('C360-PK-', '')
    const declineReason = selectedReason === 'Others' ? customReason.trim() : selectedReason

    try {
      setIsDeclining(true)
      setShowDeclineModal(false)

      const result = await shipmentsService.deleteShipment(shipmentId, declineReason)

      if (result.success) {
        dispatch({ type: actions.DELETE_SHIPMENT, payload: parseInt(shipmentId) })
        toast.success('Shipment declined successfully')
        fetchShipments() // Refresh the list
      } else {
        toast.error(result.message || 'Failed to decline shipment')
        setShowDeclineModal(true) // Reopen modal on error
      }
    } catch (error) {
      console.error('Decline error:', error)
      toast.error(error?.message || 'An error occurred while declining shipment')
      setShowDeclineModal(true) // Reopen modal on error
    } finally {
      setIsDeclining(false)
      if (!showDeclineModal) {
        setDeclineOrderId(null)
        setSelectedReason('')
        setCustomReason('')
      }
    }
  }

  const handleDeleteShipment = async (orderId) => {
    const shipmentId = orderId.replace('C360-PK-', '')

    if (window.confirm('Are you sure you want to delete this shipment?')) {
      try {
        const result = await shipmentsService.deleteShipment(shipmentId)

        if (result.success) {
          dispatch({ type: actions.DELETE_SHIPMENT, payload: parseInt(shipmentId) })
          toast.success('Shipment deleted successfully')
        } else {
          toast.error(result.message || 'Failed to delete shipment')
        }
      } catch (error) {
        toast.error('An error occurred while deleting shipment')
      }
    }
  }

  const handleEditShipment = (req) => {
    setEditOrder({
      orderId: req.orderId,
      shipmentId: req.orderId.replace('C360-PK-', ''),
      customer: req.userName,
      status: req.status,
      shipmentData: req.shipmentData,
    })
  }

  const handleUpdateShipment = (updatedShipment) => {
    // Update the shipment in the context
    dispatch({ type: actions.UPDATE_SHIPMENT, payload: updatedShipment })
    fetchShipments() // Refresh the list to get latest data
  }

  const handleRowClick = (userName, userRole) => {
    navigate(`/orders/${userName}/${userRole}`)
  }

  const handleAssignment = (orderId) => {
    const shipmentId = orderId.replace('C360-PK-', '')
    const shipment = filteredRequests.find(req => req.orderId === orderId)

    if (shipment) {
      setAssignmentOrder({
        orderId: orderId,
        shipmentId: shipmentId,
        customer: shipment.userName,
        status: shipment.status,
        shipmentData: shipment.shipmentData
      })
    }
  }

  const handleAssignSubmit = async (orderId, assignmentType, userId) => {
    const shipmentId = orderId.replace('C360-PK-', '')

    try {
      const result = await shipmentsService.assignShipment(shipmentId, assignmentType, userId)

      if (result.success) {
        dispatch({ type: actions.UPDATE_SHIPMENT, payload: result.data })
        toast.success(`Shipment assigned to ${assignmentType} successfully`)
        setAssignmentOrder(null)
      } else {
        toast.error(result.message || `Failed to assign shipment to ${assignmentType}`)
      }
    } catch (error) {
      toast.error(`An error occurred while assigning shipment to ${assignmentType}`)
    }
  }

  const handleViewLogs = (shipmentId) => {
    setLogsDrawer({
      open: true,
      shipmentId
    })
  }

  const handleExportCSV = () => {
    const headers = [
      { label: 'Shipment ID', key: 'orderId' },
      { label: 'Customer Name', key: 'userName' },
      { label: 'Cargo Type', key: 'productName' },
      { label: 'Pickup Location', key: 'shipmentData.pickupLocation' },
      { label: 'Drop Location', key: 'shipmentData.dropLocation' },
      { label: 'Date & Time', key: 'dateTime' },
      { label: 'Status', key: 'status' },
    ]

    const filename = `orders_${new Date().toISOString().split('T')[0]}.csv`
    exportToCSV(filteredRequests, headers, filename)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 px-[94px] py-[30px]">
        <div className="flex justify-between px-[12px]">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            {username && (
              <button
                onClick={() => navigate(-1)}
                className="text-gray-600 hover:text-black"
              >
                ←
              </button>
            )}
            <span className="text-purple-600">
              <img src={payoutsIcon} alt="icon" />
            </span>
            <span className="modal-heading">
              {username ? `Orders (${username}${role ? ` - ${role === 'trucker' ? 'Broker' : role.charAt(0).toUpperCase() + role.slice(1)}` : ''})` : 'Orders'}
            </span>
          </h2>

          <div className="flex gap-[20px] mb-4">
            <button
              onClick={handleExportCSV}
              className="border rounded px-[14px] py-[10px] filter-button filter-button-border focus:outline-none bg-blue-600 text-white hover:bg-blue-500 transition-colors duration-300 ease-in-out"
            >
              Export CSV
            </button>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded px-[14px] py-[10px] filter-button filter-button-border focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="picked_up">Picked Up</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
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
                  setStatusFilter('all')
                  setDateFilter('Recent Requests')
                  fetchShipments() // Refresh data
                }}
              >
                Refresh
              </button>
            )}
          </div>
        </div>

        {/* Loading state */}
        {/* {loading.shipments && (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">Loading shipments...</div>
          </div>
        )} */}

        {/* Error state */}
        {error.shipments && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error.shipments}
          </div>
        )}

        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-[#F6F5F6] text-blueBrand-normal text-xs font-semibold">
              <tr className="filter-button leading-[18px]">
                <th className="px-4 py-3">Shipment ID</th>
                <th className="px-4 py-3">Customer Name</th>
                <th className="px-4 py-3">Cargo Type</th>
                {/* <th className="px-4 py-3">Budget</th> */}
                <th className="px-4 py-3">Pickup Location</th>
                <th className="px-4 py-3">Drop Location</th>
                <th className="px-4 py-3">Date & Time</th>
                <th className="px-4 py-3">Status</th>
                {<th className="px-4 py-3">Details</th>}
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="text-blueBrand-dark">
              {filteredRequests.map((req) => (
                <tr
                  key={req.orderId}
                  className={`border-t cursor-pointer ${req.status === 'delivered' || req.status === 'accepted'
                    ? 'bg-[#ABEFC6]'
                    : req.status === 'cancelled'
                      ? 'bg-[#FDECEC]'
                      : 'hover:bg-gray-50'
                    }`}
                  onClick={() => !username && handleRowClick(req.userName, 'customer')}
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
                  {/* <td className="px-[24px] py-[16px] form-subheading text-green-600 text-[12px]">
                    <button
                      style={{
                        borderRadius: '4px',
                        border: '0.5px solid #ABEFC6',
                        background: '#ECFDF3',
                        padding: '2px 8px',
                      }}
                    >
                      ${req.payout}
                    </button>
                  </td> */}
                  <td className="px-[24px] py-[16px] form-subheading text-xs">
                    {req.shipmentData.pickupLocation?.substring(0, 30)}...
                  </td>
                  <td className="px-[24px] py-[16px] form-subheading text-xs">
                    {req.shipmentData.dropLocation?.substring(0, 30)}...
                  </td>
                  <td
                    className="px-[24px] py-[16px] text-blueBrand-normal form-subheading"
                    style={{ lineHeight: '20px' }}
                  >
                    {req.dateTime.split(/(?<=\d{4})\s/).map((part, i) => (
                      <div key={i}>{part}</div>
                    ))}
                  </td>
                  <td className="px-[24px] py-[16px]">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${req.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      req.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                        req.status === 'in_transit' ? 'bg-yellow-100 text-yellow-800' :
                          req.status === 'picked_up' ? 'bg-orange-100 text-orange-800' :
                            req.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                      }`}>
                      {req.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  {(
                    <td className="px-[24px] py-[16px]">
                      <div className="flex gap-2">
                        <button
                          className="text-purple-600 underline text-sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            console.log(req);
                            setSelectedOrder({
                              orderId: req.orderId,
                              customer: req.userName,
                              shipmentData: req.shipmentData,
                            })
                          }}
                        >
                          Quick View
                        </button>
                        <button
                          className="text-teal-600 underline text-sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleViewLogs(req.shipmentData.id)
                          }}
                        >
                          View Logs
                        </button>
                      </div>
                    </td>
                  )}
                  <td className="px-[24px] py-[16px]">
                    <div className="flex gap-2">
                      {req.status?.toLowerCase() != 'cancelled' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDecline(req.orderId)
                          }}
                          className="action-button text-[#DC3434] hover:underline text-xs"
                        >
                          Decline
                        </button>
                      )}
                      {req.status === 'pending' && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleAccept(req.orderId)
                            }}
                            className="action-button text-[#17B26A] hover:underline text-xs"
                          >
                            Accept
                          </button>
                        </>
                      )}
                      {req.status === 'accepted' || req.status === 'confirmed' && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleAssignment(req.orderId)
                            }}
                            className="action-button text-[#17B26A] hover:underline text-xs"
                          >
                            Assign broker/driver
                          </button>
                        </>
                      )}
                      {isAdmin && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditShipment(req)
                            }}
                            className="action-button text-[#17B26A] hover:underline text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteShipment(req.orderId)
                            }}
                            className="action-button text-[#DC3434] hover:underline text-xs"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* <div className="mt-[100px] text-right">
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
        </div> */}
      </main >

      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {assignmentOrder && (
        <AssignmentModal
          shipment={assignmentOrder}
          onClose={() => setAssignmentOrder(null)}
          onAssign={handleAssignSubmit}
        />
      )}

      {editOrder && (
        <EditShipmentModal
          shipment={editOrder}
          onClose={() => setEditOrder(null)}
          onUpdate={handleUpdateShipment}
        />
      )}

      <ShipmentLogsDrawer
        open={logsDrawer.open}
        shipmentId={logsDrawer.shipmentId}
        onClose={() => setLogsDrawer({ open: false, shipmentId: null })}
      />

      {/* Decline Reason Modal */}
      {showDeclineModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleCloseDeclineModal}
        >
          <div 
            className="bg-white rounded-lg w-[500px] max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{
              borderRadius: '12px'
            }}
          >
            {/* Modal Header */}
            <div 
              className="text-white px-6 py-5 rounded-t-lg flex items-center justify-between"
              style={{
                background: 'linear-gradient(135deg, #01304e 0%, #ed8411 100%)',
                borderRadius: '12px 12px 0 0'
              }}
            >
              <h3 className="modal-heading text-white flex items-center gap-2 m-0">
                <FaTimes className="text-white" />
                Decline Request
              </h3>
              <button 
                onClick={handleCloseDeclineModal}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors flex items-center justify-center"
                disabled={isDeclining}
                style={{ 
                  minWidth: '36px', 
                  minHeight: '36px',
                  cursor: isDeclining ? 'not-allowed' : 'pointer'
                }}
              >
                <FaTimes className="text-white" size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="pt-[30px] pb-[30px] px-[40px]">
              <div className="mb-6">
                <h4 className="form-heading text-blueBrand-dark mb-2">
                  Why are you declining this request?
                </h4>
                <p className="form-subheading text-blueBrand-lighter mb-0">
                  Please select a reason for declining *
                </p>
              </div>

              {/* Reason Options */}
              <div className="space-y-3 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedReason('Not satisfied with the rates')
                    setCustomReason('')
                  }}
                  className={`w-full text-left px-5 py-4 rounded-lg border-2 transition-all ${
                    selectedReason === 'Not satisfied with the rates'
                      ? 'border-[#01304e] bg-blue-50 text-[#01304e] font-semibold shadow-sm'
                      : 'input-border bg-white text-blueBrand-dark hover:border-gray-400 hover:shadow-sm'
                  }`}
                  style={{
                    fontFamily: 'inherit',
                    fontSize: '14px',
                    lineHeight: '22px',
                    cursor: 'pointer'
                  }}
                >
                  Not satisfied with the rates
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedReason("Don't need Booking anymore")
                    setCustomReason('')
                  }}
                  className={`w-full text-left px-5 py-4 rounded-lg border-2 transition-all ${
                    selectedReason === "Don't need Booking anymore"
                      ? 'border-[#01304e] bg-blue-50 text-[#01304e] font-semibold shadow-sm'
                      : 'input-border bg-white text-blueBrand-dark hover:border-gray-400 hover:shadow-sm'
                  }`}
                  style={{
                    fontFamily: 'inherit',
                    fontSize: '14px',
                    lineHeight: '22px',
                    cursor: 'pointer'
                  }}
                >
                  Don't need Booking anymore
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedReason('Others')}
                  className={`w-full text-left px-5 py-4 rounded-lg border-2 transition-all ${
                    selectedReason === 'Others'
                      ? 'border-[#01304e] bg-blue-50 text-[#01304e] font-semibold shadow-sm'
                      : 'input-border bg-white text-blueBrand-dark hover:border-gray-400 hover:shadow-sm'
                  }`}
                  style={{
                    fontFamily: 'inherit',
                    fontSize: '14px',
                    lineHeight: '22px',
                    cursor: 'pointer'
                  }}
                >
                  Others
                </button>
              </div>

              {/* Custom Reason Input */}
              {selectedReason === 'Others' && (
                <div className="mb-6">
                  <label className="form-label text-blueBrand-dark mb-2 block">
                    Please specify your reason *
                  </label>
                  <textarea
                    className="w-full px-4 py-3 input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#01304e]/20 focus:border-[#01304e] resize-none"
                    placeholder="Enter your decline reason"
                    rows={4}
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    style={{
                      fontFamily: 'inherit',
                      fontSize: '14px',
                      lineHeight: '22px',
                      minHeight: '100px'
                    }}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-5 border-t" style={{ borderColor: '#e6e4e7' }}>
                <button
                  type="button"
                  onClick={handleCloseDeclineModal}
                  disabled={isDeclining}
                  className="flex-1 px-6 py-3 border-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    fontSize: '14px',
                    lineHeight: '20px',
                    borderColor: '#e6e4e7',
                    color: '#546881',
                    backgroundColor: 'white',
                    cursor: isDeclining ? 'not-allowed' : 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    if (!isDeclining) {
                      e.target.style.backgroundColor = '#f8f9fa'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'white'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitDecline}
                  disabled={isDeclining || !selectedReason || (selectedReason === 'Others' && !customReason.trim())}
                  className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    fontSize: '14px',
                    lineHeight: '20px',
                    backgroundColor: '#01304e',
                    color: 'white',
                    border: 'none',
                    cursor: (isDeclining || !selectedReason || (selectedReason === 'Others' && !customReason.trim())) ? 'not-allowed' : 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    if (!isDeclining && selectedReason && (selectedReason !== 'Others' || customReason.trim())) {
                      e.target.style.backgroundColor = '#014a7a'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#01304e'
                  }}
                >
                  {isDeclining ? 'Declining...' : 'Confirm Decline'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div >
  )
}

export default SalesApprovalsPage
