import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const ChangePassword = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = () => {
    const newErrors = {}

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
      toast.success('Password changed successfully!')
    } catch (error) {
      console.error('Signup failed', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-whiteBrand-light flex items-center justify-center p-4">
      <div className="bg-white shadow-lg p-8 w-full max-w-[540px] form-shadow form-radius form-padding w-[540px]">
        <h2 className="text-blueBrand-dark text-center form-heading">
          New Password
        </h2>
        <p className="text-blueBrand-lighter text-center mb-[30px] form-subheading">
          Set Complex passwords to protect
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 gap-[25px]">
            <div>
              <label className="block text-blueBrand-dark form-label mb-1">
                New Password
              </label>
              <div className={`relative w-full`}>
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
              <label className="block text-blueBrand-dark form-label mb-1">
                Confirm Password
              </label>
              <div className={`relative w-full`}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full border input-border p-[15px] focus:outline-none ${
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="submit-btn w-full h-12 bg-purpleBrand-dark hover:bg-purpleBrand-normalHover text-white font-semibold rounded-md transition-colors disabled:opacity-50 mt-[25px]"
          >
            Set new password
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChangePassword
