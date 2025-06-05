import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { apiService } from './services/api';
import Quiz from './components/Quiz';
import TestResults from './components/TestResults';
import Report from './components/Report';
import './App.css';

function Home() {
  const { state, dispatch } = useApp();
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState<boolean | null>(null);

  useEffect(() => {
    // Check server status on component mount
    const checkServer = async () => {
      const isHealthy = await apiService.healthCheck();
      setServerStatus(isHealthy);
    };
    checkServer();
  }, []);

  const startNewTest = async () => {
    try {
      setLoading(true);
      const questions = await apiService.getRandomQuestions(state.userId, 25);
      dispatch({ type: 'START_TEST', payload: { questions } });
    } catch (error) {
      console.error('Failed to start test:', error);
      alert('Failed to load questions. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  if (serverStatus === false) {
    return (
      <div className="error-container">
        <h2>⚠️ Server Connection Error</h2>
        <p>Unable to connect to the backend server. Please ensure the server is running on port 3001.</p>
        <button onClick={() => window.location.reload()}>Retry Connection</button>
      </div>
    );
  }

  if (serverStatus === null) {
    return <div className="loading">Checking server connection...</div>;
  }

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Java SE 8 Programmer I (1Z0-808)</h1>
        <h2>Mock Test Application</h2>
        <p>Practice for the Oracle Certified Associate Java SE 8 Programmer I exam</p>
      </div>

      <div className="test-info">
        <div className="info-card">
          <h3>📝 Test Format</h3>
          <ul>
            <li>25 multiple choice questions</li>
            <li>50 minutes time limit</li>
            <li>Random question selection</li>
            <li>Instant results and explanations</li>
          </ul>
        </div>

        <div className="info-card">
          <h3>📊 Features</h3>
          <ul>
            <li>Performance tracking</li>
            <li>Topic-wise analysis</li>
            <li>Color-coded progress indicators</li>
            <li>Detailed explanations</li>
          </ul>
        </div>
      </div>

      <div className="action-buttons">
        <button 
          className="btn btn-primary btn-large"
          onClick={startNewTest}
          disabled={loading}
        >
          {loading ? 'Loading Questions...' : 'Start New Test'}
        </button>
        
        <a href="/report" className="btn btn-secondary">
          View Performance Report
        </a>
      </div>
    </div>
  );
}

function TestPage() {
  const { state, dispatch } = useApp();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const handleSubmit = async () => {
      if (!state.currentTest.isActive && 
          state.currentTest.answers.length > 0 && 
          !state.lastTestResults) {
        
        setSubmitting(true);
        try {
          const timeSpent = state.currentTest.startTime 
            ? Math.floor((Date.now() - state.currentTest.startTime) / 1000)
            : 0;
            
          const result = await apiService.submitAnswers(
            state.userId,
            state.currentTest.answers,
            timeSpent
          );
          
          dispatch({ type: 'SET_TEST_RESULTS', payload: { results: result.results } });
        } catch (error) {
          console.error('Failed to submit test:', error);
          alert('Failed to submit test. Please try again.');
        } finally {
          setSubmitting(false);
        }
      }
    };

    handleSubmit();
  }, [state.currentTest.isActive, state.currentTest.answers, state.currentTest.startTime, state.lastTestResults, state.userId, dispatch]);

  const handleRetakeTest = () => {
    dispatch({ type: 'RESET_TEST' });
  };

  const handleViewReport = () => {
    window.location.href = '/report';
  };

  if (submitting) {
    return <div className="loading">Submitting your test...</div>;
  }

  if (state.lastTestResults) {
    const score = state.lastTestResults.filter(r => r.isCorrect).length;
    const total = state.lastTestResults.length;
    const percentage = Math.round((score / total) * 100);

    return (
      <TestResults
        results={state.lastTestResults}
        score={score}
        total={total}
        percentage={percentage}
        onRetakeTest={handleRetakeTest}
        onViewReport={handleViewReport}
      />
    );
  }

  if (state.currentTest.isActive && state.currentTest.questions.length > 0) {
    return <Quiz />;
  }

  return <Navigate to="/" replace />;
}

function AppRoutes() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-brand">
            <a href="/">Java Test App</a>
          </div>
          <div className="nav-links">
            <a href="/">Home</a>
            <a href="/report">Report</a>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/report" element={<Report />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

export default App;
