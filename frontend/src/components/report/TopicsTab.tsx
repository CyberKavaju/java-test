import React, { useState } from 'react';
import type { TopicStats } from '../../types';
import { getJavaDocumentationLink, getTutorialSlug, getTutorialDisplayName, getPerformanceColor, getPerformanceEmoji } from './utils';
import type { ConsolidatedTopic } from './types';

interface TopicsTabProps {
  topicStats: TopicStats[];
  documentationLinks: { [key: string]: string };
}

const TopicsTab: React.FC<TopicsTabProps> = ({ topicStats, documentationLinks }) => {
  const [expandedRecommendations, setExpandedRecommendations] = useState<Set<string>>(new Set());
  const [attemptFilter, setAttemptFilter] = useState<'all' | 'more-than-1' | 'more-than-5' | 'more-than-10'>('all');

  const toggleRecommendationExpand = (topic: string) => {
    setExpandedRecommendations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(topic)) {
        newSet.delete(topic);
      } else {
        newSet.add(topic);
      }
      return newSet;
    });
  };

  const getFilteredTopics = () => {
    let filteredTopics = topicStats;
    
    // Filter by attempt count
    if (attemptFilter === 'more-than-1') {
      filteredTopics = filteredTopics.filter(topic => topic.total_attempts > 1);
    } else if (attemptFilter === 'more-than-5') {
      filteredTopics = filteredTopics.filter(topic => topic.total_attempts > 5);
    } else if (attemptFilter === 'more-than-10') {
      filteredTopics = filteredTopics.filter(topic => topic.total_attempts > 10);
    }
    
    return filteredTopics;
  };

  const renderRecommendations = () => {
    const filteredTopics = getFilteredTopics();
    const lowPerformanceTopics = filteredTopics.filter(topic => topic.success_rate < 70);
    
    // Group topics by their tutorial slug
    const tutorialGroups: { [key: string]: any[] } = {};
    const ungroupedTopics: any[] = [];
    
    lowPerformanceTopics.forEach(topic => {
      const tutorialSlug = getTutorialSlug(topic.topic);
      if (tutorialSlug) {
        if (!tutorialGroups[tutorialSlug]) {
          tutorialGroups[tutorialSlug] = [];
        }
        tutorialGroups[tutorialSlug].push(topic);
      } else {
        ungroupedTopics.push(topic);
      }
    });
    
    const consolidatedTopics: ConsolidatedTopic[] = [];
    
    // Create consolidated recommendations for topics that share the same tutorial
    Object.entries(tutorialGroups).forEach(([tutorialSlug, topics]) => {
      if (topics.length > 1) {
        // Multiple topics share the same tutorial - consolidate them
        const avgSuccessRate = Math.round(topics.reduce((sum, topic) => sum + topic.success_rate, 0) / topics.length);
        const totalAttempts = topics.reduce((sum, topic) => sum + topic.total_attempts, 0);
        const totalCorrect = topics.reduce((sum, topic) => sum + topic.correct_answers, 0);
        
        // Use tutorial display name
        const tutorialName = getTutorialDisplayName(tutorialSlug);
        
        consolidatedTopics.push({
          topic: tutorialName,
          success_rate: avgSuccessRate,
          total_attempts: totalAttempts,
          correct_answers: totalCorrect,
          isConsolidated: true,
          relatedTopics: topics.map(t => t.topic),
          tutorialSlug: tutorialSlug
        });
      } else {
        // Single topic for this tutorial
        consolidatedTopics.push({
          ...topics[0],
          tutorialSlug: tutorialSlug
        });
      }
    });
    
    // Add ungrouped topics (those without tutorial mappings)
    consolidatedTopics.push(...ungroupedTopics);
    
    return consolidatedTopics
      .sort((a, b) => a.success_rate - b.success_rate)
      .map((topic) => {
        const isExpanded = expandedRecommendations.has(topic.topic);
        const getSuccessRateClass = (rate: number) => {
          if (rate < 30) return 'critical';
          if (rate < 50) return 'warning';
          return 'improvement';
        };
        const successRateClass = getSuccessRateClass(topic.success_rate);
        
        return (
          <div key={topic.topic} className={`recommendation-item ${isExpanded ? 'expanded' : 'collapsed'} ${successRateClass}`}>
            <div 
              className="recommendation-header"
              onClick={() => toggleRecommendationExpand(topic.topic)}
            >
              <span className="priority">🎯</span>
              <span className="recommendation-title">Focus on: {topic.topic}</span>
              <span className={`success-rate-badge ${successRateClass}`}>
                {topic.success_rate}%
              </span>
              <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
                {isExpanded ? '▼' : '▶'}
              </span>
            </div>
            {isExpanded && (
              <div className="recommendation-content">
                {topic.isConsolidated ? (
                  <>
                    <p>{topic.topic} covers multiple related concepts. Current average success rate: {topic.success_rate}%.</p>
                    <div className="consolidated-topics">
                      <h5>Related topics that need improvement:</h5>
                      <div className="topic-chips">
                        {topic.relatedTopics?.map((relatedTopic, idx) => (
                          <span key={idx} className="topic-chip">{relatedTopic}</span>
                        ))}
                      </div>
                    </div>
                    <div className="recommendation-details">
                      <span>Total Attempts: {topic.total_attempts}</span>
                      <span>Total Correct: {topic.correct_answers}</span>
                      <span>Consolidated recommendation</span>
                    </div>
                    <div className="recommendation-link">
                      <a 
                        href={`/docs/tutorial/${topic.tutorialSlug}.md`}
                        className="tutorial-link"
                      >
                        📖 Study Complete {topic.topic} Tutorial
                      </a>
                    </div>
                  </>
                ) : (
                  <>
                    <p>Current success rate: {topic.success_rate}%. Consider reviewing this topic.</p>
                    <div className="recommendation-details">
                      <span>Attempts: {topic.total_attempts}</span>
                      <span>Correct: {topic.correct_answers}</span>
                      <span>Needs improvement</span>
                    </div>
                    <div className="recommendation-link">
                      <a 
                        href={getJavaDocumentationLink(topic.topic, documentationLinks)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="java-doc-link"
                      >
                        📚 Study {topic.topic} in Java Documentation
                      </a>
                      {getTutorialSlug(topic.topic) && (
                        <a 
                          href={`/tutorial?tutorial=${getTutorialSlug(topic.topic)}`}
                          className="tutorial-link"
                        >
                          📖 Study {topic.topic} Tutorial
                        </a>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        );
      });
  };

  return (
    <div className="topics-tab">
      <div className="recommendations">
        <h3>Study Recommendations</h3>
        
        {/* Attempt Count Filter */}
        <div className="filter-section">
          <div className="filter-group">
            <label className="filter-label">Filter by Attempts:</label>
            <div className="attempt-filter-buttons">
              <button 
                className={`filter-btn ${attemptFilter === 'all' ? 'active' : ''}`}
                onClick={() => setAttemptFilter('all')}
              >
                All Topics ({topicStats.length})
              </button>
              <button 
                className={`filter-btn ${attemptFilter === 'more-than-1' ? 'active' : ''}`}
                onClick={() => setAttemptFilter('more-than-1')}
              >
                More than 1 attempt ({topicStats.filter(t => t.total_attempts > 1).length})
              </button>
              <button 
                className={`filter-btn ${attemptFilter === 'more-than-5' ? 'active' : ''}`}
                onClick={() => setAttemptFilter('more-than-5')}
              >
                More than 5 attempts ({topicStats.filter(t => t.total_attempts > 5).length})
              </button>
              <button 
                className={`filter-btn ${attemptFilter === 'more-than-10' ? 'active' : ''}`}
                onClick={() => setAttemptFilter('more-than-10')}
              >
                More than 10 attempts ({topicStats.filter(t => t.total_attempts > 10).length})
              </button>
            </div>
          </div>
        </div>
        
        <div className="recommendations-list">
          {topicStats.length === 0 ? (
            <div>Loading recommendations...</div>
          ) : (
            renderRecommendations()
          )}
        </div>
      </div>
      
      <div className="topics-section">
        <h3>Performance by Topic</h3>
        <p className="section-description">Track your progress across different Java concepts and identify areas for improvement.</p>
        <div className="topics-analysis">
          {getFilteredTopics().map((topic) => {
            const performanceLevel = topic.success_rate >= 80 ? 'green' : topic.success_rate >= 50 ? 'yellow' : 'red';
            const performanceLabel = topic.success_rate >= 80 ? 'Excellent' : topic.success_rate >= 50 ? 'Good' : 'Needs Work';
            const performanceEmoji = getPerformanceEmoji(performanceLevel);
            
            return (
              <div key={topic.topic} className="topic-item">
                <div className="topic-header">
                  <h4>{topic.topic}</h4>
                  <div className="performance-label">
                    <span className={`status-badge ${performanceLevel}`}>{performanceLabel}</span>
                  </div>
                </div>
                <div className="topic-stats">
                  <div className="topic-stat">
                    <span className="stat-label">Attempts:</span>
                    <span className="stat-value">{topic.total_attempts}</span>
                  </div>
                  <div className="topic-stat">
                    <span className="stat-label">Correct:</span>
                    <span className="stat-value">{topic.correct_answers}</span>
                  </div>
                </div>
                <div className={`topic-rate ${performanceLevel}`}>
                  <span className="performance-emoji">{performanceEmoji}</span>
                  {topic.success_rate}%
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${topic.success_rate}%`,
                      backgroundColor: getPerformanceColor(performanceLevel)
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TopicsTab;
