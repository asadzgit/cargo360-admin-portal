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
    <nav className="bg-white main-navbar">
      <div className="w-full max-w-full mx-auto pl-[56px] pr-[72px] py-[16px] flex items-center justify-between">
        <div className="flex flex-row items-end gap-2">
          <img src={applogo}></img>
          <div className="text-xl font-bold text-gray-800">Royalty Sales</div>
        </div>

        <div className="flex items-center">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`pr-[48px] form-subheading leading-[24px] ${
                location.pathname === item.path
                  ? 'text-purpleBrand-dark'
                  : 'text-blueBrand-lighter hover:text-purpleBrand-darkHover'
              }`}
              style={{
                fontWeight: `${location.pathname === item.path ? '700' : ''}`,
              }}
            >
              {item.label}
            </Link>
          ))}
          <div
            onClick={() => setShowModal(true)}
            className="action-button bg-purpleBrand-dark hover:bg-purpleBrand-darkHover hover:cursor-pointer text-white px-[14px] py-[10px] rounded-[6px]"
          >
            Add New Product
          </div>
          <AddProductModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
          />
          <img src={bellIcon} className="mx-[16px]"></img>
          <Link to="/profile">
            <img src={userAvatar}></img>
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
