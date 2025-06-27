import React, { useState } from 'react';
import type { ReviewReport } from './types';

interface ReviewTabProps {
  reviewReportData: ReviewReport | null;
  reviewReportError: string | null;
}

const ReviewTab: React.FC<ReviewTabProps> = ({ reviewReportData, reviewReportError }) => {
  const [topicFilter, setTopicFilter] = useState<'all' | 'mastered' | 'good' | 'needsWork' | 'struggling'>('all');

  if (reviewReportError) {
    return (
      <div className="review-tab">
        <div className="error-message">
          <div className="text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-lg font-semibold mb-2">Review Report Not Available</h3>
            <p className="text-gray-600">{reviewReportError}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!reviewReportData) {
    return (
      <div className="review-tab">
        <div className="loading">Loading review report...</div>
      </div>
    );
  }

  return (
    <div className="review-tab">
      <div className="review-content">
        {/* Summary Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Sessions</h3>
            <div className="stat-value">{reviewReportData.totalSessions}</div>
          </div>
          <div className="stat-card">
            <h3>Topics Reviewed</h3>
            <div className="stat-value">{reviewReportData.topics.length}</div>
          </div>
          <div className="stat-card">
            <h3>Average Study Time</h3>
            <div className="stat-value">{reviewReportData.timeAnalysis.averageSessionDuration} min</div>
          </div>
          <div className="stat-card">
            <h3>Sessions This Week</h3>
            <div className="stat-value green">{reviewReportData.timeAnalysis.sessionsLast7Days}</div>
          </div>
        </div>

        {/* Topics Performance */}
        <div className="section">
          <div className="section-header">
            <h3>Topics Performance</h3>
            <div className="topic-filter-buttons">
              <button
                className={`filter-btn ${topicFilter === 'all' ? 'active' : ''}`}
                onClick={() => setTopicFilter('all')}
              >
                All ({reviewReportData.topics.length})
              </button>
              <button
                className={`filter-btn mastered ${topicFilter === 'mastered' ? 'active' : ''}`}
                onClick={() => setTopicFilter('mastered')}
              >
                🏆 Mastered ({reviewReportData.difficultyBreakdown.mastered})
              </button>
              <button
                className={`filter-btn good ${topicFilter === 'good' ? 'active' : ''}`}
                onClick={() => setTopicFilter('good')}
              >
                👍 Good ({reviewReportData.difficultyBreakdown.good})
              </button>
              <button
                className={`filter-btn needs-work ${topicFilter === 'needsWork' ? 'active' : ''}`}
                onClick={() => setTopicFilter('needsWork')}
              >
                📖 Needs Work ({reviewReportData.difficultyBreakdown.needsWork})
              </button>
              <button
                className={`filter-btn struggling ${topicFilter === 'struggling' ? 'active' : ''}`}
                onClick={() => setTopicFilter('struggling')}
              >
                🔥 Struggling ({reviewReportData.difficultyBreakdown.struggling})
              </button>
            </div>
          </div>
          <div className="topics-list">
            {reviewReportData.topics
              .filter(topic => topicFilter === 'all' || topic.difficulty === topicFilter)
              .sort((a, b) => {
                // Define the order: 1. Struggling, 2. Needs Work, 3. Good, 4. Mastered
                const difficultyOrder = {
                  'struggling': 1,
                  'needsWork': 2,
                  'good': 3,
                  'mastered': 4
                };
                return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
              })
              .map((topic, index) => (
              <div key={index} className={`topic-row ${topic.difficulty}`}>
                <div className="topic-info">
                  <div className="topic-name">{topic.topic}</div>
                  <div className="topic-meta">
                    <span className="sessions">Sessions: {topic.totalSessions}</span>
                    <span className="score">Score: {topic.averageScore}%</span>
                    <span className="last-studied">Last: {new Date(topic.lastStudied).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className={`difficulty-badge ${topic.difficulty}`}>
                  {topic.difficulty === 'struggling' && '🔥 Struggling'}
                  {topic.difficulty === 'needsWork' && '📖 Needs Work'}
                  {topic.difficulty === 'good' && '👍 Good'}
                  {topic.difficulty === 'mastered' && '🏆 Mastered'}
                </div>
              </div>
            ))}
            {reviewReportData.topics.filter(topic => topicFilter === 'all' || topic.difficulty === topicFilter).length === 0 && (
              <div className="no-topics">
                <p>No topics found for the selected filter.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recommendations */}
        {reviewReportData.recommendations.length > 0 && (
          <div className="section">
            <h3>Recommendations</h3>
            <div className="recommendations">
              {reviewReportData.recommendations.map((rec, index) => (
                <div key={index} className={`recommendation ${rec.type}`}>
                  <p>{rec.message}</p>
                  {rec.topics && rec.topics.length > 0 && (
                    <div className="recommendation-topics">
                      <strong>Focus on:</strong> {rec.topics.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewTab;
