import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { Question, Answer, TestResult } from '../types';

interface AppState {
  currentTest: {
    questions: Question[];
    answers: Answer[];
    timeRemaining: number;
    isActive: boolean;
    startTime: number | null;
  };
  lastTestResults: TestResult[] | null;
  userId: string;
}

type AppAction =
  | { type: 'START_TEST'; payload: { questions: Question[] } }
  | { type: 'ANSWER_QUESTION'; payload: { questionId: number; selectedAnswer: string | string[] } }
  | { type: 'UPDATE_TIMER'; payload: { timeRemaining: number } }
  | { type: 'END_TEST' }
  | { type: 'SET_TEST_RESULTS'; payload: { results: TestResult[] } }
  | { type: 'RESET_TEST' };

const initialState: AppState = {
  currentTest: {
    questions: [],
    answers: [],
    timeRemaining: 50 * 60, // 50 minutes in seconds
    isActive: false,
    startTime: null,
  },
  lastTestResults: null,
  userId: 'default_user',
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'START_TEST':
      return {
        ...state,
        currentTest: {
          questions: action.payload.questions,
          answers: [],
          timeRemaining: 50 * 60,
          isActive: true,
          startTime: Date.now(),
        },
      };

    case 'ANSWER_QUESTION': {
      const existingAnswerIndex = state.currentTest.answers.findIndex(
        a => a.questionId === action.payload.questionId
      );
      
      let newAnswers;
      if (existingAnswerIndex >= 0) {
        newAnswers = [...state.currentTest.answers];
        newAnswers[existingAnswerIndex].selectedAnswer = action.payload.selectedAnswer;
      } else {
        newAnswers = [
          ...state.currentTest.answers,
          {
            questionId: action.payload.questionId,
            selectedAnswer: action.payload.selectedAnswer,
          },
        ];
      }

      return {
        ...state,
        currentTest: {
          ...state.currentTest,
          answers: newAnswers,
        },
      };
    }

    case 'UPDATE_TIMER':
      return {
        ...state,
        currentTest: {
          ...state.currentTest,
          timeRemaining: action.payload.timeRemaining,
        },
      };

    case 'END_TEST':
      return {
        ...state,
        currentTest: {
          ...state.currentTest,
          isActive: false,
        },
      };

    case 'SET_TEST_RESULTS':
      return {
        ...state,
        lastTestResults: action.payload.results,
      };

    case 'RESET_TEST':
      return {
        ...state,
        currentTest: {
          questions: [],
          answers: [],
          timeRemaining: 50 * 60,
          isActive: false,
          startTime: null,
        },
        lastTestResults: null,
      };

    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
