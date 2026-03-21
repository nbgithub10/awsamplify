import React, { useState, useMemo, useEffect, useCallback } from 'react';
import SectionSelector from './SectionSelector';
import MultipleChoice from './MultipleChoice';
import ShortAnswer from './ShortAnswer';
import QuizNav from './QuizNav';
import ProgressBar from './ProgressBar';
import Results from './Results';
import { quizData } from '../data/quizData';
import { studocuQuizData } from '../data/studocu/index';
import { pastPapersRegistry } from '../data/past_papers/index';
import { useQuizPersistence } from '../hooks/useQuizPersistence';
import { clearScoresCache } from '../hooks/useQuizScores';
import { persistenceService } from '../services/persistenceService';

const QuizApp = ({ onViewStats }) => {
  const [mode, setMode] = useState('section-select');
  const [section, setSection] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState(new Map());
  const [revealedShortAnswers, setRevealedShortAnswers] = useState(new Set());
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const [questionReports, setQuestionReports] = useState(new Map());
  const [isReportSaving, setIsReportSaving] = useState(false);
  const { saveQuizAttempt, saveQuestionReport } = useQuizPersistence();

  useEffect(() => {
    const fetchReports = async () => {
      const result = await persistenceService.getAllReports();
      if (result.success) {
        const reportsMap = new Map();
        result.items.forEach(item => {
          const questionId = item.payload.questionId;
          const existingReport = reportsMap.get(questionId);
          if (!existingReport || item.payload.userId === 'naina') {
            reportsMap.set(questionId, {
              ...item.payload,
              entityId: item.pk,
            });
          }
        });
        setQuestionReports(reportsMap);
      }
    };

    if (mode === 'quiz' && section) {
      fetchReports();
    }
  }, [mode, section]);

  const getUserReportForQuestion = useCallback((questionId) => {
    const report = questionReports.get(questionId);
    if (report && report.userId === 'naina') {
      return report;
    }
    return null;
  }, [questionReports]);

  const handleReportQuestion = useCallback(async (question, issueType, comment) => {
    setIsReportSaving(true);
    const result = await saveQuestionReport({
      question,
      issueType,
      comment,
      section,
    });

    if (result.success) {
      setQuestionReports(prev => {
        const newMap = new Map(prev);
        newMap.set(question.id, {
          questionId: question.id,
          issueType,
          comment,
          userId: 'naina',
          reportedAt: new Date().toISOString(),
          entityId: result.entityId,
        });
        return newMap;
      });
    }
    setIsReportSaving(false);
  }, [saveQuestionReport, section]);

  const sectionTitle = useMemo(() => {
    if (!section) return '';
    
    if (section.startsWith('pastPaper-')) {
      const match = section.match(/^pastPaper-(.+)-(\d+.*)$/);
      if (match) {
        const [, subjectSlug, paperSlug] = match;
        const subject = pastPapersRegistry[subjectSlug];
        if (subject) {
          return `${subject.title} ${paperSlug.replace(/-/g, ' ').toUpperCase()}`;
        }
      }
    }
    
    if (section.startsWith('studocu-')) {
      const studocuSection = section.replace('studocu-', '');
      return studocuQuizData.sections[studocuSection]?.title || studocuSection;
    }
    
    if (section === 'all') {
      return 'All Questions';
    }
    
    return quizData.sections[section]?.title || section;
  }, [section]);

  const questions = useMemo(() => {
    if (!section) return [];
    
    if (section.startsWith('pastPaper-')) {
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
      return [
        ...quizData.sections.civil.multipleChoice,
        ...quizData.sections.transport.multipleChoice,
        ...quizData.sections.pastPapers.multipleChoice,
        ...quizData.sections.civil.shortAnswer,
        ...quizData.sections.transport.shortAnswer,
      ];
    } else {
      return [
        ...quizData.sections[section].multipleChoice,
        ...quizData.sections[section].shortAnswer,
      ];
    }
  }, [section]);

  const totalMCQuestions = useMemo(() => {
    if (!section) return 0;
    
    if (section.startsWith('pastPaper-')) {
      const match = section.match(/^pastPaper-(.+)-(\d+.*)$/);
      if (match) {
        const [, subjectSlug, paperSlug] = match;
        const paper = pastPapersRegistry[subjectSlug]?.papers[paperSlug];
        return paper && paper.data ? paper.data.multipleChoice.length : 0;
      }
      return 0;
    }
    
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

  const isMultipleChoice = currentQuestionIndex < totalMCQuestions;
  const currentQuestion = questions[currentQuestionIndex];

  const handleSectionSelect = (selectedSection, showAll = false) => {
    setSection(selectedSection);
    setShowAllQuestions(showAll);
    setMode('quiz');
    setCurrentQuestionIndex(0);
    setUserAnswers(new Map());
    setRevealedShortAnswers(new Set());
    setQuestionReports(new Map());
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

  const handleSubmit = async () => {
    const score = calculateScore();
    await saveQuizAttempt({
      section,
      questions,
      score,
      totalQuestions: totalMCQuestions,
      totalMCQuestions,
    });
    clearScoresCache();
    setMode('results');
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((question, index) => {
      if (index < totalMCQuestions) {
        const answer = userAnswers.get(question.id);
        if (answer !== undefined && question.correctAnswer === answer) {
          score++;
        }
      }
    });
    return score;
  };

  const handleRestart = () => {
    setMode('section-select');
    setSection(null);
    setCurrentQuestionIndex(0);
    setUserAnswers(new Map());
    setRevealedShortAnswers(new Set());
  };

  const handleMainMenu = () => {
    setMode('section-select');
    setSection(null);
    setCurrentQuestionIndex(0);
    setUserAnswers(new Map());
    setRevealedShortAnswers(new Set());
  };

  return (
    <div className="quiz-app">
      {mode === 'section-select' && (
        <SectionSelector onSectionSelect={handleSectionSelect} onViewStats={onViewStats} />
      )}

      {mode === 'quiz' && (
        <div className="quiz-container">
          <div style={styles.mainMenuButtonContainer}>
            <button
              style={styles.mainMenuButton}
              onClick={handleMainMenu}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
            >
              ← Back to Main Menu
            </button>
          </div>
          
          <div style={styles.allQuestionsHeader}>
            <h2 style={styles.headerTitle}>{sectionTitle}</h2>
          </div>
          
          {!showAllQuestions && (
            <ProgressBar
              currentIndex={currentQuestionIndex}
              totalQuestions={questions.length}
            />
          )}
          
          {showAllQuestions ? (
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
                        userReport={getUserReportForQuestion(question.id)}
                        onReport={handleReportQuestion}
                        isSaving={isReportSaving}
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
            <>
              <div className="question-container">
                {isMultipleChoice ? (
                  <MultipleChoice
                    question={currentQuestion}
                    selectedAnswer={userAnswers.get(currentQuestion.id)}
                    onSelectAnswer={(answer) => handleAnswerChange(currentQuestion.id, answer)}
                    showFeedback={userAnswers.has(currentQuestion.id)}
                    userReport={getUserReportForQuestion(currentQuestion.id)}
                    onReport={handleReportQuestion}
                    isSaving={isReportSaving}
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
          onViewStats={onViewStats}
        />
      )}
    </div>
  );
};

const styles = {
  mainMenuButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginBottom: '1rem',
  },
  mainMenuButton: {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    backgroundColor: '#007bff',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
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
