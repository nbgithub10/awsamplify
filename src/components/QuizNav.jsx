import React from 'react';

const QuizNav = ({ currentIndex, totalQuestions, onPrev, onNext, onFinish }) => {
  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  return (
    <div style={styles.container}>
      <button
        onClick={onPrev}
        disabled={isFirstQuestion}
        style={{
          ...styles.button,
          ...(isFirstQuestion ? styles.buttonDisabled : {}),
        }}
      >
        Previous
      </button>

      {isLastQuestion ? (
        <button onClick={onFinish} style={styles.finishButton}>
          Finish Quiz
        </button>
      ) : (
        <button onClick={onNext} style={styles.button}>
          Next
        </button>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
    marginTop: '2rem',
  },
  button: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    fontWeight: '500',
    color: '#fff',
    backgroundColor: '#3b82f6',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed',
    opacity: 0.6,
  },
  finishButton: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    fontWeight: '500',
    color: '#fff',
    backgroundColor: '#10b981',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
};

export default QuizNav;
