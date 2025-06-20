import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TestResult } from '../types';

interface TestResultsProps {
  results: TestResult[];
  score: number;
  total: number;
  percentage: number;
  onRetakeTest: () => void;
  onViewReport: () => void;
}

export default function TestResults({ results, score, total, percentage, onRetakeTest, onViewReport }: TestResultsProps) {
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'green';
    if (percentage >= 60) return 'yellow';
    return 'red';
  };

  const getResultIcon = (isCorrect: boolean) => {
    return isCorrect ? '✅' : '❌';
  };

  return (
    <div className="test-results">
      <div className="results-header">
        <h2>Test Results</h2>
        <div className={`score-display ${getScoreColor(percentage)}`}>
          <div className="score-number">{score}/{total}</div>
          <div className="score-percentage">{percentage}%</div>
        </div>
      </div>

      <div className="results-summary">
        <div className="summary-item">
          <span className="label">Correct Answers:</span>
          <span className="value correct">{score}</span>
        </div>
        <div className="summary-item">
          <span className="label">Incorrect Answers:</span>
          <span className="value incorrect">{total - score}</span>
        </div>
        <div className="summary-item">
          <span className="label">Success Rate:</span>
          <span className={`value ${getScoreColor(percentage)}`}>{percentage}%</span>
        </div>
      </div>

      <div className="results-actions">
        <button className="btn btn-primary" onClick={onRetakeTest}>
          Take Another Test
        </button>
        <button className="btn btn-secondary" onClick={onViewReport}>
          View Detailed Report
        </button>
      </div>

      <div className="question-results">
        <h3>Question by Question Review</h3>
        {results.map((result, index) => (
          <div key={result.questionId} className={`question-result ${result.isCorrect ? 'correct' : 'incorrect'}`}>
            <div className="result-header">
              <div className="result-number">
                <span>{getResultIcon(result.isCorrect)} Question {index + 1}</span>
              </div>
              <div className="result-status">
                {result.isCorrect ? 'Correct' : 'Incorrect'}
              </div>
            </div>
            
            <div className="result-content">
              <div className="question-text">
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
                  }}
                >
                  {result.question_text}
                </ReactMarkdown>
              </div>
              
              <div className="answers">
                <div className="answer-row">
                  <span className="answer-label">Your Answer:</span>
                  <span className={`answer-value ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                    {result.selectedAnswer}
                  </span>
                </div>
                
                {!result.isCorrect && (
                  <div className="answer-row">
                    <span className="answer-label">Correct Answer:</span>
                    <span className="answer-value correct">{result.correctAnswer}</span>
                  </div>
                )}
              </div>
              
              {result.explanation && (
                <div className="explanation">
                  <h4>Explanation:</h4>
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
                    }}
                  >
                    {result.explanation}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
