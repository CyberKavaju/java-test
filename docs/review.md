# Topic-Based Review Feature - Technical Implementation Plan

## Overview
A comprehensive review system that allows users to practice questions for specific Java tutorial topics with intelligent looping that focuses on incorrectly answered questions until mastery is achieved.
this will appear in each tutorial topic page, allowing users to practice questions related to that specific topic.

## Feature Requirements

### Core Functionality
1. **Topic Selection**: Users can select any topic from the tutorial collection (58 topics available)
2. **Topic-Specific Questions**: System retrieves all questions tagged with the selected topic
3. **Adaptive Loop Testing**: 
   - Initial round: Present all topic questions
   - Subsequent rounds: Only questions answered incorrectly
   - Continue until 100% accuracy achieved
4. **Progress Tracking**: Monitor performance per topic and overall mastery
5. **Real-time Feedback**: Immediate feedback after each answer with explanations

## Database Schema Extensions

### New Tables Required

```sql
-- Topic review sessions to track review progress
CREATE TABLE IF NOT EXISTS topic_review_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL DEFAULT 'default_user',
    topic TEXT NOT NULL,
    session_status TEXT NOT NULL DEFAULT 'active', -- 'active', 'completed', 'paused'
    current_round INTEGER DEFAULT 1,
    total_rounds INTEGER DEFAULT 1,
    questions_correct_current_round INTEGER DEFAULT 0,
    questions_total_current_round INTEGER DEFAULT 0,
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME NULL,
    last_activity DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Track question attempts within review sessions
CREATE TABLE IF NOT EXISTS topic_review_attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    round_number INTEGER NOT NULL,
    selected_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    attempt_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES topic_review_sessions(id),
    FOREIGN KEY (question_id) REFERENCES questions(id)
);

-- Topic mastery tracking
CREATE TABLE IF NOT EXISTS topic_mastery (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL DEFAULT 'default_user',
    topic TEXT NOT NULL,
    mastery_level TEXT DEFAULT 'beginner', -- 'beginner', 'intermediate', 'advanced', 'mastered'
    total_sessions INTEGER DEFAULT 0,
    average_rounds_to_mastery DECIMAL(3,1) DEFAULT 0.0,
    last_practiced DATETIME DEFAULT CURRENT_TIMESTAMP,
    mastered_at DATETIME NULL,
    UNIQUE(user_id, topic)
);
```

## Backend API Endpoints

### Topic Management
```javascript
// Get all available topics from tutorial
GET /api/topics
Response: {
  success: true,
  topics: [
    {
      id: "01-main-characteristics-of-java",
      title: "Main Characteristics of Java",
      description: "Overview of Java's key features",
      questionCount: 12
    },
    // ... more topics
  ]
}

// Get topic details with questions count and user progress
GET /api/topics/:topicId
Response: {
  success: true,
  topic: {
    id: "04-variable",
    title: "Variable",
    description: "Java variables and data types",
    questionCount: 15,
    userStats: {
      practiced: true,
      masteryLevel: "intermediate",
      lastPracticed: "2025-06-18T10:30:00Z",
      averageRounds: 2.3
    }
  }
}
```

### Review Session Management
```javascript
// Start a new topic review session
POST /api/review/start
Body: {
  userId: "user123",
  topic: "04-variable"
}
Response: {
  success: true,
  sessionId: 42,
  questions: [
    {
      id: 1,
      question_text: "What is a variable in Java?",
      option_a: "A container for values",
      option_b: "A method",
      option_c: "A class",
      option_d: "A package",
      // ... (no correct_answer in response)
    }
    // ... more questions
  ],
  roundInfo: {
    currentRound: 1,
    totalQuestions: 15
  }
}

// Submit answers for current round
POST /api/review/submit-round
Body: {
  sessionId: 42,
  answers: [
    { questionId: 1, selectedAnswer: "A" },
    { questionId: 2, selectedAnswer: "B" },
    // ... more answers
  ]
}
Response: {
  success: true,
  results: [
    {
      questionId: 1,
      selectedAnswer: "A",
      correctAnswer: "A",
      isCorrect: true,
      explanation: "Variables are containers for storing values"
    }
    // ... more results
  ],
  roundSummary: {
    correctCount: 12,
    totalCount: 15,
    percentage: 80,
    isComplete: false, // Session continues if < 100%
    nextRoundQuestions: [2, 7, 11] // Questions to repeat
  }
}

// Get next round questions
GET /api/review/next-round/:sessionId
Response: {
  success: true,
  questions: [
    // Only questions that were answered incorrectly
  ],
  roundInfo: {
    currentRound: 2,
    totalQuestions: 3
  }
}

// Complete review session (when 100% achieved)
POST /api/review/complete/:sessionId
Response: {
  success: true,
  sessionSummary: {
    topic: "04-variable",
    totalRounds: 3,
    finalScore: 100,
    timeSpent: 1247, // seconds
    masteryAchieved: true
  }
}
```

### Progress and Analytics
```javascript
// Get user's topic mastery overview
GET /api/review/mastery/:userId
Response: {
  success: true,
  mastery: [
    {
      topic: "01-main-characteristics-of-java",
      title: "Main Characteristics of Java",
      masteryLevel: "mastered",
      totalSessions: 2,
      averageRounds: 1.5,
      lastPracticed: "2025-06-15T14:20:00Z"
    }
    // ... more topics
  ],
  overallStats: {
    topicsMastered: 12,
    topicsInProgress: 3,
    topicsNotStarted: 43,
    totalTimeSpent: 14720 // seconds
  }
}

// Get detailed review history for a topic
GET /api/review/history/:userId/:topic
Response: {
  success: true,
  history: [
    {
      sessionId: 42,
      startedAt: "2025-06-18T10:00:00Z",
      completedAt: "2025-06-18T10:25:00Z",
      rounds: 2,
      finalScore: 100,
      timeSpent: 1500
    }
    // ... more sessions
  ]
}
```

## Frontend Components Architecture

### Main Review Components
```
src/components/review/
├── TopicSelector.tsx           # Browse and select topics
├── ReviewSession.tsx           # Main review interface
├── QuestionCard.tsx            # Individual question display
├── RoundSummary.tsx            # Results after each round
├── MasteryDashboard.tsx        # Overall progress overview
├── TopicProgress.tsx           # Detailed topic statistics
└── SessionHistory.tsx          # Review session history
```

### Component Specifications

#### TopicSelector.tsx
```typescript
interface TopicSelectorProps {
  topics: Topic[];
  onTopicSelect: (topicId: string) => void;
  userProgress: MasteryProgress[];
}

// Features:
// - Grid/list view of all topics
// - Filter by mastery level (not started, in progress, mastered)
// - Search topics by name
// - Show progress indicators (color coding)
// - Show question count per topic
```

#### ReviewSession.tsx
```typescript
interface ReviewSessionState {
  sessionId: number;
  currentQuestion: number;
  questions: Question[];
  answers: Answer[];
  currentRound: number;
  showResult: boolean;
  isSessionComplete: boolean;
}

// Features:
// - Question navigation (with round context)
// - Progress indicator (X of Y questions, Round N)
// - Timer for session duration
// - Submit round functionality
// - Handle round transitions
// - Session completion celebration
```

#### RoundSummary.tsx
```typescript
interface RoundSummaryProps {
  results: QuestionResult[];
  roundNumber: number;
  onContinue: () => void;
  onFinish: () => void;
  isComplete: boolean;
}

// Features:
// - Show correct/incorrect breakdown
// - List questions to retry (if any)
// - Performance visualization
// - Round completion animation
// - Next round preview or completion options
```

## Core Business Logic

### Topic-Question Mapping
```javascript
// Utility to map tutorial topics to database questions
class TopicQuestionMapper {
  static getQuestionsForTopic(topic) {
    // Map topic names to question database topics
    const topicMapping = {
      '01-main-characteristics-of-java': ['Java Basics', 'Language Features'],
      '04-variable': ['Working With Java Data Types', 'Variable'],
      '12-if-else-statement': ['Flow Control', 'Decision Making'],
      '20-looping-constructs': ['Flow Control', 'Loops'],
      '21-arrays': ['Arrays', 'API Classes'],
      // ... complete mapping
    };
    
    return database.getQuestionsByTopics(topicMapping[topic]);
  }
}
```

### Review Session Controller
```javascript
class ReviewSessionController {
  async startSession(userId, topicId) {
    const questions = await TopicQuestionMapper.getQuestionsForTopic(topicId);
    const session = await database.createReviewSession(userId, topicId, questions);
    return session;
  }
  
  async submitRound(sessionId, answers) {
    const session = await database.getReviewSession(sessionId);
    const results = await this.gradeAnswers(answers);
    
    // Record attempts
    await database.recordReviewAttempts(sessionId, results);
    
    // Determine next round questions (incorrect ones)
    const incorrectQuestions = results
      .filter(r => !r.isCorrect)
      .map(r => r.questionId);
    
    if (incorrectQuestions.length === 0) {
      // Perfect score - complete session
      await this.completeSession(sessionId);
      return { isComplete: true, results };
    } else {
      // Prepare next round
      await database.updateSessionRound(sessionId, incorrectQuestions);
      return { 
        isComplete: false, 
        results, 
        nextRoundQuestions: incorrectQuestions 
      };
    }
  }
  
  async completeSession(sessionId) {
    const session = await database.getReviewSession(sessionId);
    await database.markSessionComplete(sessionId);
    await this.updateTopicMastery(session.userId, session.topic);
  }
}
```

### Mastery Calculation Algorithm
```javascript
class MasteryCalculator {
  static calculateMasteryLevel(sessions) {
    const recentSessions = sessions.slice(-5); // Last 5 sessions
    const averageRounds = recentSessions.reduce((sum, s) => sum + s.rounds, 0) / recentSessions.length;
    const averageScore = recentSessions.reduce((sum, s) => sum + s.finalScore, 0) / recentSessions.length;
    
    if (averageScore === 100 && averageRounds <= 1.2) return 'mastered';
    if (averageScore >= 90 && averageRounds <= 2) return 'advanced';
    if (averageScore >= 70 && averageRounds <= 3) return 'intermediate';
    return 'beginner';
  }
}
```

## UI/UX Design Specifications

### Visual Design Elements
- **Progress Indicators**: Circular progress for topic completion, linear for session rounds
- **Color Coding**: 
  - Red: Beginner/Not Started
  - Yellow: Intermediate/In Progress  
  - Green: Advanced/Mastered
  - Blue: Currently Active
- **Animations**: Smooth transitions between rounds, celebration effects for mastery
- **Responsive Design**: Mobile-first approach for accessibility

### User Flow
1. **Topic Selection Page**: Grid of topics with progress indicators
2. **Pre-Session Brief**: Topic overview, question count, estimated time
3. **Review Session**: Question interface with round progress
4. **Round Results**: Performance summary with incorrect question review
5. **Session Completion**: Mastery celebration and next topic suggestions

## Implementation Phases

### Phase 1: Core Infrastructure
- Database schema implementation
- Basic API endpoints (start session, submit answers)
- Topic-question mapping logic
- Simple review session flow

### Phase 2: Advanced Features
- Round-based loop logic
- Mastery tracking and calculation
- Progress analytics
- Session history

### Phase 3: Frontend Development
- React components development
- UI/UX implementation
- State management (Redux/Context)
- Responsive design

### Phase 4: Integration & Polish
- Backend-frontend integration
- Testing and bug fixes
- Performance optimization
- Documentation updates

## Testing Strategy

### Unit Tests
- Question filtering and selection logic
- Mastery calculation algorithms
- Round progression logic
- API endpoint responses

### Integration Tests
- Complete review session workflows
- Database transaction integrity
- Frontend-backend data flow
- User progress persistence

## Performance Considerations

### Database Optimization
- Index on `topic` field in questions table
- Efficient session cleanup for old data
- Query optimization for question retrieval

### Frontend Performance
- Lazy loading of topic components
- Question pre-fetching for smooth transitions
- Local state management for session data
- Progressive loading for large topic lists


This comprehensive plan provides a roadmap for implementing a sophisticated topic-based review system that will significantly enhance the learning experience by providing targeted, adaptive practice focused on areas where users need the most improvement.