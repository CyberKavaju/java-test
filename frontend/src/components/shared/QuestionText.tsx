import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface QuestionTextProps {
  children: string;
  className?: string;
}

export const QuestionText: React.FC<QuestionTextProps> = ({ children, className = '' }) => {
  return (
    <div className={`question-text ${className}`}>
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
        {children}
      </ReactMarkdown>
    </div>
  );
};

interface OptionTextProps {
  children: string;
  className?: string;
}

export const OptionText: React.FC<OptionTextProps> = ({ children, className = '' }) => {
  return (
    <span className={className}>
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
        {children}
      </ReactMarkdown>
    </span>
  );
};

interface ExplanationTextProps {
  children: string;
  className?: string;
}

export const ExplanationText: React.FC<ExplanationTextProps> = ({ children, className = '' }) => {
  return (
    <div className={className}>
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
        {children}
      </ReactMarkdown>
    </div>
  );
};
