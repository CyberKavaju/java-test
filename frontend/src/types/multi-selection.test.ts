// Type validation tests for multi-selection support
import { describe, it, expect } from 'vitest';
import type { 
  Question, 
  Answer, 
  QuestionType, 
  FormattedQuestion,
  AnswerSubmission,
  ValidationResult,
  Score 
} from '../types/index';

describe('Multi-Selection Type System', () => {
  describe('Question Type Support', () => {
    it('should support single choice question type', () => {
      const singleQuestion: Question = {
        id: 1,
        domain: 'Java Basics',
        topic: 'Variables',
        question_text: 'What is the default value of an int variable?',
        option_a: '0',
        option_b: 'null',
        option_c: '1',
        option_d: 'undefined',
        correct_answer: 'A',
        explanation: 'The default value of an int is 0',
        question_type: 'single'
      };

      expect(singleQuestion.question_type).toBe('single');
      expect(typeof singleQuestion.correct_answer).toBe('string');
    });

    it('should support multiple choice question type', () => {
      const multipleQuestion: Question = {
        id: 2,
        domain: 'Java Basics',
        topic: 'Keywords',
        question_text: 'Which of the following are valid Java keywords?',
        option_a: 'class',
        option_b: 'interface',
        option_c: 'goto',
        option_d: 'const',
        correct_answer: 'A,B',
        explanation: 'class and interface are valid Java keywords',
        question_type: 'multiple'
      };

      expect(multipleQuestion.question_type).toBe('multiple');
      expect(typeof multipleQuestion.correct_answer).toBe('string');
    });

    it('should have valid question type values', () => {
      const validTypes: QuestionType[] = ['single', 'multiple'];
      
      validTypes.forEach(type => {
        expect(['single', 'multiple']).toContain(type);
      });
    });
  });

  describe('Formatted Question Support', () => {
    it('should support formatted single choice questions', () => {
      const formattedSingle: FormattedQuestion = {
        id: 1,
        question: 'What is the default value of an int variable?',
        options: [
          { key: 'A', text: '0' },
          { key: 'B', text: 'null' },
          { key: 'C', text: '1' },
          { key: 'D', text: 'undefined' }
        ],
        question_type: 'single',
        max_selections: 1
      };

      expect(formattedSingle.question_type).toBe('single');
      expect(formattedSingle.max_selections).toBe(1);
      expect(formattedSingle.options).toHaveLength(4);
    });

    it('should support formatted multiple choice questions', () => {
      const formattedMultiple: FormattedQuestion = {
        id: 2,
        question: 'Which of the following are valid Java keywords?',
        options: [
          { key: 'A', text: 'class' },
          { key: 'B', text: 'interface' },
          { key: 'C', text: 'goto' },
          { key: 'D', text: 'const' }
        ],
        question_type: 'multiple',
        max_selections: 2
      };

      expect(formattedMultiple.question_type).toBe('multiple');
      expect(formattedMultiple.max_selections).toBe(2);
      expect(formattedMultiple.options).toHaveLength(4);
    });

    it('should validate option structure', () => {
      const option = { key: 'A', text: 'Option text' };
      
      expect(option).toHaveProperty('key');
      expect(option).toHaveProperty('text');
      expect(typeof option.key).toBe('string');
      expect(typeof option.text).toBe('string');
    });
  });

  describe('Answer Type Support', () => {
    it('should support single answer format', () => {
      const singleAnswer: Answer = {
        questionId: 1,
        selectedAnswer: 'A'
      };

      expect(typeof singleAnswer.selectedAnswer).toBe('string');
      expect(singleAnswer.selectedAnswer).toBe('A');
    });

    it('should support multiple answer format', () => {
      const multipleAnswer: Answer = {
        questionId: 2,
        selectedAnswer: ['A', 'B']
      };

      expect(Array.isArray(multipleAnswer.selectedAnswer)).toBe(true);
      expect(multipleAnswer.selectedAnswer).toContain('A');
      expect(multipleAnswer.selectedAnswer).toContain('B');
    });

    it('should support answer submission format', () => {
      const singleSubmission: AnswerSubmission = {
        questionId: 1,
        selectedAnswer: 'A'
      };

      const multipleSubmission: AnswerSubmission = {
        questionId: 2,
        selectedAnswer: ['A', 'B']
      };

      expect(singleSubmission.selectedAnswer).toBe('A');
      expect(Array.isArray(multipleSubmission.selectedAnswer)).toBe(true);
    });
  });

  describe('Test Result Support', () => {
    it('should support single choice test results', () => {
      const singleResult = {
        questionId: 1,
        selectedAnswer: 'A',
        correctAnswer: 'A',
        isCorrect: true,
        explanation: 'Correct answer explanation',
        question_text: 'Test question?'
      };

      expect(typeof singleResult.selectedAnswer).toBe('string');
      expect(typeof singleResult.correctAnswer).toBe('string');
    });

    it('should support multiple choice test results', () => {
      const multipleResult = {
        questionId: 2,
        selectedAnswer: ['A', 'B'],
        correctAnswer: ['A', 'B'],
        isCorrect: true,
        explanation: 'Correct answers explanation',
        question_text: 'Multiple choice question?'
      };

      expect(Array.isArray(multipleResult.selectedAnswer)).toBe(true);
      expect(Array.isArray(multipleResult.correctAnswer)).toBe(true);
    });
  });

  describe('Validation Result Support', () => {
    it('should support validation result structure', () => {
      const validationResult: ValidationResult = {
        success: true,
        results: [
          {
            questionId: 1,
            isCorrect: true,
            selectedAnswer: 'A',
            correctAnswer: 'A',
            explanation: 'Correct'
          },
          {
            questionId: 2,
            isCorrect: false,
            selectedAnswer: ['A'],
            correctAnswer: ['A', 'B'],
            explanation: 'Partial answer'
          }
        ],
        score: {
          correct: 1,
          total: 2,
          percentage: 50
        }
      };

      expect(validationResult.success).toBe(true);
      expect(validationResult.results).toHaveLength(2);
      expect(validationResult.score.total).toBe(2);
    });

    it('should support score calculation structure', () => {
      const score: Score = {
        correct: 18,
        total: 25,
        percentage: 72
      };

      expect(score.correct).toBeLessThanOrEqual(score.total);
      expect(score.percentage).toBeGreaterThanOrEqual(0);
      expect(score.percentage).toBeLessThanOrEqual(100);
    });
  });

  describe('Backward Compatibility', () => {
    it('should support legacy question format without question_type', () => {
      const legacyQuestion = {
        id: 1,
        domain: 'Java Basics',
        topic: 'Variables',
        question_text: 'Legacy question?',
        option_a: 'A',
        option_b: 'B',
        option_c: 'C',
        option_d: 'D',
        correct_answer: 'A',
        explanation: 'Legacy explanation'
        // No question_type specified - should default to 'single'
      };

      // TypeScript should allow this with optional question_type
      const typedLegacy: Question = {
        ...legacyQuestion,
        question_type: 'single' // Can be added programmatically
      };

      expect(typedLegacy.question_type).toBe('single');
    });

    it('should maintain existing Answer interface compatibility', () => {
      // Legacy single answer format should still work
      const legacyAnswer: Answer = {
        questionId: 1,
        selectedAnswer: 'A'
      };

      expect(typeof legacyAnswer.selectedAnswer).toBe('string');
    });
  });

  describe('Type Guards and Utilities', () => {
    it('should identify single choice questions', () => {
      const isSingleChoice = (question: FormattedQuestion): boolean => {
        return question.question_type === 'single';
      };

      const singleQ: FormattedQuestion = {
        id: 1,
        question: 'Test?',
        options: [{ key: 'A', text: 'Option A' }],
        question_type: 'single',
        max_selections: 1
      };

      expect(isSingleChoice(singleQ)).toBe(true);
    });

    it('should identify multiple choice questions', () => {
      const isMultipleChoice = (question: FormattedQuestion): boolean => {
        return question.question_type === 'multiple';
      };

      const multipleQ: FormattedQuestion = {
        id: 2,
        question: 'Test?',
        options: [{ key: 'A', text: 'Option A' }],
        question_type: 'multiple',
        max_selections: 2
      };

      expect(isMultipleChoice(multipleQ)).toBe(true);
    });

    it('should validate answer format for question type', () => {
      const isValidAnswerFormat = (
        answer: string | string[], 
        questionType: QuestionType
      ): boolean => {
        if (questionType === 'single') {
          return typeof answer === 'string';
        } else {
          return Array.isArray(answer);
        }
      };

      expect(isValidAnswerFormat('A', 'single')).toBe(true);
      expect(isValidAnswerFormat(['A', 'B'], 'multiple')).toBe(true);
      expect(isValidAnswerFormat(['A'], 'single')).toBe(false);
      expect(isValidAnswerFormat('A', 'multiple')).toBe(false);
    });
  });
});
