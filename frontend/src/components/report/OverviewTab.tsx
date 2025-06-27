import React from 'react';
import type { UserStats, TestSession } from '../../types';
import ImprovementGraph from '../ImprovementGraph';

interface OverviewTabProps {
  userStats: UserStats;
  testSessions: TestSession[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({ userStats, testSessions }) => {
  return (
    <div className="overview-tab">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Attempts</h3>
          <div className="stat-value">{userStats.total_attempts}</div>
        </div>
        <div className="stat-card">
          <h3>Correct Answers</h3>
          <div className="stat-value green">{userStats.correct_answers}</div>
        </div>
        <div className="stat-card">
          <h3>Success Rate</h3>
          <div className="stat-value">
            {userStats.total_attempts > 0 
              ? Math.round((userStats.correct_answers / userStats.total_attempts) * 100)
              : 0}%
          </div>
        </div>
        <div className="stat-card">
          <h3>Questions Attempted</h3>
          <div className="stat-value">{userStats.unique_questions_attempted}</div>
        </div>
      </div>

      <ImprovementGraph testSessions={testSessions} />

      <div className="recent-tests">
        <h3>Recent Test Sessions</h3>
        <div className="test-sessions">
          {testSessions.map((session) => (
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
  );
};

export default OverviewTab;
