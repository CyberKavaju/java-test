import axios from 'axios';
import type { Question, Answer, TestResult, UserStats, TestSession, TopicStats, QuestionPerformance, PerformanceTrend, DetailedQuestionPerformance } from '../types/index.js';

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

  // Get detailed question performance with user attempts
  async getDetailedQuestionPerformance(userId: string = 'default_user'): Promise<{
    questionDetails: DetailedQuestionPerformance[];
  }> {
    const response = await api.get(`/question-details?userId=${userId}`);
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
  },

  // Get total question count
  async getQuestionCount(): Promise<number> {
    try {
      const response = await api.get('/questions/count');
      return response.data.count;
    } catch {
      return 0;
    }
  },

  // Preview CSV import
  async previewImport(formData: FormData): Promise<{
    valid: Array<{
      domain: string;
      topic: string;
      question_text: string;
      option_a: string;
      option_b: string;
      option_c: string;
      option_d?: string;
      option_e?: string;
      correct_answer: string;
      explanation: string;
    }>;
    duplicates: Array<{
      rowIndex: number;
      question_text: string;
      reason: string;
    }>;
    errors: Array<{
      rowIndex: number;
      errors: string[];
    }>;
  }> {
    const response = await api.post('/import/preview', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Import questions from CSV
  async importQuestions(formData: FormData): Promise<{
    success: boolean;
    imported: number;
    skipped: number;
    errors: number;
    message: string;
    details?: {
      importedQuestions: number;
      skippedDuplicates: number;
      errorRows: Array<{
        rowIndex: number;
        errors: string[];
      }>;
    };
  }> {
    const response = await api.post('/import/questions', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // CRUD operations for question management
  
  // Get all questions with pagination and filtering
  async getQuestions(params?: {
    page?: number;
    limit?: number;
    domain?: string;
    topic?: string;
    search?: string;
  }): Promise<{
    questions: Question[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.domain) queryParams.append('domain', params.domain);
    if (params?.topic) queryParams.append('topic', params.topic);
    if (params?.search) queryParams.append('search', params.search);

    const response = await api.get(`/questions?${queryParams.toString()}`);
    return response.data;
  },

  // Get a single question by ID
  async getQuestion(id: number): Promise<Question> {
    const response = await api.get(`/questions/${id}`);
    return response.data.question;
  },

  // Create a new question
  async createQuestion(question: Omit<Question, 'id' | 'created_at'>): Promise<{ questionId: number }> {
    const response = await api.post('/questions', question);
    return response.data;
  },

  // Update an existing question
  async updateQuestion(id: number, question: Omit<Question, 'id' | 'created_at'>): Promise<void> {
    await api.put(`/questions/${id}`, question);
  },

  // Delete a question
  async deleteQuestion(id: number): Promise<void> {
    await api.delete(`/questions/${id}`);
  },

  // Get filter options (domains and topics)
  async getFilterOptions(): Promise<{
    domains: string[];
    topics: string[];
  }> {
    const response = await api.get('/questions/meta/filters');
    return response.data;
  }
};
