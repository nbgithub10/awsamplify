import React from 'react';

const MultipleChoice = ({ question, selectedAnswer, onSelectAnswer, showFeedback }) => {
  const optionLetters = ['A', 'B', 'C', 'D'];

  const getButtonClass = (index) => {
    const baseClass = 'option-button';
    const isSelected = selectedAnswer === index;
    
    if (!showFeedback) {
      return `${baseClass} ${isSelected ? 'selected' : ''}`;
    }
    
    if (isSelected) {
      return `${baseClass} ${index === question.correctAnswer ? 'correct' : 'incorrect'}`;
    }
    
    if (index === question.correctAnswer) {
      return `${baseClass} correct`;
    }
    
    return baseClass;
  };

  return (
    <div style={{ marginBottom: '30px' }}>
      <div style={{ marginBottom: '15px' }}>
        <span style={{ color: '#667eea', fontSize: '0.9rem', fontWeight: '600' }}>
          Question {question.id}
        </span>
      </div>
      
      <h2 className="question-text">{question.question}</h2>
      
      {/* Render image if present */}
      {question.image && (
        <div style={{ 
          marginTop: '20px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <img 
            src={question.image} 
            alt="Question reference diagram"
            style={{ 
              maxWidth: '100%', 
              height: 'auto',
              borderRadius: '8px',
              border: '2px solid #e0e0e0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              console.error('Failed to load image:', question.image);
            }}
          />
        </div>
      )}
      
      <div className="options-container">
        {question.options.map((option, index) => (
          <button
            key={index}
            className={getButtonClass(index)}
            onClick={() => onSelectAnswer(index)}
            disabled={showFeedback}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <span style={{ 
              fontWeight: 'bold',
              minWidth: '30px',
              display: 'inline-block'
            }}>
              {optionLetters[index]}.
            </span>
            <span style={{ flex: 1, textAlign: 'left' }}>{option}</span>
          </button>
        ))}
      </div>

      {showFeedback && (
        <div style={{
          marginTop: '20px',
          padding: '16px',
          borderRadius: '8px',
          backgroundColor: selectedAnswer === question.correctAnswer ? '#d1fae5' : '#fee2e2',
          border: `2px solid ${selectedAnswer === question.correctAnswer ? '#10b981' : '#ef4444'}`,
          color: selectedAnswer === question.correctAnswer ? '#065f46' : '#991b1b',
        }}>
          <strong>
            {selectedAnswer === question.correctAnswer ? '✓ Correct!' : '✗ Incorrect'}
          </strong>
          <div style={{ marginTop: '8px' }}>
            <strong>Correct Answer:</strong> {optionLetters[question.correctAnswer]}. {question.options[question.correctAnswer]}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultipleChoice;
