/* eslint-disable import/order */
import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

import applogo from '../assets/images/cargo-360.png'
import AddVehicleModal from './AddVehicleModal.jsx'
import bellIcon from '../assets/images/bell-icon.svg'
import userAvatar from '../assets/images/user-avatar.png'

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [isAdmin, setIsAdmin] = useState(true)
  

  const navItems = [
    { label: 'Dashboard', path: '/' },
    // { label: 'Vehicles', path: '/vehicles' },
    { label: 'Orders', path: '/orders' },
    { label: 'Clearance', path: '/clearance' },
  ]
  if (isAdmin) {
    navItems.push({ label: 'Users', path: '/users' })
    navItems.push({ label: 'Mobile Config', path: '/mobile-config' })
  }
  const handleLogout = () => {
    logout()                // ✅clears token & user from localStorage
    navigate('/signin')     // ✅ Redirect to login page
  }


  return (
    <nav className="bg-white main-navbar">
      <div className="w-full max-w-full mx-auto pl-[56px] pr-[72px] flex items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          <img style={{ width: '100px' }} src={applogo}></img>
          <div className="text-xl font-bold text-gray-800 flex">Cargo360</div>
        </div>

        <div className="flex items-center">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`pr-[48px] form-subheading leading-[24px] ${location.pathname === item.path
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
          {/* ✅ LOGOUT BUTTON */}
          <button
            onClick={handleLogout}
            className="ml-6 text-red-600 font-semibold hover:text-red-800"
          >
            Logout
          </button>
          {/* <div
            onClick={() => setShowModal(true)}
            // bg-[#122E34]
            className="action-button bg-purpleBrand-dark hover:bg-purpleBrand-darkHover hover:cursor-pointer text-white px-[14px] py-[10px] rounded-[6px]"
          >
            Add New Vehicle
          </div> */}
          <AddVehicleModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
          />
          {/* <img src={bellIcon} className="mx-[16px]"></img> */}
          {/* <Link to="/profile">
            <img src={userAvatar}></img>
          </Link> */}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
