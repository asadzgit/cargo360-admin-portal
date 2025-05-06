import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import userAvatar from '../assets/images/user-avatar.png'

const ProfilePage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: 'Katherine',
    lastName: '',
    emailOrPhone: 'katherine@gmail.com',
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }
    if (!formData.emailOrPhone.trim()) {
      newErrors.emailOrPhone = 'Email or phone is required'
    } else if (
      !/^\S+@\S+\.\S+$/.test(formData.emailOrPhone) &&
      !/^\d{10,15}$/.test(formData.emailOrPhone)
    ) {
      newErrors.emailOrPhone = 'Enter a valid email or phone'
    }

    return newErrors
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log('Profile updated:', formData)
      toast.success('Profile updated successfully')
      navigate('/products')
      // Add toast or notification here
    } catch (error) {
      console.error('Failed to update profile:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="">
      <div className="pl-102 pt-30 pr-388">
        <div className="flex gap-4 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 1.25C9.37665 1.25 7.25 3.37665 7.25 6C7.25 8.62335 9.37665 10.75 12 10.75C14.6234 10.75 16.75 8.62335 16.75 6C16.75 3.37665 14.6234 1.25 12 1.25ZM8.75 6C8.75 4.20507 10.2051 2.75 12 2.75C13.7949 2.75 15.25 4.20507 15.25 6C15.25 7.79493 13.7949 9.25 12 9.25C10.2051 9.25 8.75 7.79493 8.75 6Z"
              fill="#9D00FF"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9 12.25C6.37665 12.25 4.25 14.3766 4.25 17C4.25 19.6234 6.37665 21.75 9 21.75H15C17.6234 21.75 19.75 19.6234 19.75 17C19.75 14.3766 17.6234 12.25 15 12.25H9ZM5.75 17C5.75 15.2051 7.20507 13.75 9 13.75H15C16.7949 13.75 18.25 15.2051 18.25 17C18.25 18.7949 16.7949 20.25 15 20.25H9C7.20507 20.25 5.75 18.7949 5.75 17Z"
              fill="#9D00FF"
            />
          </svg>
          <h2 className="text-2xl font-bold">Profile</h2>
        </div>
        <div className="flex items-center gap-4 mb-6 mt-70">
          <img
            src={userAvatar}
            alt="Avatar"
            className="h-16 w-16 rounded-full"
          />
          <div>
            <h2 className="text-2xl font-bold">Katherine</h2>
            <p className="text-gray-500">{formData.emailOrPhone}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-blueBrand-lighter font-medium mb-1">
                First name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full border rounded-md px-4 py-2 focus:outline-none ${
                  errors.firstName
                    ? 'border-red-500'
                    : 'border-blueBrand-lighter focus:border-purpleBrand-normal'
                }`}
                placeholder="Enter first name"
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-blueBrand-lighter font-medium mb-1">
                Last name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border rounded-md px-4 py-2 focus:outline-none border-blueBrand-lighter focus:border-purpleBrand-normal"
                placeholder="Enter last name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-blueBrand-lighter font-medium mb-1">
                E-mail or phone number
              </label>
              <input
                type="text"
                name="emailOrPhone"
                value={formData.emailOrPhone}
                onChange={handleChange}
                className={`w-full border rounded-md px-4 py-2 focus:outline-none ${
                  errors.emailOrPhone
                    ? 'border-red-500'
                    : 'border-blueBrand-lighter focus:border-purpleBrand-normal'
                }`}
                placeholder="Enter email or phone"
              />
              {errors.emailOrPhone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.emailOrPhone}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-purpleBrand-normal hover:bg-purpleBrand-normalHover text-white font-semibold px-6 py-2 rounded-md transition disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => {
                setFormData({
                  firstName: 'Katherine',
                  lastName: '',
                  emailOrPhone: 'katherine@gmail.com',
                })
                navigate('/products')
              }}
              className="text-blueBrand-dark text-purpleBrand-normal px-6 py-2 rounded-md transition"
            >
              Discard
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProfilePage
