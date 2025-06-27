import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import type { 
  QuestionPerformance, 
  PerformanceTrend, 
  UserStats, 
  TestSession, 
  TopicStats 
} from '../../types';
import type { DetailedQuestionPerformance, ReviewReport } from './types';

// Import tab components
import OverviewTab from './OverviewTab';
import PerformanceTab from './PerformanceTab';
import TopicsTab from './TopicsTab';
import ReviewTab from './ReviewTab';

const Report: React.FC = () => {
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

  const [reviewReportData, setReviewReportData] = useState<ReviewReport | null>(null);
  const [reviewReportError, setReviewReportError] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'topics' | 'review'>('overview');
  const [documentationLinks, setDocumentationLinks] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [report, history, detailed, recommendations] = await Promise.all([
          apiService.getReport(),
          apiService.getUserHistory(),
          apiService.getDetailedQuestionPerformance(),
          apiService.getRecommendations()
        ]);
        setReportData(report);
        setUserHistory(history);
        setDetailedQuestions(detailed);
        setDocumentationLinks(recommendations);
      } catch (error) {
        console.error('Error fetching report data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch review report when review tab is active
  useEffect(() => {
    if (activeTab === 'review' && !reviewReportData && !reviewReportError) {
      const fetchReviewReport = async () => {
        try {
          const reviewData = await apiService.getReviewReport();
          setReviewReportData(reviewData);
        } catch (error) {
          console.error('Error fetching review report:', error);
          if (error instanceof Error) {
            setReviewReportError(error.message);
          } else {
            setReviewReportError('Failed to load review report. Please try again later.');
          }
        }
      };

      fetchReviewReport();
    }
  }, [activeTab, reviewReportData, reviewReportError]);

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
          <button
            className={activeTab === 'review' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('review')}
          >
            Review Sessions
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <OverviewTab 
          userStats={userHistory.userStats}
          testSessions={userHistory.testSessions}
        />
      )}

      {activeTab === 'performance' && (
        <PerformanceTab 
          detailedQuestions={detailedQuestions}
        />
      )}

      {activeTab === 'topics' && (
        <TopicsTab 
          topicStats={userHistory.topicStats}
          documentationLinks={documentationLinks}
        />
      )}

      {activeTab === 'review' && (
        <ReviewTab 
          reviewReportData={reviewReportData}
          reviewReportError={reviewReportError}
        />
      )}
    </div>
  );
};

export default Report;
