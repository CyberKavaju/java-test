import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import './QuestionForm.css';

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
  question_type?: 'single' | 'multiple';
}

interface QuestionFormProps {
  question?: Question | null;
  onSave: (question: Question) => void;
  onCancel: () => void;
}

interface FormData {
  domain: string;
  topic: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  option_e: string;
  correct_answer: string;
  explanation: string;
  question_type: 'single' | 'multiple';
}

export const QuestionForm: React.FC<QuestionFormProps> = ({ question, onSave, onCancel }) => {
  const [formData, setFormData] = useState<FormData>({
    domain: '',
    topic: '',
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    option_e: '',
    correct_answer: 'A',
    explanation: '',
    question_type: 'single'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState({
    domains: [] as string[],
    topics: [] as string[]
  });

  const isEditing = !!question;

  useEffect(() => {
    loadFilterOptions();
    if (question) {
      setFormData({
        domain: question.domain,
        topic: question.topic,
        question_text: question.question_text,
        option_a: question.option_a,
        option_b: question.option_b,
        option_c: question.option_c,
        option_d: question.option_d || '',
        option_e: question.option_e || '',
        correct_answer: question.correct_answer,
        explanation: question.explanation || '',
        question_type: question.question_type || 'single'
      });
    }
  }, [question]);

  const loadFilterOptions = async () => {
    try {
      const options = await apiService.getFilterOptions();
      setFilterOptions(options);
    } catch (err) {
      console.error('Failed to load filter options:', err);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleQuestionTypeChange = (isMulti: boolean) => {
    setFormData(prev => ({
      ...prev,
      question_type: isMulti ? 'multiple' : 'single',
      correct_answer: isMulti ? '' : 'A'
    }));
  };

  const validateForm = (): string | null => {
    const requiredFields = ['domain', 'topic', 'question_text', 'option_a', 'option_b', 'option_c', 'correct_answer'];
    
    for (const field of requiredFields) {
      if (!formData[field as keyof FormData].trim()) {
        return `${field.replace('_', ' ')} is required`;
      }
    }

    const validAnswers = ['A', 'B', 'C', 'D', 'E'];
    const correctAnswers = formData.correct_answer.split(',').map(a => a.trim().toUpperCase());

    for (const answer of correctAnswers) {
        if (!validAnswers.includes(answer)) {
            return 'Correct answer must be a comma-separated list of A, B, C, D, or E';
        }
    }
    
    // Check if the selected correct answers have corresponding options
    const answerMap = {
      'A': formData.option_a,
      'B': formData.option_b,
      'C': formData.option_c,
      'D': formData.option_d,
      'E': formData.option_e
    };

    for (const answer of correctAnswers) {
        if (!answerMap[answer as keyof typeof answerMap].trim()) {
          return `Option ${answer} is selected as correct answer but is empty`;
        }
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const questionData = {
        ...formData,
        option_d: formData.option_d || undefined,
        option_e: formData.option_e || undefined,
        explanation: formData.explanation || undefined
      };

      if (isEditing && question) {
        await apiService.updateQuestion(question.id, questionData);
        onSave({ ...question, ...questionData });
      } else {
        const result = await apiService.createQuestion(questionData);
        const newQuestion: Question = {
          id: result.questionId,
          ...questionData,
          created_at: new Date().toISOString()
        };
        onSave(newQuestion);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="question-form-overlay">
      <div className="question-form">
        <div className="form-header">
          <h2>{isEditing ? 'Edit Question' : 'Create New Question'}</h2>
          <button onClick={onCancel} className="close-btn" aria-label="Close">
            ×
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="domain">Domain *</label>
              <input
                type="text"
                id="domain"
                value={formData.domain}
                onChange={(e) => handleInputChange('domain', e.target.value)}
                placeholder="e.g., Core Java"
                list="domains"
                required
              />
              <datalist id="domains">
                {filterOptions.domains.map(domain => (
                  <option key={domain} value={domain} />
                ))}
              </datalist>
            </div>

            <div className="form-group">
              <label htmlFor="topic">Topic *</label>
              <input
                type="text"
                id="topic"
                value={formData.topic}
                onChange={(e) => handleInputChange('topic', e.target.value)}
                placeholder="e.g., OOP Concepts"
                list="topics"
                required
              />
              <datalist id="topics">
                {filterOptions.topics.map(topic => (
                  <option key={topic} value={topic} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="question_text">Question Text *</label>
            <textarea
              id="question_text"
              value={formData.question_text}
              onChange={(e) => handleInputChange('question_text', e.target.value)}
              placeholder="Enter the question text..."
              rows={4}
              required
            />
          </div>

          <div className="options-section">
            <h3>Answer Options</h3>
            <div className="form-group">
              <label htmlFor="option_a">Option A *</label>
              <input
                type="text"
                id="option_a"
                value={formData.option_a}
                onChange={(e) => handleInputChange('option_a', e.target.value)}
                placeholder="Enter option A"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="option_b">Option B *</label>
              <input
                type="text"
                id="option_b"
                value={formData.option_b}
                onChange={(e) => handleInputChange('option_b', e.target.value)}
                placeholder="Enter option B"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="option_c">Option C *</label>
              <input
                type="text"
                id="option_c"
                value={formData.option_c}
                onChange={(e) => handleInputChange('option_c', e.target.value)}
                placeholder="Enter option C"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="option_d">Option D</label>
              <input
                type="text"
                id="option_d"
                value={formData.option_d}
                onChange={(e) => handleInputChange('option_d', e.target.value)}
                placeholder="Enter option D (optional)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="option_e">Option E</label>
              <input
                type="text"
                id="option_e"
                value={formData.option_e}
                onChange={(e) => handleInputChange('option_e', e.target.value)}
                placeholder="Enter option E (optional)"
              />
            </div>
          </div>

          <div className="form-group form-check">
            <input
              type="checkbox"
              id="question_type"
              className="form-check-input"
              checked={formData.question_type === 'multiple'}
              onChange={(e) => handleQuestionTypeChange(e.target.checked)}
            />
            <label htmlFor="question_type" className="form-check-label">
              Multiple Correct Answers
            </label>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="correct_answer">Correct Answer *</label>
              {formData.question_type === 'multiple' ? (
                <input
                  type="text"
                  id="correct_answer"
                  value={formData.correct_answer}
                  onChange={(e) => handleInputChange('correct_answer', e.target.value)}
                  placeholder="e.g., A, C"
                  required
                />
              ) : (
                <select
                  id="correct_answer"
                  value={formData.correct_answer}
                  onChange={(e) => handleInputChange('correct_answer', e.target.value)}
                  required
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                </select>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="explanation">Explanation</label>
            <textarea
              id="explanation"
              value={formData.explanation}
              onChange={(e) => handleInputChange('explanation', e.target.value)}
              placeholder="Enter explanation for the correct answer (optional)"
              rows={3}
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Saving...' : (isEditing ? 'Update Question' : 'Create Question')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
