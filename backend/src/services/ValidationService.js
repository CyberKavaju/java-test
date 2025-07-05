/**
 * Multi-Selection Question Validation Service
 * Handles validation logic for both single and multiple choice questions
 */

class ValidationService {
    /**
     * Validates an answer against the correct answer based on question type
     * @param {string|string[]} answer - User's selected answer(s)
     * @param {string} correctAnswer - Correct answer (comma-separated for multiple)
     * @param {string} questionType - 'single' or 'multiple'
     * @returns {boolean} - Whether the answer is correct
     */
    static validateAnswer(answer, correctAnswer, questionType) {
        // Handle null/undefined/empty answers
        if (!answer || answer === '' || (Array.isArray(answer) && answer.length === 0)) {
            return false;
        }

        if (questionType === 'single') {
            return this.validateSingleAnswer(answer, correctAnswer);
        } else if (questionType === 'multiple') {
            return this.validateMultipleAnswer(answer, correctAnswer);
        }

        return false;
    }

    /**
     * Validates single choice answers
     * @param {string} answer - User's selected answer
     * @param {string} correctAnswer - Correct answer
     * @returns {boolean}
     */
    static validateSingleAnswer(answer, correctAnswer) {
        return answer === correctAnswer;
    }

    /**
     * Validates multiple choice answers
     * @param {string[]} answer - Array of user's selected answers
     * @param {string} correctAnswer - Comma-separated correct answers
     * @returns {boolean}
     */
    static validateMultipleAnswer(answer, correctAnswer) {
        if (!Array.isArray(answer)) {
            return false;
        }

        const correctAnswers = correctAnswer.split(',').map(a => a.trim());
        
        // Must have exact same length
        if (answer.length !== correctAnswers.length) {
            return false;
        }

        // All answers must be in the correct set (order doesn't matter)
        const sortedAnswer = [...answer].sort();
        const sortedCorrect = [...correctAnswers].sort();
        
        return JSON.stringify(sortedAnswer) === JSON.stringify(sortedCorrect);
    }

    /**
     * Calculates score from array of answer results
     * @param {Array<{questionType: string, isCorrect: boolean}>} answers
     * @returns {{correct: number, total: number, percentage: number}}
     */
    static calculateScore(answers) {
        const total = answers.length;
        const correct = answers.filter(answer => answer.isCorrect).length;
        const percentage = total === 0 ? 0 : Math.round((correct / total) * 100);

        return {
            correct,
            total,
            percentage
        };
    }

    /**
     * Formats a question for API response (removes sensitive data)
     * @param {Object} question - Database question object
     * @returns {Object} - Formatted question for API
     */
    static formatQuestionForAPI(question) {
        const options = [
            { key: 'A', text: question.option_a },
            { key: 'B', text: question.option_b },
            { key: 'C', text: question.option_c }
        ];

        // Add optional options if they exist
        if (question.option_d) {
            options.push({ key: 'D', text: question.option_d });
        }
        if (question.option_e) {
            options.push({ key: 'E', text: question.option_e });
        }

        const formatted = {
            id: question.id,
            question: question.question_text,
            options: options,
            question_type: question.question_type || 'single'
        };

        // Calculate max_selections for multiple choice questions
        if (formatted.question_type === 'multiple') {
            if (question.correct_answer) {
                const correctAnswers = question.correct_answer.split(',');
                formatted.max_selections = correctAnswers.length;
            } else {
                // Default to 2 for multiple choice when correct_answer is not available
                formatted.max_selections = 2;
            }
        } else {
            formatted.max_selections = 1;
        }

        return formatted;
    }

    /**
     * Formats multiple questions for API response
     * @param {Array<Object>} questions - Array of database question objects
     * @returns {Array<Object>} - Array of formatted questions
     */
    static formatQuestionsForAPI(questions) {
        return questions.map(question => this.formatQuestionForAPI(question));
    }
}

module.exports = ValidationService;
