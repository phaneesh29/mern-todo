import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_BASE_URL;

  // Fetch the profile data when the component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Send the token in the request header
          },
        });
        setUserData(response.data);
      } catch (err) {
        navigate("/login"); // Redirect to the login page if the token is invalid or expired
        setError("Failed to fetch profile data. Please try again.");
      }
    };

    fetchProfile();
  }, []);

  const handleGoBack = () => {
    navigate("/dashboard"); // Navigate to the dashboard
  };

  const handleShareProfile = () => {
    if (userData && userData._id) {
      navigate(`/users/${userData._id}`); // Navigate to the share profile route with the user ID
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 w-full max-w-md">
          <p className="text-red-600 font-semibold text-center">{error}</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 w-full max-w-md">
          <p className="text-gray-600 font-semibold text-center">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-4">User Profile</h1>
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700">UUID: {userData._id}</p>
          <p className="text-lg font-medium text-gray-700">First Name: {userData.fullname.firstname}</p>
          <p className="text-lg font-medium text-gray-700">Last Name: {userData.fullname.lastname}</p>
          <p className="text-lg font-medium text-gray-700">Email: {userData.email}</p>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={handleGoBack}
            className="py-2 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-md shadow-md hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Go Back to Dashboard
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={handleShareProfile}
            className="py-2 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-md shadow-md hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Share Profile
          </button>
          <Link to={"/forgot"} className="text-blue-800 underline block mt-5">Change password</Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
