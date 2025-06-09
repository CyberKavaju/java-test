import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { QuestionPerformance, PerformanceTrend, UserStats, TestSession, TopicStats, DetailedQuestionPerformance } from '../types';

export default function Report() {
  const [reportData, setReportData] = useState<{
    questionPerformance: QuestionPerformance[];
    performanceTrend: PerformanceTrend[];
  } | null>(null);
  
  const [userHistory, setUserHistory] = useState<{
    userStats: UserStats;
    testSessions: TestSession[];
    topicStats: TopicStats[];
  } | null>(null);

  const [detailedQuestions, setDetailedQuestions] = useState<{
    questionDetails: DetailedQuestionPerformance[];
  } | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'topics'>('overview');
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [report, history, detailed] = await Promise.all([
          apiService.getReport(),
          apiService.getUserHistory(),
          apiService.getDetailedQuestionPerformance()
        ]);
        setReportData(report);
        setUserHistory(history);
        setDetailedQuestions(detailed);
      } catch (error) {
        console.error('Failed to fetch report data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getPerformanceColor = (color: string) => {
    switch (color) {
      case 'green': return '#10B981';
      case 'yellow': return '#F59E0B';
      case 'red': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getPerformanceEmoji = (color: string) => {
    switch (color) {
      case 'green': return '🟢';
      case 'yellow': return '🟡';
      case 'red': return '🔴';
      default: return '⚪';
    }
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

  if (loading) {
    return <div className="loading">Loading report...</div>;
  }

  if (!reportData || !userHistory || !detailedQuestions) {
    return <div className="error">Failed to load report data</div>;
  }

  return (
    <div className="report-container">
      <div className="report-header">
        <h2>Performance Report</h2>
        <div className="tab-navigation">
          <button
            className={activeTab === 'overview' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={activeTab === 'performance' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('performance')}
          >
            Question Performance
          </button>
          <button
            className={activeTab === 'topics' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('topics')}
          >
            Topics Analysis
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="overview-tab">
          <div className="recommendations">
            <h3>Study Recommendations</h3>
            <div className="recommendations-list">
              {userHistory.topicStats
                .filter(topic => topic.success_rate < 70)
                .sort((a, b) => a.success_rate - b.success_rate)
                .map((topic) => (
                  <div key={topic.topic} className="recommendation-item">
                    <span className="priority">🎯</span>
                    <div className="recommendation-content">
                      <strong>Focus on: {topic.topic}</strong>
                      <p>Current success rate: {topic.success_rate}%. Consider reviewing this topic.</p>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Attempts</h3>
              <div className="stat-value">{userHistory.userStats.total_attempts}</div>
            </div>
            <div className="stat-card">
              <h3>Correct Answers</h3>
              <div className="stat-value green">{userHistory.userStats.correct_answers}</div>
            </div>
            <div className="stat-card">
              <h3>Success Rate</h3>
              <div className="stat-value">
                {userHistory.userStats.total_attempts > 0 
                  ? Math.round((userHistory.userStats.correct_answers / userHistory.userStats.total_attempts) * 100)
                  : 0}%
              </div>
            </div>
            <div className="stat-card">
              <h3>Questions Attempted</h3>
              <div className="stat-value">{userHistory.userStats.unique_questions_attempted}</div>
            </div>
          </div>

          <div className="recent-tests">
            <h3>Recent Test Sessions</h3>
            <div className="test-sessions">
              {userHistory.testSessions.map((session) => (
                <div key={session.id} className="session-card">
                  <div className="session-score">
                    {session.score}/{session.total_questions}
                  </div>
                  <div className="session-percentage">
                    {Math.round((session.score / session.total_questions) * 100)}%
                  </div>
                  <div className="session-time">
                    {Math.round(session.time_taken / 60)} min
                  </div>
                  <div className="session-date">
                    {new Date(session.completed_at).toLocaleDateString()} {new Date(session.completed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="performance-tab">
          <h3>Detailed Question Review</h3>
          <div className="performance-summary">
            <div className="performance-legend">
              <span><span style={{ color: getPerformanceColor('green') }}>🟢 Green:</span> 80%+ success rate</span>
              <span><span style={{ color: getPerformanceColor('yellow') }}>🟡 Yellow:</span> 50-79% success rate</span>
              <span><span style={{ color: getPerformanceColor('red') }}>🔴 Red:</span> &lt;50% success rate</span>
            </div>
          </div>
          <div className="detailed-questions-list">
            {detailedQuestions.questionDetails.map((question) => {
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
                        <p>{question.question_text}</p>
                      </div>

                      <div className="answer-options">
                        <h4>Answer Options:</h4>
                        <div className="options-grid">
                          <div className={`option ${question.correct_answer === 'A' ? 'correct' : ''}`}>
                            <span className="option-label">A)</span>
                            <span className="option-text">{question.option_a}</span>
                            {question.correct_answer === 'A' && <span className="correct-indicator">✓ Correct</span>}
                          </div>
                          <div className={`option ${question.correct_answer === 'B' ? 'correct' : ''}`}>
                            <span className="option-label">B)</span>
                            <span className="option-text">{question.option_b}</span>
                            {question.correct_answer === 'B' && <span className="correct-indicator">✓ Correct</span>}
                          </div>
                          <div className={`option ${question.correct_answer === 'C' ? 'correct' : ''}`}>
                            <span className="option-label">C)</span>
                            <span className="option-text">{question.option_c}</span>
                            {question.correct_answer === 'C' && <span className="correct-indicator">✓ Correct</span>}
                          </div>
                          {question.option_d && (
                            <div className={`option ${question.correct_answer === 'D' ? 'correct' : ''}`}>
                              <span className="option-label">D)</span>
                              <span className="option-text">{question.option_d}</span>
                              {question.correct_answer === 'D' && <span className="correct-indicator">✓ Correct</span>}
                            </div>
                          )}
                          {question.option_e && (
                            <div className={`option ${question.correct_answer === 'E' ? 'correct' : ''}`}>
                              <span className="option-label">E)</span>
                              <span className="option-text">{question.option_e}</span>
                              {question.correct_answer === 'E' && <span className="correct-indicator">✓ Correct</span>}
                            </div>
                          )}
                        </div>
                      </div>

                      {question.explanation && (
                        <div className="explanation">
                          <h4>Explanation:</h4>
                          <p>{question.explanation}</p>
                        </div>
                      )}

                      {question.user_attempts.length > 0 && (
                        <div className="user-attempts">
                          <h4>Your Attempts:</h4>
                          <div className="attempts-list">
                            {question.user_attempts.map((attempt, index) => (
                              <div key={index} className={`attempt-item ${attempt.is_correct ? 'correct' : 'incorrect'}`}>
                                <div className="attempt-details">
                                  <span className="attempt-answer">
                                    You selected: <strong>{attempt.selected_answer}</strong>
                                  </span>
                                  <span className={`attempt-result ${attempt.is_correct ? 'correct' : 'incorrect'}`}>
                                    {attempt.is_correct ? '✅ Correct' : '❌ Incorrect'}
                                  </span>
                                </div>
                                <div className="attempt-time">
                                  {new Date(attempt.attempt_timestamp).toLocaleDateString()} {new Date(attempt.attempt_timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'topics' && (
        <div className="topics-tab">
          <h3>Performance by Topic</h3>
          <div className="topics-analysis">
            {userHistory.topicStats.map((topic) => (
              <div key={topic.topic} className="topic-item">
                <div className="topic-header">
                  <h4>{topic.topic}</h4>
                  <div className={`topic-rate ${topic.success_rate >= 80 ? 'green' : topic.success_rate >= 50 ? 'yellow' : 'red'}`}>
                    {topic.success_rate}%
                  </div>
                </div>
                <div className="topic-stats">
                  <div className="topic-stat">
                    <span>Attempts: {topic.total_attempts}</span>
                  </div>
                  <div className="topic-stat">
                    <span>Correct: {topic.correct_answers}</span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${topic.success_rate}%`,
                      backgroundColor: getPerformanceColor(
                        topic.success_rate >= 80 ? 'green' : 
                        topic.success_rate >= 50 ? 'yellow' : 'red'
                      )
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
