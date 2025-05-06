import React, { useState } from 'react'
import { FiMoreVertical, FiEye, FiEyeOff, FiUpload } from 'react-icons/fi'
import { toast } from 'react-toastify'

import userAvatarOther from '../assets/images/user-avatar-other.jpg'
import userAvatar from '../assets/images/user-avatar.png'

const UsersPage = () => {
  const [users, setUsers] = useState([
    {
      name: 'Sarah',
      email: 'abc@gmail.com',
      account: 'Admin',
      joined: 'Apr 6, 2024',
    },
    {
      name: 'Talia',
      email: 'abc@gmail.com',
      account: 'Admin',
      joined: 'Apr 6, 2024',
    },
    {
      name: 'Jamie',
      email: 'abc@gmail.com',
      account: 'Agent',
      joined: 'Apr 6, 2024',
    },
    {
      name: 'Aidelle',
      email: 'abc@gmail.com',
      account: 'Agent',
      joined: 'Apr 6, 2024',
    },
    {
      name: 'Nora',
      email: 'abc@gmail.com',
      account: 'Agent',
      joined: 'Apr 6, 2024',
    },
    {
      name: 'Kevin',
      email: 'abc@gmail.com',
      account: 'Agent',
      joined: 'Apr 6, 2024',
    },
  ])
  const [actionMenuOpen, setActionMenuOpen] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAccount, setSelectedAccount] = useState('')
  const [showModal, setShowModal] = useState(false)

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

  const handleAddUser = () => {
    console.log(formData)
    toast.success('User created successfully!')
    // TODO: Add logic to actually add user
    setShowModal(false)
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAccount =
      selectedAccount === 'All Users' ||
      selectedAccount === '' ||
      (selectedAccount === 'Admins' && user.account === 'Admin') ||
      (selectedAccount === 'Agents' && user.account === 'Agent')
    return matchesSearch && matchesAccount
  })
  return (
    <div className="min-h-screen p-8">
      <div className="flex justify-between mb-[16px]">
        <div className="flex items-center gap-2">
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
          <h1 className="text-2xl font-bold">Users</h1>
        </div>

        <div className="flex justify-between items-center mb-4 gap-[18px]">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input border rounded px-4 py-2 pr-10 focus:outline-none"
          />
          <div className="flex items-center gap-4">
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="border rounded px-3 py-2 focus:outline-none text-blueBrand-normal"
            >
              <option value="All Users">All Users</option>
              <option value="Admins">Admins</option>
              <option value="Agents">Agents</option>
            </select>
            <button
              onClick={() => setShowModal(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Add New
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-blueBrand-normal text-xs">
            <tr>
              <th className="px-4 py-3">Full Name</th>
              <th className="px-4 py-3">Email Address</th>
              <th className="px-4 py-3">Account</th>
              <th className="px-4 py-3">Joined Date</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-blueBrand-dark">
            {filteredUsers.map((user, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-4 py-3 flex items-center gap-2 relative">
                  {idx % 2 === 0 ? (
                    <>
                      <img src={userAvatar} width="32"></img>
                      <svg
                        className="absolute left-[38px] bottom-[12px]"
                        xmlns="http://www.w3.org/2000/svg"
                        width="11"
                        height="11"
                        viewBox="0 0 11 11"
                        fill="none"
                      >
                        <ellipse
                          cx="5.23244"
                          cy="5.5"
                          rx="5.04299"
                          ry="5"
                          fill="#4ADE80"
                        />
                      </svg>
                    </>
                  ) : (
                    <img src={userAvatarOther} width="32"></img>
                  )}
                  {user.name}
                </td>
                <td className="px-4 py-3">{user.email}</td>
                <td
                  className={`px-4 py-3 ${user.account === 'Admin' ? 'text-purple-600' : ''}`}
                >
                  {user.account}
                </td>
                <td className="px-4 py-3">{user.joined}</td>
                <td className="px-4 py-3 relative">
                  <button
                    onClick={() => toggleActionMenu(idx)}
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    <FiMoreVertical size={16} />
                  </button>
                  {actionMenuOpen === idx && (
                    <div className="absolute right-0 mt-2 w-32 bg-white shadow rounded border z-10">
                      <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                        Make Agent
                      </button>
                      <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                        Delete
                      </button>
                      <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                        Block
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end mt-6 space-x-2">
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
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl w-96 p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute left-4 top-4 text-gray-500 hover:text-gray-700"
            >
              &larr;
            </button>
            <h2 className="text-xl font-semibold text-center mb-4">Add User</h2>

            {/* Image upload */}
            <label className="block border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer text-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mx-auto w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <>
                  <FiUpload size={24} className="mx-auto text-gray-500" />
                  <span className="text-sm text-gray-500">Upload Image</span>
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
            <div className="flex gap-4 my-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.role === 'Admin'}
                  onChange={() => handleRoleChange('Admin')}
                />
                Admin
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.role === 'Agent'}
                  onChange={() => handleRoleChange('Agent')}
                />
                Agent
              </label>
            </div>

            {/* Name */}
            <input
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              placeholder="Name"
              className="border rounded w-full px-3 py-2 mb-3 focus:outline-none"
            />
            {/* Email */}
            <input
              name="email"
              value={formData.email}
              onChange={handleFormChange}
              placeholder="E-mail or phone number"
              className="border rounded w-full px-3 py-2 mb-3 focus:outline-none"
            />

            {/* Passwords */}
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleFormChange}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className="border rounded w-full px-3 py-2 pr-10 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-2 text-gray-500"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              <div className="relative flex-1">
                <input
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleFormChange}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  className="border rounded w-full px-3 py-2 pr-10 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-2 text-gray-500"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button
              onClick={handleAddUser}
              className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
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
