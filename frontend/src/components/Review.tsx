import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { apiService } from '../services/api';
import type { 
  ReviewSession, 
  ReviewRoundResult, 
  ReviewRoundSummary,
  ReviewSessionSummary,
  Answer
} from '../types';
import './Review.css';

interface ReviewProps {}

const Review: React.FC<ReviewProps> = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const topicId = searchParams.get('topic');
  const userId = 'default_user'; // TODO: Get from auth context

  const [session, setSession] = useState<ReviewSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [roundResults, setRoundResults] = useState<ReviewRoundResult[]>([]);
  const [roundSummary, setRoundSummary] = useState<ReviewRoundSummary | null>(null);
  const [sessionSummary, setSessionSummary] = useState<ReviewSessionSummary | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());
  const [showFilter, setShowFilter] = useState<'all' | 'correct' | 'incorrect'>('all');

  useEffect(() => {
    if (topicId) {
      startReviewSession();
    } else {
      setError('No topic specified for review');
    }
  }, [topicId]);

  const startReviewSession = async () => {
    if (!topicId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.startReviewSession(userId, topicId);
      
      if (response.success) {
        setSession({
          sessionId: response.sessionId,
          topic: topicId,
          currentRound: response.roundInfo.currentRound,
          totalQuestions: response.roundInfo.totalQuestions,
          questions: response.questions // Don't format - backend already sends formatted questions
        });
        setAnswers([]);
        setCurrentQuestionIndex(0);
        setShowResults(false);
      } else {
        console.log('Review session failed:', response);
        setError('Failed to start review session');
      }
    } catch (err: any) {
      console.error('API Error details:', err);
      if (err.response) {
        console.error('Error response data:', err.response.data);
        console.error('Error response status:', err.response.status);
        setError(`API Error: ${err.response.data?.error || err.response.status}`);
      } else if (err.request) {
        console.error('Network error:', err.request);
        setError('Network error - cannot reach server');
      } else {
        console.error('Request setup error:', err.message);
        setError(`Request error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId: number, selectedAnswer: string | string[]) => {
    setAnswers(prev => {
      const existing = prev.find(a => a.questionId === questionId);
      if (existing) {
        return prev.map(a => 
          a.questionId === questionId 
            ? { ...a, selectedAnswer }
            : a
        );
      } else {
        return [...prev, { questionId, selectedAnswer }];
      }
    });
  };

  const submitRound = async () => {
    if (!session) {
      setError('No active session');
      return;
    }

    // Check if all questions are answered
    const unansweredQuestions = session.questions.filter(question => {
      const answer = answers.find(a => a.questionId === question.id);
      if (!answer) return true;
      
      // For multi-selection, check if at least one option is selected
      if (question.question_type === 'multiple') {
        return !Array.isArray(answer.selectedAnswer) || answer.selectedAnswer.length === 0;
      }
      
      // For single selection, check if an option is selected
      return !answer.selectedAnswer;
    });

    if (unansweredQuestions.length > 0) {
      setError('Please answer all questions before submitting');
      return;
    }

    try {
      setLoading(true);
      
      const response = await apiService.submitReviewRound(session.sessionId, answers);
      
      if (response.success) {
        setRoundResults(response.results);
        setRoundSummary(response.roundSummary);
        setShowResults(true);
        
        if (response.roundSummary.isComplete) {
          // Session is complete, get final summary
          const completeResponse = await apiService.completeReviewSession(session.sessionId);
          if (completeResponse.success) {
            setSessionSummary(completeResponse.sessionSummary);
            setIsCompleted(true);
          }
        }
      } else {
        setError('Failed to submit round');
      }
    } catch (err: any) {
      setError('Error submitting round');
      console.error('Submit round error:', err);
    } finally {
      setLoading(false);
    }
  };

  const startNextRound = async () => {
    if (!session) return;

    try {
      setLoading(true);
      
      const response = await apiService.getNextRound(session.sessionId);
      
      if (response.success) {
        setSession({
          ...session,
          questions: response.questions, // Don't format - backend already sends formatted questions
          currentRound: response.roundInfo.currentRound,
          totalQuestions: response.roundInfo.totalQuestions
        });
        setAnswers([]);
        setCurrentQuestionIndex(0);
        setShowResults(false);
        setRoundResults([]);
        setRoundSummary(null);
      } else {
        setError('Failed to get next round');
      }
    } catch (err: any) {
      setError('Error getting next round');
      console.error('Next round error:', err);
    } finally {
      setLoading(false);
    }
  };

  const goBackToTutorial = () => {
    navigate(`/tutorial?tutorial=${topicId}`);
  };

  const goToTutorials = () => {
    navigate('/tutorial');
  };

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

  const toggleAllQuestions = () => {
    if (expandedQuestions.size === roundResults.length) {
      setExpandedQuestions(new Set());
    } else {
      setExpandedQuestions(new Set(roundResults.map(r => r.questionId)));
    }
  };

  const getFilteredResults = () => {
    if (showFilter === 'correct') {
      return roundResults.filter(r => r.isCorrect);
    } else if (showFilter === 'incorrect') {
      return roundResults.filter(r => !r.isCorrect);
    }
    return roundResults;
  };

  const getQuestionByIdFromSession = (questionId: number) => {
    return session?.questions.find(q => q.id === questionId);
  };

  if (loading && !session) {
    return (
      <div className="review-container">
        <div className="loading">Starting review session...</div>
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="review-container">
        <div className="error">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={goToTutorials} className="btn btn-secondary">
            Back to Tutorials
          </button>
        </div>
      </div>
    );
  }

  if (isCompleted && sessionSummary) {
    return (
      <div className="review-container">
        <div className="review-completion">
          <h1>Review Session Complete!</h1>
          <div className="session-summary">
            <h2>Topic: {sessionSummary.topic}</h2>
            <div className="summary-stats">
              <div className="stat">
                <span className="stat-label">Total Rounds:</span>
                <span className="stat-value">{sessionSummary.totalRounds}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Final Score:</span>
                <span className="stat-value">{sessionSummary.finalScore}%</span>
              </div>
              <div className="stat">
                <span className="stat-label">Time Spent:</span>
                <span className="stat-value">{Math.round(sessionSummary.timeSpent / 60)} minutes</span>
              </div>
              <div className="stat">
                <span className="stat-label">Mastery:</span>
                <span className={`stat-value ${sessionSummary.masteryAchieved ? 'mastery-achieved' : 'mastery-progress'}`}>
                  {sessionSummary.masteryAchieved ? 'Achieved!' : 'In Progress'}
                </span>
              </div>
            </div>
          </div>
          <div className="completion-actions">
            <button onClick={goBackToTutorial} className="btn btn-primary">
              Back to Tutorial
            </button>
            <button onClick={goToTutorials} className="btn btn-secondary">
              All Tutorials
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResults && roundSummary) {
    return (
      <div className="review-container">
        <div className="round-results">
          <h1>Round {session?.currentRound} Results</h1>
          
          <div className="round-summary">
            <div className="summary-score">
              <span className="score-text">
                {roundSummary.correctCount} / {roundSummary.totalCount} correct
              </span>
              <span className="score-percentage">({roundSummary.percentage}%)</span>
            </div>
          </div>

          <div className="results-controls">
            <div className="filter-controls">
              <button 
                className={`filter-btn ${showFilter === 'all' ? 'active' : ''}`}
                onClick={() => setShowFilter('all')}
              >
                All ({roundResults.length})
              </button>
              <button 
                className={`filter-btn correct ${showFilter === 'correct' ? 'active' : ''}`}
                onClick={() => setShowFilter('correct')}
              >
                Correct ({roundResults.filter(r => r.isCorrect).length})
              </button>
              <button 
                className={`filter-btn incorrect ${showFilter === 'incorrect' ? 'active' : ''}`}
                onClick={() => setShowFilter('incorrect')}
              >
                Incorrect ({roundResults.filter(r => !r.isCorrect).length})
              </button>
            </div>
            
            <div className="expand-controls">
              <button 
                className="expand-btn"
                onClick={toggleAllQuestions}
              >
                {expandedQuestions.size === roundResults.length ? 'Collapse All' : 'Expand All'}
              </button>
            </div>
          </div>

          <div className="results-list">
            {getFilteredResults().map((result) => {
              const question = getQuestionByIdFromSession(result.questionId);
              const isExpanded = expandedQuestions.has(result.questionId);
              const originalIndex = roundResults.findIndex(r => r.questionId === result.questionId);
              
              return (
                <div key={result.questionId} className={`result-item ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                  <div 
                    className="result-header clickable"
                    onClick={() => toggleQuestionExpanded(result.questionId)}
                  >
                    <div className="result-header-left">
                      <span className="question-number">Question {originalIndex + 1}</span>
                      <span className={`result-status ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                        {result.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                      </span>
                    </div>
                    <div className="expand-icon">
                      {isExpanded ? '▼' : '▶'}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="result-content">
                      {question && (
                        <div className="question-text">
                          <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={{
                              code: ({className, children, ...props}) => {
                                const match = /language-(\w+)/.exec(className || '');
                                const isInline = !match;
                                return isInline ? (
                                  <code className="inline-code" {...props}>{children}</code>
                                ) : (
                                  <code className={className} {...props}>{children}</code>
                                );
                              },
                              pre: ({children}) => <pre className="code-block">{children}</pre>,
                            }}
                          >
                            {question.question}
                          </ReactMarkdown>
                        </div>
                      )}

                      <div className="result-answers">
                        <div>Your answer: <strong>{result.selectedAnswer}</strong></div>
                        <div>Correct answer: <strong>{result.correctAnswer}</strong></div>
                      </div>
                      
                      {result.explanation && (
                        <div className="result-explanation">
                          <strong>Explanation:</strong> {result.explanation}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="round-actions">
            {roundSummary.isComplete ? (
              <div className="completion-message">
                <p>🎉 Congratulations! You've completed the review session.</p>
                <p>Finalizing your results...</p>
              </div>
            ) : (
              <>
                <p>Keep practicing! You'll review the questions you got wrong in the next round.</p>
                <button onClick={startNextRound} className="btn btn-primary" disabled={loading}>
                  {loading ? 'Starting Next Round...' : 'Continue to Next Round'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="review-container">
        <div className="loading">Loading review session...</div>
      </div>
    );
  }

  const currentQuestion = session.questions[currentQuestionIndex];
  const currentAnswer = answers.find(a => a.questionId === currentQuestion?.id)?.selectedAnswer;

  return (
    <div className="review-container">
      <div className="review-header">
        <button onClick={goBackToTutorial} className="btn btn-secondary back-btn">
          ← Back to Tutorial
        </button>
        <div className="review-progress">
          <h1>Review: {session.topic}</h1>
          <p>Round {session.currentRound} - Question {currentQuestionIndex + 1} of {session.questions.length}</p>
        </div>
      </div>

      <div className="question-container">
        <div className="question-text">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              // Custom styling for code blocks
              code: ({className, children, ...props}) => {
                const match = /language-(\w+)/.exec(className || '');
                const isInline = !match;
                return isInline ? (
                  <code className="inline-code" {...props}>
                    {children}
                  </code>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
              // Custom styling for pre blocks (code blocks)
              pre: ({children}) => (
                <pre className="code-block">{children}</pre>
              ),
            }}
          >
            {currentQuestion?.question}
          </ReactMarkdown>
        </div>

        <div className="answer-options">
          {currentQuestion?.question_type === 'multiple' && (
            <div className="multi-select-instructions">
              Select all that apply (multiple answers possible)
            </div>
          )}
          {currentQuestion?.options?.map(option => {
            const isMultiple = currentQuestion?.question_type === 'multiple';
            const isSelected = isMultiple 
              ? Array.isArray(currentAnswer) && currentAnswer.includes(option.key)
              : currentAnswer === option.key;

            const handleChange = () => {
              if (isMultiple) {
                const currentSelected = Array.isArray(currentAnswer) ? currentAnswer : [];
                if (currentSelected.includes(option.key)) {
                  // Remove option
                  const newSelected = currentSelected.filter(opt => opt !== option.key);
                  handleAnswerSelect(currentQuestion.id, newSelected);
                } else {
                  // Add option
                  const newSelected = [...currentSelected, option.key];
                  handleAnswerSelect(currentQuestion.id, newSelected);
                }
              } else {
                handleAnswerSelect(currentQuestion.id, option.key);
              }
            };

            return (
              <label key={option.key} className={`answer-option ${isSelected ? 'selected' : ''}`}>
                <input
                  type={isMultiple ? "checkbox" : "radio"}
                  name={`question-${currentQuestion.id}`}
                  value={option.key}
                  checked={isSelected}
                  onChange={handleChange}
                />
                <span className="option-letter">{option.key}</span>
                <span className="option-text">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code: ({className, children, ...props}) => {
                        const match = /language-(\w+)/.exec(className || '');
                        const isInline = !match;
                        return isInline ? (
                          <code className="inline-code" {...props}>{children}</code>
                        ) : (
                          <code className={className} {...props}>{children}</code>
                        );
                      },
                      pre: ({children}) => <pre className="code-block">{children}</pre>,
                    }}
                  >
                    {option.text}
                  </ReactMarkdown>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="question-navigation">
        <div className="nav-buttons">
          <button 
            onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
            disabled={currentQuestionIndex === 0}
            className="btn btn-secondary"
          >
            Previous
          </button>
          
          <button 
            onClick={() => setCurrentQuestionIndex(Math.min(session.questions.length - 1, currentQuestionIndex + 1))}
            disabled={currentQuestionIndex === session.questions.length - 1}
            className="btn btn-secondary"
          >
            Next
          </button>
        </div>

        <div className="submit-section">
          <div className="answered-count">
            {answers.length} of {session.questions.length} questions answered
          </div>
          <button 
            onClick={submitRound}
            disabled={answers.length !== session.questions.length || loading}
            className="btn btn-primary"
          >
            {loading ? 'Submitting...' : 'Submit Round'}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
};

export default Review;
