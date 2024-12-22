import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const HealthPage = () => {
  const [healthData, setHealthData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_BASE_URL; // Ensure to use the correct base URL

  // Fetch health status from the backend
  useEffect(() => {
    const fetchHealthStatus = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/health`);
        setHealthData(response.data);
      } catch (err) {
        setError("Failed to fetch health data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchHealthStatus();
  }, []);

  // Determine the background color based on the error state
  const bgColor = error ? 'from-red-50 to-red-100' : 'from-green-50 to-green-100';

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${bgColor} px-4`}>
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 w-full max-w-md">
          <p className="text-gray-600 font-semibold text-center">Loading health status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${bgColor} px-4`}>
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 w-full max-w-md">
          <p className="text-red-600 font-semibold text-center">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${bgColor} px-4`}>
      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-4">Server Health Status</h1>
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700">Message: {healthData.message}</p>
          <p className="text-lg font-medium text-gray-700">Timestamp: {new Date(healthData.timestamp).toLocaleString()}</p>
        </div>
      <Link to="/dashboard" className="inline-block mt-6 p-2 bg-blue-500 rounded-full text-white ">Dashboard</Link>
      </div>
    </div>
  );
};

export default HealthPage;
