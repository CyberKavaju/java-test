import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { TestSession } from '../types';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ImprovementGraphProps {
  testSessions: TestSession[];
}

export default function ImprovementGraph({ testSessions }: ImprovementGraphProps) {
  // Sort sessions by completion date (oldest first for chronological progression)
  const sortedSessions = [...testSessions].sort((a, b) => 
    new Date(a.completed_at).getTime() - new Date(b.completed_at).getTime()
  );

  // Prepare data for the chart
  const labels = sortedSessions.map((session, index) => {
    const date = new Date(session.completed_at);
    return `Test ${index + 1}\n${date.toLocaleDateString()}`;
  });

  const percentageData = sortedSessions.map(session => 
    Math.round((session.score / session.total_questions) * 100)
  );

  const scoreData = sortedSessions.map(session => session.score);

  const data = {
    labels,
    datasets: [
      {
        label: 'Success Rate (%)',
        data: percentageData,
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(16, 185, 129)',
        pointBorderColor: 'rgb(16, 185, 129)',
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: 'Raw Score',
        data: scoreData,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: false,
        tension: 0.4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: 'rgb(59, 130, 246)',
        pointRadius: 4,
        pointHoverRadius: 6,
        yAxisID: 'y1',
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        }
      },
      title: {
        display: true,
        text: 'Test Performance Improvement Over Time',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
        padding: 20,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: function(context: any) {
            const sessionIndex = context.dataIndex;
            const session = sortedSessions[sessionIndex];
            const label = context.dataset.label || '';
            
            if (label === 'Success Rate (%)') {
              return `${label}: ${context.parsed.y}% (${session.score}/${session.total_questions})`;
            } else {
              return `${label}: ${context.parsed.y}/${session.total_questions} questions`;
            }
          },
          afterLabel: function(context: any) {
            const sessionIndex = context.dataIndex;
            const session = sortedSessions[sessionIndex];
            const timeMinutes = Math.round(session.time_taken / 60);
            const date = new Date(session.completed_at);
            return [
              `Time: ${timeMinutes} minutes`,
              `Date: ${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
            ];
          }
        }
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Test Sessions',
          font: {
            weight: 'bold' as const,
          }
        },
        grid: {
          display: false,
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Success Rate (%)',
          font: {
            weight: 'bold' as const,
          }
        },
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Raw Score',
          font: {
            weight: 'bold' as const,
          }
        },
        min: 0,
        max: Math.max(...sortedSessions.map(s => s.total_questions)),
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  if (testSessions.length === 0) {
    return (
      <div className="improvement-graph-container">
        <div className="no-data-message">
          <h3>📈 Test Improvement Tracking</h3>
          <p>Complete more tests to see your improvement over time!</p>
        </div>
      </div>
    );
  }

  if (testSessions.length === 1) {
    return (
      <div className="improvement-graph-container">
        <div className="single-test-message">
          <h3>📈 Test Improvement Tracking</h3>
          <p>You have completed 1 test. Take more tests to see your improvement trend!</p>
          <div className="first-test-stats">
            <div className="stat">
              <span className="label">Score:</span>
              <span className="value">{testSessions[0].score}/{testSessions[0].total_questions}</span>
            </div>
            <div className="stat">
              <span className="label">Success Rate:</span>
              <span className="value">{Math.round((testSessions[0].score / testSessions[0].total_questions) * 100)}%</span>
            </div>
            <div className="stat">
              <span className="label">Time:</span>
              <span className="value">{Math.round(testSessions[0].time_taken / 60)} min</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="improvement-graph-container">
      <div className="chart-wrapper">
        <Line data={data} options={options} />
      </div>
      <div className="improvement-insights">
        <div className="insight-cards">
          <div className="insight-card">
            <div className="insight-label">Latest Score</div>
            <div className="insight-value">
              {Math.round((sortedSessions[sortedSessions.length - 1].score / sortedSessions[sortedSessions.length - 1].total_questions) * 100)}%
            </div>
          </div>
          <div className="insight-card">
            <div className="insight-label">Best Score</div>
            <div className="insight-value">
              {Math.max(...percentageData)}%
            </div>
          </div>
          <div className="insight-card">
            <div className="insight-label">Improvement</div>
            <div className="insight-value">
              {percentageData.length > 1 
                ? `${percentageData[percentageData.length - 1] - percentageData[0] >= 0 ? '+' : ''}${percentageData[percentageData.length - 1] - percentageData[0]}%`
                : '0%'
              }
            </div>
          </div>
          <div className="insight-card">
            <div className="insight-label">Total Tests</div>
            <div className="insight-value">
              {sortedSessions.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
