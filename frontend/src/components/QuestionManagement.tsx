import React, { useState } from 'react';
import { QuestionList } from './QuestionList';
import { QuestionForm } from './QuestionForm';

// Temporary type definition to avoid import issues
interface Question {
  id: number;
  domain: string;
  topic: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d?: string;
  option_e?: string;
  correct_answer: string;
  explanation?: string;
  created_at?: string;
}

export const QuestionManagement: React.FC = () => {
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleEditQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setShowForm(true);
  };

  const handleCreateNew = () => {
    setSelectedQuestion(null);
    setShowForm(true);
  };

  const handleSave = (question: Question) => {
    setShowForm(false);
    setSelectedQuestion(null);
    // The QuestionList will refresh automatically when the form closes
    // We could also trigger a refresh callback here if needed
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedQuestion(null);
  };

  return (
    <div>
      <QuestionList 
        onEditQuestion={handleEditQuestion}
        onCreateNew={handleCreateNew}
      />
      
      {showForm && (
        <QuestionForm
          question={selectedQuestion}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};
