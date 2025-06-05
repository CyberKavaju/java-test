import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { QuestionPerformance, PerformanceTrend, UserStats, TestSession, TopicStats } from '../types';

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
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'topics'>('overview');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [report, history] = await Promise.all([
          apiService.getReport(),
          apiService.getUserHistory()
        ]);
        setReportData(report);
        setUserHistory(history);
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

  if (loading) {
    return <div className="loading">Loading report...</div>;
  }

  if (!reportData || !userHistory) {
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
                    {new Date(session.completed_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="performance-tab">
          <div className="performance-summary">
            <h3>Question Performance Summary</h3>
            <div className="performance-legend">
              <span><span style={{ color: getPerformanceColor('green') }}>🟢 Green:</span> 80%+ success rate</span>
              <span><span style={{ color: getPerformanceColor('yellow') }}>🟡 Yellow:</span> 50-79% success rate</span>
              <span><span style={{ color: getPerformanceColor('red') }}>🔴 Red:</span> &lt;50% success rate</span>
            </div>
          </div>

          <div className="question-performance-list">
            {reportData.questionPerformance.map((question) => (
              <div key={question.id} className="performance-item">
                <div className="performance-header">
                  <span className="performance-indicator">
                    {getPerformanceEmoji(question.performance_color)}
                  </span>
                  <span className="topic-badge">{question.topic}</span>
                  <span className="success-rate">{question.success_rate}%</span>
                </div>
                <div className="performance-stats">
                  <span>✅ {question.correct_count}</span>
                  <span>❌ {question.wrong_count}</span>
                  <span>Total: {question.total_attempts}</span>
                </div>
                <div className="question-preview">
                  {question.question_text.substring(0, 100)}...
                </div>
              </div>
            ))}
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
        </div>
      )}
    </div>
  );
}
