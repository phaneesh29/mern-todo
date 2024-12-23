import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UserPage = () => {
  const { id } = useParams();  // Get user ID from URL params
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_BASE_URL;

  // Fetch user and todos data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/users/${id}`);
        setUserData(response.data);
      } catch (err) {
        setError("Failed to fetch user data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  // Handle Go Back to Dashboard button click
  const handleGoBack = () => {
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 w-full max-w-md">
          <p className="text-gray-600 font-semibold text-center">Loading user data...</p>
        </div>
      </div>
    );
  }

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
          <p className="text-red-600 font-semibold text-center">User not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 w-full max-w-2xl">
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">User Profile</h1>
          <button
            onClick={handleGoBack}
            className="py-2 px-4 bg-indigo-500 text-white font-semibold rounded-md shadow-md hover:bg-indigo-600"
          >
            Go Back to Dashboard
          </button>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">User Info</h2>
          <p className="text-lg text-gray-800">UUID: {userData.user._id}</p>
          <p className="text-lg text-gray-800">Name: {userData.user.fullname.firstname} {userData.user.fullname.lastname}</p>
          <p className="text-lg text-gray-800">Email: {userData.user.email}</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">Todos</h2>
          {userData.todos.length === 0 ? (
            <p className="text-gray-600">No todos found for this user.</p>
          ) : (
            <ul className="space-y-4">
              {userData.todos.map((todo) => (
                <li
                  key={todo._id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-md shadow-sm"
                >
                  <div className="flex-1">
                    <h3
                      className={`text-xl font-medium ${
                        todo.completed ? "line-through text-gray-500" : "text-gray-800"
                      }`}
                    >
                      {todo.title}
                    </h3>
                    <p className="text-gray-600">{todo.description}</p>
                  </div>
                  <div className="flex gap-4">
                    <span
                      className={`py-2 px-4 text-white font-semibold rounded-md ${
                        todo.completed ? "bg-gray-500" : "bg-blue-500"
                      }`}
                    >
                      {todo.completed ? "Completed" : "Incomplete"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPage;
