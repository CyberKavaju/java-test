// Types for the Java Test application

export interface Question {
  id: number;
  domain: string;
  topic: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d?: string;
  option_e?: string;
  correct_answer: string;
  explanation?: string;
  created_at?: string;
}

export interface Answer {
  questionId: number;
  selectedAnswer: string;
}

export interface TestResult {
  questionId: number;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
  question_text: string;
}

export interface TestSession {
  id: number;
  user_id: string;
  question_ids: string;
  score: number;
  total_questions: number;
  time_taken: number;
  completed_at: string;
  status: string;
}

export interface UserStats {
  total_attempts: number;
  correct_answers: number;
  unique_questions_attempted: number;
}

export interface TopicStats {
  topic: string;
  total_attempts: number;
  correct_answers: number;
  success_rate: number;
}

export interface QuestionPerformance {
  id: number;
  topic: string;
  question_text: string;
  correct_count: number;
  wrong_count: number;
  total_attempts: number;
  performance_color: 'green' | 'yellow' | 'red' | 'gray';
  success_rate: number;
}

export interface PerformanceTrend {
  date: string;
  total_attempts: number;
  correct_answers: number;
  daily_success_rate: number;
}

export interface UserAttempt {
  selected_answer: string;
  is_correct: boolean;
  attempt_timestamp: string;
}

export interface DetailedQuestionPerformance {
  id: number;
  domain: string;
  topic: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d?: string;
  option_e?: string;
  correct_answer: string;
  explanation?: string;
  correct_count: number;
  wrong_count: number;
  total_attempts: number;
  performance_color: 'green' | 'yellow' | 'red' | 'gray';
  success_rate: number;
  user_attempts: UserAttempt[];
}

export interface Tutorial {
  id: number;
  filename: string;
  title: string;
  slug: string;
}

export interface TutorialContent {
  slug: string;
  title: string;
  content: string;
}
