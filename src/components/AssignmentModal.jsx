/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { usersService } from '../services/usersService'

const AssignmentModal = ({ shipment, onClose, onAssign }) => {
    const [assignmentType, setAssignmentType] = useState('')
    const [selectedUserId, setSelectedUserId] = useState('')
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)

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
        setAssignmentType(type)
        setSelectedUserId('')
        setUsers([])
    }

    if (!shipment) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg w-[500px] pt-[30px] pb-[30px] px-[40px] relative">
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
                                <span className="text-blueBrand-lighter form-label">Customer:</span>
                                <span className="form-subheading">{shipment.customer}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-blueBrand-lighter form-label">Status:</span>
                                <span className="form-subheading">{shipment.status?.toUpperCase()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Assignment Type Selection */}
                    <div>
                        <label className="text-blueBrand-lighter form-label block mb-2">
                            Assignment Type
                        </label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="assignmentType"
                                    value="trucker"
                                    checked={assignmentType === 'trucker'}
                                    onChange={(e) => handleAssignmentTypeChange(e.target.value)}
                                    className="w-4 h-4"
                                />
                                <span className="form-subheading">Broker</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="assignmentType"
                                    value="driver"
                                    checked={assignmentType === 'driver'}
                                    onChange={(e) => handleAssignmentTypeChange(e.target.value)}
                                    className="w-4 h-4"
                                />
                                <span className="form-subheading">Driver</span>
                            </label>
                        </div>
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
