import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import appleIcon from '../assets/images/apple-logo.svg'

const SignInForm = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = () => {
    const newErrors = {}

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
      console.log('Form submitted successfully:', formData)
      toast.success('Signed in successfully!')
      navigate('/products')
      // Redirect user to dashboard or show success message
    } catch (error) {
      console.error('Signin failed', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-whiteBrand-light flex items-center justify-center p-4">
      <div className="bg-white shadow-lg p-8 w-full max-w-[540px] form-shadow form-radius form-padding w-[540px]">
        <h2 className="text-blueBrand-dark text-center form-heading">
          Sign In
        </h2>
        <p className="text-center mb-[30px] text-blueBrand-lighter form-subheading">
          Access your dashboard and stay on top of your performance.
        </p>

        <form onSubmit={handleSubmit} className="space-y-[20px]" noValidate>
          {/* Email or Phone */}
          <div>
            <label className="block text-blueBrand-dark form-label mb-1">
              E-mail or phone number
            </label>
            <input
              type="text"
              name="emailOrPhone"
              value={formData.emailOrPhone}
              onChange={handleChange}
              className={`w-full border input-border p-[15px] focus:outline-none ${
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
          <div className="flex flex-col justify-end items-end">
            <div className="relative w-full grid grid-cols-1 gap-[20px]">
              <div className="flex flex-col justify-end items-end">
                <div className={`relative w-full`}>
                  <label className="block text-blueBrand-dark form-label mb-1">
                    Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full border input-border p-[15px] focus:outline-none ${
                      errors.password
                        ? 'border-red-500'
                        : 'border-blueBrand-lighter focus:border-purpleBrand-normal'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-[45px] right-3 flex items-center text-[#999999]"
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
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="submit-btn w-full h-12 bg-purpleBrand-dark hover:bg-purpleBrand-normalHover text-white font-semibold rounded-md mt-[15px] transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Signing in...' : 'Login'}
          </button>
        </form>
        <div className="flex justify-end my-[15px]">
          <a
            href="/forgot-password"
            className="text-purpleBrand-normal hover:underline"
          >
            Forgot Password?
          </a>
        </div>
        {/* OAuth Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
          <button
            type="button"
            className="w-full input-border p-[15px] flex items-center justify-center gap-2 hover:bg-gray-50"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="h-5 w-5"
            />
            <span className="text-blueBrand-dark form-subheading">
              Sign up with Google
            </span>
          </button>
          <button
            type="button"
            className="w-full input-border p-[15px] flex items-center justify-center gap-2 hover:bg-gray-50"
          >
            <img src={appleIcon} alt="Apple" className="h-5 w-5" />
            <span className="text-blueBrand-dark form-subheading">
              Sign up with Apple
            </span>
          </button>
        </div>

        {/* Sign In Link */}
        <p className="text-center text-blueBrand-dark fomr-subheading mt-[20px]">
          Don’t have an account?{' '}
          <a href="/signup" className="text-purpleBrand-normal hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}

export default SignInForm
