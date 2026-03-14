import React, { useState, useMemo } from 'react';
import SectionSelector from './SectionSelector';
import MultipleChoice from './MultipleChoice';
import ShortAnswer from './ShortAnswer';
import QuizNav from './QuizNav';
import ProgressBar from './ProgressBar';
import Results from './Results';
import { quizData } from '../data/quizData';
import { studocuQuizData } from '../data/studocu/index';
import { enggPaper2020 } from '../data/engg_papers/2020';
import { pastPapersRegistry } from '../data/past_papers/index';

const QuizApp = () => {
  const [mode, setMode] = useState('section-select');
  const [section, setSection] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState(new Map());
  const [revealedShortAnswers, setRevealedShortAnswers] = useState(new Set());
  const [showAllQuestions, setShowAllQuestions] = useState(false);

  // Build complete questions array based on selected section
  const questions = useMemo(() => {
    if (!section) return [];
    
    // Handle Engineering Paper 2020
    if (section === 'enggPaper2020') {
      return [
        ...enggPaper2020.multipleChoice,
        ...enggPaper2020.shortAnswer,
      ];
    }
    
    // Check if it's a Past Papers section
    if (section.startsWith('pastPaper-')) {
      // Pattern: pastPaper-[subject]-[paper] where paper starts with a digit (e.g., 2022-hsc)
      const match = section.match(/^pastPaper-(.+)-(\d+.*)$/);
      if (match) {
        const [, subjectSlug, paperSlug] = match;
        const paper = pastPapersRegistry[subjectSlug]?.papers[paperSlug];
        if (paper && paper.data) {
          return [
            ...paper.data.multipleChoice,
            ...paper.data.shortAnswer,
          ];
        }
      }
      return [];
    }
    
    // Check if it's a Studocu section
    if (section.startsWith('studocu-')) {
      const studocuSection = section.replace('studocu-', '');
      const sectionData = studocuQuizData.sections[studocuSection];
      if (sectionData) {
        return [
          ...sectionData.multipleChoice,
          ...sectionData.shortAnswer,
        ];
      }
      return [];
    }
    
    if (section === 'all') {
      // Combine all sections: civil MC, transport MC, past papers MC, civil SA, transport SA
      return [
        ...quizData.sections.civil.multipleChoice,
        ...quizData.sections.transport.multipleChoice,
        ...quizData.sections.pastPapers.multipleChoice,
        ...quizData.sections.civil.shortAnswer,
        ...quizData.sections.transport.shortAnswer,
      ];
    } else {
      // Single section: MC questions first, then SA questions
      return [
        ...quizData.sections[section].multipleChoice,
        ...quizData.sections[section].shortAnswer,
      ];
    }
  }, [section]);

  // Determine total MC questions for the selected section
  const totalMCQuestions = useMemo(() => {
    if (!section) return 0;
    
    // Handle Engineering Paper 2020
    if (section === 'enggPaper2020') {
      return enggPaper2020.multipleChoice.length;
    }
    
    // Check if it's a Past Papers section
    if (section.startsWith('pastPaper-')) {
      const match = section.match(/^pastPaper-(.+)-(\d+.*)$/);
      if (match) {
        const [, subjectSlug, paperSlug] = match;
        const paper = pastPapersRegistry[subjectSlug]?.papers[paperSlug];
        return paper && paper.data ? paper.data.multipleChoice.length : 0;
      }
      return 0;
    }
    
    // Check if it's a Studocu section
    if (section.startsWith('studocu-')) {
      const studocuSection = section.replace('studocu-', '');
      const sectionData = studocuQuizData.sections[studocuSection];
      return sectionData ? sectionData.multipleChoice.length : 0;
    }
    
    if (section === 'all') {
      return quizData.sections.civil.multipleChoice.length + 
             quizData.sections.transport.multipleChoice.length +
             quizData.sections.pastPapers.multipleChoice.length;
    } else {
      return quizData.sections[section].multipleChoice.length;
    }
  }, [section]);

  // Determine if current question is MC or short answer
  const isMultipleChoice = currentQuestionIndex < totalMCQuestions;
  const currentQuestion = questions[currentQuestionIndex];

  const handleSectionSelect = (selectedSection, showAll = false) => {
    setSection(selectedSection);
    setShowAllQuestions(showAll);
    setMode('quiz');
    setCurrentQuestionIndex(0);
    setUserAnswers(new Map());
    setRevealedShortAnswers(new Set());
  };

  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers(new Map(userAnswers.set(questionId, answer)));
  };

  const handleToggleReveal = (questionId) => {
    const newRevealed = new Set(revealedShortAnswers);
    if (newRevealed.has(questionId)) {
      newRevealed.delete(questionId);
    } else {
      newRevealed.add(questionId);
    }
    setRevealedShortAnswers(newRevealed);
  };

  const handleNext = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  const handleSubmit = () => {
    setMode('results');
  };

  const handleRestart = () => {
    setMode('section-select');
    setSection(null);
    setCurrentQuestionIndex(0);
    setUserAnswers(new Map());
    setRevealedShortAnswers(new Set());
  };

  return (
    <div className="quiz-app">
      {mode === 'section-select' && (
        <SectionSelector onSectionSelect={handleSectionSelect} />
      )}

      {mode === 'quiz' && (
        <div className="quiz-container">
          {!showAllQuestions && (
            <ProgressBar
              currentIndex={currentQuestionIndex}
              totalQuestions={questions.length}
            />
          )}
          
          {showAllQuestions ? (
            // Show ALL questions on single page
            <div className="all-questions-container">
              <div style={styles.allQuestionsHeader}>
                <h2 style={styles.headerTitle}>All Questions</h2>
                <p style={styles.headerSubtitle}>
                  Scroll through all {questions.length} questions. Answer at your own pace.
                </p>
              </div>
              
              {questions.map((question, index) => {
                const isMC = index < totalMCQuestions;
                return (
                  <div key={question.id} style={styles.questionWrapper}>
                    <div style={styles.questionNumber}>
                      Question {index + 1} of {questions.length}
                    </div>
                    {isMC ? (
                      <MultipleChoice
                        question={question}
                        selectedAnswer={userAnswers.get(question.id)}
                        onSelectAnswer={(answer) => handleAnswerChange(question.id, answer)}
                        showFeedback={userAnswers.has(question.id)}
                      />
                    ) : (
                      <ShortAnswer
                        question={question}
                        isRevealed={revealedShortAnswers.has(question.id)}
                        onToggleReveal={() => handleToggleReveal(question.id)}
                      />
                    )}
                  </div>
                );
              })}
              
              <div style={styles.finishButtonContainer}>
                <button
                  style={styles.finishButton}
                  onClick={handleSubmit}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
                >
                  Finish Quiz
                </button>
              </div>
            </div>
          ) : (
            // Show SINGLE question with navigation (original behavior)
            <>
              <div className="question-container">
                {/* Render only ONE question component at a time based on question type */}
                {isMultipleChoice ? (
                  <MultipleChoice
                    question={currentQuestion}
                    selectedAnswer={userAnswers.get(currentQuestion.id)}
                    onSelectAnswer={(answer) => handleAnswerChange(currentQuestion.id, answer)}
                    showFeedback={userAnswers.has(currentQuestion.id)}
                  />
                ) : (
                  <ShortAnswer
                    question={currentQuestion}
                    isRevealed={revealedShortAnswers.has(currentQuestion.id)}
                    onToggleReveal={() => handleToggleReveal(currentQuestion.id)}
                  />
                )}
              </div>

              <QuizNav
                currentIndex={currentQuestionIndex}
                totalQuestions={questions.length}
                onPrev={handlePrevious}
                onNext={handleNext}
                onFinish={handleSubmit}
              />
            </>
          )}
        </div>
      )}

      {mode === 'results' && (
        <Results
          userAnswers={userAnswers}
          questions={questions}
          totalMCQuestions={totalMCQuestions}
          section={section}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
};

const styles = {
  allQuestionsHeader: {
    textAlign: 'center',
    marginBottom: '2rem',
    padding: '1.5rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '2px solid #e0e0e0',
  },
  headerTitle: {
    fontSize: '2rem',
    color: '#333',
    marginBottom: '0.5rem',
  },
  headerSubtitle: {
    fontSize: '1.1rem',
    color: '#666',
    margin: 0,
  },
  questionWrapper: {
    marginBottom: '2.5rem',
    padding: '1.5rem',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: '1px solid #e0e0e0',
  },
  questionNumber: {
    fontSize: '0.9rem',
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: '1rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  finishButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '3rem',
    marginBottom: '2rem',
  },
  finishButton: {
    padding: '1rem 3rem',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
};

export default QuizApp;
