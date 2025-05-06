import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import appleIcon from '../assets/images/apple-logo.svg'

const SignUpForm = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    emailOrPhone: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name'
    }
    if (!formData.emailOrPhone.trim()) {
      newErrors.emailOrPhone = 'Please enter your email or phone'
    } else if (
      !/^\S+@\S+\.\S+$/.test(formData.emailOrPhone) &&
      !/^\d{10,15}$/.test(formData.emailOrPhone)
    ) {
      newErrors.emailOrPhone = 'Enter a valid email or phone'
    }
    if (!formData.password) {
      newErrors.password = 'Please enter your password'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match'
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
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log('Form submitted successfully:', formData)
      navigate('/signin')
      toast.success('Signed up successfully!')
      // Redirect user to dashboard or show success message
    } catch (error) {
      console.error('Signup failed', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-whiteBrand-light flex items-center justify-center p-4">
      <div className="bg-white shadow-lg p-8 w-full max-w-[540px] form-shadow form-radius form-padding w-[540px]">
        <h2 className="text-2xl font-bold text-blueBrand-dark text-center">
          Sign Up
        </h2>
        <p className="text-blueBrand-normal text-center mb-[30px]">
          Enter details to create your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-[20px]" noValidate>
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Your name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full border rounded-md px-4 py-2 focus:outline-none ${
                errors.name
                  ? 'border-red-500'
                  : 'border-blueBrand-lighter focus:border-purpleBrand-normal'
              }`}
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email or Phone */}
          <div>
            <label className="block text-sm font-medium mb-1">
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
              placeholder="Enter your email"
            />
            {errors.emailOrPhone && (
              <p className="text-red-500 text-xs mt-1">{errors.emailOrPhone}</p>
            )}
          </div>

          {/* Password and Confirm Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className={`relative w-full`}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full border rounded-md px-4 py-2 focus:outline-none ${
                    errors.password
                      ? 'border-red-500'
                      : 'border-blueBrand-lighter focus:border-purpleBrand-normal'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-[#999999]"
                >
                  {showPassword ? (
                    <FaEye className="text-[#333333]" />
                  ) : (
                    <FaEyeSlash />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Confirm Password
              </label>
              <div className={`relative w-full`}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full border rounded-md px-4 py-2 focus:outline-none ${
                    errors.confirmPassword
                      ? 'border-red-500'
                      : 'border-blueBrand-lighter focus:border-purpleBrand-normal'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-[#999999]"
                >
                  {showConfirmPassword ? (
                    <FaEye className="text-[#333333]" />
                  ) : (
                    <FaEyeSlash />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-purpleBrand-normal hover:bg-purpleBrand-normalHover text-white font-semibold rounded-md mt-4 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Signing up...' : 'Sign up'}
          </button>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
            <button
              type="button"
              className="w-full border border-blueBrand-lighter rounded-md flex items-center justify-center gap-2 py-2 hover:bg-gray-50"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="h-5 w-5"
              />
              <span>Sign up with Google</span>
            </button>
            <button
              type="button"
              className="w-full border border-blueBrand-lighter rounded-md flex items-center justify-center gap-2 py-2 hover:bg-gray-50"
            >
              <img src={appleIcon} alt="Apple" className="h-5 w-5" />
              <span>Sign up with Apple</span>
            </button>
          </div>
        </form>

        {/* Sign In Link */}
        <p className="text-center text-sm mt-6">
          Already have an account?{' '}
          <a href="/signin" className="text-purpleBrand-normal hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  )
}

export default SignUpForm
