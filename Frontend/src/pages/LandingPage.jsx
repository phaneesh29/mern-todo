import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center justify-between p-4 sm:p-8">
      {/* Header Section */}
      <header className="w-full flex flex-col sm:flex-row justify-between items-center max-w-7xl">
        <Link to="/"><h1 className="text-3xl sm:text-4xl font-bold text-blue-600">TodoShare</h1></Link>
        <nav className="flex space-x-4 mt-4 sm:mt-0">
          <Link
            to="/login"
            className="text-lg font-medium text-blue-500 hover:text-blue-600"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="text-lg font-medium text-blue-500 hover:text-blue-600"
          >
            Register
          </Link>
        </nav>
      </header>

      {/* Main Content Section */}
      <main className="flex flex-col items-center text-center space-y-6 mt-8 sm:mt-16">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-800 leading-tight">
          Manage, Share, and Conquer <br className="hidden sm:block" />
          Your Tasks with Ease
        </h2>
        <p className="text-base sm:text-lg text-gray-600 max-w-lg sm:max-w-xl">
          Join TodoShare today to organize your tasks, collaborate with others, 
          and achieve more together.
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            to="/dashboard"
            className="px-6 sm:px-8 py-3 bg-blue-500 text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-300"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="px-6 sm:px-8 py-3 border-2 border-blue-500 text-blue-500 font-bold rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-300"
          >
            Log In
          </Link>
        </div>
      </main>

      {/* Features Section */}
      <section className=" flex justify-center items-center flex-wrap gap-10 mt-16 max-w-6xl px-4">
        <div className="flex flex-col items-center text-center space-y-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1000/1000964.png"
            alt="Organize Tasks"
            className="w-16 h-16 sm:w-20 sm:h-20"
          />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700">Organize Your Tasks</h3>
          <p className="text-sm sm:text-base text-gray-600">
            Create, update, and delete tasks effortlessly.
          </p>
        </div>
        <div className="flex flex-col items-center text-center space-y-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3097/3097956.png"
            alt="Share Todos"
            className="w-16 h-16 sm:w-20 sm:h-20"
          />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700">Share with Friends</h3>
          <p className="text-sm sm:text-base text-gray-600">
            Collaborate by sharing your to-dos with others.
          </p>
        </div>
        <div className="flex flex-col items-center text-center space-y-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2885/2885420.png"
            alt="Track Progress"
            className="w-16 h-16 sm:w-20 sm:h-20"
          />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700">Track Your Progress</h3>
          <p className="text-sm sm:text-base text-gray-600">
            Stay on top of your goals and deadlines.
          </p>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="mt-16 text-gray-500 text-sm text-center">
        © {new Date().getFullYear()} TodoShare. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
