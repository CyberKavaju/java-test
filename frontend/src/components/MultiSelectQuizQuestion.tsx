import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { FormattedQuestion } from '../types';

interface MultiSelectQuizQuestionProps {
  question: FormattedQuestion;
  questionNumber: number;
  selectedAnswer: string | string[] | null;
  onAnswerSelect: (answer: string | string[]) => void;
}

export default function MultiSelectQuizQuestion({ 
  question, 
  questionNumber, 
  selectedAnswer, 
  onAnswerSelect 
}: MultiSelectQuizQuestionProps) {
  
  const handleSingleSelect = (optionKey: string) => {
    onAnswerSelect(optionKey);
  };

  const handleMultipleSelect = (optionKey: string) => {
    const currentSelected = Array.isArray(selectedAnswer) ? selectedAnswer : [];
    
    if (currentSelected.includes(optionKey)) {
      // Remove the option if already selected
      const newSelected = currentSelected.filter(key => key !== optionKey);
      onAnswerSelect(newSelected);
    } else if (currentSelected.length < question.max_selections) {
      // Add the option if under the limit
      const newSelected = [...currentSelected, optionKey];
      onAnswerSelect(newSelected);
    }
    // If at max selections and trying to add, ignore the click
  };

  const isSelected = (optionKey: string): boolean => {
    if (question.question_type === 'single') {
      return selectedAnswer === optionKey;
    } else {
      return Array.isArray(selectedAnswer) && selectedAnswer.includes(optionKey);
    }
  };

  const canSelectMore = (): boolean => {
    if (question.question_type === 'single') {
      return true; // Can always change single selection
    } else {
      const currentCount = Array.isArray(selectedAnswer) ? selectedAnswer.length : 0;
      return currentCount < question.max_selections;
    }
  };

  const getSelectionCount = (): string => {
    if (question.question_type === 'single') {
      return '';
    }
    const currentCount = Array.isArray(selectedAnswer) ? selectedAnswer.length : 0;
    return `(${currentCount}/${question.max_selections} selected)`;
  };

  return (
    <div className="question-container">
      <div className="question-header">
        <h3>Question {questionNumber}</h3>
        <div className="question-meta">
          <span className={`question-type-badge ${question.question_type}`}>
            {question.question_type === 'single' ? 'Single Choice' : 'Multiple Choice'}
          </span>
          {question.question_type === 'multiple' && (
            <span className="selection-count">{getSelectionCount()}</span>
          )}
        </div>
      </div>
      
      <div className="question-text">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
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
            pre: ({children}) => (
              <pre className="code-block">{children}</pre>
            ),
          }}
        >
          {question.question}
        </ReactMarkdown>
      </div>
      
      {question.question_type === 'multiple' && (
        <div className="multiple-choice-instructions">
          <p>Select {question.max_selections} option{question.max_selections > 1 ? 's' : ''}:</p>
        </div>
      )}
      
      <div className="options">
        {question.options.map((option) => (
          <label 
            key={option.key} 
            className={`option-label ${question.question_type} ${
              isSelected(option.key) ? 'selected' : ''
            } ${
              question.question_type === 'multiple' && !isSelected(option.key) && !canSelectMore() 
                ? 'disabled' 
                : ''
            }`}
          >
            <input
              type={question.question_type === 'single' ? 'radio' : 'checkbox'}
              name={`question-${question.id}`}
              value={option.key}
              checked={isSelected(option.key)}
              onChange={() => {
                if (question.question_type === 'single') {
                  handleSingleSelect(option.key);
                } else {
                  handleMultipleSelect(option.key);
                }
              }}
              disabled={
                question.question_type === 'multiple' && 
                !isSelected(option.key) && 
                !canSelectMore()
              }
            />
            <span className="option-key">{option.key}.</span>
            <span className="option-text">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  code: ({className, children, ...props}) => {
                    const match = /language-(\w+)/.exec(className || '');
                    const isInline = !match;
                    return isInline ? (
                      <code className="inline-code" {...props}>{children}</code>
                    ) : (
                      <code className={className} {...props}>{children}</code>
                    );
                  },
                  pre: ({children}) => <pre className="code-block">{children}</pre>,
                }}
              >
                {option.text}
              </ReactMarkdown>
            </span>
          </label>
        ))}
      </div>
      
      {question.question_type === 'multiple' && (
        <div className="selection-status">
          {(() => {
            const currentCount = Array.isArray(selectedAnswer) ? selectedAnswer.length : 0;
            if (currentCount === 0) {
              return <span className="status-none">No options selected</span>;
            } else if (currentCount < question.max_selections) {
              return (
                <span className="status-partial">
                  Select {question.max_selections - currentCount} more option{question.max_selections - currentCount > 1 ? 's' : ''}
                </span>
              );
            } else {
              return <span className="status-complete">All required options selected</span>;
            }
          })()}
        </div>
      )}
    </div>
  );
}
