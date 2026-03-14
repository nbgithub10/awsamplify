import { describe, it, expect } from 'vitest';
import { quizData } from '../data/quizData';
import { enggPaper2020 } from '../data/engg_papers/2020';
import { studocuQuizData } from '../data/studocu/index';

/**
 * Validates a single question object
 * @param {Object} question - The question object to validate
 * @returns {Object} - Validation result with isValid flag and errors array
 */
function validateQuestion(question) {
  const errors = [];

  // Check for required fields
  if (!question.id) {
    errors.push('Missing id field');
  }

  if (!question.question || question.question.trim() === '') {
    errors.push('Missing or empty question text');
  }

  if (!Array.isArray(question.options)) {
    errors.push('Options is not an array');
  } else if (question.options.length !== 4) {
    errors.push(`Expected 4 options, got ${question.options.length}`);
  }

  // Critical: Check correctAnswer field exists and is valid
  if (question.correctAnswer === undefined || question.correctAnswer === null) {
    errors.push('Missing correctAnswer field');
  } else if (typeof question.correctAnswer !== 'number') {
    errors.push(`correctAnswer must be a number, got ${typeof question.correctAnswer}`);
  } else if (!Number.isInteger(question.correctAnswer)) {
    errors.push('correctAnswer must be an integer');
  } else if (question.correctAnswer < 0 || question.correctAnswer >= question.options.length) {
    errors.push(`correctAnswer ${question.correctAnswer} is out of range [0-${question.options.length - 1}]`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates an entire section of questions
 * @param {Array} questions - Array of question objects
 * @param {String} sectionName - Name of the section for error reporting
 */
function validateSection(questions, sectionName) {
  const ids = new Set();
  const duplicateIds = [];

  questions.forEach((question, index) => {
    const validation = validateQuestion(question);
    
    if (!validation.isValid) {
      const errorMsg = `${sectionName} - Question ${index + 1} (id: ${question.id || 'missing'}): ${validation.errors.join(', ')}`;
      throw new Error(errorMsg);
    }

    // Check for duplicate IDs
    if (ids.has(question.id)) {
      duplicateIds.push(question.id);
    }
    ids.add(question.id);
  });

  if (duplicateIds.length > 0) {
    throw new Error(`${sectionName} has duplicate IDs: ${duplicateIds.join(', ')}`);
  }
}

describe('Data Validation Tests', () => {
  
  describe('Quiz Data (AI Generated Content)', () => {
    it('should have valid Civil Structures questions', () => {
      const civil = quizData.sections.civil.multipleChoice;
      expect(civil).toBeDefined();
      expect(Array.isArray(civil)).toBe(true);
      expect(civil.length).toBeGreaterThan(0);
      validateSection(civil, 'Civil Structures');
    });

    it('should have valid Personal & Public Transport questions', () => {
      const transport = quizData.sections.transport.multipleChoice;
      expect(transport).toBeDefined();
      expect(Array.isArray(transport)).toBe(true);
      expect(transport.length).toBeGreaterThan(0);
      validateSection(transport, 'Personal & Public Transport');
    });

    it('should have valid Past Papers questions', () => {
      const pastPapers = quizData.sections.pastPapers.multipleChoice;
      expect(pastPapers).toBeDefined();
      expect(Array.isArray(pastPapers)).toBe(true);
      expect(pastPapers.length).toBe(22);
      validateSection(pastPapers, 'Past Papers (2020-2025)');
    });
  });

  describe('Engineering Paper 2020', () => {
    it('should have 9 valid questions', () => {
      const questions = enggPaper2020.multipleChoice;
      expect(questions).toBeDefined();
      expect(Array.isArray(questions)).toBe(true);
      expect(questions.length).toBe(9);
      validateSection(questions, 'Engineering Paper 2020');
    });

    it('should have image references for all questions', () => {
      const questions = enggPaper2020.multipleChoice;
      questions.forEach((question, index) => {
        expect(question.image, `Question ${index + 1} missing image field`).toBeDefined();
        expect(question.image, `Question ${index + 1} has empty image path`).toBeTruthy();
        expect(question.image.startsWith('/engg_papers/images/2020/'), 
          `Question ${index + 1} has invalid image path: ${question.image}`).toBe(true);
      });
    });
  });

  describe('Studocu Quiz Data (20 Topics)', () => {
    const expectedTopics = [
      'metals',
      'corrosion',
      'ceramics',
      'polymersElastomers',
      'composites',
      'civilTesting',
      'crackTheory',
      'recyclability',
      'hardnessImpactTesting',
      'visualRadiographicTesting',
      'ultrasonicTesting',
      'advancedCeramics',
      'advancedComposites',
      'glassSemiconductors',
      'heatTreatment',
      'ferrousManufacturing',
      'nonFerrousManufacturing',
      'polymerManufacturing',
      'aeronauticalEngineering',
      'telecommunications'
    ];

    expectedTopics.forEach((key) => {
      it(`should have valid ${key} questions`, () => {
        const sectionData = studocuQuizData.sections[key];
        expect(sectionData, `${key} section not found`).toBeDefined();
        expect(sectionData.multipleChoice, `${key} multipleChoice not found`).toBeDefined();
        
        const questions = sectionData.multipleChoice;
        expect(Array.isArray(questions), `${key} is not an array`).toBe(true);
        expect(questions.length, `${key} has no questions`).toBeGreaterThan(0);
        validateSection(questions, `Studocu - ${key}`);
      });
    });

    it('should have all 20 topics defined', () => {
      expect(Object.keys(studocuQuizData.sections).length).toBe(20);
    });

    it('should have reasonable total of questions across all topics', () => {
      const totalQuestions = Object.values(studocuQuizData.sections)
        .reduce((sum, section) => sum + section.multipleChoice.length, 0);
      expect(totalQuestions).toBeGreaterThan(300); // At least 300 questions total
    });
  });

  describe('Global Validation', () => {
    it('should have no duplicate IDs across all sections', () => {
      const allIds = new Set();
      const duplicates = [];

      // Collect all IDs from all sections
      const allQuestions = [
        ...quizData.sections.civil.multipleChoice,
        ...quizData.sections.transport.multipleChoice,
        ...quizData.sections.pastPapers.multipleChoice,
        ...enggPaper2020.multipleChoice,
        ...Object.values(studocuQuizData.sections).flatMap(section => section.multipleChoice)
      ];

      allQuestions.forEach(question => {
        if (allIds.has(question.id)) {
          duplicates.push(question.id);
        }
        allIds.add(question.id);
      });

      expect(duplicates, `Found duplicate IDs: ${duplicates.join(', ')}`).toHaveLength(0);
    });

    it('should have correct total number of questions across entire app', () => {
      const civil = quizData.sections.civil.multipleChoice.length;
      const transport = quizData.sections.transport.multipleChoice.length;
      const pastPapers = quizData.sections.pastPapers.multipleChoice.length;
      const engg2020 = enggPaper2020.multipleChoice.length;
      const studocu = Object.values(studocuQuizData.sections)
        .reduce((sum, section) => sum + section.multipleChoice.length, 0);
      
      const totalQuestions = civil + transport + pastPapers + engg2020 + studocu;
      
      // Log for debugging
      console.log(`Civil: ${civil}, Transport: ${transport}, Past Papers: ${pastPapers}, Engg 2020: ${engg2020}, Studocu: ${studocu}, Total: ${totalQuestions}`);
      
      expect(totalQuestions).toBeGreaterThan(0);
    });

    it('should ensure all correctAnswer values use camelCase (not "correct:")', () => {
      const allSections = [
        { name: 'Civil Structures', questions: quizData.sections.civil.multipleChoice },
        { name: 'Transport', questions: quizData.sections.transport.multipleChoice },
        { name: 'Past Papers', questions: quizData.sections.pastPapers.multipleChoice },
        { name: 'Engg Paper 2020', questions: enggPaper2020.multipleChoice },
        ...Object.entries(studocuQuizData.sections).map(([key, section]) => ({
          name: `Studocu - ${key}`,
          questions: section.multipleChoice
        }))
      ];

      allSections.forEach(({ name, questions }) => {
        questions.forEach((question, index) => {
          expect(question.correctAnswer, 
            `${name} - Question ${index + 1} (${question.id}) uses "correct:" instead of "correctAnswer:"`
          ).toBeDefined();
          
          expect(question.correct, 
            `${name} - Question ${index + 1} (${question.id}) has legacy "correct:" field - should be "correctAnswer:"`
          ).toBeUndefined();
        });
      });
    });
  });
});
