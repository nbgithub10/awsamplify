import React, { useState } from 'react';
import { pastPapersRegistry } from '../data/past_papers/index';
import { useQuizScores } from '../hooks/useQuizScores';

const getScoreColor = (percentage) => {
  if (percentage >= 80) return '#28a745';
  if (percentage >= 60) return '#ffc107';
  return '#dc3545';
};

const ScoreBadge = ({ score }) => {
  if (!score) return null;
  
  return (
    <span style={{
      ...styles.scoreBadge,
      backgroundColor: getScoreColor(score.percentage),
    }}>
      {score.percentage}%
    </span>
  );
};

const StatsBar = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div style={styles.statsBar}>
        <span style={styles.statsLoadingText}>Loading stats...</span>
      </div>
    );
  }

  return (
    <div style={styles.statsBar}>
      <div style={styles.statItem}>
        <span style={styles.statValue}>{stats.attempted}</span>
        <span style={styles.statLabel}>Attempted</span>
      </div>
      <div style={styles.statDivider} />
      <div style={styles.statItem}>
        <span style={styles.statValue}>{stats.notAttempted}</span>
        <span style={styles.statLabel}>Not Attempted</span>
      </div>
      <div style={styles.statDivider} />
      <div style={styles.statItem}>
        <span style={{ 
          ...styles.statValue, 
          color: stats.averageScore > 0 ? getScoreColor(stats.averageScore) : '#666' 
        }}>
          {stats.averageScore > 0 ? `${stats.averageScore}%` : '-'}
        </span>
        <span style={styles.statLabel}>Avg Score</span>
      </div>
    </div>
  );
};

const SectionButton = ({ title, score, onClick }) => {
  return (
    <button style={styles.sectionButton} onClick={onClick}>
      <span style={styles.sectionButtonText}>{title}</span>
      <ScoreBadge score={score} />
    </button>
  );
};

const SectionSelector = ({ onSectionSelect, onViewStats }) => {
  const [view, setView] = useState('main');
  const [showAllQuestions, setShowAllQuestions] = useState(true);
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const { stats, isLoading, getScoreForSection } = useQuizScores();

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

  const handlePastPaperSelect = (subjectSlug, paperSlug) => {
    onSectionSelect(`pastPaper-${subjectSlug}-${paperSlug}`, showAllQuestions);
  };

  const toggleSubject = (slug) => {
    setExpandedSubjects(prev => ({
      ...prev,
      [slug]: !prev[slug]
    }));
  };

  const aiGeneratedSections = [
    { id: 'civil', title: 'Civil Structures', count: 25 },
    { id: 'transport', title: 'Personal & Public Transport', count: 25 },
    { id: 'all', title: 'All Questions', count: 72 },
  ];

  const pastPapersSubjects = Object.entries(pastPapersRegistry).map(([slug, data]) => ({
    slug,
    title: data.title,
    papers: Object.entries(data.papers || {}).map(([paperSlug, paperData]) => ({
      slug: paperSlug,
      title: paperSlug.split('-')[0],
      count: (paperData.data?.multipleChoice?.length || 0) + (paperData.data?.shortAnswer?.length || 0)
    }))
  })).filter(subject => subject.papers.length > 0);

  if (view === 'aiGenerated') {
    return (
      <div style={styles.container}>
        <button style={styles.backButton} onClick={() => setView('main')}>
          ← Back to Main Menu
        </button>
        <h1 style={styles.title}>AI Generated Content</h1>
        <p style={styles.instructions}>
          Choose a section to practice
        </p>
        <div style={styles.categoryButtonContainer}>
          {aiGeneratedSections.map((section) => (
            <SectionButton
              key={section.id}
              title={`${section.title} (${section.count})`}
              score={getScoreForSection(section.id)}
              onClick={() => onSectionSelect(section.id, showAllQuestions)}
            />
          ))}
        </div>
      </div>
    );
  }

  if (view === 'studocu') {
    return (
      <div style={styles.container}>
        <button style={styles.backButton} onClick={() => setView('main')}>
          ← Back to Main Menu
        </button>
        <h1 style={styles.title}>Studocu - Engineering Materials</h1>
        <p style={styles.instructions}>
          Choose a topic to practice
        </p>
        <div style={styles.scrollContainer}>
          {studocuCategories.map((categoryGroup, idx) => (
            <div key={idx} style={styles.categoryGroup}>
              <h3 style={styles.categoryTitle}>{categoryGroup.category}</h3>
              <div style={styles.categoryButtonContainer}>
                {categoryGroup.topics.map((topic) => (
                  <SectionButton
                    key={topic.id}
                    title={`${topic.title} (${topic.count})`}
                    score={getScoreForSection(`studocu-${topic.id}`)}
                    onClick={() => handleStudocuTopicSelect(topic.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (view === 'pastPapers') {
    const hasPapers = pastPapersSubjects.length > 0;
    
    return (
      <div style={styles.container}>
        <button style={styles.backButton} onClick={() => setView('main')}>
          ← Back to Main Menu
        </button>
        <h1 style={styles.title}>Past Papers</h1>
        <p style={styles.instructions}>
          Choose a past paper to practice
        </p>
        
        {!hasPapers ? (
          <div style={styles.noPapersContainer}>
            <p style={styles.noPapersText}>No past papers available.</p>
            <p style={styles.noPapersSubtext}>Run the PDF processing script to generate past papers.</p>
          </div>
        ) : (
          <div style={styles.scrollContainer}>
            {pastPapersSubjects.map((subject) => {
              const isExpanded = expandedSubjects[subject.slug] === true;
              return (
                <div key={subject.slug} style={styles.collapsibleCategoryGroup}>
                  <button
                    style={styles.collapsibleHeader}
                    onClick={() => toggleSubject(subject.slug)}
                  >
                    <span style={styles.collapsibleTitle}>{subject.title}</span>
                    <span style={styles.collapsibleCount}>({subject.papers.length} papers)</span>
                    <span style={styles.collapsibleArrow}>{isExpanded ? '▼' : '▶'}</span>
                  </button>
                  {isExpanded && (
                    <div style={styles.collapsibleContent}>
                      <div style={styles.categoryButtonContainer}>
                        {subject.papers.map((paper) => (
                          <SectionButton
                            key={paper.slug}
                            title={`${paper.title} (${paper.count})`}
                            score={getScoreForSection(`pastPaper-${subject.slug}-${paper.slug}`)}
                            onClick={() => handlePastPaperSelect(subject.slug, paper.slug)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>HSC Engineering Quiz</h1>
      
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

      <StatsBar stats={stats} isLoading={isLoading} />

      <div style={styles.buttonContainer}>
        <SectionButton
          title="AI Generated Content"
          onClick={() => setView('aiGenerated')}
        />
        <SectionButton
          title="Past Papers"
          onClick={() => setView('pastPapers')}
        />
        <SectionButton
          title="Studocu - Engineering Materials"
          onClick={() => setView('studocu')}
        />

        {onViewStats && (
          <button style={styles.statsButton} onClick={onViewStats}>
            View Stats
          </button>
        )}
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
    marginBottom: '1rem',
    padding: '1rem 1.5rem',
    backgroundColor: '#222',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '400px',
  },
  infoItem: {
    marginBottom: '0.75rem',
  },
  infoText: {
    fontSize: '1rem',
    color: '#fff',
    fontWeight: '500',
  },
  divider: {
    height: '1px',
    backgroundColor: '#555',
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
    color: '#fff',
    fontWeight: '500',
    userSelect: 'none',
  },
  statsBar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#222',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    width: '100%',
    maxWidth: '450px',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: '80px',
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: '0.75rem',
    color: '#aaa',
    textTransform: 'uppercase',
  },
  statDivider: {
    width: '1px',
    height: '30px',
    backgroundColor: '#555',
  },
  statsLoadingText: {
    fontSize: '0.9rem',
    color: '#aaa',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: '100%',
    maxWidth: '400px',
  },
  sectionButton: {
    position: 'relative',
    padding: '1rem 2rem',
    fontSize: '1.1rem',
    color: '#fff',
    backgroundColor: '#333',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    textAlign: 'center',
  },
  sectionButtonText: {
    display: 'inline-block',
  },
  scoreBadge: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    padding: '0.2rem 0.5rem',
    borderRadius: '12px',
    color: 'white',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    minWidth: '40px',
  },
  statsButton: {
    padding: '1rem 2rem',
    fontSize: '1.1rem',
    color: '#fff',
    backgroundColor: '#333',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '1rem',
  },
  backButton: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    color: '#fff',
    backgroundColor: '#333',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
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
  collapsibleCategoryGroup: {
    marginBottom: '1rem',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  collapsibleHeader: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 1.25rem',
    fontSize: '1.1rem',
    backgroundColor: '#1a1a1a',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
  },
  collapsibleTitle: {
    fontWeight: 'bold',
    fontSize: '1.2rem',
  },
  collapsibleCount: {
    flex: 1,
    marginLeft: '1rem',
    fontSize: '0.9rem',
    opacity: 0.8,
  },
  collapsibleArrow: {
    fontSize: '0.9rem',
    marginLeft: '0.5rem',
  },
  collapsibleContent: {
    padding: '1rem',
    backgroundColor: '#f5f5f5',
  },
  categoryTitle: {
    fontSize: '1.3rem',
    color: '#333',
    fontWeight: 'bold',
    marginBottom: '1rem',
    textAlign: 'left',
    borderBottom: '2px solid #333',
    paddingBottom: '0.5rem',
  },
  categoryButtonContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '0.75rem',
  },
  noPapersContainer: {
    padding: '2rem',
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '2px solid #e0e0e0',
    marginTop: '1rem',
  },
  noPapersText: {
    fontSize: '1.1rem',
    color: '#666',
    marginBottom: '0.5rem',
  },
  noPapersSubtext: {
    fontSize: '0.9rem',
    color: '#999',
  },
};

export default SectionSelector;
