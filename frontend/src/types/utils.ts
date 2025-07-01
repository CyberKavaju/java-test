// Type guards and utility functions for multi-selection support
import type { 
  Question, 
  FormattedQuestion, 
  QuestionType, 
  Answer, 
  AnswerSubmission 
} from './index';

/**
 * Type guard to check if a question is single choice
 */
export function isSingleChoice(question: FormattedQuestion): boolean {
  return question.question_type === 'single';
}

/**
 * Type guard to check if a question is multiple choice
 */
export function isMultipleChoice(question: FormattedQuestion): boolean {
  return question.question_type === 'multiple';
}

/**
 * Type guard to check if an answer is a string (single choice)
 */
export function isSingleAnswer(answer: string | string[]): answer is string {
  return typeof answer === 'string';
}

/**
 * Type guard to check if an answer is an array (multiple choice)
 */
export function isMultipleAnswer(answer: string | string[]): answer is string[] {
  return Array.isArray(answer);
}

/**
 * Validates that an answer format matches the question type
 */
export function isValidAnswerFormat(
  answer: string | string[], 
  questionType: QuestionType
): boolean {
  if (questionType === 'single') {
    return isSingleAnswer(answer);
  } else {
    return isMultipleAnswer(answer);
  }
}

/**
 * Converts a database question to a formatted question for display
 */
export function formatQuestionForDisplay(question: Question): FormattedQuestion {
  const options = [
    { key: 'A', text: question.option_a },
    { key: 'B', text: question.option_b },
    { key: 'C', text: question.option_c }
  ];

  // Add optional options if they exist
  if (question.option_d) {
    options.push({ key: 'D', text: question.option_d });
  }
  if (question.option_e) {
    options.push({ key: 'E', text: question.option_e });
  }

  const questionType = question.question_type || 'single';
  let maxSelections = 1;

  // Calculate max selections for multiple choice questions
  if (questionType === 'multiple') {
    const correctAnswers = question.correct_answer.split(',');
    maxSelections = correctAnswers.length;
  }

  return {
    id: question.id,
    question: question.question_text,
    options: options,
    question_type: questionType,
    max_selections: maxSelections
  };
}

/**
 * Formats multiple questions for display
 */
export function formatQuestionsForDisplay(questions: Question[]): FormattedQuestion[] {
  return questions.map(formatQuestionForDisplay);
}

/**
 * Creates an answer submission object
 */
export function createAnswerSubmission(
  questionId: number, 
  selectedAnswer: string | string[]
): AnswerSubmission {
  return {
    questionId,
    selectedAnswer
  };
}

/**
 * Validates the number of selected answers against max_selections
 */
export function isValidSelectionCount(
  selectedAnswers: string[],
  maxSelections: number
): boolean {
  return selectedAnswers.length <= maxSelections;
}

/**
 * Gets the correct answer format for a question (converts comma-separated to array)
 */
export function parseCorrectAnswer(
  correctAnswer: string,
  questionType: QuestionType
): string | string[] {
  if (questionType === 'single') {
    return correctAnswer;
  } else {
    return correctAnswer.split(',').map(a => a.trim());
  }
}

/**
 * Converts answer submission to the format expected by the backend
 */
export function formatAnswerForSubmission(answer: Answer): AnswerSubmission {
  return {
    questionId: answer.questionId,
    selectedAnswer: answer.selectedAnswer
  };
}

/**
 * Checks if all required selections are made for a multiple choice question
 */
export function hasMinimumSelections(
  selectedAnswers: string[],
  questionType: QuestionType,
  maxSelections: number
): boolean {
  if (questionType === 'single') {
    return selectedAnswers.length === 1;
  } else {
    // For multiple choice, at least one selection is required
    return selectedAnswers.length > 0;
  }
}

/**
 * Gets display text for question type
 */
export function getQuestionTypeDisplay(questionType: QuestionType): string {
  return questionType === 'single' 
    ? 'Single Choice' 
    : 'Multiple Choice';
}

/**
 * Gets instruction text for question type
 */
export function getQuestionInstructions(question: FormattedQuestion): string {
  if (question.question_type === 'single') {
    return 'Select one answer:';
  } else {
    return `Select ${question.max_selections} answer${question.max_selections > 1 ? 's' : ''}:`;
  }
}

/**
 * Validates that a question object has all required fields
 */
export function isValidQuestion(question: Partial<Question>): question is Question {
  return !!(
    question.id &&
    question.domain &&
    question.topic &&
    question.question_text &&
    question.option_a &&
    question.option_b &&
    question.option_c &&
    question.correct_answer
  );
}

/**
 * Type guard to check if a question has been formatted for display
 */
export function isFormattedQuestion(question: Question | FormattedQuestion): question is FormattedQuestion {
  return 'question' in question && 'options' in question && 'max_selections' in question;
}

/**
 * Alias for formatQuestionForDisplay for backward compatibility
 */
export function convertQuestionToFormatted(question: Question): FormattedQuestion {
  return formatQuestionForDisplay(question);
}

/**
 * Default question type for backward compatibility
 */
export const DEFAULT_QUESTION_TYPE: QuestionType = 'single';

/**
 * Creates a default empty answer for a question
 */
export function createEmptyAnswer(questionId: number, questionType: QuestionType): Answer {
  return {
    questionId,
    selectedAnswer: questionType === 'single' ? '' : []
  };
}
