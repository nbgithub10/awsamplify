import React, { useState } from 'react';

const SectionSelector = ({ onSectionSelect }) => {
  const [view, setView] = useState('main'); // 'main' or 'studocu'
  const [showAllQuestions, setShowAllQuestions] = useState(false);

  // Studocu topics organized by category
  const studocuCategories = [
    {
      category: 'MATERIALS',
      topics: [
        { id: 'metals', title: 'Metals' },
        { id: 'polymersElastomers', title: 'Polymers & Elastomers' },
        { id: 'ceramics', title: 'Ceramics' },
        { id: 'composites', title: 'Composites' },
      ]
    },
    {
      category: 'CIVIL ENGINEERING',
      topics: [
        { id: 'civilTesting', title: 'Civil Testing Methods' },
        { id: 'crackTheory', title: 'Crack Theory' },
        { id: 'corrosion', title: 'Corrosion' },
        { id: 'recyclability', title: 'Recyclability' },
      ]
    },
    {
      category: 'TESTING METHODS',
      topics: [
        { id: 'hardnessImpactTesting', title: 'Hardness & Impact Testing' },
        { id: 'visualRadiographicTesting', title: 'Visual & Radiographic Testing' },
        { id: 'ultrasonicTesting', title: 'Ultrasonic Testing' },
      ]
    },
    {
      category: 'ADVANCED MATERIALS',
      topics: [
        { id: 'advancedCeramics', title: 'Advanced Ceramics' },
        { id: 'advancedComposites', title: 'Advanced Composites' },
        { id: 'glassSemiconductors', title: 'Glass & Semiconductors' },
      ]
    },
    {
      category: 'MANUFACTURING',
      topics: [
        { id: 'heatTreatment', title: 'Heat Treatment' },
        { id: 'ferrousManufacturing', title: 'Ferrous Manufacturing' },
        { id: 'nonFerrousManufacturing', title: 'Non-Ferrous Manufacturing' },
        { id: 'polymerManufacturing', title: 'Polymer Manufacturing' },
      ]
    },
    {
      category: 'ENGINEERING APPLICATIONS',
      topics: [
        { id: 'aeronauticalEngineering', title: 'Aeronautical Engineering' },
        { id: 'telecommunications', title: 'Telecommunications' },
      ]
    },
  ];

  const handleStudocuTopicSelect = (topicId) => {
    onSectionSelect(`studocu-${topicId}`, showAllQuestions);
  };

  if (view === 'studocu') {
    return (
      <div style={styles.container}>
        <button
          style={styles.backButton}
          onClick={() => setView('main')}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#e0e0e0'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#f5f5f5'}
        >
          ← Back to Main Menu
        </button>
        <h1 style={styles.title}>Select Engineering Topic</h1>
        <p style={styles.instructions}>
          Choose a topic from Engineering Materials
        </p>
        <div style={styles.scrollContainer}>
          {studocuCategories.map((categoryGroup, idx) => (
            <div key={idx} style={styles.categoryGroup}>
              <h3 style={styles.categoryTitle}>{categoryGroup.category}</h3>
              <div style={styles.categoryButtonContainer}>
                {categoryGroup.topics.map((topic) => (
                  <button
                    key={topic.id}
                    style={{...styles.topicButton, backgroundColor: '#f97316'}}
                    onClick={() => handleStudocuTopicSelect(topic.id)}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#ea580c'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#f97316'}
                  >
                    {topic.title}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>HSC Engineering Quiz</h1>
      
      {/* Combined instructions and toggle section */}
      <div style={styles.infoContainer}>
        <div style={styles.infoItem}>
          <span style={styles.infoText}>Select a section to begin your practice quiz</span>
        </div>
        <div style={styles.divider}></div>
        <label style={styles.toggleLabel}>
          <input
            type="checkbox"
            checked={showAllQuestions}
            onChange={(e) => setShowAllQuestions(e.target.checked)}
            style={styles.checkbox}
          />
          <span style={styles.toggleText}>Show all questions on single page</span>
        </label>
      </div>

      <div style={styles.buttonContainer}>
        <button
          style={styles.button}
          onClick={() => onSectionSelect('civil', showAllQuestions)}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
        >
          Civil Structures
        </button>
        <button
          style={styles.button}
          onClick={() => onSectionSelect('transport', showAllQuestions)}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
        >
          Personal & Public Transport
        </button>
        <button
          style={{...styles.button, backgroundColor: '#28a745'}}
          onClick={() => onSectionSelect('pastPapers', showAllQuestions)}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#218838'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#28a745'}
        >
          Past Papers (2020-2025)
        </button>
        <button
          style={styles.button}
          onClick={() => onSectionSelect('all', showAllQuestions)}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
        >
          All Questions
        </button>
        <button
          style={{...styles.button, backgroundColor: '#f97316'}}
          onClick={() => setView('studocu')}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#ea580c'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#f97316'}
        >
          Studocu - Engineering Materials
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
    marginBottom: '1.5rem',
    color: '#333',
  },
  infoContainer: {
    marginBottom: '2rem',
    padding: '1rem 1.5rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '2px solid #e0e0e0',
    width: '100%',
    maxWidth: '400px',
  },
  infoItem: {
    marginBottom: '0.75rem',
  },
  infoText: {
    fontSize: '1rem',
    color: '#333',
    fontWeight: '500',
  },
  divider: {
    height: '1px',
    backgroundColor: '#d0d0d0',
    marginBottom: '0.75rem',
  },
  toggleLabel: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    marginRight: '10px',
    cursor: 'pointer',
  },
  toggleText: {
    color: '#333',
    fontWeight: '500',
    userSelect: 'none',
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
  backButton: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    backgroundColor: '#f5f5f5',
    color: '#333',
    border: '2px solid #ddd',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    marginBottom: '1.5rem',
    alignSelf: 'flex-start',
  },
  scrollContainer: {
    width: '100%',
    maxWidth: '900px',
    maxHeight: '70vh',
    overflowY: 'auto',
    padding: '1rem',
  },
  categoryGroup: {
    marginBottom: '2rem',
  },
  categoryTitle: {
    fontSize: '1.3rem',
    color: '#f97316',
    fontWeight: 'bold',
    marginBottom: '1rem',
    textAlign: 'left',
    borderBottom: '2px solid #f97316',
    paddingBottom: '0.5rem',
  },
  categoryButtonContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '0.75rem',
  },
  topicButton: {
    padding: '0.75rem 1rem',
    fontSize: '0.95rem',
    backgroundColor: '#f97316',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    textAlign: 'center',
  },
};

export default SectionSelector;
