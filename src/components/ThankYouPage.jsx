import React from 'react';
import { useNavigate } from 'react-router-dom';

const ThankYouPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-cyan-300 to-cyan-900">
      <div className="text-center p-8 bg-white rounded-lg shadow-xl max-w-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Thank You for Completing All Tests!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Your responses have been recorded successfully. We appreciate your participation.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
        >
          Return Home
        </button>
      </div>
    </div>
  );
};

export default ThankYouPage;