import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { DetailedQuestionPerformance } from './types';
import { getPerformanceColor, getPerformanceEmoji } from './utils';

interface PerformanceTabProps {
  detailedQuestions: {
    questionDetails: DetailedQuestionPerformance[];
  };
}

const PerformanceTab: React.FC<PerformanceTabProps> = ({ detailedQuestions }) => {
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());
  const [performanceFilter, setPerformanceFilter] = useState<'all' | 'green' | 'yellow' | 'red'>('all');

  const toggleQuestionExpanded = (questionId: number) => {
    setExpandedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const getFilteredQuestions = () => {
    if (!detailedQuestions?.questionDetails) return [];
    
    if (performanceFilter === 'all') {
      return detailedQuestions.questionDetails;
    }
    
    return detailedQuestions.questionDetails.filter(question => 
      question.performance_color === performanceFilter
    );
  };

  const filteredQuestions = getFilteredQuestions();

  return (
    <div className="performance-tab">
      <h3>Detailed Question Review</h3>
      <div className="performance-summary">
        <div className="performance-legend">
          <button 
            className={`performance-filter-btn ${performanceFilter === 'all' ? 'active' : ''}`}
            onClick={() => setPerformanceFilter('all')}
          >
            📋 All ({detailedQuestions.questionDetails.length})
          </button>
          <button 
            className={`performance-filter-btn green ${performanceFilter === 'green' ? 'active' : ''}`}
            onClick={() => setPerformanceFilter('green')}
            style={{ color: getPerformanceColor('green') }}
          >
            🟢 Green ({detailedQuestions.questionDetails.filter(q => q.performance_color === 'green').length})
          </button>
          <button 
            className={`performance-filter-btn yellow ${performanceFilter === 'yellow' ? 'active' : ''}`}
            onClick={() => setPerformanceFilter('yellow')}
            style={{ color: getPerformanceColor('yellow') }}
          >
            🟡 Yellow ({detailedQuestions.questionDetails.filter(q => q.performance_color === 'yellow').length})
          </button>
          <button 
            className={`performance-filter-btn red ${performanceFilter === 'red' ? 'active' : ''}`}
            onClick={() => setPerformanceFilter('red')}
            style={{ color: getPerformanceColor('red') }}
          >
            🔴 Red ({detailedQuestions.questionDetails.filter(q => q.performance_color === 'red').length})
          </button>
        </div>
      </div>
      <div className="detailed-questions-list">
        {filteredQuestions.length === 0 ? (
          <div className="no-questions-found">
            <p>No questions found for the selected filter.</p>
          </div>
        ) : (
          filteredQuestions.map((question) => {
            const isExpanded = expandedQuestions.has(question.id);
            return (
            <div key={question.id} className="detailed-question-card">
              <div 
                className="question-header clickable" 
                onClick={() => toggleQuestionExpanded(question.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="question-meta">
                  <span className="performance-indicator">
                    {getPerformanceEmoji(question.performance_color)}
                  </span>
                  <span className="topic-badge">{question.topic}</span>
                  <span className="domain-badge">{question.domain}</span>
                  <span className="success-rate">{question.success_rate}%</span>
                </div>
                <div className="attempts-summary">
                  <span>✅ {question.correct_count}</span>
                  <span>❌ {question.wrong_count}</span>
                  <span>Total: {question.total_attempts}</span>
                </div>
                <div className="expand-indicator">
                  {isExpanded ? '▼' : '▶'}
                </div>
              </div>

              {isExpanded && (
                <div className="question-content">
                  <div className="question-text">
                    <h4>Question:</h4>
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code: ({className, children, ...props}) => {
                          const match = /language-(\w+)/.exec(className || '');
                          const isInline = !match;
                          
                          return isInline ? (
                            <code className="inline-code">
                              {children}
                            </code>
                          ) : (
                            <code className={className}>
                              {children}
                            </code>
                          );
                        },
                        pre: ({children}) => (
                          <pre className="code-block">{children}</pre>
                        ),
                      }}
                    >
                      {question.question_text}
                    </ReactMarkdown>
                  </div>

                  <div className="answer-options">
                    <h4>Answer Options:</h4>
                    <div className="options-grid">
                      <div className={`option ${question.correct_answer === 'A' ? 'correct' : ''}`}>
                        <span className="option-label">A:</span>
                        <span className="option-text">{question.option_a}</span>
                        {question.correct_answer === 'A' && <span className="correct-indicator">✓ Correct</span>}
                      </div>
                      <div className={`option ${question.correct_answer === 'B' ? 'correct' : ''}`}>
                        <span className="option-label">B:</span>
                        <span className="option-text">{question.option_b}</span>
                        {question.correct_answer === 'B' && <span className="correct-indicator">✓ Correct</span>}
                      </div>
                      <div className={`option ${question.correct_answer === 'C' ? 'correct' : ''}`}>
                        <span className="option-label">C:</span>
                        <span className="option-text">{question.option_c}</span>
                        {question.correct_answer === 'C' && <span className="correct-indicator">✓ Correct</span>}
                      </div>
                      {question.option_d && (
                        <div className={`option ${question.correct_answer === 'D' ? 'correct' : ''}`}>
                          <span className="option-label">D:</span>
                          <span className="option-text">{question.option_d}</span>
                          {question.correct_answer === 'D' && <span className="correct-indicator">✓ Correct</span>}
                        </div>
                      )}
                      {question.option_e && (
                        <div className={`option ${question.correct_answer === 'E' ? 'correct' : ''}`}>
                          <span className="option-label">E:</span>
                          <span className="option-text">{question.option_e}</span>
                          {question.correct_answer === 'E' && <span className="correct-indicator">✓ Correct</span>}
                        </div>
                      )}
                    </div>
                  </div>

                  {question.explanation && (
                    <div className="explanation">
                      <h4>Explanation:</h4>
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code: ({className, children, ...props}) => {
                            const match = /language-(\w+)/.exec(className || '');
                            const isInline = !match;
                            
                            return isInline ? (
                              <code className="inline-code">
                                {children}
                              </code>
                            ) : (
                              <code className={className}>
                                {children}
                              </code>
                            );
                          },
                          pre: ({children}) => (
                            <pre className="code-block">{children}</pre>
                          ),
                        }}
                      >
                        {question.explanation}
                      </ReactMarkdown>
                    </div>
                  )}

                  {question.user_attempts.length > 0 && (
                    <div className="user-attempts">
                      <h4>Your Attempts:</h4>
                      <div className="attempts-list">
                        {question.user_attempts.map((attempt, index) => (
                          <div key={index} className={`attempt-item ${attempt.is_correct ? 'correct' : 'incorrect'}`}>
                            <span className="attempt-answer">Answer: {attempt.selected_answer}</span>
                            <span className={`attempt-result ${attempt.is_correct ? 'correct' : 'incorrect'}`}>
                              {attempt.is_correct ? '✓ Correct' : '✗ Incorrect'}
                            </span>
                            <span className="attempt-time">
                              {new Date(attempt.answered_at).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })
        )}
      </div>
    </div>
  );
};

export default PerformanceTab;
