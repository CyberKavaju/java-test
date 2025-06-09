import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import ImprovementGraph from './ImprovementGraph';
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
  const [expandedRecommendations, setExpandedRecommendations] = useState<Set<string>>(new Set());
  const [performanceFilter, setPerformanceFilter] = useState<'all' | 'green' | 'yellow' | 'red'>('all');

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

  const getJavaDocumentationLink = (topic: string) => {
    // Map topics to specific Java documentation URLs
    const topicMappings: { [key: string]: string } = {
      'Arrays': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/arrays.html',
      'Loops': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/for.html',
      'Conditionals': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/if.html',
      'Methods': 'https://docs.oracle.com/javase/tutorial/java/javaOO/methods.html',
      'Classes': 'https://docs.oracle.com/javase/tutorial/java/javaOO/classes.html',
      'Objects': 'https://docs.oracle.com/javase/tutorial/java/javaOO/objects.html',
      'Inheritance': 'https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html',
      'Polymorphism': 'https://docs.oracle.com/javase/tutorial/java/IandI/polymorphism.html',
      'Encapsulation': 'https://docs.oracle.com/javase/tutorial/java/javaOO/accesscontrol.html',
      'Abstraction': 'https://docs.oracle.com/javase/tutorial/java/IandI/abstract.html',
      'Interfaces': 'https://docs.oracle.com/javase/tutorial/java/IandI/createinterface.html',
      'Exception Handling': 'https://docs.oracle.com/javase/tutorial/essential/exceptions/',
      'Collections': 'https://docs.oracle.com/javase/tutorial/collections/',
      'Generics': 'https://docs.oracle.com/javase/tutorial/java/generics/',
      'Streams': 'https://docs.oracle.com/javase/8/docs/api/java/util/stream/package-summary.html',
      'Lambda Expressions': 'https://docs.oracle.com/javase/tutorial/java/javaOO/lambdaexpressions.html',
      'Threads': 'https://docs.oracle.com/javase/tutorial/essential/concurrency/',
      'File I/O': 'https://docs.oracle.com/javase/tutorial/essential/io/',
      'String Manipulation': 'https://docs.oracle.com/javase/tutorial/java/data/strings.html',
      'Data Types': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html',
      'Variables': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/variables.html',
      'Operators': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/operators.html',
      'Booleans': 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html',
      'Static': 'https://docs.oracle.com/javase/tutorial/java/javaOO/classvars.html',
      'Final': 'https://docs.oracle.com/javase/tutorial/java/IandI/final.html',
      'Packages': 'https://docs.oracle.com/javase/tutorial/java/package/',
      'Access Modifiers': 'https://docs.oracle.com/javase/tutorial/java/javaOO/accesscontrol.html'
    };

    // Try exact match first
    if (topicMappings[topic]) {
      return topicMappings[topic];
    }

    // Try partial matches for common patterns
    const lowerTopic = topic.toLowerCase();
    if (lowerTopic.includes('array')) return topicMappings['Arrays'];
    if (lowerTopic.includes('loop') || lowerTopic.includes('for') || lowerTopic.includes('while')) return topicMappings['Loops'];
    if (lowerTopic.includes('if') || lowerTopic.includes('condition')) return topicMappings['Conditionals'];
    if (lowerTopic.includes('method') || lowerTopic.includes('function')) return topicMappings['Methods'];
    if (lowerTopic.includes('class')) return topicMappings['Classes'];
    if (lowerTopic.includes('object')) return topicMappings['Objects'];
    if (lowerTopic.includes('inherit')) return topicMappings['Inheritance'];
    if (lowerTopic.includes('exception') || lowerTopic.includes('error')) return topicMappings['Exception Handling'];
    if (lowerTopic.includes('collection') || lowerTopic.includes('list') || lowerTopic.includes('set') || lowerTopic.includes('map')) return topicMappings['Collections'];
    if (lowerTopic.includes('string')) return topicMappings['String Manipulation'];
    if (lowerTopic.includes('thread') || lowerTopic.includes('concurrency')) return topicMappings['Threads'];
    if (lowerTopic.includes('file') || lowerTopic.includes('io')) return topicMappings['File I/O'];
    if (lowerTopic.includes('boolean')) return topicMappings['Booleans'];

    // Default to Java tutorial main page
    return 'https://docs.oracle.com/javase/tutorial/';
  };

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

          <ImprovementGraph testSessions={userHistory.testSessions} />

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
            })
            )}
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
                .map((topic) => {
                  const isExpanded = expandedRecommendations.has(topic.topic);
                  return (
                    <div key={topic.topic} className={`recommendation-item ${isExpanded ? 'expanded' : 'collapsed'}`}>
                      <div 
                        className="recommendation-header"
                        onClick={() => toggleRecommendationExpand(topic.topic)}
                      >
                        <span className="priority">🎯</span>
                        <span className="recommendation-title">Focus on: {topic.topic}</span>
                        <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
                          {isExpanded ? '▼' : '▶'}
                        </span>
                      </div>
                      {isExpanded && (
                        <div className="recommendation-content">
                          <p>Current success rate: {topic.success_rate}%. Consider reviewing this topic.</p>
                          <div className="recommendation-details">
                            <span>Attempts: {topic.total_attempts}</span>
                            <span>Correct: {topic.correct_answers}</span>
                            <span>Needs improvement</span>
                          </div>
                          <div className="recommendation-link">
                            <a 
                              href={getJavaDocumentationLink(topic.topic)} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="java-doc-link"
                            >
                              📚 Study {topic.topic} in Java Documentation
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
