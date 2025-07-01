// State management utilities for multi-selection quiz functionality
import type { FormattedQuestion, Answer, QuestionType } from './index';
import { isSingleChoice, isMultipleChoice, createEmptyAnswer } from './utils';

/**
 * Quiz state for managing multiple questions and answers
 */
export interface QuizState {
  questions: FormattedQuestion[];
  answers: Map<number, Answer>;
  currentQuestionIndex: number;
  isCompleted: boolean;
  startTime: number;
  timeLimit?: number; // in seconds
}

/**
 * Creates initial quiz state
 */
export function createInitialQuizState(questions: FormattedQuestion[]): QuizState {
  const answers = new Map<number, Answer>();
  
  // Initialize empty answers for all questions
  questions.forEach(question => {
    answers.set(
      question.id, 
      createEmptyAnswer(question.id, question.question_type)
    );
  });

  return {
    questions,
    answers,
    currentQuestionIndex: 0,
    isCompleted: false,
    startTime: Date.now()
  };
}

/**
 * Quiz actions for state management
 */
export type QuizAction = 
  | { type: 'SELECT_ANSWER'; questionId: number; selectedAnswer: string | string[] }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PREVIOUS_QUESTION' }
  | { type: 'GO_TO_QUESTION'; index: number }
  | { type: 'COMPLETE_QUIZ' }
  | { type: 'RESET_QUIZ'; questions: FormattedQuestion[] }
  | { type: 'TOGGLE_MULTIPLE_ANSWER'; questionId: number; option: string };

/**
 * Quiz state reducer
 */
export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'SELECT_ANSWER': {
      const newAnswers = new Map(state.answers);
      newAnswers.set(action.questionId, {
        questionId: action.questionId,
        selectedAnswer: action.selectedAnswer
      });
      
      return {
        ...state,
        answers: newAnswers
      };
    }

    case 'TOGGLE_MULTIPLE_ANSWER': {
      const currentAnswer = state.answers.get(action.questionId);
      const question = state.questions.find(q => q.id === action.questionId);
      
      if (!currentAnswer || !question || isSingleChoice(question)) {
        return state;
      }

      let currentSelections = Array.isArray(currentAnswer.selectedAnswer) 
        ? currentAnswer.selectedAnswer 
        : [];

      const optionIndex = currentSelections.indexOf(action.option);
      
      if (optionIndex > -1) {
        // Remove option if already selected
        currentSelections = currentSelections.filter((_, index) => index !== optionIndex);
      } else {
        // Add option if not at max selections
        if (currentSelections.length < question.max_selections) {
          currentSelections = [...currentSelections, action.option];
        }
      }

      const newAnswers = new Map(state.answers);
      newAnswers.set(action.questionId, {
        questionId: action.questionId,
        selectedAnswer: currentSelections
      });

      return {
        ...state,
        answers: newAnswers
      };
    }

    case 'NEXT_QUESTION': {
      const nextIndex = Math.min(
        state.currentQuestionIndex + 1, 
        state.questions.length - 1
      );
      
      return {
        ...state,
        currentQuestionIndex: nextIndex
      };
    }

    case 'PREVIOUS_QUESTION': {
      const prevIndex = Math.max(state.currentQuestionIndex - 1, 0);
      
      return {
        ...state,
        currentQuestionIndex: prevIndex
      };
    }

    case 'GO_TO_QUESTION': {
      const index = Math.max(0, Math.min(action.index, state.questions.length - 1));
      
      return {
        ...state,
        currentQuestionIndex: index
      };
    }

    case 'COMPLETE_QUIZ': {
      return {
        ...state,
        isCompleted: true
      };
    }

    case 'RESET_QUIZ': {
      return createInitialQuizState(action.questions);
    }

    default:
      return state;
  }
}

/**
 * Selectors for quiz state
 */
export const quizSelectors = {
  getCurrentQuestion: (state: QuizState): FormattedQuestion | undefined => {
    return state.questions[state.currentQuestionIndex];
  },

  getCurrentAnswer: (state: QuizState): Answer | undefined => {
    const currentQuestion = quizSelectors.getCurrentQuestion(state);
    return currentQuestion ? state.answers.get(currentQuestion.id) : undefined;
  },

  getAnswerForQuestion: (state: QuizState, questionId: number): Answer | undefined => {
    return state.answers.get(questionId);
  },

  getAllAnswers: (state: QuizState): Answer[] => {
    return Array.from(state.answers.values());
  },

  getAnsweredQuestionCount: (state: QuizState): number => {
    return Array.from(state.answers.values()).filter(answer => {
      if (Array.isArray(answer.selectedAnswer)) {
        return answer.selectedAnswer.length > 0;
      } else {
        return answer.selectedAnswer !== '';
      }
    }).length;
  },

  getTotalQuestions: (state: QuizState): number => {
    return state.questions.length;
  },

  getProgress: (state: QuizState): number => {
    const answered = quizSelectors.getAnsweredQuestionCount(state);
    const total = quizSelectors.getTotalQuestions(state);
    return total > 0 ? (answered / total) * 100 : 0;
  },

  isCurrentQuestionAnswered: (state: QuizState): boolean => {
    const currentAnswer = quizSelectors.getCurrentAnswer(state);
    if (!currentAnswer) return false;

    if (Array.isArray(currentAnswer.selectedAnswer)) {
      return currentAnswer.selectedAnswer.length > 0;
    } else {
      return currentAnswer.selectedAnswer !== '';
    }
  },

  canGoNext: (state: QuizState): boolean => {
    return state.currentQuestionIndex < state.questions.length - 1;
  },

  canGoPrevious: (state: QuizState): boolean => {
    return state.currentQuestionIndex > 0;
  },

  getElapsedTime: (state: QuizState): number => {
    return Date.now() - state.startTime;
  },

  isTimeUp: (state: QuizState): boolean => {
    if (!state.timeLimit) return false;
    return quizSelectors.getElapsedTime(state) > (state.timeLimit * 1000);
  }
};

/**
 * Utility to check if an option is selected in multiple choice question
 */
export function isOptionSelected(
  answer: Answer | undefined,
  option: string
): boolean {
  if (!answer) return false;

  if (Array.isArray(answer.selectedAnswer)) {
    return answer.selectedAnswer.includes(option);
  } else {
    return answer.selectedAnswer === option;
  }
}

/**
 * Utility to get the number of selected options
 */
export function getSelectedCount(answer: Answer | undefined): number {
  if (!answer) return 0;

  if (Array.isArray(answer.selectedAnswer)) {
    return answer.selectedAnswer.length;
  } else {
    return answer.selectedAnswer ? 1 : 0;
  }
}

/**
 * Utility to check if max selections reached for multiple choice
 */
export function isMaxSelectionsReached(
  answer: Answer | undefined,
  maxSelections: number
): boolean {
  return getSelectedCount(answer) >= maxSelections;
}

/**
 * Utility to validate all answers before submission
 */
export function validateQuizAnswers(state: QuizState): {
  isValid: boolean;
  unansweredQuestions: number[];
  invalidAnswers: number[];
} {
  const unansweredQuestions: number[] = [];
  const invalidAnswers: number[] = [];

  state.questions.forEach(question => {
    const answer = state.answers.get(question.id);
    
    if (!answer) {
      unansweredQuestions.push(question.id);
      return;
    }

    // Check if answered
    const isAnswered = Array.isArray(answer.selectedAnswer) 
      ? answer.selectedAnswer.length > 0
      : answer.selectedAnswer !== '';

    if (!isAnswered) {
      unansweredQuestions.push(question.id);
      return;
    }

    // Check if multiple choice has valid selection count
    if (isMultipleChoice(question)) {
      const selectedCount = getSelectedCount(answer);
      if (selectedCount > question.max_selections) {
        invalidAnswers.push(question.id);
      }
    }
  });

  return {
    isValid: unansweredQuestions.length === 0 && invalidAnswers.length === 0,
    unansweredQuestions,
    invalidAnswers
  };
}
