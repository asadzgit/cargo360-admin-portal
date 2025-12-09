import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaTimes, FaFileAlt, FaMapMarkerAlt, FaShip, FaBox, FaUser, FaCalendarAlt } from 'react-icons/fa'
import { clearanceService } from '../services/clearanceService'
import { exportToCSV } from '../utils/csvExport'

const ClearancePage = () => {
  const navigate = useNavigate()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [selectedRequest, setSelectedRequest] = useState(null)

  const fetchClearanceRequests = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const filters = {
        limit: 100,
        offset: 0,
      }
      if (statusFilter !== 'all') {
        filters.status = statusFilter
      }
      if (typeFilter !== 'all') {
        filters.requestType = typeFilter
      }

      const result = await clearanceService.getAllClearanceRequests(filters)

      if (result.success) {
        setRequests(result.data || [])
      } else {
        setError(result.error)
        toast.error(result.message || 'Failed to fetch clearance requests')
      }
    } catch (error) {
      setError(error.message)
      toast.error('An error occurred while fetching clearance requests')
    } finally {
      setLoading(false)
    }
  }, [statusFilter, typeFilter])

  // Fetch clearance requests when filters change
  useEffect(() => {
    fetchClearanceRequests()
  }, [fetchClearanceRequests])

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchClearanceRequests()
    }, 60000)

    return () => clearInterval(interval)
  }, [fetchClearanceRequests])

  const getRequestTypeLabel = (type) => {
    switch (type) {
      case 'freight_forwarding':
        return 'Freight Forwarding'
      case 'import':
        return 'Import Clearance'
      case 'export':
        return 'Export Clearance'
      default:
        return type || 'Clearance Request'
    }
  }

  const getStatusBadgeClass = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'under_review':
        return 'bg-blue-100 text-blue-800'
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '—'
    try {
      const date = new Date(dateString)
      return date.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return String(dateString)
    }
  }

  const handleUpdateStatus = async (requestId, newStatus) => {
    try {
      const result = await clearanceService.updateClearanceStatus(requestId, newStatus)
      if (result.success) {
        toast.success('Clearance request status updated successfully')
        fetchClearanceRequests()
      } else {
        toast.error(result.message || 'Failed to update status')
      }
    } catch (error) {
      toast.error('An error occurred while updating status')
    }
  }

  const handleDelete = async (requestId) => {
    if (window.confirm('Are you sure you want to delete this clearance request?')) {
      try {
        const result = await clearanceService.deleteClearanceRequest(requestId)
        if (result.success) {
          toast.success('Clearance request deleted successfully')
          fetchClearanceRequests()
        } else {
          toast.error(result.message || 'Failed to delete clearance request')
        }
      } catch (error) {
        toast.error('An error occurred while deleting clearance request')
      }
    }
  }

  const handleExportCSV = () => {
    const headers = [
      { label: 'Request ID', key: 'id' },
      { label: 'Type', key: 'requestType' },
      { label: 'Status', key: 'status' },
      { label: 'City', key: 'city' },
      { label: 'Container Type', key: 'containerType' },
      { label: 'Transport Mode', key: 'transportMode' },
      { label: 'Created By', key: 'Creator.name' },
      { label: 'Created At', key: 'createdAt' },
    ]

    const filename = `clearance_requests_${new Date().toISOString().split('T')[0]}.csv`
    exportToCSV(requests, headers, filename)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 px-[94px] py-[30px]">
        <div className="flex justify-between items-center px-[12px] mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span className="modal-heading">Clearance Details</span>
          </h2>

          <div className="flex gap-[20px]">
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
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border rounded px-[14px] py-[10px] filter-button filter-button-border focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="import">Import</option>
              <option value="export">Export</option>
              <option value="freight_forwarding">Freight Forwarding</option>
            </select>
            <button
              className="text-blueBrand-normal filter-button"
              onClick={() => {
                setStatusFilter('all')
                setTypeFilter('all')
              }}
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">Loading clearance requests...</div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded shadow">
          {requests.length === 0 ? (
            <div className="text-center py-12 px-4">
              <p className="text-gray-500 text-lg mb-2">No clearance requests found</p>
              <p className="text-gray-400 text-sm">
                No clearance requests match the current filters
              </p>
            </div>
          ) : (
            <table className="min-w-full text-sm text-left">
              <thead className="bg-[#F6F5F6] text-blueBrand-normal text-xs font-semibold">
                <tr className="filter-button leading-[18px]">
                  <th className="px-4 py-3">Request ID</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">City</th>
                  <th className="px-4 py-3">Container Type</th>
                  <th className="px-4 py-3">Transport Mode</th>
                  <th className="px-4 py-3">Created By</th>
                  <th className="px-4 py-3">Date & Time</th>
                  <th className="px-4 py-3">Documents</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="text-blueBrand-dark">
                {requests.map((req) => (
                  <tr
                    key={req.id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="px-[24px] py-[16px] form-subheading">
                      C360-PK-{req.id}
                    </td>
                    <td className="px-[24px] py-[16px] form-subheading">
                      {getRequestTypeLabel(req.requestType)}
                    </td>
                    <td className="px-[24px] py-[16px]">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusBadgeClass(req.status)}`}>
                        {(req.status || 'pending').replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-[24px] py-[16px] form-subheading">
                      {req.city || '—'}
                    </td>
                    <td className="px-[24px] py-[16px] form-subheading">
                      {req.containerType || '—'}
                    </td>
                    <td className="px-[24px] py-[16px] form-subheading">
                      {req.transportMode || '—'}
                    </td>
                    <td className="px-[24px] py-[16px] form-subheading">
                      {req.Creator?.name || 'Unknown'}
                    </td>
                    <td className="px-[24px] py-[16px] text-blueBrand-normal form-subheading">
                      {formatDate(req.createdAt)}
                    </td>
                    <td className="px-[24px] py-[16px] form-subheading">
                      {req.Documents?.length || 0} document{(req.Documents?.length || 0) !== 1 ? 's' : ''}
                    </td>
                    <td className="px-[24px] py-[16px]">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedRequest(req)}
                          className="text-purple-600 underline text-sm hover:text-purple-800"
                        >
                          View Details
                        </button>
                        {req.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(req.id, 'under_review')}
                              className="text-blue-600 underline text-xs hover:text-blue-800"
                            >
                              Review
                            </button>
                          </>
                        )}
                        {req.status === 'under_review' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(req.id, 'approved')}
                              className="text-green-600 underline text-xs hover:text-green-800"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(req.id, 'rejected')}
                              className="text-red-600 underline text-xs hover:text-red-800"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(req.id)}
                          className="text-red-600 underline text-xs hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Details Modal */}
      {selectedRequest && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setSelectedRequest(null)}
        >
          <div
            className="bg-white rounded-lg w-[1000px] max-h-[90vh] overflow-y-auto pt-[30px] pb-[30px] px-[40px] relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-[25px]">
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-gray-500 hover:text-gray-800 text-sm flex items-center gap-1 absolute top-[24px] left-[30px]"
              >
                ←
              </button>
              <h2 className="modal-heading text-center flex-1">Clearance Request Details</h2>
              <div className="w-12"></div> {/* Spacer to balance the layout */}
            </div>

            <div className="space-y-6">
              {/* Basic Information */}
              <div className="input-border px-[20px] py-[15px]">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex flex-col gap-[10px]">
                    <span className="text-blueBrand-lighter form-label">
                      Request ID
                    </span>
                    <span className="form-subheading" style={{ lineHeight: '20px' }}>
                      C360-PK-{selectedRequest.id}
                    </span>
                  </div>
                  <div className="flex flex-col gap-[10px]">
                    <span className="text-blueBrand-lighter form-label">
                      Type
                    </span>
                    <span className="form-subheading" style={{ lineHeight: '20px' }}>
                      {getRequestTypeLabel(selectedRequest.requestType)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-[10px]">
                    <span className="text-blueBrand-lighter form-label">Status</span>
                    <span className="form-subheading" style={{ lineHeight: '20px' }}>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusBadgeClass(selectedRequest.status)}`}>
                        {(selectedRequest.status || 'pending').replace('_', ' ').toUpperCase()}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Location & Transport Details */}
              {(selectedRequest.city || selectedRequest.transportMode || selectedRequest.containerType || selectedRequest.port || selectedRequest.clearingAgentNum) && (
                <div>
                  <h3 className="text-blueBrand-dark modal-heading mb-[15px] flex items-center gap-2">
                    <FaMapMarkerAlt /> Location & Transport Details
                  </h3>
                  <div className="input-border px-[20px] py-[15px]">
                    <div className="grid grid-cols-2 gap-6">
                      {selectedRequest.city && (
                        <div className="flex flex-col gap-[10px]">
                          <span className="text-blueBrand-lighter form-label">
                            City
                          </span>
                          <span className="form-subheading" style={{ lineHeight: '20px' }}>
                            {selectedRequest.city}
                          </span>
                        </div>
                      )}
                      {selectedRequest.transportMode && (
                        <div className="flex flex-col gap-[10px]">
                          <span className="text-blueBrand-lighter form-label">
                            Transport Mode
                          </span>
                          <span className="form-subheading" style={{ lineHeight: '20px' }}>
                            {selectedRequest.transportMode.toUpperCase()}
                          </span>
                        </div>
                      )}
                      {selectedRequest.containerType && (
                        <div className="flex flex-col gap-[10px]">
                          <span className="text-blueBrand-lighter form-label">
                            Container Type
                          </span>
                          <span className="form-subheading" style={{ lineHeight: '20px' }}>
                            {selectedRequest.containerType}
                          </span>
                        </div>
                      )}
                      {selectedRequest.port && (
                        <div className="flex flex-col gap-[10px]">
                          <span className="text-blueBrand-lighter form-label">
                            Port
                          </span>
                          <span className="form-subheading" style={{ lineHeight: '20px' }}>
                            {selectedRequest.port}
                          </span>
                        </div>
                      )}
                      {selectedRequest.clearingAgentNum && (
                        <div className="flex flex-col gap-[10px]">
                          <span className="text-blueBrand-lighter form-label">
                            Clearing Agent Number
                          </span>
                          <span className="form-subheading" style={{ lineHeight: '20px' }}>
                            {selectedRequest.clearingAgentNum}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Shipment Details */}
              {(selectedRequest.pol || selectedRequest.pod || selectedRequest.product || selectedRequest.incoterms) && (
                <div>
                  <h3 className="text-blueBrand-dark modal-heading mb-[15px] flex items-center gap-2">
                    <FaShip /> Shipment Details
                  </h3>
                  <div className="input-border px-[20px] py-[15px]">
                    <div className="grid grid-cols-2 gap-6">
                      {selectedRequest.pol && (
                        <div className="flex flex-col gap-[10px]">
                          <span className="text-blueBrand-lighter form-label">
                            Port of Loading (POL)
                          </span>
                          <span className="form-subheading" style={{ lineHeight: '20px' }}>
                            {selectedRequest.pol}
                          </span>
                        </div>
                      )}
                      {selectedRequest.pod && (
                        <div className="flex flex-col gap-[10px]">
                          <span className="text-blueBrand-lighter form-label">
                            Port of Discharge (POD)
                          </span>
                          <span className="form-subheading" style={{ lineHeight: '20px' }}>
                            {selectedRequest.pod}
                          </span>
                        </div>
                      )}
                      {selectedRequest.product && (
                        <div className="flex flex-col gap-[10px]">
                          <span className="text-blueBrand-lighter form-label">
                            Product
                          </span>
                          <span className="form-subheading" style={{ lineHeight: '20px' }}>
                            {selectedRequest.product}
                          </span>
                        </div>
                      )}
                      {selectedRequest.incoterms && (
                        <div className="flex flex-col gap-[10px]">
                          <span className="text-blueBrand-lighter form-label">
                            Incoterms
                          </span>
                          <span className="form-subheading" style={{ lineHeight: '20px' }}>
                            {selectedRequest.incoterms}
                          </span>
                        </div>
                      )}
                      {selectedRequest.cbm && (
                        <div className="flex flex-col gap-[10px]">
                          <span className="text-blueBrand-lighter form-label">
                            CBM
                          </span>
                          <span className="form-subheading" style={{ lineHeight: '20px' }}>
                            {selectedRequest.cbm}
                          </span>
                        </div>
                      )}
                      {selectedRequest.packages && (
                        <div className="flex flex-col gap-[10px]">
                          <span className="text-blueBrand-lighter form-label">
                            Packages
                          </span>
                          <span className="form-subheading" style={{ lineHeight: '20px' }}>
                            {selectedRequest.packages}
                          </span>
                        </div>
                      )}
                      {selectedRequest.containerSize && (
                        <div className="flex flex-col gap-[10px]">
                          <span className="text-blueBrand-lighter form-label">
                            Container Size
                          </span>
                          <span className="form-subheading" style={{ lineHeight: '20px' }}>
                            {selectedRequest.containerSize}
                          </span>
                        </div>
                      )}
                      {selectedRequest.numberOfContainers && (
                        <div className="flex flex-col gap-[10px]">
                          <span className="text-blueBrand-lighter form-label">
                            No. of Containers
                          </span>
                          <span className="form-subheading" style={{ lineHeight: '20px' }}>
                            {selectedRequest.numberOfContainers}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Creator Information */}
              {selectedRequest.Creator && (
                <div>
                  <h3 className="text-blueBrand-dark modal-heading mb-[15px] flex items-center gap-2">
                    <FaUser /> Request Creator
                  </h3>
                  <div className="input-border px-[20px] py-[15px]">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="flex flex-col gap-[10px]">
                        <span className="text-blueBrand-lighter form-label">
                          Name
                        </span>
                        <span className="form-subheading" style={{ lineHeight: '20px' }}>
                          {selectedRequest.Creator.name || 'Unknown'}
                        </span>
                      </div>
                      {selectedRequest.Creator.email && (
                        <div className="flex flex-col gap-[10px]">
                          <span className="text-blueBrand-lighter form-label">
                            Email
                          </span>
                          <span className="form-subheading" style={{ lineHeight: '20px' }}>
                            {selectedRequest.Creator.email}
                          </span>
                        </div>
                      )}
                      {selectedRequest.Creator.company && (
                        <div className="flex flex-col gap-[10px]">
                          <span className="text-blueBrand-lighter form-label">
                            Company
                          </span>
                          <span className="form-subheading" style={{ lineHeight: '20px' }}>
                            {selectedRequest.Creator.company}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Documents */}
              {selectedRequest.Documents && selectedRequest.Documents.length > 0 && (
                <div>
                  <h3 className="text-blueBrand-dark modal-heading mb-[15px] flex items-center gap-2">
                    <FaFileAlt /> Documents ({selectedRequest.Documents.length})
                  </h3>
                  <div className="input-border px-[20px] py-[15px]">
                    <div className="space-y-3">
                      {selectedRequest.Documents.map((doc, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded border border-gray-200">
                          <FaFileAlt className="text-blueBrand-normal mt-1 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="form-subheading text-blueBrand-dark font-semibold mb-1">
                              {doc.documentType || 'Document'}
                            </p>
                            {doc.fileName && (
                              <p className="text-xs text-blueBrand-lighter">
                                {doc.fileName}
                              </p>
                            )}
                            {doc.fileUrl && (
                              <a
                                href={doc.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:text-blue-800 underline mt-1 inline-block"
                              >
                                View Document
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Timeline */}
              {(selectedRequest.createdAt || selectedRequest.updatedAt || selectedRequest.Reviewer) && (
                <div>
                  <h3 className="text-blueBrand-dark modal-heading mb-[15px] flex items-center gap-2">
                    <FaCalendarAlt /> Timeline & Review
                  </h3>
                  <div className="input-border px-[20px] py-[15px]">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {selectedRequest.createdAt && (
                        <div className="flex flex-col gap-[10px]">
                          <span className="text-blueBrand-lighter form-label">
                            Created At
                          </span>
                          <span className="form-subheading" style={{ lineHeight: '20px' }}>
                            {formatDate(selectedRequest.createdAt)}
                          </span>
                        </div>
                      )}
                      {selectedRequest.updatedAt && (
                        <div className="flex flex-col gap-[10px]">
                          <span className="text-blueBrand-lighter form-label">
                            Last Updated
                          </span>
                          <span className="form-subheading" style={{ lineHeight: '20px' }}>
                            {formatDate(selectedRequest.updatedAt)}
                          </span>
                        </div>
                      )}
                      {selectedRequest.Reviewer && (
                        <div className="flex flex-col gap-[10px]">
                          <span className="text-blueBrand-lighter form-label">
                            Reviewed By
                          </span>
                          <span className="form-subheading" style={{ lineHeight: '20px' }}>
                            {selectedRequest.Reviewer.name || 'N/A'}
                          </span>
                        </div>
                      )}
                      {selectedRequest.reviewNotes && (
                        <div className="flex flex-col gap-[10px] md:col-span-3">
                          <span className="text-blueBrand-lighter form-label">
                            Review Notes
                          </span>
                          <span className="form-subheading" style={{ lineHeight: '20px' }}>
                            {selectedRequest.reviewNotes}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClearancePage
