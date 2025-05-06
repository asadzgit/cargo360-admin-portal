/* eslint-disable import/order */
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import applogo from '../assets/images/app-logo.svg'
import AddProductModal from './AddProductModal.jsx'
import bellIcon from '../assets/images/bell-icon.svg'
import userAvatar from '../assets/images/user-avatar.png'

const Navbar = () => {
  const location = useLocation()
  const [showModal, setShowModal] = useState(false)

  const navItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'Sales Approvals', path: '/approvals' },
    { label: 'Users', path: '/users' },
  ]

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex flex-row items-end gap-2">
          <img src={applogo}></img>
          <div className="text-xl font-bold text-gray-800">Royalty Sales</div>
        </div>

        <div className="flex items-center space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-2 rounded text-sm font-medium ${
                location.pathname === item.path
                  ? 'text-blue-600 font-semibold'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <div
            onClick={() => setShowModal(true)}
            className="bg-blue-700 hover:bg-blue-800 hover:cursor-pointer text-white text-sm px-4 py-2 rounded"
          >
            Add New Product
          </div>
          <AddProductModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
          />
          <img src={bellIcon}></img>
          <Link to="/profile">
            <img src={userAvatar}></img>
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
