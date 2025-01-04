import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Importing React Icons for show/hide button

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Password visibility toggle
  const [isSubmitting, setIsSubmitting] = useState(false); // New state to track the submission status
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_BASE_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSuccessMessage("");
    setIsSubmitting(true); // Disable button during submission

    try {
      const res = await axios.post(`${API_BASE_URL}/login`, {
        email: formData.email,
        password: formData.password,
      });

      // Save token to local storage
      localStorage.setItem("token", res.data.token);
      setSuccessMessage("Login successful!");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error) {
      console.log(error);
      if (error.response?.status === 400 || error.response?.status === 401) {
        setErrors([error.response.data.message || "Invalid credentials"]);
      } else {
        setErrors(["Something went wrong. Please try again later."]);
      }
    } finally {
      setIsSubmitting(false); // Re-enable button after submission is complete
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 text-center">Login</h1>
        <p className="text-gray-500 text-center text-sm mb-4">
          Welcome back! Please login to manage your to-dos.
        </p>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-400 text-red-600 rounded-md p-4 mb-4">
            {errors.map((error, index) => (
              <p key={index} className="text-sm">{error}</p>
            ))}
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-400 text-green-600 rounded-md p-4 mb-4">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-800 focus:outline-none"
                aria-label="Toggle Password Visibility"
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
            <span className="text-sm mt-2">Forgot password, <Link to="/forgot" className="text-indigo-500">Click here </Link></span>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-md shadow-md hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={isSubmitting} // Disable the button while submitting
          >
            {isSubmitting ? "Logging in..." : "Login"} {/* Show "Logging in..." while submitting */}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
