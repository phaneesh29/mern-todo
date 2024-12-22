import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
    const randomQuotes = [
        "Oops! Lost in the void.",
        "Are you sure you’re in the right place?",
        "404: The page you’re looking for is out of orbit.",
        "Even the best explorers get lost sometimes!"
    ];

    const randomQuote =
        randomQuotes[Math.floor(Math.random() * randomQuotes.length)];

    return (
        <div className="selection:bg-none flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-gray-100 text-gray-800 p-6">
            {/* Animated Image */}
            <img
                draggable="false"
                src="https://cdn-icons-png.flaticon.com/512/753/753345.png"
                alt="404 Illustration"
                className="selection:bg-none w-48 h-48 mb-6 animate-bounce"
            />

            {/* Heading */}
            <h1 className="text-5xl font-extrabold mb-4 text-gray-700 drop-shadow-lg">
                404: Page Not Found
            </h1>

            {/* Random Quote */}
            <p className="text-lg italic mb-6 text-gray-600">{randomQuote}</p>

            {/* Back Home Button */}
            <Link
                to="/"
                className="px-8 py-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
                Go Back Home
            </Link>
        </div>
    );
};

export default NotFound;
