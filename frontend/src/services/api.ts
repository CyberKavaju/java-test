import axios from 'axios';
import type { Question, Answer, TestResult, UserStats, TestSession, TopicStats, QuestionPerformance, PerformanceTrend } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Get random questions for a test
  async getRandomQuestions(userId: string = 'default_user', limit: number = 25): Promise<Question[]> {
    const response = await api.get(`/questions/random?userId=${userId}&limit=${limit}`);
    return response.data.questions;
  },

  // Submit test answers
  async submitAnswers(userId: string = 'default_user', answers: Answer[], timeSpent: number): Promise<{
    results: TestResult[];
    score: number;
    total: number;
    percentage: number;
  }> {
    const response = await api.post('/submit-answers', {
      userId,
      answers,
      timeSpent
    });
    return response.data;
  },

  // Get user history and statistics
  async getUserHistory(userId: string = 'default_user'): Promise<{
    userStats: UserStats;
    testSessions: TestSession[];
    topicStats: TopicStats[];
  }> {
    const response = await api.get(`/user-history?userId=${userId}`);
    return response.data;
  },

  // Get performance report
  async getReport(userId: string = 'default_user'): Promise<{
    questionPerformance: QuestionPerformance[];
    performanceTrend: PerformanceTrend[];
  }> {
    const response = await api.get(`/report?userId=${userId}`);
    return response.data;
  },

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await api.get('/health');
      return response.data.success;
    } catch {
      return false;
    }
  }
};
