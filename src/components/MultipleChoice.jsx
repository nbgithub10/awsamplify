import React, { useState } from 'react';
import { ISSUE_TYPES } from '../services/persistenceService';

const MultipleChoice = ({ question, selectedAnswer, onSelectAnswer, showFeedback, userReport, onReport, isSaving }) => {
  const [showDiagram, setShowDiagram] = useState(false);
  const [issueType, setIssueType] = useState('');
  const [comment, setComment] = useState('');
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

  const handleSaveReport = () => {
    if (issueType) {
      onReport(question, issueType, comment);
      setIssueType('');
      setComment('');
    }
  };

  const getIssueTypeLabel = (value) => {
    const type = ISSUE_TYPES.find(t => t.value === value);
    return type ? type.label : value;
  };

  return (
    <div style={{ marginBottom: '30px' }}>
      <div style={{ marginBottom: '15px' }}>
        <span style={{ color: '#667eea', fontSize: '0.9rem', fontWeight: '600' }}>
          Question {question.id}
        </span>
      </div>
      
      <h2 className="question-text">{question.question}</h2>
      
      {question.image && (
        <div style={{ marginBottom: '15px' }}>
          <button 
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500'
            }}
            onClick={() => setShowDiagram(!showDiagram)}
          >
            {showDiagram ? 'Hide Diagram' : 'Show Diagram'}
          </button>
          {showDiagram && (
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

      <div style={{ marginTop: '20px', padding: '16px', borderRadius: '8px', backgroundColor: '#fff8e1', border: '1px solid #e0e0e0' }}>
        {userReport ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#28a745', fontWeight: 'bold' }}>✓</span>
            <span style={{ color: '#6c5ce7' }}>
              <strong>{getIssueTypeLabel(userReport.issueType)}</strong>
              {userReport.comment && <span style={{ fontStyle: 'italic', color: '#555' }}> - "{userReport.comment}"</span>}
            </span>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '10px', fontSize: '0.9rem', color: '#666', fontWeight: '500' }}>
              Report Issue:
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                disabled={isSaving}
                style={{
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  fontSize: '13px',
                  minWidth: '170px',
                  backgroundColor: 'white',
                  color: '#333',
                  cursor: 'pointer'
                }}
              >
                <option value="">Select issue type...</option>
                {ISSUE_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Comment (optional)"
                disabled={isSaving}
                style={{
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  fontSize: '13px',
                  width: '200px',
                  backgroundColor: 'white',
                  color: '#333'
                }}
              />
              <button
                onClick={handleSaveReport}
                disabled={!issueType || isSaving}
                style={{
                  padding: '8px 16px',
                  borderRadius: '4px',
                  border: 'none',
                  backgroundColor: issueType && !isSaving ? '#dc3545' : '#ccc',
                  color: 'white',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: issueType && !isSaving ? 'pointer' : 'not-allowed',
                  opacity: isSaving ? 0.7 : 1
                }}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultipleChoice;
