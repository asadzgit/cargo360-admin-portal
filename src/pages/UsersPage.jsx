import React, { useState, useEffect } from 'react'
import { FiMoreVertical, FiEye, FiEyeOff, FiUpload } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'


import { useApp } from '../contexts/AppContext'
import { usersService } from '../services/usersService'
import userAvatarOther from '../assets/images/user-avatar-other.jpg'
import userAvatar from '../assets/images/user-avatar.png'

const UsersPage = () => {
  const { users, loading, error, dispatch, actions } = useApp()
  const [actionMenuOpen, setActionMenuOpen] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAccount, setSelectedAccount] = useState('')
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers()
  }, [])

  // Auto-refresh every 1 minute
  useEffect(() => {
    const interval = setInterval(() => {
      fetchUsers();
    }, 60000);

    return () => clearInterval(interval); // cleanup
  }, []);


  const handleRowClick = (userName, userRole) => {
    navigate(`/orders/${userName}/${userRole}`)
  }

  const fetchUsers = async () => {
    dispatch({ type: actions.SET_USERS_LOADING, payload: true })

    try {
      const result = await usersService.getAllUsers()

      if (result.success) {
        dispatch({ type: actions.SET_USERS_SUCCESS, payload: result.data })
      } else {
        dispatch({ type: actions.SET_USERS_ERROR, payload: result.error })
        toast.error(result.message || 'Failed to fetch users')
      }
    } catch (error) {
      dispatch({ type: actions.SET_USERS_ERROR, payload: error.message })
      toast.error('An error occurred while fetching users')
    }
  }

  const [formData, setFormData] = useState({
    role: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    image: null,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)

  const toggleActionMenu = (index) => {
    setActionMenuOpen(actionMenuOpen === index ? null : index)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, image: file })
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRoleChange = (role) => {
    setFormData({ ...formData, role })
  }

  const handleAddUser = async () => {
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      toast.error('Please fill in all required fields')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role.toLowerCase(),
        phone: '1234567890', // Default phone for now
      }

      const result = await usersService.createUser(userData)

      if (result.success) {
        dispatch({ type: actions.ADD_USER, payload: result.data })
        toast.success(result.message || 'User created successfully!')
        setShowModal(false)
        setFormData({
          role: '',
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          image: null,
        })
        setImagePreview(null)
      } else {
        toast.error(result.error || 'Failed to create user')
      }
    } catch (error) {
      toast.error('An error occurred while creating user')
    }
  }

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const result = await usersService.deleteUser(userId)

        if (result.success) {
          dispatch({ type: actions.DELETE_USER, payload: userId })
          toast.success('User deleted successfully')
        } else {
          toast.error(result.message || 'Failed to delete user')
        }
      } catch (error) {
        toast.error('An error occurred while deleting user')
      }
    }
  }

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      const result = await usersService.updateUserRole(userId, newRole)

      if (result.success) {
        dispatch({ type: actions.UPDATE_USER, payload: result.data })
        toast.success(`User role updated to ${newRole}`)
      } else {
        toast.error(result.message || 'Failed to update user role')
      }
    } catch (error) {
      toast.error('An error occurred while updating user role')
    }
  }

  const handleBlockUser = async (userId, isApproved) => {
    try {
      const result = await usersService.updateUserApproval(userId, !isApproved)

      if (result.success) {
        dispatch({ type: actions.UPDATE_USER, payload: result.data })
        toast.success(`User ${!isApproved ? 'approved' : 'blocked'} successfully`)
      } else {
        toast.error(result.message || `Failed to ${!isApproved ? 'approve' : 'block'} user`)
      }
    } catch (error) {
      toast.error(`An error occurred while ${!isApproved ? 'approving' : 'blocking'} user`)
    }
  }

  const filteredUsers = users.filter((user) => {
    console.log({ user });


    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      user.phone?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      user.company?.toLowerCase()?.includes(searchTerm.toLowerCase())
    const matchesAccount =
      selectedAccount === 'All Users' ||
      selectedAccount === '' ||
      (selectedAccount === 'Admins' && user.role === 'admin') ||
      (selectedAccount === 'Customers' && user.role === 'customer') ||
      (selectedAccount === 'Brokers' && user.role === 'trucker') ||
      (selectedAccount === 'Drivers' && user.role === 'driver')
    return matchesSearch && matchesAccount
  })
  return (
    <div className="min-h-screen px-[94px] py-[30px]">
      <div className="flex justify-between mb-[16px]">
        <div className="flex items-center ml-[12px] gap-[12px]">
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
          <h1 className="modal-heading">Users</h1>
        </div>

        <div className="flex justify-between items-center gap-[20px]">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input filter-button-border px-[14px] py-[10px] focus:outline-none h-[40px]"
          />
          <div className="flex items-center gap-4">
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="border rounded px-[14px] py-[10px] filter-button filter-button-border focus:outline-none text-blueBrand-normal"
            >
              <option value="All Users">All Users</option>
              <option value="Admins">Admins</option>
              <option value="Customers">Customers</option>
              <option value="Truckers">Brokers</option>
              <option value="Drivers">Drivers</option>
            </select>
            {/* <button
              onClick={() => setShowModal(true)}
              className="filter-button bg-purpleBrand-dark px-[14px] py-[10px] rounded-[6px] hover:bg-purpleBrand-darkHover"
              style={{
                boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
                color: '#fff',
              }}
            >
              Add New
            </button> */}
          </div>
        </div>
      </div>

      {/* Loading state */}
      {/* {loading.users && (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">Loading users...</div>
        </div>
      )} */}

      {/* Error state */}
      {error.users && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error.users}
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-[#F6F5F6] text-blueBrand-normal text-xs">
            <tr className="filter-button leading-[18px]">
              <th className="px-4 py-3">Full Name</th>
              <th className="px-4 py-3">Email Address</th>
              <th className="px-4 py-3">Phone Number</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Joined Date</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-blueBrand-dark">
            {filteredUsers.map((user, idx) => (
              <tr key={user.id || idx} className="border-t">
                <td className="px-4 py-3 flex items-center gap-2 relative">
                  <span className="form-subheading text-blueBrand-dark">
                    {user.name}
                  </span>
                </td>
                <td className="px-[24px] py-[16px] form-subheading text-blueBrand-dark">
                  {user.email}
                </td>
                <td className="px-[24px] py-[16px] form-subheading text-blueBrand-dark">
                  {user.phone || 'N/A'}
                </td>
                <td className="px-[24px] py-[16px] form-subheading text-blueBrand-dark">
                  {user.company || 'N/A'}
                </td>
                <td className="px-[24px] py-[16px] form-subheading text-blueBrand-dark">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                    user.role === 'customer' ? 'bg-blue-100 text-blue-800' :
                      user.role === 'trucker' ? 'bg-green-100 text-green-800' :
                        user.role === 'driver' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                    }`}>
                    {user.role === "trucker" ? "BROKER" : user.role?.toUpperCase()}
                  </span>
                </td>
                <td className="px-[24px] py-[16px] form-subheading text-blueBrand-dark">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${user.isApproved ? 'bg-green-500' : 'bg-red-500'
                      }`}></span>
                    <span className="text-xs">
                      {user.isApproved ? 'Approved' : 'Pending'}
                    </span>
                    {user.isEmailVerified && (
                      <span className="text-xs text-green-600">✓ Verified</span>
                    )}
                  </div>
                </td>
                <td className="px-[24px] py-[16px] form-subheading text-blueBrand-dark">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-[24px] py-[16px] form-subheading text-blueBrand-dark relative">
                  <button
                    onClick={() => user.name && handleRowClick(user.name, user.role)}
                    className="block text-left px-2 py-2 rounded-[6px] bg-[#50C878] text-blueBrand-dark font-medium hover:bg-[#5F8575]"
                  >
                    See orders
                  </button>
                  {/* <button
                    onClick={() => toggleActionMenu(idx)}
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    <FiMoreVertical size={16} stroke="#B2BBC6" />
                  </button>
                  {actionMenuOpen === idx && (
                    <div className="absolute right-0 mt-2 w-40 bg-white shadow rounded border z-10">
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => {
                            handleUpdateUserRole(user.id, 'admin')
                            setActionMenuOpen(null)
                          }}
                          className="block w-full text-left px-4 py-2 text-blueBrand-dark font-medium hover:bg-gray-100"
                        >
                          Make Admin
                        </button>
                      )}
                      <button
                        onClick={() => {
                          handleBlockUser(user.id, user.isApproved)
                          setActionMenuOpen(null)
                        }}
                        className="block w-full text-left px-4 py-2 text-blueBrand-dark font-medium hover:bg-gray-100"
                      >
                        {user.isApproved ? 'Block' : 'Approve'}
                      </button>
                      <button
                        onClick={() => {
                          handleDeleteUser(user.id)
                          setActionMenuOpen(null)
                        }}
                        className="block w-full text-left px-4 py-2 text-red-600 font-medium hover:bg-gray-100"
                      >
                        Delete
                      </button>
                    </div>
                  )} */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {/* <div className="flex justify-end mt-6 space-x-2">
        <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-100">
          &lt; Back
        </button>
        {[1, 2, 3, 4, 5].map((p) => (
          <button
            key={p}
            className={`px-3 py-1 border rounded ${p === 2 ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {p}
          </button>
        ))}
        <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-100">
          Next &gt;
        </button>
      </div> */}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white w-[540px] h-[715px] py-[30px] px-[40px] relative rounded-[12px]">
            <button
              onClick={() => setShowModal(false)}
              className="absolute left-4 top-4 text-gray-500 hover:text-gray-700"
            >
              &larr;
            </button>
            <h2 className="text-bluBrand-dark form-heading text-center">
              Add User
            </h2>

            {/* Image upload */}
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 w-[207px] h-[123px] mx-auto my-[30px] rounded-[6px] p-[15px] cursor-pointer text-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mx-auto w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <>
                  <FiUpload size={24} className="mx-auto text-[#B2BBC6]" />
                  <span className="mt-[10px] text-blueBrand-dark form-subheading">
                    Upload Image
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            {/* Role */}
            <label className="text-blueBrand-lighter form-label">Role</label>
            <div className="flex gap-4 mt-[5px] mb-[20px]">
              <label className="flex items-center role-input gap-[8px] p-[8px] w-[180px]">
                <input
                  type="checkbox"
                  className="input-border w-[22px] h-[22px]"
                  style={{ borderColor: '#E8E9EA' }}
                  checked={formData.role === 'Admin'}
                  onChange={() => handleRoleChange('Admin')}
                />
                Admin
              </label>
              <label className="flex items-center role-input gap-[8px] p-[8px] w-[180px]">
                <input
                  type="checkbox"
                  className="input-border w-[22px] h-[22px]"
                  style={{ borderColor: '#E8E9EA' }}
                  checked={formData.role === 'Agent'}
                  onChange={() => handleRoleChange('Agent')}
                />
                Agent
              </label>
            </div>

            <label className="text-blueBrand-lighter form-label">Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              placeholder="Enter your name"
              className="border rounded w-full px-3 py-2 mb-[20px] focus:outline-none  mt-[5px]"
            />

            <label className="text-blueBrand-lighter form-label">
              E-mail or phone number
            </label>
            <input
              name="email"
              value={formData.email}
              onChange={handleFormChange}
              placeholder="Enter your email"
              className="border rounded w-full px-3 py-2 focus:outline-none mt-[5px]"
            />

            <div className="flex gap-[20px] my-[20px]">
              <div className="relative flex-1">
                <label className="text-blueBrand-lighter form-label">
                  Password
                </label>
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleFormChange}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="border rounded w-full px-3 py-2 pr-10 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-[38px] text-gray-500"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              <div className="relative flex-1">
                <label className="text-blueBrand-lighter form-label">
                  Confimr Password
                </label>
                <input
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleFormChange}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="border rounded w-full px-3 py-2 pr-10 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-[38px] text-gray-500"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button
              onClick={handleAddUser}
              className="w-full bg-purpleBrand-dark text-white py-[14px] px-[49px] rounded-[6px] hover:bg-purpleBrand-darkHover product-name leading-[24px]"
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default UsersPage
