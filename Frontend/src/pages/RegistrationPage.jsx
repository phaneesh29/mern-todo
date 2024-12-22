import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Password visibility toggle
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state
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
      const res = await axios.post(`${API_BASE_URL}/register`, {
        fullname: {
          firstname: formData.firstname,
          lastname: formData.lastname,
        },
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem("token", res.data.token);
      setSuccessMessage("Registration successful!");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error) {
      console.log(error);
      if (error.response?.status === 400) {
        setErrors(error.response.data.errors || [{ msg: error.response.data.message }]);
      } else {
        setErrors([{ msg: "Something went wrong. Please try again later." }]);
      }
    } finally {
      setIsSubmitting(false); // Re-enable button after submission
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 text-center">Register</h1>
        <p className="text-gray-500 text-center text-sm mb-4">
          Join us and manage your to-dos efficiently!
        </p>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-400 text-red-600 rounded-md p-4 mb-4">
            {errors.map((error, index) => (
              <p key={index} className="text-sm">
                {error.msg}
              </p>
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
            <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              placeholder="Enter your first name"
              value={formData.firstname}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              placeholder="Enter your last name"
              value={formData.lastname}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
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
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-md shadow-md hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={isSubmitting} // Disable button during submission
          >
            {isSubmitting ? "Registering..." : "Register"} {/* Show "Registering..." while submitting */}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
