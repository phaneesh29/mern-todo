import React from 'react'
import { Routes, Route, Link } from "react-router-dom";
import NotFound from './pages/NotFound';
import LandingPage from './pages/LandingPage';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/Profile';
import LogoutPage from './pages/LogoutPage';
import DashboardPage from './pages/DashboardPage';
import UserPage from './pages/UserPage';
import HealthPage from './pages/HealthPage';
import { MdHealthAndSafety } from "react-icons/md";
import { Analytics } from '@vercel/analytics/react';
const App = () => {
  return (
    <>
    <Analytics />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users/:id" element={<UserPage />} />
        <Route path="/health" element={<HealthPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Link to="/health" aria-label="Go to Health section">
        <div className="fixed flex justify-center items-center gap-2 bottom-2 left-2 bg-gradient-to-br p-3 rounded-full from-green-400 via-purple-300 to-green-500 shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300 md:bottom-6 md:left-6">
          <MdHealthAndSafety className="text-black text-lg" />
          <span className="text-sm font-semibold text-black hidden sm:inline">Health</span>
        </div>
      </Link>


    </>
  )
}

export default App