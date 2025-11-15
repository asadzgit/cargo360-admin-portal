import React, { useEffect, useState } from 'react'
import { shipmentsService } from '../services/shipmentsService'
import { useApp } from '../contexts/AppContext'

const OPERATION_STYLES = {
    create: 'bg-green-100 text-green-800 border border-green-200',
    update: 'bg-blue-100 text-blue-800 border border-blue-200',
    delete: 'bg-red-100 text-red-800 border border-red-200',
}

const formatValue = (value) => {
    if (value === null || value === undefined || value === '') {
        return '—'
    }
    if (typeof value === 'object') {
        try {
            return JSON.stringify(value, null, 2)
        } catch (error) {
            return String(value)
        }
    }
    return String(value)
}

const ShipmentLogsDrawer = ({ open, onClose, shipmentId }) => {
    const { users } = useApp()
    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!open || !shipmentId) return

        const fetchLogs = async () => {
            setLoading(true)
            setError('')
            try {
                const result = await shipmentsService.getShipmentLogs(shipmentId, 100)

                if (result.success) {
                    setLogs(result.data || [])
                } else {
                    setError(result.message || 'Failed to load shipment logs')
                }
            } catch (err) {
                setError(err.message || 'Failed to load shipment logs')
            } finally {
                setLoading(false)
            }
        }

        fetchLogs()
    }, [open, shipmentId])

    const getChangedByLabel = (log) => {
        const matchedUser = users?.find?.((user) => user?.id === log.changedBy)
        const email = (log.changedByEmail || matchedUser?.email || '').trim()
        const isSuperAdmin = log.changedBy === 126 || email.toLowerCase() === 'muhammad.asad@cargo360pk.com'

        if (isSuperAdmin) {
            return 'Super Admin'
        }

        if (email) {
            return email
        }

        if (log.changedBy) {
            return `User #${log.changedBy}`
        }

        return 'Unknown user'
    }

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
                aria-hidden="true"
            />

            <aside className="relative h-full w-[480px] bg-white shadow-2xl flex flex-col">
                <header className="sticky top-0 z-10 bg-white px-6 py-5 border-b border-gray-200 flex items-center justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">Shipment #{shipmentId}</p>
                        <h2 className="text-lg font-semibold text-blueBrand-dark">Change History</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-900 text-2xl leading-none"
                        aria-label="Close"
                    >
                        ×
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-gray-50">
                    {loading && (
                        <div className="flex h-full items-center justify-center text-gray-500">
                            Loading logs...
                        </div>
                    )}

                    {!loading && error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    {!loading && !error && logs.filter((log) => log.operation !== 'create').length === 0 && (
                        <div className="text-center text-gray-500 py-10">
                            No logs found for this shipment.
                        </div>
                    )}

                    {!loading && !error && logs.filter((log) => log.operation !== 'create').length > 0 && (
                        <div className="relative">
                            <div className="absolute left-3 top-0 bottom-0 border-l-2 border-gray-200" aria-hidden="true"></div>
                            <div className="space-y-6">
                                {logs
                                    .filter((log) => log.operation !== 'create')
                                    .map((log) => {
                                        const diffEntries = Object.entries(log.diff || {})
                                        const operationStyle = OPERATION_STYLES[log.operation] || OPERATION_STYLES.update

                                        return (
                                            <div key={log.id} className="relative pl-10">
                                                <div className="absolute left-0 top-3 w-6 h-6 bg-white border-2 border-blueBrand-light rounded-full flex items-center justify-center">
                                                    <span className="w-2 h-2 bg-blueBrand-light rounded-full" />
                                                </div>

                                                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 space-y-3">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <p className="text-sm text-gray-500">
                                                            {new Date(log.createdAt).toLocaleString()}
                                                        </p>
                                                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${operationStyle}`}>
                                                            {log.operation?.toUpperCase()}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            Updated by {getChangedByLabel(log)}
                                                        </span>
                                                    </div>

                                                    {diffEntries.length > 0 ? (
                                                        <div className="border border-gray-100 rounded-lg divide-y divide-gray-100">
                                                            {diffEntries.map(([field, values]) => (
                                                                <div key={field} className="p-3 grid grid-cols-1 gap-1">
                                                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{field}</p>
                                                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                                                        <span className="flex-1 bg-gray-50 rounded px-2 py-1">{formatValue(values?.old)}</span>
                                                                        <span className="text-blueBrand-normal text-lg leading-none">→</span>
                                                                        <span className="flex-1 bg-gray-50 rounded px-2 py-1">{formatValue(values?.new)}</span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm text-gray-500 italic">
                                                            No field-level changes recorded.
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                            </div>
                        </div>
                    )}
                </div>
            </aside>
        </div>
    )
}

export default ShipmentLogsDrawer

