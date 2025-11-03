import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { useApp } from '../contexts/AppContext'
import { useAuth } from '../contexts/AuthContext'
import { shipmentsService } from '../services/shipmentsService'
import OrderModal from '../components/OrderModal.jsx'
import AssignmentModal from '../components/AssignmentModal.jsx'
import EditShipmentModal from '../components/EditShipmentModal.jsx'
import payoutsIcon from '../assets/images/payouts-icon.svg'

const SalesApprovalsPage = () => {
  const { username } = useParams()
  const navigate = useNavigate()
  const { shipments, loading, error, dispatch, actions } = useApp()
  const { user } = useAuth()

  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [assignmentOrder, setAssignmentOrder] = useState(null)
  const [editOrder, setEditOrder] = useState(null)
  const [dateFilter, setDateFilter] = useState('Recent Requests')

  // Check if current user is admin
  const isAdmin = user?.email === 'muhammad.asad@cargo360pk.com';

  // Fetch shipments on component mount
  useEffect(() => {
    fetchShipments()
  }, [])

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

    const matchesUser = username
      ? req.userName.toLowerCase() === username.toLowerCase() ||
      req.shipmentData?.Trucker?.name.toLowerCase() === username.toLowerCase()
      : true

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

  const handleDecline = async (orderId) => {
    const shipmentId = orderId.replace('C360-PK-', '')

    try {
      const result = await shipmentsService.updateShipmentStatus(shipmentId, 'cancelled')

      if (result.success) {
        dispatch({ type: actions.UPDATE_SHIPMENT, payload: result.data })
        toast.success('Shipment declined successfully')
      } else {
        toast.error(result.message || 'Failed to decline shipment')
      }
    } catch (error) {
      toast.error('An error occurred while declining shipment')
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

  const handleRowClick = (userName) => {
    navigate(`/orders/${userName}`)
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
              {username ? `Orders (${username})` : 'Orders'}
            </span>
          </h2>

          <div className="flex gap-[20px] mb-4">
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
        {loading.shipments && (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">Loading shipments...</div>
          </div>
        )}

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
                      <button
                        className="text-purple-600 underline text-sm"
                        onClick={() => {
                          console.log(req);
                          setSelectedOrder({
                            orderId: req.orderId,
                            customer: req.userName,
                            shipmentData: req.shipmentData,
                          })
                        }}
                      >
                        View Details
                      </button>
                    </td>
                  )}
                  <td className="px-[24px] py-[16px]">
                    <div className="flex gap-2">
                      {req.status === 'pending' && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDecline(req.orderId)
                            }}
                            className="action-button text-[#DC3434] hover:underline text-xs"
                          >
                            Decline
                          </button>
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
                      {req.status === 'accepted' && (
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
    </div >
  )
}

export default SalesApprovalsPage
