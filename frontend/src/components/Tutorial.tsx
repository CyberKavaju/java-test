import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

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
      navigate(`/review?topic=${selectedSlug}`);
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

  // Define the OCA exam topic structure based on README.md
  const examTopics = [
    {
      title: "1. Java Basics",
      description: "Define scope of variables, Java class structure, main method, import packages, platform independence",
      tutorials: [
        { id: 1, slug: "main-characteristics-of-java" },
        { id: 2, slug: "simple-execution-of-java-program" },
        { id: 3, slug: "multiple-classes-in-one-java-file" },
        { id: 4, slug: "variable" },
        { id: 6, slug: "scanner-input-object" },
        { id: 49, slug: "packages" }
      ]
    },
    {
      title: "2. Working With Java Data Types",
      description: "Primitives vs objects, object lifecycle, wrapper classes, casting",
      tutorials: [
        { id: 58, slug: "working-with-java-data-types" },
        { id: 4, slug: "variable" },
        { id: 5, slug: "variable-casting-and-conversions" },
        { id: 29, slug: "fields-vs-attributes" },
        { id: 30, slug: "getters-and-setters" }
      ]
    },
    {
      title: "3. Using Operators and Decision Constructs",
      description: "Java operators, precedence, equality testing, if/else, switch statements",
      tutorials: [
        { id: 7, slug: "operators" },
        { id: 8, slug: "comparison-operators" },
        { id: 9, slug: "logical-operators" },
        { id: 10, slug: "bitwise-operators" },
        { id: 11, slug: "operator-precedence" },
        { id: 12, slug: "if-else-statement" },
        { id: 13, slug: "switch-statement" },
        { id: 14, slug: "when-to-use-if-else-or-switch" }
      ]
    },
    {
      title: "4. Creating and Using Arrays",
      description: "One-dimensional and multi-dimensional arrays",
      tutorials: [
        { id: 21, slug: "arrays" }
      ]
    },
    {
      title: "5. Using Loop Constructs",
      description: "while, for, do-while loops, break and continue",
      tutorials: [
        { id: 20, slug: "looping-constructs" }
      ]
    },
    {
      title: "6. Working with Methods and Encapsulation",
      description: "Methods, overloading, static keyword, constructors, access modifiers, encapsulation",
      tutorials: [
        { id: 32, slug: "methods" },
        { id: 36, slug: "method-overloading" },
        { id: 37, slug: "static-vs-instance-methods" },
        { id: 31, slug: "constructors" },
        { id: 39, slug: "encapsulation" },
        { id: 40, slug: "pass-by-value-vs-reference" }
      ]
    },
    {
      title: "7. Working with Inheritance",
      description: "Inheritance, polymorphism, method overriding, super/this, abstract classes, interfaces",
      tutorials: [
        { id: 46, slug: "inheritance" },
        { id: 47, slug: "polymorphism" },
        { id: 38, slug: "method-overriding" },
        { id: 34, slug: "this-reference-variable" },
        { id: 35, slug: "super-reference-variable" },
        { id: 33, slug: "this-and-super-calls" },
        { id: 42, slug: "abstract-classes" },
        { id: 44, slug: "interfaces" }
      ]
    },
    {
      title: "8. Handling Exceptions",
      description: "Exception types, try-catch blocks, common exceptions",
      tutorials: [
        { id: 26, slug: "exception-handling" }
      ]
    },
    {
      title: "9. Working with Selected Classes from the Java API",
      description: "StringBuilder, String, date/time API, ArrayList, lambda expressions",
      tutorials: [
        { id: 54, slug: "stringbuilder" },
        { id: 18, slug: "string-class" },
        { id: 25, slug: "date-time-api" },
        { id: 22, slug: "list-object" },
        { id: 45, slug: "lambda-expressions" }
      ]
    }
  ];

  // Additional supporting topics
  const supportingTopics = {
    title: "Additional Supporting Topics",
    description: "Supplementary concepts and advanced topics",
    tutorials: [
      { id: 15, slug: "the-enum-field" },
      { id: 16, slug: "random-object" },
      { id: 17, slug: "numeric-method" },
      { id: 19, slug: "printf-method" },
      { id: 23, slug: "set-object" },
      { id: 24, slug: "map-object" },
      { id: 27, slug: "oop-overview" },
      { id: 28, slug: "classes-and-objects" }
    ]
  };

  const getTutorialFromExamTopics = (topicTutorial: {id: number, slug: string}) => {
    return tutorials.find(t => t.id === topicTutorial.id || t.slug === topicTutorial.slug);
  };

  const getFilteredExamTopics = () => {
    if (!searchQuery.trim()) {
      return examTopics;
    }
    
    return examTopics.map(topic => ({
      ...topic,
      tutorials: topic.tutorials.filter(topicTutorial => {
        const tutorial = getTutorialFromExamTopics(topicTutorial);
        return tutorial && (
          tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tutorial.id.toString().includes(searchQuery) ||
          topic.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      })
    })).filter(topic => topic.tutorials.length > 0);
  };

  return (
    <div className="tutorial-container">
      <div className="tutorial-header">
        <h1>OCA Java SE 8 Programmer I (1Z0-808) Tutorial</h1>
        <p>Comprehensive Java study materials organized according to the Oracle Certified Associate exam topics.</p>
        
        <div className="search-container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search tutorials by title, number, or exam topic..."
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
        {getFilteredExamTopics().map((examTopic, topicIndex) => (
          <div key={topicIndex} className="exam-topic-section">
            <div className="exam-topic-header">
              <h2>{examTopic.title}</h2>
              <p>{examTopic.description}</p>
            </div>
            
            <div className="tutorial-grid">
              {examTopic.tutorials.map((topicTutorial) => {
                const tutorial = getTutorialFromExamTopics(topicTutorial);
                if (!tutorial) return null;
                
                return (
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
                );
              })}
            </div>
          </div>
        ))}

        {/* Supporting Topics Section */}
        {(!searchQuery.trim() || 
          supportingTopics.tutorials.some(topicTutorial => {
            const tutorial = getTutorialFromExamTopics(topicTutorial);
            return tutorial && (
              tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              tutorial.id.toString().includes(searchQuery) ||
              supportingTopics.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
          })
        ) && (
          <div className="exam-topic-section supporting-topics">
            <div className="exam-topic-header">
              <h2>{supportingTopics.title}</h2>
              <p>{supportingTopics.description}</p>
            </div>
            
            <div className="tutorial-grid">
              {supportingTopics.tutorials.map((topicTutorial) => {
                const tutorial = getTutorialFromExamTopics(topicTutorial);
                if (!tutorial) return null;
                
                // Skip if searching and doesn't match
                if (searchQuery.trim() && 
                    !tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
                    !tutorial.id.toString().includes(searchQuery) &&
                    !supportingTopics.title.toLowerCase().includes(searchQuery.toLowerCase())) {
                  return null;
                }
                
                return (
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
                );
              })}
            </div>
          </div>
        )}
        
        {getFilteredExamTopics().length === 0 && searchQuery && (
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
          <strong>📋 Exam Preparation:</strong> Follow the OCA Java SE 8 exam topic order for optimal study progression.
          Each section covers specific exam objectives and builds foundational knowledge.
        </p>
        <p>
          <strong>💡 Study Tips:</strong> Complete each section thoroughly before moving to the next.
          Use the review feature to test your understanding of each topic.
        </p>
      </div>
    </div>
  );
};

export default Tutorial;
