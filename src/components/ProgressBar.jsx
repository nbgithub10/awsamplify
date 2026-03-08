import React from 'react';

const ProgressBar = ({ currentIndex, totalQuestions }) => {
  const current = currentIndex + 1;
  const percentage = (current / totalQuestions) * 100;

  return (
    <div style={{
      width: '100%',
      marginBottom: '20px'
    }}>
      <div style={{
        fontSize: '14px',
        marginBottom: '8px',
        color: '#666',
        textAlign: 'center'
      }}>
        Question {current} of {totalQuestions}
      </div>
      <div style={{
        width: '100%',
        height: '8px',
        backgroundColor: '#e0e0e0',
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        <div 
          style={{ 
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: '#4CAF50',
            transition: 'width 0.3s ease'
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
