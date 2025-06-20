import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { ReviewReport, ReviewTopicPerformance } from '../types';

interface ReviewReportProps {
  userId?: string;
}

export default function ReviewReport({ userId = 'default_user' }: ReviewReportProps) {
  const [reportData, setReportData] = useState<ReviewReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'topics'>('overview');

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.getReviewReport(userId);
        setReportData(response.report);
      } catch (err: any) {
        console.error('Error fetching review report:', err);
        if (err.response?.status === 404) {
          setError('No review sessions found. Complete some review sessions to see your report.');
        } else {
          setError('Failed to load review report. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [userId]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'mastered': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'needsWork': return 'text-yellow-600 bg-yellow-50';
      case 'struggling': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'mastered': return '🏆';
      case 'good': return '👍';
      case 'needsWork': return '📖';
      case 'struggling': return '🔥';
      default: return '❓';
    }
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'focus_on_struggling': return '🎯';
      case 'review_needs_work': return '📚';
      case 'maintain_mastery': return '✨';
      default: return '💡';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your review report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 text-5xl mb-4">📊</div>
        <h3 className="text-lg font-semibold text-red-800 mb-2">Report Not Available</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!reportData) {
    return null;
  }

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="text-3xl text-blue-600 mr-3">📚</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sessions</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.totalSessions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="text-3xl text-green-600 mr-3">🏆</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Mastered Topics</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.difficultyBreakdown.mastered}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="text-3xl text-orange-600 mr-3">⏱️</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Study Time</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.timeAnalysis.totalStudyTime}<span className="text-sm font-normal text-gray-600">m</span></p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="text-3xl text-purple-600 mr-3">🔥</div>
            <div>
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.timeAnalysis.sessionsLast7Days}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Difficulty Breakdown Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Topic Difficulty Breakdown</h3>
        <div className="space-y-3">
          {Object.entries(reportData.difficultyBreakdown).map(([difficulty, count]) => {
            const percentage = reportData.totalSessions > 0 ? (count / reportData.totalSessions) * 100 : 0;
            return (
              <div key={difficulty} className="flex items-center">
                <div className="w-20 text-sm text-gray-600 capitalize">{difficulty === 'needsWork' ? 'Needs Work' : difficulty}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-4 mx-3">
                  <div 
                    className={`h-4 rounded-full ${getDifficultyColor(difficulty).split(' ')[1]}`} 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="w-12 text-sm font-semibold text-gray-700">{count}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
        <div className="space-y-4">
          {reportData.recommendations.map((rec, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl">{getRecommendationIcon(rec.type)}</div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 mb-1">{rec.message}</p>
                <div className="flex flex-wrap gap-2">
                  {rec.topics.map((topic, topicIndex) => (
                    <span key={topicIndex} className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                      {topic.replace(/^\d+-/, '').replace(/-/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPerformanceTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Study Time Analysis</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{reportData.timeAnalysis.averageSessionDuration}m</p>
            <p className="text-sm text-gray-600">Avg Session</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{reportData.timeAnalysis.totalStudyTime}m</p>
            <p className="text-sm text-gray-600">Total Time</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{reportData.timeAnalysis.sessionsLast7Days}</p>
            <p className="text-sm text-gray-600">Last 7 Days</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{reportData.timeAnalysis.sessionsLast30Days}</p>
            <p className="text-sm text-gray-600">Last 30 Days</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTopicsTab = () => (
    <div className="space-y-4">
      {reportData.topics.map((topic, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getDifficultyIcon(topic.difficulty)}</span>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {topic.topic.replace(/^\d+-/, '').replace(/-/g, ' ')}
                </h3>
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(topic.difficulty)}`}>
                  {topic.difficulty === 'needsWork' ? 'Needs Work' : topic.difficulty}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-sm text-gray-900">{new Date(topic.completedAt).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Rounds to Complete</span>
                <span className="font-semibold text-gray-900">{topic.roundsToComplete}</span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Final Accuracy</span>
                <span className="font-semibold text-gray-900">{topic.finalAccuracy}%</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="report-header mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Review Session Report</h1>
        <p className="text-gray-600">Analyze your learning progress and identify areas for improvement</p>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation mb-6">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {[
            { key: 'overview', label: 'Overview', icon: '📊' },
            { key: 'performance', label: 'Performance', icon: '📈' },
            { key: 'topics', label: 'Topics Analysis', icon: '📚' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="report-container">
        <div className="main-content">
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'performance' && renderPerformanceTab()}
          {activeTab === 'topics' && renderTopicsTab()}
        </div>
      </div>
    </div>
  );
}
