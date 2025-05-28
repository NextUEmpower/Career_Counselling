import React from "react";
import { useNavigate } from "react-router-dom";
import {Registration} from "./Registration";
const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-cyan-300 to-cyan-900 text-white">
      <div className="text-center">
        <img
          src="/logo.png"
          alt="App Logo"
          className="w-40 h-40 mb--8 rounded-full shadow-lg object-cover"
        />
        <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">
          Career Preference Tests
        </h1>
        <p className="text-lg font-medium mb-8 max-w-md mx-auto drop-shadow-md">
          Discover your personality, career preferences, and learning styles in
          a fun and interactive way!
        </p>
        <button
          onClick={() => navigate("/register")}
          className="px-8 py-4 bg-gradient-to-r from-white to-blue-500 white text-blue-600 font-bold rounded-full shadow-lg hover:bg-blue-100 hover:scale-105 transition-transform duration-300"
        >
          Get Started
        </button>
        <p className="mt-8 text-sm font-semibold text-white drop-shadow-md ">
          Powered by <span className="text-yellow-300 italic pb-10">NextU Empower</span>
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
