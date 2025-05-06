import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const VerifyCode = () => {
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const location = useLocation()
  // eslint-disable-next-line no-unused-vars
  const email = location.state?.email || ''

  const handleChange = (e) => {
    setCode(e.target.value)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!code.trim()) {
      setError('Please enter your verification code')
    }
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log('Form submitted successfully:')
      toast.success('Code verified!')
      navigate('/change-password')
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
        <h2 className="text-2xl font-bold text-blueBrand-dark text-center">
          Forgot Password
        </h2>
        <p className="text-blueBrand-normal text-center mb-[30px]">
          {`We’ve sent 5 digits verification code to `}
          <span className="text-purpleBrand-normal hover:underline">
            {email}
          </span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-sm font-medium mb-1">
              Verification Code
            </label>
            <input
              type="number"
              name="verificationCode"
              value={code}
              onChange={handleChange}
              className={`w-full border rounded-md px-4 py-2 focus:outline-none 
                [appearance:textfield] 
    [&::-webkit-outer-spin-button]:appearance-none 
    [&::-webkit-inner-spin-button]:appearance-none ${
      error
        ? 'border-red-500'
        : 'border-blueBrand-lighter focus:border-purpleBrand-normal'
    }`}
              placeholder="Enter your code here"
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-purpleBrand-normal hover:bg-purpleBrand-normalHover text-white font-semibold rounded-md mt-4 transition-colors disabled:opacity-50"
          >
            Verify and set new password
          </button>
        </form>
      </div>
    </div>
  )
}

export default VerifyCode
