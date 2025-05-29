// components/TestPage.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import QuestionCard from './QuestionCard';
import { supabase } from '../supaBaseClient'; // Adjust the import path as necessary

const TestPage = ({ title, questions }) => {
  const [allResponses, setAllResponses] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const testType = location.pathname.slice(1);

  useEffect(() => {
    // Check for authentication
    const userToken = localStorage.getItem('userToken');
    if (!userToken) {
      navigate('/login');
      return;
    }

    // Load saved responses
    const savedAllResponses = localStorage.getItem('all_test_responses');
    if (savedAllResponses) {
      setAllResponses(JSON.parse(savedAllResponses));
    }
  }, [navigate]);

  const handleResponse = (questionIndex, selectedOption) => {
    const newAllResponses = {
      ...allResponses,
      [testType]: {
        ...(allResponses[testType] || {}),
        [questionIndex]: selectedOption,
      },
    };
    setAllResponses(newAllResponses);
    localStorage.setItem('all_test_responses', JSON.stringify(newAllResponses));
  };

  const currentQuestion = questions[currentPage];
  const isLastQuestion = currentPage === questions.length - 1;
  const currentTestResponses = allResponses[testType] || {};

  const handleNextQuestion = () => {
    if (currentPage < questions.length - 1) {
      // If not the last question, go to next question
      setCurrentPage(currentPage + 1);
    } else {
      // If last question, submit test and navigate to next test
      handleSubmitTest();
    }
  };

  const handleSubmitTest = async () => {
    try {
      const userToken = localStorage.getItem('userToken');
      
      if (!userToken) {
        navigate('/login');
        return;
      }

      const submissionData = {
        access_token: userToken,
        section: testType,
        answers: currentTestResponses
      };

      const { error } = await supabase
        .from('responses')
        .insert([submissionData]);

      if (error) {
        throw error;
      }

      // Reset current page for next test
      setCurrentPage(0);
      
      // Navigate to next test
      const nextTest = getNextTest(testType);
      navigate(nextTest);

    } catch (err) {
      console.error('Submission failed:', err);
      alert('Failed to save responses. Please try again.');
    }
  };

  const getNextTest = (currentTest) => {
    const testFlow = {
      'personality': '/intelligences',
      'intelligences': '/career',
      'career': '/learning',
      'learning': '/thank-you'
    };
    return testFlow[currentTest];
  };

  // Add a check for invalid question index
  if (currentPage >= questions.length) {
    handleSubmitTest();
    return null;
  }

  return (
    <div className="flex">
      {/* Left Section: Current Question */}
      <div className="w-2/3 p-4">
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        <QuestionCard
          question={currentQuestion}
          index={currentPage}
          selectedOption={currentTestResponses[currentPage]}
          onResponse={handleResponse}
          testType={testType}
        />
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Previous
          </button>
          {!isLastQuestion ? (
            <button
              onClick={handleNextQuestion}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmitTest}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Submit Test
            </button>
          )}
        </div>
      </div>

      {/* Right Section: Question Grid */}
      <div className="w-1/3 p-4 border-l">
        <h2 className="text-lg font-bold mb-4">Question Grid ({testType})</h2>
        <div className="grid grid-cols-4 gap-2">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`p-2 rounded border ${
                i === currentPage
                  ? 'bg-blue-600 text-white'
                  : currentTestResponses[i]
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestPage;