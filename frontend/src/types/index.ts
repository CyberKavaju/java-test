// Types for the Java Test application

// Question Types
export type QuestionType = 'single' | 'multiple';

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
  question_type?: QuestionType; // Optional for backward compatibility
}

// Formatted question for frontend display
export interface FormattedQuestion {
  id: number;
  question: string;
  options: Option[];
  question_type: QuestionType;
  max_selections: number;
}

export interface Option {
  key: string;
  text: string;
}

export interface Answer {
  questionId: number;
  selectedAnswer: string | string[]; // Support both single and multiple answers
}

// API Submission format
export interface AnswerSubmission {
  questionId: number;
  selectedAnswer: string | string[];
}

export interface TestResult {
  questionId: number;
  selectedAnswer: string | string[];
  correctAnswer: string | string[];
  isCorrect: boolean;
  explanation: string;
  question_text: string;
}

// Validation result from backend
export interface ValidationResult {
  success: boolean;
  results: AnswerResult[];
  score: Score;
}

export interface AnswerResult {
  questionId: number;
  isCorrect: boolean;
  selectedAnswer: string | string[];
  correctAnswer: string | string[];
  explanation?: string;
}

export interface Score {
  correct: number;
  total: number;
  percentage: number;
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

// Review feature types
export interface Topic {
  id: string;
  title: string;
  description: string;
  questionCount: number;
}

export interface ReviewSession {
  sessionId: number;
  topic: string;
  currentRound: number;
  totalQuestions: number;
  questions: FormattedQuestion[];
}

export interface ReviewRoundResult {
  questionId: number;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
}

export interface ReviewRoundSummary {
  correctCount: number;
  totalCount: number;
  percentage: number;
  isComplete: boolean;
  nextRoundQuestions?: number[];
}

export interface ReviewSessionSummary {
  topic: string;
  totalRounds: number;
  finalScore: number;
  timeSpent: number;
  masteryAchieved: boolean;
}

export interface TopicMastery {
  topic: string;
  title: string;
  masteryLevel: string;
  totalSessions: number;
  averageRounds: number;
  lastPracticed: string;
}

export interface MasteryOverview {
  mastery: TopicMastery[];
  overallStats: {
    topicsMastered: number;
    topicsInProgress: number;
    topicsNotStarted: number;
    totalTimeSpent: number;
  };
}

export interface ReviewHistoryItem {
  sessionId: number;
  startedAt: string;
  completedAt: string;
  rounds: number;
  finalScore: number;
  timeSpent: number;
}

// Review session report types
export interface ReviewTopicPerformance {
  topic: string;
  roundsToComplete: number;
  finalAccuracy: number;
  difficulty: 'mastered' | 'good' | 'needsWork' | 'struggling';
  completedAt: string;
}

export interface ReviewRecommendation {
  type: 'focus_on_struggling' | 'review_needs_work' | 'maintain_mastery';
  message: string;
  topics: string[];
}

export interface ReviewTimeAnalysis {
  averageSessionDuration: number;
  totalStudyTime: number;
  sessionsLast7Days: number;
  sessionsLast30Days: number;
}

export interface ReviewDifficultyBreakdown {
  mastered: number;
  good: number;
  needsWork: number;
  struggling: number;
}

export interface ReviewReport {
  userId: string;
  totalSessions: number;
  topics: ReviewTopicPerformance[];
  recommendations: ReviewRecommendation[];
  timeAnalysis: ReviewTimeAnalysis;
  difficultyBreakdown: ReviewDifficultyBreakdown;
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
