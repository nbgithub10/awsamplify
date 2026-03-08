import React, { useState, useMemo } from 'react';
import SectionSelector from './SectionSelector';
import MultipleChoice from './MultipleChoice';
import ShortAnswer from './ShortAnswer';
import QuizNav from './QuizNav';
import ProgressBar from './ProgressBar';
import Results from './Results';
import { quizData } from '../data/quizData';

const QuizApp = () => {
  const [mode, setMode] = useState('section-select');
  const [section, setSection] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState(new Map());
  const [revealedShortAnswers, setRevealedShortAnswers] = useState(new Set());

  // Build complete questions array based on selected section
  const questions = useMemo(() => {
    if (!section) return [];
    
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

  const handleSectionSelect = (selectedSection) => {
    setSection(selectedSection);
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
          <ProgressBar
            currentIndex={currentQuestionIndex}
            totalQuestions={questions.length}
          />
          
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

export default QuizApp;
