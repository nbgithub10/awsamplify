import React from 'react';

const SectionSelector = ({ onSectionSelect }) => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>HSC Engineering Quiz</h1>
      <p style={styles.instructions}>
        Select a section to begin your practice quiz
      </p>
      <div style={styles.buttonContainer}>
        <button
          style={styles.button}
          onClick={() => onSectionSelect('civil')}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
        >
          Civil Structures
        </button>
        <button
          style={styles.button}
          onClick={() => onSectionSelect('transport')}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
        >
          Personal & Public Transport
        </button>
        <button
          style={{...styles.button, backgroundColor: '#28a745'}}
          onClick={() => onSectionSelect('pastPapers')}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#218838'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#28a745'}
        >
          Past Papers (2020-2025)
        </button>
        <button
          style={styles.button}
          onClick={() => onSectionSelect('all')}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
        >
          All Questions
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px',
    textAlign: 'center',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
    color: '#333',
  },
  instructions: {
    fontSize: '1.2rem',
    marginBottom: '2rem',
    color: '#666',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: '100%',
    maxWidth: '400px',
  },
  button: {
    padding: '1rem 2rem',
    fontSize: '1.1rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    position: 'relative',
    zIndex: 10,
    pointerEvents: 'auto',
  },
};

export default SectionSelector;
