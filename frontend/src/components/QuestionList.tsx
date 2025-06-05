import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import './QuestionList.css';

// Temporary type definition to avoid import issues
interface Question {
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

interface QuestionListProps {
  onEditQuestion: (question: Question) => void;
  onCreateNew: () => void;
}

export const QuestionList: React.FC<QuestionListProps> = ({ onEditQuestion, onCreateNew }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    domain: '',
    topic: '',
    search: ''
  });
  const [filterOptions, setFilterOptions] = useState({
    domains: [] as string[],
    topics: [] as string[]
  });

  const itemsPerPage = 10;

  useEffect(() => {
    loadFilterOptions();
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [currentPage, filters]);

  const loadFilterOptions = async () => {
    try {
      const options = await apiService.getFilterOptions();
      setFilterOptions(options);
    } catch (err) {
      console.error('Failed to load filter options:', err);
    }
  };

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const response = await apiService.getQuestions({
        page: currentPage,
        limit: itemsPerPage,
        ...filters
      });
      setQuestions(response.questions);
      setTotalPages(response.pagination.totalPages);
      setError(null);
    } catch (err) {
      setError('Failed to load questions');
      console.error('Error loading questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleDeleteQuestion = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }

    try {
      await apiService.deleteQuestion(id);
      loadQuestions(); // Reload the list
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete question');
    }
  };

  const clearFilters = () => {
    setFilters({ domain: '', topic: '', search: '' });
    setCurrentPage(1);
  };

  if (loading && questions.length === 0) {
    return <div className="loading">Loading questions...</div>;
  }

  return (
    <div className="question-list">
      <div className="question-list-header">
        <h2>Question Management</h2>
        <button onClick={onCreateNew} className="btn btn-primary">
          Add New Question
        </button>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="filter-row">
          <select
            value={filters.domain}
            onChange={(e) => handleFilterChange('domain', e.target.value)}
            className="filter-select"
          >
            <option value="">All Domains</option>
            {filterOptions.domains.map(domain => (
              <option key={domain} value={domain}>{domain}</option>
            ))}
          </select>

          <select
            value={filters.topic}
            onChange={(e) => handleFilterChange('topic', e.target.value)}
            className="filter-select"
          >
            <option value="">All Topics</option>
            {filterOptions.topics.map(topic => (
              <option key={topic} value={topic}>{topic}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search questions..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="filter-input"
          />

          <button onClick={clearFilters} className="btn btn-secondary">
            Clear Filters
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Questions Table */}
      <div className="questions-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Domain</th>
              <th>Topic</th>
              <th>Question</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.map(question => (
              <tr key={question.id}>
                <td>{question.id}</td>
                <td>{question.domain}</td>
                <td>{question.topic}</td>
                <td className="question-text">
                  {question.question_text.length > 100
                    ? `${question.question_text.substring(0, 100)}...`
                    : question.question_text
                  }
                </td>
                <td className="actions">
                  <button
                    onClick={() => onEditQuestion(question)}
                    className="btn btn-small btn-primary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(question.id)}
                    className="btn btn-small btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {questions.length === 0 && !loading && (
          <div className="no-questions">
            No questions found. {filters.domain || filters.topic || filters.search ? 'Try adjusting your filters.' : ''}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="btn btn-secondary"
          >
            Previous
          </button>
          
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="btn btn-secondary"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
