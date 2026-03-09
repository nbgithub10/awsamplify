import React, { useState } from 'react';

const SectionSelector = ({ onSectionSelect }) => {
  const [view, setView] = useState('main'); // 'main', 'studocu', or 'aiGenerated'
  const [showAllQuestions, setShowAllQuestions] = useState(true);

  // Studocu topics organized by category
  const studocuCategories = [
    {
      category: 'MATERIALS',
      topics: [
        { id: 'metals', title: 'Metals', count: 22 },
        { id: 'polymersElastomers', title: 'Polymers & Elastomers', count: 15 },
        { id: 'ceramics', title: 'Ceramics', count: 13 },
        { id: 'composites', title: 'Composites', count: 21 },
      ]
    },
    {
      category: 'CIVIL ENGINEERING',
      topics: [
        { id: 'civilTesting', title: 'Civil Testing Methods', count: 27 },
        { id: 'crackTheory', title: 'Crack Theory', count: 22 },
        { id: 'corrosion', title: 'Corrosion', count: 25 },
        { id: 'recyclability', title: 'Recyclability', count: 16 },
      ]
    },
    {
      category: 'TESTING METHODS',
      topics: [
        { id: 'hardnessImpactTesting', title: 'Hardness & Impact Testing', count: 22 },
        { id: 'visualRadiographicTesting', title: 'Visual & Radiographic Testing', count: 18 },
        { id: 'ultrasonicTesting', title: 'Ultrasonic Testing', count: 11 },
      ]
    },
    {
      category: 'ADVANCED MATERIALS',
      topics: [
        { id: 'advancedCeramics', title: 'Advanced Ceramics', count: 18 },
        { id: 'advancedComposites', title: 'Advanced Composites', count: 29 },
        { id: 'glassSemiconductors', title: 'Glass & Semiconductors', count: 23 },
      ]
    },
    {
      category: 'MANUFACTURING',
      topics: [
        { id: 'heatTreatment', title: 'Heat Treatment', count: 33 },
        { id: 'ferrousManufacturing', title: 'Ferrous Manufacturing', count: 44 },
        { id: 'nonFerrousManufacturing', title: 'Non-Ferrous Manufacturing', count: 29 },
        { id: 'polymerManufacturing', title: 'Polymer Manufacturing', count: 26 },
      ]
    },
    {
      category: 'ENGINEERING APPLICATIONS',
      topics: [
        { id: 'aeronauticalEngineering', title: 'Aeronautical Engineering', count: 30 },
        { id: 'telecommunications', title: 'Telecommunications', count: 38 },
      ]
    },
  ];

  const handleStudocuTopicSelect = (topicId) => {
    onSectionSelect(`studocu-${topicId}`, showAllQuestions);
  };

  // AI Generated Content sections
  const aiGeneratedSections = [
    { id: 'civil', title: 'Civil Structures', count: 25 },
    { id: 'transport', title: 'Personal & Public Transport', count: 25 },
    { id: 'all', title: 'All Questions', count: 72 },
  ];

  if (view === 'aiGenerated') {
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
        <h1 style={styles.title}>AI Generated Content</h1>
        <p style={styles.instructions}>
          Choose a section to practice
        </p>
        <div style={styles.categoryButtonContainer}>
          {aiGeneratedSections.map((section) => (
            <button
              key={section.id}
              style={{...styles.topicButton, backgroundColor: '#007bff'}}
              onClick={() => onSectionSelect(section.id, showAllQuestions)}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
            >
              {section.title} ({section.count})
            </button>
          ))}
        </div>
      </div>
    );
  }

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
                    {topic.title} ({topic.count})
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
          onClick={() => setView('aiGenerated')}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
        >
          AI Generated Content
        </button>
        <button
          style={{...styles.button, backgroundColor: '#28a745'}}
          onClick={() => onSectionSelect('pastPapers', showAllQuestions)}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#218838'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#28a745'}
        >
          Past Papers (2020-2025) (22)
        </button>
        <button
          style={{...styles.button, backgroundColor: '#6366f1'}}
          onClick={() => onSectionSelect('enggPaper2020', showAllQuestions)}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#4f46e5'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#6366f1'}
        >
          Engg Paper 2020 (9)
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
    color: '#ffffff',
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
