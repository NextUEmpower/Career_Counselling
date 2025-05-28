import React from 'react';
import { useNavigate } from 'react-router-dom';

const InstructionsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-300 to-cyan-900 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Test Instructions
        </h1>
        
        <div className="space-y-6 text-gray-600">
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-3">
              Overview
            </h2>
            <p>
              You will be taking 4 different tests in the following order:
            </p>
            <ol className="list-decimal ml-6 mt-2 space-y-2">
              <li>Personality Test</li>
              <li>Multiple Intelligences Test</li>
              <li>Career Preference Test</li>
              <li>Learning Styles Test</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-3">
              Important Guidelines
            </h2>
            <ul className="list-disc ml-6 space-y-2">
              <li>Answer all questions honestly and to the best of your ability</li>
              <li>Make sure to complete all the four tests in one sitting</li>
              <li>You can navigate between questions using the Next/Previous buttons</li>
              <li>Use the question grid on the right to jump to specific questions</li>
              <li>Your progress is saved automatically</li>
              <li>You must complete all questions in a test before proceeding to the next one</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-3">
              Navigation Tips
            </h2>
            <ul className="list-disc ml-6 space-y-2">
              <li>Green buttons indicate answered questions</li>
              <li>Blue button shows your current question</li>
              <li>Gray buttons are unanswered questions</li>
              <li>You can review and change your answers before submission</li>
            </ul>
          </section>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate('/personality')}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-lg"
          >
            Begin Tests
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructionsPage;