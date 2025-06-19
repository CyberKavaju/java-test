import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { apiService } from '../services/api';
import type { Tutorial as TutorialType, TutorialContent } from '../types';
import './Tutorial.css';

interface TutorialProps {}

const Tutorial: React.FC<TutorialProps> = () => {
  const [tutorials, setTutorials] = useState<TutorialType[]>([]);
  const [selectedTutorial, setSelectedTutorial] = useState<TutorialContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const selectedSlug = searchParams.get('tutorial');

  useEffect(() => {
    loadTutorials();
  }, []);

  useEffect(() => {
    if (selectedSlug && tutorials.length > 0) {
      loadTutorialContent(selectedSlug);
    } else if (!selectedSlug) {
      setSelectedTutorial(null);
    }
  }, [selectedSlug, tutorials]);

  const loadTutorials = async () => {
    try {
      setLoading(true);
      const response = await apiService.getTutorials();
      setTutorials(response.tutorials);
    } catch (err) {
      setError('Failed to load tutorials');
      console.error('Error loading tutorials:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTutorialContent = async (slug: string) => {
    try {
      setLoading(true);
      const response = await apiService.getTutorial(slug);
      setSelectedTutorial(response.tutorial);
    } catch (err) {
      setError(`Failed to load tutorial: ${slug}`);
      console.error('Error loading tutorial content:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectTutorial = (slug: string) => {
    setSearchParams({ tutorial: slug });
  };

  const goBack = () => {
    setSearchParams({});
  };

  const startReview = () => {
    if (selectedSlug) {
      // Navigate to review page with the current tutorial topic
      window.open(`/review?topic=${selectedSlug}`, '_blank');
    }
  };

  const getFilteredTutorials = () => {
    if (!searchQuery.trim()) {
      return tutorials;
    }
    
    return tutorials.filter(tutorial =>
      tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutorial.id.toString().includes(searchQuery)
    );
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const getNextTutorial = () => {
    if (!selectedSlug) return null;
    const currentIndex = tutorials.findIndex(t => t.slug === selectedSlug);
    return currentIndex < tutorials.length - 1 ? tutorials[currentIndex + 1] : null;
  };

  const getPreviousTutorial = () => {
    if (!selectedSlug) return null;
    const currentIndex = tutorials.findIndex(t => t.slug === selectedSlug);
    return currentIndex > 0 ? tutorials[currentIndex - 1] : null;
  };

  if (loading && tutorials.length === 0) {
    return (
      <div className="tutorial-container">
        <div className="loading">Loading tutorials...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tutorial-container">
        <div className="error">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={goBack} className="btn btn-secondary">
            Back to Tutorial List
          </button>
        </div>
      </div>
    );
  }

  if (selectedTutorial) {
    const nextTutorial = getNextTutorial();
    const prevTutorial = getPreviousTutorial();

    return (
      <div className="tutorial-container">
        <div className="tutorial-header tutorial-header-single">
          <div className="header-left">
            <button onClick={goBack} className="btn btn-secondary back-btn">
              ← Back to Tutorials
            </button>
          </div>
          <div className="header-center">
            <h1>{selectedTutorial.title}</h1>
          </div>
          <div className="header-right">
            {/* Empty div for flex balance */}
          </div>
        </div>

        <div className="tutorial-content">
          <div className="markdown-content">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                // Custom styling for code blocks
                code: ({className, children, ...props}) => {
                  const match = /language-(\w+)/.exec(className || '');
                  const isInline = !match;
                  return isInline ? (
                    <code className="inline-code" {...props}>
                      {children}
                    </code>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
                // Custom styling for pre blocks (code blocks)
                pre: ({children}) => (
                  <pre className="code-block">{children}</pre>
                ),
                // Custom styling for tables
                table: ({children}) => (
                  <table className="markdown-table">{children}</table>
                ),
              }}
            >
              {selectedTutorial.content}
            </ReactMarkdown>
          </div>
        </div>

        <div className="tutorial-navigation">
          <div className="nav-buttons">
            {prevTutorial && (
              <button 
                onClick={() => selectTutorial(prevTutorial.slug)}
                className="btn btn-secondary nav-btn"
              >
                ← Previous: {prevTutorial.title}
              </button>
            )}
            {nextTutorial && (
              <button 
                onClick={() => selectTutorial(nextTutorial.slug)}
                className="btn btn-primary nav-btn"
              >
                Next: {nextTutorial.title} →
              </button>
            )}
          </div>
          
          <div className="review-section">
            <button onClick={startReview} className="btn btn-primary review-btn">
              🎯 Review This Topic
            </button>
          </div>
        </div>

        {loading && <div className="loading-overlay">Loading...</div>}
      </div>
    );
  }

  return (
    <div className="tutorial-container">
      <div className="tutorial-header">
        <h1>Java Tutorial</h1>
        <p>Learn Java programming step by step with our comprehensive tutorial series.</p>
        
        <div className="search-container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search tutorials by title or number..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
            {searchQuery && (
              <button onClick={clearSearch} className="clear-search-btn">
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="tutorial-list">
        <div className="tutorial-grid">
          {getFilteredTutorials().map((tutorial) => (
            <div 
              key={tutorial.id} 
              className="tutorial-card"
              onClick={() => selectTutorial(tutorial.slug)}
            >
              <div className="tutorial-number">{tutorial.id}</div>
              <h3>{tutorial.title}</h3>
              <p>Click to read this tutorial section</p>
              <div className="tutorial-link">
                Read Tutorial →
              </div>
            </div>
          ))}
        </div>
        
        {getFilteredTutorials().length === 0 && searchQuery && (
          <div className="no-results">
            <p>No tutorials found matching "{searchQuery}"</p>
            <button onClick={clearSearch} className="btn btn-secondary">
              Clear Search
            </button>
          </div>
        )}
      </div>

      <div className="tutorial-footer">
        <p>
          <strong>Tutorial Progress:</strong> Follow these tutorials in sequence for the best learning experience.
          Each tutorial builds upon the concepts from previous sections.
        </p>
        <p>
          Use these tutorial links as references when reviewing your test results and recommendations.
        </p>
      </div>
    </div>
  );
};

export default Tutorial;
