# Mock testing application for OCA Java SE 8 Programmer I (1Z0-808)

---

## ✅ Functional Requirements Breakdown

You want the app to:

1. Store multiple choice questions (MCQs) in a database make the option of adding more questions and editing existing ones by importing a csv.
2. Allow randomized selection of 25 *unique* questions for each test session.
3. Prevent repeating questions across different tests until the pool resets.
4. Track answers (right/wrong), attempt count per question.
5. Generate reports with colored alerts (green/yellow/red) based on performance history.
6. Make the color go from red to yellow and then green as the user answers the question correctly and show a tally of how many times the user got it wrong vs how many times they got it right.
7. Enforce a timer (50 mins per test).
8. Show correct/incorrect answers after submission.
9. Track number of test attempts.

---

## 🧠 Recommended Tech Stack (Agentic + Scalable)

### Frontend

* **React.js (with TypeScript)**

  * Clean component structure, typing safety, and better DX.
  * Use **React Router** for navigation and **React Context or Redux Toolkit** for state.
  * Integrate **Tailwind CSS** for styling or **MUI** for a clean component library.

### Backend

* **Node.js with Express (or NestJS)**

  * Express for simplicity, NestJS for structure if you prefer a more scalable, maintainable solution.
  * Expose RESTful APIs or GraphQL endpoints for frontend interaction.

### Database

* **SQLite**

  * Supports relational data, tracking relationships (questions ↔ attempts).
  * Can handle advanced queries for randomization, history tracking, and statistics.

### Hosting

it will be locally hosted for now, but you can use: Vercel, Railway, or Render for deployment later.

---

## ⚙️ System Architecture Overview

</code>text

[ React Frontend ]
   |
   |-- Auth UI
   |-- Quiz UI (25 Qs, Timer)
   |-- Report View
   |
   ↓
[ Node.js / NestJS API Layer ]
   |
   |-- /questions/random
   |-- /submit-answers
   |-- /user-history
   |-- /report
   |
   ↓
[ SQLite DB ]
   |-- questions (id, topic, text, options, answer)
   |-- user_attempts (user_id, question_id, result, timestamp)
   |-- test_sessions (id, user_id, question_ids[], time_taken, score)
   |-- question_stats (question_id, wrong_count, correct_count)
</code>

---

## 🧪 Key Business Logic

### Random 25 Question Selection Logic

</code>sql
SELECT * FROM questions 
WHERE id NOT IN (
  SELECT question_id 
  FROM user_attempts 
  WHERE user_id = $USER_ID
) 
ORDER BY RANDOM() 
LIMIT 25;
</code>

If question pool is exhausted, reset.

### Answer Tracking

* Track both correct and incorrect attempts per question in `user_attempts`.
* After every answer, calculate the ratio:  
    `correct_count / (correct_count + wrong_count)` for that question.
* Use triggers or background jobs to update status:

  * `green` if ratio ≥ 0.8
  * `yellow` if 0.5 ≤ ratio < 0.8
  * `red` if ratio < 0.5

* After every 20 attempts on a question, reset `correct_count` and `wrong_count` for that question to start fresh tracking.

### Report Generation

* Aggregate per topic and per question stats.
* Use AI to suggest what to study based on patterns.
* offer improvements based on user performance.

---

## ⏱️ Timer (Frontend)

Use `useEffect` + `setInterval` to implement the 30-minute countdown, or use a countdown library like `react-countdown`.

---

## 📘 Sample User Flow

1. **User starts test**

   * Backend provides 25 random, non-repeating questions.
2. **User answers within 50 mins**

   * Timer managed on frontend.
3. **On submit**, backend:

   * Records answers
   * Tallies score
   * Updates question history
4. **AI agent**:

   * Summarizes topics to study
   * Gives alert levels (green/yellow/red)
   * Suggests links or explanations
5. **Report displayed**
    * Shows performance history
    * Displays question stats (correct/incorrect)
    * Provides study recommendations

6. **Tag questions by topic**

   * Questions must be tagged by topics like:

     * Java Data Types
     * Methods and Encapsulation
     * Inheritance and Polymorphism
     * Interfaces and Abstract Classes
     * Exception Handling
     * Java Collections Framework
     * Java Streams API
     * Java Concurrency
     * Java File I/O
     * Java 8 Features
     * Lambda Expressions
     * Functional Interfaces
     * Java Memory Management
     * Java Generics
     * Java Annotations

   * This allows users to focus on specific areas they need to improve.

---

## 🏆 Features to Implement in the future

* **User Authentication**
* **Difficulty level**
* **Admin panel to manage questions**
* **Daily Practice Mode**
* **Leaderboard**

---
