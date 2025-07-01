import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { isFormattedQuestion, convertQuestionToFormatted } from '../types/utils';
import MultiSelectQuizQuestion from './MultiSelectQuizQuestion';

export default function Quiz() {
  const { state, dispatch } = useApp();
  const { currentTest } = state;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance required
  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentQuestionIndex < currentTest.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
    if (isRightSwipe && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitTest = useCallback(() => {
    dispatch({ type: 'END_TEST' });
    // This will be handled by the parent component
  }, [dispatch]);

  // Timer effect
  useEffect(() => {
    if (!currentTest.isActive) return;

    const timer = setInterval(() => {
      dispatch({
        type: 'UPDATE_TIMER',
        payload: { timeRemaining: Math.max(0, currentTest.timeRemaining - 1) }
      });

      if (currentTest.timeRemaining <= 1) {
        dispatch({ type: 'END_TEST' });
        handleSubmitTest();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentTest.isActive, currentTest.timeRemaining, dispatch, handleSubmitTest]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answer: string | string[]) => {
    dispatch({
      type: 'ANSWER_QUESTION',
      payload: {
        questionId: currentTest.questions[currentQuestionIndex].id,
        selectedAnswer: answer,
      },
    });
  };

  const getSelectedAnswer = (questionId: number) => {
    const answer = currentTest.answers.find(a => a.questionId === questionId);
    return answer?.selectedAnswer || null;
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const canSubmit = currentTest.answers.length === currentTest.questions.length;

  if (!currentTest.isActive || currentTest.questions.length === 0) {
    return <div>Test not active or no questions available</div>;
  }

  const currentQuestion = currentTest.questions[currentQuestionIndex];

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="timer">
          <span className={currentTest.timeRemaining < 300 ? 'timer-warning' : ''}>
            Time Remaining: {formatTime(currentTest.timeRemaining)}
          </span>
        </div>
        <div className="progress">
          Question {currentQuestionIndex + 1} of {currentTest.questions.length}
        </div>
      </div>

      <div className="quiz-content">
        <div 
          className="question-section"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <MultiSelectQuizQuestion
            question={isFormattedQuestion(currentQuestion) ? currentQuestion : convertQuestionToFormatted(currentQuestion)}
            questionNumber={currentQuestionIndex + 1}
            selectedAnswer={getSelectedAnswer(currentQuestion.id)}
            onAnswerSelect={handleAnswerSelect}
          />
        </div>
        <div className="footer-spacer"></div>
      </div>

      <div className="navigation-footer">
        <button
          className="nav-btn-footer nav-btn-previous"
          disabled={currentQuestionIndex === 0}
          onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
        >
          Previous
        </button>
        
        <div className="progress-bar-container">
          <div className="question-progress-grid">
            {currentTest.questions.map((_, index) => {
              const questionId = currentTest.questions[index].id;
              const isAnswered = currentTest.answers.some(a => a.questionId === questionId);
              const isCurrent = index === currentQuestionIndex;
              
              return (
                <button
                  key={index}
                  className={`progress-dot ${isCurrent ? 'current' : ''} ${isAnswered ? 'answered' : ''}`}
                  onClick={() => goToQuestion(index)}
                  title={`Question ${index + 1}`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>

        {currentQuestionIndex < currentTest.questions.length - 1 ? (
          <button
            className="nav-btn-footer nav-btn-next"
            onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
          >
            Next
          </button>
        ) : (
          <button
            className="nav-btn-footer submit-btn"
            disabled={!canSubmit}
            onClick={handleSubmitTest}
          >
            Submit Test
          </button>
        )}
      </div>
    </div>
  );
}
