import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

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
      toast.success('Verification code sent to your email')
      navigate('/verify-code', {
        state: { email: formData.emailOrPhone },
      })
      console.log('Form submitted successfully:', formData)
      // Redirect user to dashboard or show success message
    } catch (error) {
      console.error('failed', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-whiteBrand-light flex items-center justify-center p-4">
      <div className="bg-white shadow-lg p-8 w-full max-w-[540px] form-shadow form-radius form-padding w-[540px]">
        <h2 className="text-blueBrand-dark text-center form-heading">
          Forgot Password
        </h2>
        <p className="text-blueBrand-lighter text-center mb-[30px] form-subheading">
          {`Enter your email address below and we’ll send you a link with instructions`}
        </p>

        <form onSubmit={handleSubmit} noValidate>
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

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="submit-btn w-full h-12 bg-purpleBrand-dark hover:bg-purpleBrand-normalHover text-white font-semibold rounded-md transition-colors disabled:opacity-50 mt-[25px]"
          >
            {'Send verification code'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword
