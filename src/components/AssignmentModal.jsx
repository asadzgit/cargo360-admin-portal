/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { usersService } from '../services/usersService'
import { useAuth } from '../contexts/AuthContext'
import { shipmentsService } from '../services/shipmentsService'

const AssignmentModal = ({ shipment, onClose, onAssign }) => {
    const { user } = useAuth()
    const [assignmentType, setAssignmentType] = useState('')
    const [selectedUserId, setSelectedUserId] = useState('')
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [hasTruckerBeenReassigned, setHasTruckerBeenReassigned] = useState(false)
    const [hasDriverBeenReassigned, setHasDriverBeenReassigned] = useState(false)
    const [checkingReassignment, setCheckingReassignment] = useState(true)

    // Check if user is super admin
    const isSuperAdmin = user?.email === 'muhammad.asad@cargo360pk.com' || user?.id === 126

    // Check if there's been a previous reassignment by examining logs
    useEffect(() => {
        const checkReassignmentHistory = async () => {
            if (!shipment?.shipmentId) {
                setCheckingReassignment(false)
                return
            }

            try {
                const result = await shipmentsService.getShipmentLogs(shipment.shipmentId, 100)
                if (result.success && result.data) {
                    // Track reassignments separately for trucker and driver
                    let truckerReassignmentCount = 0
                    let driverReassignmentCount = 0
                    
                    result.data.forEach((log) => {
                        if (log.operation === 'update' && log.diff) {
                            const diff = log.diff
                            
                            // Check all keys in diff - field names might be formatted (e.g., "Trucker ID" or "truckerId")
                            Object.keys(diff).forEach((key) => {
                                const keyLower = key.toLowerCase()
                                const diffValue = diff[key]
                                
                                // Handle both object format { old, new } and array format [old, new]
                                let oldValue, newValue
                                if (diffValue && typeof diffValue === 'object') {
                                    if (Array.isArray(diffValue)) {
                                        oldValue = diffValue[0]
                                        newValue = diffValue[1]
                                    } else {
                                        oldValue = diffValue.old
                                        newValue = diffValue.new
                                    }
                                } else {
                                    return // Skip if format is unexpected
                                }
                                
                                // Check if truckerId was reassigned (from non-null to different non-null)
                                if (keyLower === 'trucker id' || keyLower === 'truckerid' || key === 'truckerId') {
                                    if (oldValue !== null && oldValue !== undefined && 
                                        newValue !== null && newValue !== undefined && 
                                        oldValue !== newValue) {
                                        truckerReassignmentCount++
                                    }
                                }
                                
                                // Check if driverId was reassigned (from non-null to different non-null)
                                if (keyLower === 'driver id' || keyLower === 'driverid' || key === 'driverId') {
                                    if (oldValue !== null && oldValue !== undefined && 
                                        newValue !== null && newValue !== undefined && 
                                        oldValue !== newValue) {
                                        driverReassignmentCount++
                                    }
                                }
                            })
                        }
                    })
                    // Set flags separately - each can be reassigned once
                    setHasTruckerBeenReassigned(truckerReassignmentCount >= 1)
                    setHasDriverBeenReassigned(driverReassignmentCount >= 1)
                    
                    // Debug logging
                    console.log('Reassignment check:', {
                        truckerReassignmentCount,
                        driverReassignmentCount,
                        hasTruckerBeenReassigned: truckerReassignmentCount >= 1,
                        hasDriverBeenReassigned: driverReassignmentCount >= 1
                    })
                }
            } catch (error) {
                console.error('Error checking reassignment history:', error)
                // On error, assume no reassignment to be safe
                setHasTruckerBeenReassigned(false)
                setHasDriverBeenReassigned(false)
            } finally {
                setCheckingReassignment(false)
            }
        }

        checkReassignmentHistory()
    }, [shipment?.shipmentId])

    useEffect(() => {
        if (assignmentType) {
            fetchUsers()
        }
    }, [assignmentType])

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const result = await usersService.getAllUsers({ role: assignmentType })
            if (result.success) {
                // Filter for approved users only
                // const approvedUsers = result.data.filter(user => user.isApproved && user.role === assignmentType)
                const approvedUsers = result.data.filter(user => user.role === assignmentType)
                setUsers(approvedUsers)
            } else {
                toast.error('Failed to fetch users')
                setUsers([])
            }
        } catch (error) {
            toast.error('Error fetching users')
            setUsers([])
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async () => {
        if (!assignmentType || !selectedUserId) {
            toast.error('Please select assignment type and user')
            return
        }

        // Check if trying to reassign (only if assigning to a different user)
        const isReassigningBroker = assignmentType === 'trucker' && 
            shipment.shipmentData?.Trucker && 
            shipment.shipmentData.Trucker.id !== parseInt(selectedUserId)
        const isReassigningDriver = assignmentType === 'driver' && 
            shipment.shipmentData?.Driver && 
            shipment.shipmentData.Driver.id !== parseInt(selectedUserId)

        if (isReassigningBroker) {
            // Only super admin can reassign
            if (!isSuperAdmin) {
                toast.error('Only super admin can reassign brokers')
                return
            }

            // Check if trucker has already been reassigned once
            if (hasTruckerBeenReassigned) {
                toast.error('This broker has already been reassigned once. Further reassignments are not allowed.')
                return
            }
        }

        if (isReassigningDriver) {
            // Only super admin can reassign
            if (!isSuperAdmin) {
                toast.error('Only super admin can reassign drivers')
                return
            }

            // Check if driver has already been reassigned once
            if (hasDriverBeenReassigned) {
                toast.error('This driver has already been reassigned once. Further reassignments are not allowed.')
                return
            }
        }

        setSubmitting(true)
        try {
            await onAssign(shipment.orderId, assignmentType, parseInt(selectedUserId))
            onClose()
        } catch (error) {
            toast.error('Failed to assign shipment')
        } finally {
            setSubmitting(false)
        }
    }

    const handleAssignmentTypeChange = (type) => {
        // Check if trying to reassign
        const isReassigningBroker = type === 'trucker' && shipment.shipmentData?.Trucker
        const isReassigningDriver = type === 'driver' && shipment.shipmentData?.Driver

        if (isReassigningBroker) {
            // Only super admin can reassign
            if (!isSuperAdmin) {
                toast.error('Only super admin can reassign brokers')
                return
            }

            // Check if trucker has already been reassigned once
            if (hasTruckerBeenReassigned) {
                toast.error('This broker has already been reassigned once. Further reassignments are not allowed.')
                return
            }
        }

        if (isReassigningDriver) {
            // Only super admin can reassign
            if (!isSuperAdmin) {
                toast.error('Only super admin can reassign drivers')
                return
            }

            // Check if driver has already been reassigned once
            if (hasDriverBeenReassigned) {
                toast.error('This driver has already been reassigned once. Further reassignments are not allowed.')
                return
            }
        }

        setAssignmentType(type)
        setSelectedUserId('')
        setUsers([])
    }

    // Check if broker or driver is already assigned
    const isBrokerAssigned = shipment.shipmentData?.Trucker !== null && shipment.shipmentData?.Trucker !== undefined
    const isDriverAssigned = shipment.shipmentData?.Driver !== null && shipment.shipmentData?.Driver !== undefined

    // Determine if reassignment should be disabled (not super admin or already reassigned once)
    // Track trucker and driver reassignments separately
    const canReassignBroker = isSuperAdmin && !hasTruckerBeenReassigned
    const canReassignDriver = isSuperAdmin && !hasDriverBeenReassigned

    // Clear assignment type if broker or driver is selected but reassignment is not allowed
    useEffect(() => {
        if (assignmentType === 'trucker' && isBrokerAssigned && !canReassignBroker) {
            setAssignmentType('')
            setSelectedUserId('')
            setUsers([])
        }
        if (assignmentType === 'driver' && isDriverAssigned && !canReassignDriver) {
            setAssignmentType('')
            setSelectedUserId('')
            setUsers([])
        }
    }, [isBrokerAssigned, isDriverAssigned, assignmentType, canReassignBroker, canReassignDriver])

    if (!shipment) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg w-[600px] max-h-[90vh] overflow-y-auto pt-[30px] pb-[30px] px-[40px] relative">
                <div className="flex items-center justify-between mb-[25px]">
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 text-sm flex items-center gap-1 absolute top-[24px] left-[30px]"
                    >
                        ←
                    </button>
                    <h2 className="modal-heading text-center flex-1">Assign Shipment</h2>
                    <div className="w-12"></div>
                </div>

                <div className="space-y-6">
                    {/* Shipment Info */}
                    <div className="input-border px-[20px] py-[15px]">
                        <div className="text-sm">
                            <div className="flex justify-between mb-2">
                                <span className="text-blueBrand-lighter form-label">Shipment ID:</span>
                                <span className="form-subheading">{shipment.orderId}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-blueBrand-lighter form-label">Company Name:</span>
                                <span className="form-subheading">{shipment.shipmentData?.Customer?.company || 'Not available'}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-blueBrand-lighter form-label">Customer:</span>
                                <span className="form-subheading">{shipment.customer}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-blueBrand-lighter form-label">Status:</span>
                                <span className="form-subheading">{shipment.status?.toUpperCase()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Assignment Information - Show if trucker/driver is already assigned */}
                    {shipment.shipmentData && (shipment.shipmentData.Trucker || shipment.shipmentData.Driver) && (
                        <div>
                            <h3 className="text-blueBrand-dark modal-heading mb-[15px]">
                                Current Assignment
                            </h3>
                            <div className="input-border px-[20px] py-[15px]">
                                <div className="grid grid-cols-1 gap-4">
                                    {shipment.shipmentData.Trucker && (
                                        <div className="flex flex-col gap-[10px]">
                                            <span className="text-blueBrand-lighter form-label">
                                                Assigned Trucker/Broker
                                            </span>
                                            <span className="form-subheading" style={{ lineHeight: '20px' }}>
                                                {shipment.shipmentData.Trucker.name}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                ID: {shipment.shipmentData.Trucker.id} | {shipment.shipmentData.Trucker.email}
                                            </span>
                                            {shipment.shipmentData.Trucker.phone && (
                                                <span className="text-xs text-gray-600">
                                                    Phone: {shipment.shipmentData.Trucker.phone}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    {shipment.shipmentData.Driver && (
                                        <div className="flex flex-col gap-[10px]">
                                            <span className="text-blueBrand-lighter form-label">
                                                Assigned Driver
                                            </span>
                                            <span className="form-subheading" style={{ lineHeight: '20px' }}>
                                                {shipment.shipmentData.Driver.name}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                ID: {shipment.shipmentData.Driver.id} | {shipment.shipmentData.Driver.email}
                                            </span>
                                            {shipment.shipmentData.Driver.phone && (
                                                <span className="text-xs text-gray-600">
                                                    Phone: {shipment.shipmentData.Driver.phone}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Assignment Type Selection */}
                    <div>
                        <label className="text-blueBrand-lighter form-label block mb-2">
                            Assignment Type
                        </label>
                        <div className="flex gap-4">
                            <label className={`flex items-center gap-2 ${isBrokerAssigned && !canReassignBroker ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                                <input
                                    type="radio"
                                    name="assignmentType"
                                    value="trucker"
                                    checked={assignmentType === 'trucker'}
                                    onChange={(e) => handleAssignmentTypeChange(e.target.value)}
                                    disabled={isBrokerAssigned && !canReassignBroker}
                                    className="w-4 h-4"
                                />
                                <span className="form-subheading">
                                    Broker
                                    {isBrokerAssigned && (
                                        <span className="text-xs text-gray-500 ml-2">
                                            {hasTruckerBeenReassigned ? '(Already reassigned)' : '(Already assigned)'}
                                        </span>
                                    )}
                                </span>
                            </label>
                            <label className={`flex items-center gap-2 ${isDriverAssigned && !canReassignDriver ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                                <input
                                    type="radio"
                                    name="assignmentType"
                                    value="driver"
                                    checked={assignmentType === 'driver'}
                                    onChange={(e) => handleAssignmentTypeChange(e.target.value)}
                                    disabled={isDriverAssigned && !canReassignDriver}
                                    className="w-4 h-4"
                                />
                                <span className="form-subheading">
                                    Driver
                                    {isDriverAssigned && (
                                        <span className="text-xs text-gray-500 ml-2">
                                            {hasDriverBeenReassigned ? '(Already reassigned)' : '(Already assigned)'}
                                        </span>
                                    )}
                                </span>
                            </label>
                        </div>
                        {checkingReassignment && (
                            <p className="text-xs text-gray-500 mt-2">
                                Checking reassignment history...
                            </p>
                        )}
                        {!checkingReassignment && isBrokerAssigned && !canReassignBroker && (
                            <p className="text-xs text-gray-500 mt-2">
                                {hasTruckerBeenReassigned 
                                    ? 'This broker has already been reassigned once. Further reassignments are not allowed.'
                                    : !isSuperAdmin 
                                        ? 'A broker is already assigned. Only super admin can reassign.'
                                        : 'A broker is already assigned to this shipment.'}
                            </p>
                        )}
                        {!checkingReassignment && isDriverAssigned && !canReassignDriver && (
                            <p className="text-xs text-gray-500 mt-2">
                                {hasDriverBeenReassigned 
                                    ? 'This driver has already been reassigned once. Further reassignments are not allowed.'
                                    : !isSuperAdmin 
                                        ? 'A driver is already assigned. Only super admin can reassign.'
                                        : 'A driver is already assigned to this shipment.'}
                            </p>
                        )}
                        {!checkingReassignment && isBrokerAssigned && isSuperAdmin && !hasTruckerBeenReassigned && (
                            <p className="text-xs text-blue-600 mt-2">
                                As super admin, you can reassign the broker once.
                            </p>
                        )}
                        {!checkingReassignment && isDriverAssigned && isSuperAdmin && !hasDriverBeenReassigned && (
                            <p className="text-xs text-blue-600 mt-2">
                                As super admin, you can reassign the driver once.
                            </p>
                        )}
                    </div>

                    {/* User Selection */}
                    {assignmentType && (
                        <div>
                            <label className="text-blueBrand-lighter form-label block mb-2">
                                Select {assignmentType.charAt(0).toUpperCase() + assignmentType.slice(1)}
                            </label>
                            {loading ? (
                                <div className="text-gray-500 text-sm">Loading users...</div>
                            ) : (
                                <select
                                    value={selectedUserId}
                                    onChange={(e) => setSelectedUserId(e.target.value)}
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:border-purple-500"
                                    disabled={users.length === 0}
                                >
                                    <option value="">
                                        {users.length === 0
                                            ? `No approved ${assignmentType}s available`
                                            : `Select a ${assignmentType}`
                                        }
                                    </option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name} ({user.email})
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={onClose}
                            className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-50"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!assignmentType || !selectedUserId || submitting}
                            className="flex-1 bg-purpleBrand-dark text-white py-2 px-4 rounded hover:bg-purpleBrand-darkHover disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Assigning...' : 'Assign'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AssignmentModal
