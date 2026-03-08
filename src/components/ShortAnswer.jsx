import React from 'react';

const ShortAnswer = ({ question, isRevealed, onToggleReveal }) => {
  const containerStyle = {
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    marginBottom: '20px'
  };

  const questionTextStyle = {
    fontSize: '18px',
    fontWeight: '500',
    marginBottom: '15px',
    color: '#333'
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  };

  const modelAnswerStyle = {
    marginTop: '15px',
    padding: '15px',
    backgroundColor: '#e8f4f8',
    borderRadius: '4px',
    borderLeft: '4px solid #007bff'
  };

  const headingStyle = {
    margin: '0 0 10px 0',
    fontSize: '16px',
    fontWeight: '600',
    color: '#007bff'
  };

  const paragraphStyle = {
    margin: '0',
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#555'
  };

  return (
    <div style={containerStyle}>
      <div style={questionTextStyle}>{question.question}</div>
      
      <button 
        style={buttonStyle}
        onClick={onToggleReveal}
      >
        {isRevealed ? 'Hide Model Answer' : 'Reveal Model Answer'}
      </button>

      {isRevealed && (
        <div style={modelAnswerStyle}>
          <h4 style={headingStyle}>Model Answer:</h4>
          <p style={paragraphStyle}>{question.modelAnswer}</p>
        </div>
      )}
    </div>
  );
};

export default ShortAnswer;
