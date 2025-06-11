import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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

  const formatMarkdownToHtml = (markdown: string): string => {
    // Basic markdown to HTML conversion
    let html = markdown
      // Headers
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      // Bold and italic
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Code blocks
      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="code-block"><code class="language-$1">$2</code></pre>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      // Line breaks
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      // Horizontal rules
      .replace(/^---$/gm, '<hr>')
      // Lists (simple implementation)
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    // Wrap in paragraphs if not already wrapped
    if (!html.startsWith('<h1>') && !html.startsWith('<h2>') && !html.startsWith('<h3>')) {
      html = '<p>' + html + '</p>';
    }

    return html;
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
        <div className="tutorial-header">
          <button onClick={goBack} className="btn btn-secondary back-btn">
            ← Back to Tutorials
          </button>
          <h1>{selectedTutorial.title}</h1>
        </div>

        <div className="tutorial-content">
          <div 
            className="markdown-content"
            dangerouslySetInnerHTML={{ 
              __html: formatMarkdownToHtml(selectedTutorial.content) 
            }}
          />
        </div>

        <div className="tutorial-navigation">
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

        {loading && <div className="loading-overlay">Loading...</div>}
      </div>
    );
  }

  return (
    <div className="tutorial-container">
      <div className="tutorial-header">
        <h1>Java Tutorial</h1>
        <p>Learn Java programming step by step with our comprehensive tutorial series.</p>
      </div>

      <div className="tutorial-list">
        <div className="tutorial-grid">
          {tutorials.map((tutorial) => (
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
