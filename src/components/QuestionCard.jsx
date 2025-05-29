import React from 'react';
import PropTypes from 'prop-types';

const QuestionCard = ({ 
  question = { text: '', options: [] }, 
  index = 0, 
  selectedOption = null, 
  onResponse 
}) => {
  if (!question) {
    return (
      <div className="border p-4 mb-4 rounded shadow-sm">
        <p className="text-gray-500">Loading question...</p>
      </div>
    );
  }

  const { text = '', options = [] } = question;

  const handleOptionClick = (option) => {
    onResponse(index, option);
  };

  const handleClearResponse = () => {
    onResponse(index, null); // Pass null to clear the response
  };

  return (
    <div className="border p-4 mb-4 rounded shadow-sm">
      <h3 className="text-lg font-medium mb-2">Question {index + 1}</h3>
      <p className="mb-4">{text}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleOptionClick(option)}
            className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
              selectedOption === option
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      {selectedOption && (
        <div className="mt-4">
          <p className="text-green-600 font-medium mb-2">
            Response "{selectedOption}" recorded successfully!
          </p>
          <button
            onClick={handleClearResponse}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
          >
            Clear Response
          </button>
        </div>
      )}
    </div>
  );
};

QuestionCard.propTypes = {
  question: PropTypes.shape({
    text: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired
  }),
  index: PropTypes.number.isRequired,
  selectedOption: PropTypes.string,
  onResponse: PropTypes.func.isRequired
};

export default QuestionCard;
