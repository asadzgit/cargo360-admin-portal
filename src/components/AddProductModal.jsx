import React, { useState } from 'react'
import { toast } from 'react-toastify'
// eslint-disable-next-line react/prop-types
const AddProductModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    commission: '',
    imageFile: null,
    imagePreview: '',
  })

  if (!isOpen) return null

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const previewURL = URL.createObjectURL(file)
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: previewURL,
      }))
    }
  }

  const handleContinue = (e) => {
    e.preventDefault()
    setStep(2)
  }

  const handleEdit = () => setStep(1)
  const handleDiscard = () => {
    setStep(1)
    setFormData({
      name: '',
      description: '',
      price: '',
      commission: '',
      imageFile: null,
      imagePreview: '',
    })
    onClose()
  }

  const handleSaveProduct = () => {
    // Handle final save logic here
    console.log('Saved Product:', formData)
    toast.success('Product created successfully!')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-xl p-6 relative">
        <button
          onClick={() => (step === 1 ? onClose() : setStep(1))}
          className="absolute top-4 left-4 text-gray-600 hover:text-black"
        >
          ←
        </button>

        <h2 className="text-2xl font-semibold text-center mb-2">Add Product</h2>

        <div className="flex justify-center mb-6 text-sm font-medium text-gray-500">
          {step === 1 ? (
            <span className="text-purpleBrand-normal">—</span>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.99935 17.3337C13.6017 17.3337 17.3327 13.6027 17.3327 9.00033C17.3327 4.39795 13.6017 0.666992 8.99935 0.666992C4.39698 0.666992 0.666016 4.39795 0.666016 9.00033C0.666016 13.6027 4.39698 17.3337 8.99935 17.3337ZM13.6317 6.91722C13.8619 6.66005 13.8401 6.26492 13.5829 6.03468C13.3257 5.80444 12.9306 5.82626 12.7004 6.08343L9.89272 9.21942C9.32381 9.85486 8.94068 10.2806 8.61311 10.5559C8.30107 10.8182 8.11779 10.8753 7.95768 10.8753C7.79758 10.8753 7.6143 10.8182 7.30225 10.5559C6.97468 10.2806 6.59155 9.85486 6.02264 9.21941L5.29833 8.4104C5.06808 8.15323 4.67296 8.1314 4.41579 8.36165C4.15862 8.59189 4.13679 8.98702 4.36704 9.24419L5.12229 10.0878C5.65217 10.6796 6.09413 11.1733 6.49797 11.5128C6.92517 11.8718 7.38595 12.1253 7.95768 12.1253C8.52941 12.1253 8.99019 11.8718 9.41739 11.5128C9.82123 11.1733 10.2632 10.6797 10.7931 10.0878L13.6317 6.91722Z"
                fill="#7600BF"
              />
            </svg>
          )}
          <span
            className={`${step === 1 ? 'text-purple-600' : ''} pb-1 ml-2 mr-4`}
          >
            Product Information
          </span>
          <span
            className={`${step === 1 ? 'text-gray-400' : 'text-purpleBrand-normal'}`}
          >
            —
          </span>
          <span className={`${step === 2 ? 'text-purple-600' : ''} ml-2`}>
            Review
          </span>
        </div>

        {step === 1 && (
          <>
            <label className="flex w-60 m-auto items-center justify-center border-2 border-dashed border-gray-300 rounded-md h-32 mb-6 cursor-pointer">
              {formData.imagePreview ? (
                <img
                  src={formData.imagePreview}
                  alt="Preview"
                  className="h-full object-contain"
                />
              ) : (
                <div className="text-gray-400 text-center">
                  <div className="text-3xl mb-2">
                    <svg
                      className="m-auto"
                      xmlns="http://www.w3.org/2000/svg"
                      width="21"
                      height="21"
                      viewBox="0 0 21 21"
                      fill="none"
                    >
                      <path
                        d="M8.70552 1.61252C9.10964 1.20685 9.55817 0.870553 10.1313 0.779232C10.2534 0.759777 10.3766 0.75 10.5 0.75C10.6234 0.75 10.7466 0.759776 10.8687 0.779231C11.4419 0.870553 11.8904 1.20685 12.2945 1.61252C12.6883 2.00784 13.1283 2.56275 13.6614 3.23524L15.0877 5.03403C15.345 5.3586 15.2905 5.83034 14.966 6.08768C14.6414 6.34503 14.1697 6.29054 13.9123 5.96597L12.5145 4.203C11.9563 3.49897 11.5727 3.01697 11.25 2.68952V15.5C11.25 15.9142 10.9142 16.25 10.5 16.25C10.0858 16.25 9.75001 15.9142 9.75001 15.5V2.68952C9.42735 3.01697 9.04376 3.49897 8.48554 4.203L7.08769 5.96597C6.83035 6.29054 6.35861 6.34503 6.03404 6.08768C5.70947 5.83034 5.65498 5.3586 5.91233 5.03403L7.33857 3.23525C7.87174 2.56278 8.31173 2.00783 8.70552 1.61252Z"
                        fill="#B2BBC6"
                      />
                      <path
                        d="M19.1 9.04956C18.8513 8.71837 18.3811 8.65156 18.0499 8.90032C17.7188 9.14909 17.6519 9.61924 17.9007 9.95043C18.4342 10.6607 18.75 11.5424 18.75 12.5V13.5C18.75 14.4577 18.7477 14.8492 18.6977 15.1648C18.4097 16.9834 16.9834 18.4096 15.1649 18.6977C14.8492 18.7477 14.4577 18.75 13.5 18.75H7.50001C6.54234 18.75 6.15083 18.7477 5.83516 18.6977C4.01662 18.4096 2.59036 16.9834 2.30233 15.1648C2.25234 14.8492 2.25001 14.4577 2.25001 13.5V12.5C2.25001 11.5424 2.56583 10.6607 3.09932 9.95043C3.34808 9.61924 3.28127 9.14909 2.95008 8.90032C2.61888 8.65156 2.14874 8.71837 1.89997 9.04956C1.17807 10.0106 0.750008 11.2064 0.750008 12.5L0.750004 13.5808C0.749937 14.4328 0.749895 14.9518 0.8208 15.3995C1.21049 17.8599 3.14013 19.7895 5.60051 20.1792C6.04819 20.2501 6.56718 20.2501 7.41921 20.25H13.5808C14.4328 20.2501 14.9518 20.2501 15.3995 20.1792C17.8599 19.7895 19.7895 17.8599 20.1792 15.3995C20.2501 14.9518 20.2501 14.4328 20.25 13.5808L20.25 12.5C20.25 11.2064 19.8219 10.0106 19.1 9.04956Z"
                        fill="#B2BBC6"
                      />
                    </svg>
                  </div>
                  <p>Upload Product Image</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            <form className="space-y-4" onSubmit={handleContinue}>
              <div>
                <label className="block text-sm font-medium mb-1 text-blueBrand-lighter">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2 text-sm"
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-blueBrand-lighter">
                  Description
                </label>
                <textarea
                  rows="3"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2 text-sm"
                  placeholder="Enter description"
                  required
                ></textarea>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1 text-blueBrand-lighter">
                    Retail price
                  </label>
                  <div className="flex items-center border rounded-md p-2 text-sm">
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full outline-none"
                      placeholder="0"
                      required
                    />
                    <span className="ml-2 text-gray-500">$</span>
                  </div>
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1 text-blueBrand-lighter">
                    Commission
                  </label>
                  <div className="flex items-center border rounded-md p-2 text-sm">
                    <input
                      type="number"
                      name="commission"
                      value={formData.commission}
                      onChange={handleInputChange}
                      className="w-full outline-none"
                      placeholder="0"
                      required
                    />
                    <span className="ml-2 text-gray-500">$</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-purple-600 hover:underline text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm hover:bg-purple-700"
                >
                  Continue
                </button>
              </div>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <div className="flex flex-col items-center mb-6">
              {formData.imagePreview && (
                <img
                  src={formData.imagePreview}
                  alt="Product"
                  className="h-32 mb-2 object-contain"
                />
              )}
              <h3 className="text-lg font-medium">{formData.name}</h3>
            </div>

            <hr className="mb-4" />

            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-bold">Product Details</h4>
              <button
                onClick={handleEdit}
                className="flex items-center text-purple-600 text-sm hover:underline"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M10.8022 3.05066L10.8623 3.08532C11.381 3.3848 11.8136 3.63453 12.1303 3.87896C12.4647 4.13695 12.73 4.43308 12.8411 4.84787C12.9523 5.26266 12.8706 5.65179 12.71 6.04239C12.5986 6.3135 12.4347 6.61815 12.2373 6.96567L11.8138 6.71393L11.8083 6.71073L7.19145 4.04518L6.75969 3.7907C6.95975 3.44998 7.14 3.15896 7.31747 2.92899C7.57546 2.59467 7.87159 2.32932 8.28638 2.21818C8.70117 2.10703 9.0903 2.18877 9.48089 2.3493C9.85094 2.50139 10.2835 2.75115 10.8022 3.05066Z"
                    fill="#7600BF"
                  />
                  <path
                    d="M6.25874 4.65622L3.94009 8.67216C3.74157 9.01536 3.58459 9.28673 3.52644 9.5954C3.46828 9.90407 3.51574 10.214 3.57576 10.6059L3.59193 10.7118C3.70272 11.4394 3.79404 12.0391 3.93177 12.4939C4.07582 12.9695 4.29726 13.3812 4.73277 13.6326C5.16828 13.884 5.63553 13.87 6.11945 13.7569C6.58216 13.6488 7.14718 13.428 7.83267 13.1602L7.9325 13.1212C8.30192 12.9773 8.59402 12.8634 8.83226 12.6587C9.0705 12.454 9.22702 12.1824 9.42498 11.8389L11.7381 7.83227L11.3056 7.57517L6.68563 4.90784L6.25874 4.65622Z"
                    fill="#7600BF"
                  />
                </svg>{' '}
                Edit
              </button>
            </div>

            <div className="text-sm space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-400">Product Name</span>
                <span>{formData.name}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-gray-400 block">Product Description</span>
                <p className="text-right">{formData.description}</p>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Retail Price</span>
                <span>${formData.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Commission</span>
                <span>${formData.commission}</span>
              </div>
            </div>

            <hr className="mb-4" />

            <div className="flex justify-end gap-4">
              <button
                onClick={handleDiscard}
                className="text-purple-600 hover:underline text-sm"
              >
                Discard
              </button>
              <button
                onClick={handleSaveProduct}
                className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm hover:bg-purple-700"
              >
                Save Product
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AddProductModal
