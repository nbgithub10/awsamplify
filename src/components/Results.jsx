import React from 'react';

const Results = ({ userAnswers, questions, totalMCQuestions, section, onRestart }) => {
  // Get only the multiple choice questions (first totalMCQuestions in the array)
  const mcQuestions = questions.slice(0, totalMCQuestions);
  
  const calculateScore = () => {
    let correct = 0;
    // Only calculate score for multiple choice questions
    mcQuestions.forEach((question) => {
      const userAnswer = userAnswers.get(question.id);
      if (userAnswer === question.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const score = calculateScore();
  const total = mcQuestions.length;
  const percentage = ((score / total) * 100).toFixed(1);

  const getIncorrectAnswers = () => {
    return mcQuestions.filter((question) => {
      const userAnswer = userAnswers.get(question.id);
      return userAnswer !== question.correctAnswer;
    });
  };

  const incorrectAnswers = getIncorrectAnswers();

  // Inline styles
  const styles = {
    container: {
      maxWidth: '900px',
      margin: '0 auto',
      padding: '40px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px',
      padding: '30px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '12px',
      color: 'white',
      boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
    },
    title: {
      margin: '0 0 20px 0',
      fontSize: '2.5em',
      fontWeight: 'bold',
    },
    scoreDisplay: {
      marginTop: '20px',
    },
    scoreMain: {
      fontSize: '2em',
      fontWeight: 'bold',
      marginBottom: '10px',
    },
    scorePercentage: {
      fontSize: '3em',
      fontWeight: 'bold',
      marginTop: '10px',
    },
    incorrectSection: {
      backgroundColor: '#f8f9fa',
      padding: '30px',
      borderRadius: '12px',
      marginBottom: '30px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    sectionTitle: {
      fontSize: '1.8em',
      marginBottom: '25px',
      color: '#333',
      borderBottom: '3px solid #667eea',
      paddingBottom: '10px',
    },
    reviewItem: {
      backgroundColor: 'white',
      padding: '25px',
      marginBottom: '20px',
      borderRadius: '8px',
      border: '1px solid #e0e0e0',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    },
    reviewQuestion: {
      fontSize: '1.1em',
      marginBottom: '20px',
      color: '#333',
      lineHeight: '1.6',
    },
    questionStrong: {
      color: '#667eea',
      fontWeight: 'bold',
    },
    reviewAnswers: {
      marginTop: '15px',
    },
    userAnswer: {
      padding: '15px',
      marginBottom: '12px',
      backgroundColor: '#fee',
      borderLeft: '4px solid #dc3545',
      borderRadius: '4px',
    },
    correctAnswer: {
      padding: '15px',
      marginBottom: '12px',
      backgroundColor: '#d4edda',
      borderLeft: '4px solid #28a745',
      borderRadius: '4px',
    },
    explanation: {
      padding: '15px',
      backgroundColor: '#e7f3ff',
      borderLeft: '4px solid #0066cc',
      borderRadius: '4px',
      marginTop: '12px',
    },
    label: {
      fontWeight: 'bold',
      display: 'inline-block',
      marginRight: '8px',
      color: '#555',
    },
    answerText: {
      color: '#333',
    },
    explanationText: {
      color: '#333',
      lineHeight: '1.6',
    },
    perfectScore: {
      textAlign: 'center',
      padding: '40px',
      backgroundColor: '#d4edda',
      borderRadius: '12px',
      marginBottom: '30px',
      border: '2px solid #28a745',
    },
    perfectText: {
      fontSize: '1.5em',
      color: '#155724',
      margin: '0',
      fontWeight: 'bold',
    },
    retryButton: {
      display: 'block',
      width: '100%',
      maxWidth: '300px',
      margin: '0 auto',
      padding: '15px 30px',
      fontSize: '1.2em',
      fontWeight: 'bold',
      color: 'white',
      backgroundColor: '#667eea',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Quiz Complete!</h1>
        <div style={styles.scoreDisplay}>
          <div style={styles.scoreMain}>
            You scored {score}/{total}
          </div>
          <div style={styles.scorePercentage}>
            {percentage}%
          </div>
        </div>
      </div>

      {incorrectAnswers.length > 0 && (
        <div style={styles.incorrectSection}>
          <h2 style={styles.sectionTitle}>Review Incorrect Answers</h2>
          {incorrectAnswers.map((question) => {
            const userAnswer = userAnswers.get(question.id);
            return (
              <div key={question.id} style={styles.reviewItem}>
                <div style={styles.reviewQuestion}>
                  <strong style={styles.questionStrong}>Question:</strong> {question.question}
                </div>
                <div style={styles.reviewAnswers}>
                  <div style={styles.userAnswer}>
                    <span style={styles.label}>Your answer:</span>
                    <span style={styles.answerText}>
                      {userAnswer !== undefined ? question.options[userAnswer] : 'Not answered'}
                    </span>
                  </div>
                  <div style={styles.correctAnswer}>
                    <span style={styles.label}>Correct answer:</span>
                    <span style={styles.answerText}>
                      {question.options[question.correctAnswer]}
                    </span>
                  </div>
                  {question.explanation && (
                    <div style={styles.explanation}>
                      <span style={styles.label}>Explanation:</span>
                      <span style={styles.explanationText}>{question.explanation}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {incorrectAnswers.length === 0 && (
        <div style={styles.perfectScore}>
          <p style={styles.perfectText}>Perfect score! You answered all questions correctly!</p>
        </div>
      )}

      <button 
        style={styles.retryButton}
        onClick={onRestart}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#5568d3';
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#667eea';
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
        }}
      >
        Retry Quiz
      </button>
    </div>
  );
};

export default Results;
