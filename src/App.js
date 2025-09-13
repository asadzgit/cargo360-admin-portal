import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from './contexts/AuthContext'
import { AppProvider } from './contexts/AppContext'
import Layout from './components/Layout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import BookingPage from './pages/BookingPage.jsx'
import ChangePassword from './pages/ChangePassword.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import Products from './pages/Products.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import SalesApprovalsPage from './pages/SalesApprovalsPage.jsx'
import Signin from './pages/Signin.jsx'
import Signup from './pages/Signup.jsx'
import UsersPage from './pages/UsersPage.jsx'
import VerifyCode from './pages/VerifyCode.jsx'

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <ToastContainer position="top-right" autoClose={3000} />
        <Router>
          <Routes>
            {/* <Route path="/signup" element={<Signup />} /> */}
            <Route path="/signin" element={<Signin />} />
            {/* <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/verify-code" element={<VerifyCode />} /> */}

            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="/" element={<Dashboard />} />
              {/* <Route path="/vehicles" element={<Products />} /> */}
              {/* <Route path="/profile" element={<ProfilePage />} /> */}
              <Route path="/orders" element={<SalesApprovalsPage />} />
              <Route path="/orders/:username" element={<SalesApprovalsPage />} />
              <Route path="/users" element={<UsersPage />} />
              {/* <Route path="/booking" element={<BookingPage />} /> */}
            </Route>
          </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
  )
}

export default App
