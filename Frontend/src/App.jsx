import React from 'react'
import { Routes, Route } from "react-router-dom";
import NotFound from './pages/NotFound';
import LandingPage from './pages/LandingPage';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/Profile';
import LogoutPage from './pages/LogoutPage';
import DashboardPage from './pages/DashboardPage';
import UserPage from './pages/UserPage';
import HealthPage from './pages/HealthPage';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegistrationPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/profile" element={<ProfilePage/>} />
        <Route path="/logout" element={<LogoutPage/>} />
        <Route path="/dashboard" element={<DashboardPage/>} />
        <Route path="/users/:id" element={<UserPage />} />
        <Route path="/health" element={<HealthPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App