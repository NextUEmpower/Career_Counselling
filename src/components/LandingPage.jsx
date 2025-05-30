import React from "react";
import { useNavigate } from "react-router-dom";
import {Registration} from "./Registration";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-cyan-300 to-cyan-900 text-white p-4">
      <div className="text-center max-w-2xl mx-auto">
        <div className="relative w-48 h-48 mx-auto mb-8 overflow-hidden rounded-full shadow-xl">
          <img
            src="/logo.png"
            alt="NextU Empower Logo"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/200?text=NextU+Empower";
            }}
          />
        </div>
        <h1 className="text-5xl font-extrabold mb-6 drop-shadow-lg">
          Career Preference Tests
        </h1>
        <p className="text-lg font-medium mb-8 max-w-md mx-auto drop-shadow-md">
          Discover your personality, career preferences, and learning styles in
          a fun and interactive way!
        </p>
        <button
          onClick={() => navigate("/register")}
          className="px-8 py-4 bg-gradient-to-r from-white to-blue-500 text-blue-600 font-bold rounded-full shadow-lg hover:bg-blue-100 hover:scale-105 transition-transform duration-300"
        >
          Get Started
        </button>
        <p className="mt-8 text-sm font-semibold text-white drop-shadow-md">
          Powered by <span className="text-yellow-300 italic">NextU Empower</span>
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
