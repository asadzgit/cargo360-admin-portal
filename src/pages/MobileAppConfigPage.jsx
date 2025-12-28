import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { mobileConfigService } from '../services/mobileConfigService'

const MobileAppConfigPage = () => {
  const [configs, setConfigs] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPlatform, setSelectedPlatform] = useState('android')
  const [formData, setFormData] = useState({
    minSupportedVersion: '',
    latestVersion: '',
    forceUpdate: false,
    storeUrl: '',
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingFormData, setPendingFormData] = useState(null)

  useEffect(() => {
    fetchConfigs()
  }, [])

  useEffect(() => {
    if (configs.length > 0) {
      const config = configs.find(c => c.platform === selectedPlatform)
      if (config) {
        setFormData({
          minSupportedVersion: config.minSupportedVersion || '',
          latestVersion: config.latestVersion || '',
          forceUpdate: config.forceUpdate || false,
          storeUrl: config.storeUrl || '',
        })
        setErrors({})
      }
    }
  }, [selectedPlatform, configs])

  const fetchConfigs = async () => {
    setLoading(true)
    try {
      const result = await mobileConfigService.getAllConfigs()
      if (result.success) {
        setConfigs(result.data || [])
        // Select first platform if available
        if (result.data && result.data.length > 0 && !configs.find(c => c.platform === selectedPlatform)) {
          setSelectedPlatform(result.data[0].platform)
        }
      } else {
        toast.error(result.message || 'Failed to load configurations')
      }
    } catch (error) {
      toast.error('Failed to load mobile app configurations')
    } finally {
      setLoading(false)
    }
  }

  const validateVersion = (version) => {
    if (!version || typeof version !== 'string') return false
    return /^\d+\.\d+\.\d+$/.test(version.trim())
  }

  const compareVersions = (v1, v2) => {
    const parts1 = v1.split('.').map(Number)
    const parts2 = v2.split('.').map(Number)
    while (parts1.length < 3) parts1.push(0)
    while (parts2.length < 3) parts2.push(0)
    for (let i = 0; i < 3; i++) {
      if (parts1[i] < parts2[i]) return -1
      if (parts1[i] > parts2[i]) return 1
    }
    return 0
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.minSupportedVersion.trim()) {
      newErrors.minSupportedVersion = 'Minimum supported version is required'
    } else if (!validateVersion(formData.minSupportedVersion)) {
      newErrors.minSupportedVersion = 'Invalid format. Must be semantic version (x.y.z)'
    }

    if (!formData.latestVersion.trim()) {
      newErrors.latestVersion = 'Latest version is required'
    } else if (!validateVersion(formData.latestVersion)) {
      newErrors.latestVersion = 'Invalid format. Must be semantic version (x.y.z)'
    }

    if (!formData.storeUrl.trim()) {
      newErrors.storeUrl = 'Store URL is required'
    } else {
      try {
        new URL(formData.storeUrl)
      } catch {
        newErrors.storeUrl = 'Invalid URL format'
      }
    }

    // Validate minSupportedVersion <= latestVersion
    if (
      !newErrors.minSupportedVersion &&
      !newErrors.latestVersion &&
      compareVersions(formData.minSupportedVersion, formData.latestVersion) > 0
    ) {
      newErrors.latestVersion = 'Latest version must be greater than or equal to minimum supported version'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Show confirmation dialog if forceUpdate is enabled
    if (formData.forceUpdate) {
      setPendingFormData({ ...formData })
      setShowConfirmDialog(true)
      return
    }

    await saveConfig()
  }

  const saveConfig = async () => {
    setSaving(true)
    try {
      const updateData = {
        minSupportedVersion: formData.minSupportedVersion.trim(),
        latestVersion: formData.latestVersion.trim(),
        forceUpdate: formData.forceUpdate,
        storeUrl: formData.storeUrl.trim(),
      }

      const result = await mobileConfigService.updateConfig(selectedPlatform, updateData)
      if (result.success) {
        toast.success(result.message || 'Configuration saved successfully')
        await fetchConfigs() // Refresh configs
        setShowConfirmDialog(false)
      } else {
        toast.error(result.message || 'Failed to save configuration')
      }
    } catch (error) {
      toast.error('Failed to save mobile app configuration')
    } finally {
      setSaving(false)
    }
  }

  const handleConfirmSave = () => {
    setShowConfirmDialog(false)
    saveConfig()
  }

  const currentConfig = configs.find(c => c.platform === selectedPlatform)

  if (loading) {
    return (
      <div className="min-h-screen px-[94px] py-[30px] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading configurations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-[94px] py-[30px]">
      <div className="bg-white rounded-lg shadow-lg p-[40px]">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Mobile App Configuration</h1>
        <p className="text-gray-600 mb-8">
          Manage minimum supported versions and update requirements for mobile apps
        </p>

        {/* Platform Selector */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
          <div className="flex gap-4">
            {['android', 'ios'].map(platform => (
              <button
                key={platform}
                type="button"
                onClick={() => setSelectedPlatform(platform)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  selectedPlatform === platform
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {platform === 'android' ? 'Android' : 'iOS'}
              </button>
            ))}
          </div>
        </div>

        {/* Status Badge */}
        {currentConfig && (
          <div className="mb-6">
            <div className={`inline-flex items-center px-4 py-2 rounded-full ${
              currentConfig.forceUpdate
                ? 'bg-red-100 text-red-800 border border-red-300'
                : 'bg-green-100 text-green-800 border border-green-300'
            }`}>
              <span className="w-2 h-2 rounded-full mr-2 bg-current"></span>
              <span className="font-medium">
                {currentConfig.forceUpdate ? '🔴 Forced Update' : '🟢 Soft Update'}
              </span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Minimum Supported Version */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Supported Version <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.minSupportedVersion}
                onChange={(e) => handleInputChange('minSupportedVersion', e.target.value)}
                placeholder="e.g., 1.1.3"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.minSupportedVersion ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={!!currentConfig}
              />
              {errors.minSupportedVersion && (
                <p className="text-red-500 text-sm mt-1">{errors.minSupportedVersion}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">Users below this version will be blocked</p>
            </div>

            {/* Latest Version */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Latest Version <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.latestVersion}
                onChange={(e) => handleInputChange('latestVersion', e.target.value)}
                placeholder="e.g., 1.1.3"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.latestVersion ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.latestVersion && (
                <p className="text-red-500 text-sm mt-1">{errors.latestVersion}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">Current latest version available</p>
            </div>
          </div>

          {/* Store URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Store URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={formData.storeUrl}
              onChange={(e) => handleInputChange('storeUrl', e.target.value)}
              placeholder="https://play.google.com/store/apps/details?id=..."
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.storeUrl ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.storeUrl && (
              <p className="text-red-500 text-sm mt-1">{errors.storeUrl}</p>
            )}
          </div>

          {/* Force Update Toggle */}
          <div className="border-t pt-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.forceUpdate}
                onChange={(e) => handleInputChange('forceUpdate', e.target.checked)}
                className="sr-only"
              />
              <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.forceUpdate ? 'bg-red-600' : 'bg-gray-300'
              }`}>
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.forceUpdate ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </div>
              <span className={`ml-3 font-medium ${
                formData.forceUpdate ? 'text-red-600' : 'text-gray-700'
              }`}>
                Force Update (Block versions below minimum)
              </span>
            </label>
            <p className="text-gray-500 text-sm mt-2 ml-14">
              When enabled, users below the minimum supported version will be blocked immediately
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => fetchConfigs()}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </form>

        {/* Confirmation Dialog */}
        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Confirm Force Update</h3>
              <p className="text-gray-600 mb-6">
                Users below the minimum supported version ({pendingFormData?.minSupportedVersion}) will be blocked immediately.
                <br />
                <br />
                Are you sure you want to proceed?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowConfirmDialog(false)
                    setPendingFormData(null)
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSave}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MobileAppConfigPage

