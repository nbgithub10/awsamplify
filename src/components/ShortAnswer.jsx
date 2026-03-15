import React, { useState } from 'react';

const ShortAnswer = ({ question, isRevealed, onToggleReveal }) => {
  const [showDiagram, setShowDiagram] = useState(false);

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
    fontWeight: '500',
    marginRight: '10px'
  };

  const diagramButtonStyle = {
    padding: '8px 16px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
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

  const imageStyle = {
    maxWidth: '100%',
    marginTop: '15px',
    borderRadius: '4px',
    border: '1px solid #ddd'
  };

  return (
    <div style={containerStyle}>
      <div style={questionTextStyle}>{question.question}</div>
      
      {question.image && (
        <div style={{ marginBottom: '15px' }}>
          <button 
            style={diagramButtonStyle}
            onClick={() => setShowDiagram(!showDiagram)}
          >
            {showDiagram ? 'Hide Diagram' : 'Show Diagram'}
          </button>
          {showDiagram && (
            <img 
              src={question.image} 
              alt="Question Diagram" 
              style={imageStyle}
              onError={(e) => {
                e.target.style.display = 'none';
                console.error('Failed to load question image:', question.image);
              }}
            />
          )}
        </div>
      )}
      
      <button 
        style={buttonStyle}
        onClick={onToggleReveal}
      >
        {isRevealed ? 'Hide Model Answer' : 'Reveal Model Answer'}
      </button>

      {isRevealed && (
        <div style={modelAnswerStyle}>
          <h4 style={headingStyle}>Model Answer:</h4>
          {(question.answer || question.modelAnswer || question.explanation) && (
            <p style={paragraphStyle}>{question.answer || question.modelAnswer || question.explanation}</p>
          )}
          {question.answerImage && (
            <div style={{ marginTop: '15px' }}>
              <img 
                src={question.answerImage} 
                alt="Answer" 
                style={imageStyle}
                onError={(e) => {
                  e.target.style.display = 'none';
                  console.error('Failed to load answer image:', question.answerImage);
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShortAnswer;
