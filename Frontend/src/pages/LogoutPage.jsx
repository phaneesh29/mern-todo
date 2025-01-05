import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LogoutPage = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_BASE_URL;

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/users/logout`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Clear the token from localStorage and redirect
      localStorage.removeItem("token");
      setMessage(response.data.message);
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setMessage("Error logging out. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 px-4">
      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-4">Logout</h1>

        <div className="text-center mb-6">
          <p className="text-lg font-medium text-gray-700">
            Are you sure you want to log out?
          </p>
        </div>

        {message && (
          <div
            className={`text-center mb-4 ${
              message.includes("Error") ? "text-red-600" : "text-green-600"
            } font-semibold`}
          >
            {message}
          </div>
        )}

        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={handleLogout}
            disabled={loading}
            className={`py-2 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-md shadow-md hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging out..." : "Logout"}
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="py-2 px-4 bg-gradient-to-r from-gray-400 to-gray-500 text-white font-bold rounded-md shadow-md hover:from-gray-500 hover:to-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutPage;
