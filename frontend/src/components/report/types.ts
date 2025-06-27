// TypeScript interfaces for the Report component

export interface QuestionPerformance {
  question_id: number;
  topic: string;
  domain: string;
  success_rate: number;
  total_attempts: number;
  avg_time: number;
  performance_color: string;
}

export interface PerformanceTrend {
  session_id: number;
  date: string;
  score: number;
  total_questions: number;
  percentage: number;
}

export interface UserStats {
  total_attempts: number;
  correct_answers: number;
  unique_questions_attempted: number;
}

export interface TestSession {
  id: number;
  score: number;
  total_questions: number;
  time_taken: number;
  completed_at: string;
}

export interface TopicStats {
  topic: string;
  total_attempts: number;
  correct_answers: number;
  success_rate: number;
}

export interface DetailedQuestionPerformance {
  id: number;
  question_text: string;
  topic: string;
  domain: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d?: string;
  option_e?: string;
  correct_answer: string;
  explanation?: string;
  success_rate: number;
  total_attempts: number;
  correct_count: number;
  wrong_count: number;
  performance_color: string;
  user_attempts: Array<{
    selected_answer: string;
    is_correct: boolean;
    answered_at: string;
  }>;
}

export interface ReviewReport {
  totalSessions: number;
  topics: Array<{
    topic: string;
    difficulty: 'struggling' | 'needsWork' | 'good' | 'mastered';
    averageScore: number;
    totalSessions: number;
    lastStudied: string;
  }>;
  timeAnalysis: {
    averageSessionDuration: number;
    sessionsLast7Days: number;
    totalStudyTime: number;
  };
  difficultyBreakdown: {
    struggling: number;
    needsWork: number;
    good: number;
    mastered: number;
  };
  recommendations: Array<{
    type: string;
    message: string;
    topics?: string[];
  }>;
}

export interface ConsolidatedTopic {
  topic: string;
  success_rate: number;
  total_attempts: number;
  correct_answers: number;
  isConsolidated?: boolean;
  relatedTopics?: string[];
  tutorialSlug?: string;
}
