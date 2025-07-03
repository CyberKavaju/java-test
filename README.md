# Java SE 8 Programmer I (1Z0-808) Mock Test Application

A comprehensive mock testing application for the Oracle Certified Associate Java SE 8 Programmer I (1Z0-808) exam. This application provides randomized practice tests with detailed performance tracking and reporting.

## Features

- 🎯 **Randomized Tests**: 25 unique questions per test session from a comprehensive question pool
- ⏱️ **Timed Tests**: 30-minute timer per test session (similar to actual exam)
- 📊 **Performance Tracking**: Track correct/incorrect answers and attempt history
- 🎨 **Color-coded Reports**: Visual performance indicators (Red → Yellow → Green)
- 📋 **Detailed Results**: View correct answers and explanations after test completion
- 🔄 **Question Pool Management**: Prevents question repetition until pool resets
- 📱 **Mobile Responsive**: Optimized for both desktop and mobile devices
- 📈 **Progress Analytics**: Track improvement over multiple test attempts

## Tech Stack

### Frontend

- **React 19** with TypeScript
- **Vite** for fast development and building
- **React Router** for navigation
- **Axios** for API communication
- **ESLint** for code quality

### Backend

- **Node.js** with Express
- **SQLite** database for data persistence
- **CORS** enabled for cross-origin requests
- **Jest** for testing

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager

## Installation & Setup

### 1. Clone the Repository

</code>bash
git clone <your-repository-url>
cd java-test
</code>

### 2. Quick Start (Recommended)

For the fastest setup, use the root-level scripts that handle both frontend and backend:

</code>bash
# Install all dependencies for both frontend and backend
npm run install-all

# Start both frontend and backend development servers
npm run dev
</code>

This will start:

- Backend server on `http://localhost:3001`
- Frontend application on `http://localhost:5173`

### 3. Manual Setup (Alternative)

If you prefer to set up each part separately:

#### Backend Setup

</code>bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the backend server
npm run dev
</code>

#### Frontend Setup

</code>bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
</code>

## Usage

1. **Start a Test**: Click "Start New Test" to begin a 25-question practice exam
2. **Answer Questions**: Select your answers and navigate between questions
3. **Submit Test**: Complete the test within the 50-minute time limit
4. **Review Results**: View your score, correct answers, and explanations
5. **Track Progress**: Monitor your improvement through the reports section

## API Endpoints

The backend provides the following REST API endpoints:

- `GET /api/questions` - Retrieve all questions
- `GET /api/questions/test` - Get 25 random questions for a test
- `POST /api/questions/submit` - Submit test answers
- `GET /api/reports` - Get performance reports
- `POST /api/questions/reset-pool` - Reset question pool

## Project Structure

</code>text
java-test/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── server.js       # Main server file
│   │   ├── database/       # Database models and schema
│   │   └── data/           # Initial question data
│   ├── tests/              # Backend tests
│   └── package.json
├── frontend/               # React/TypeScript frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # App context and state
│   │   ├── services/       # API service layer
│   │   └── types/          # TypeScript type definitions
│   ├── public/
│   └── package.json
└── docs/                   # Project documentation
</code>

## Scripts

### Root Scripts (Recommended)

</code>bash
npm run dev        # Start both frontend and backend development servers
npm run install-all # Install dependencies for both frontend and backend
npm start          # Start both frontend and backend in production mode
npm run build      # Build frontend for production
npm test           # Run backend tests
</code>

### Backend Scripts

</code>bash
npm start       # Start production server
npm run dev     # Start development server with nodemon
npm test        # Run tests
</code>

### Frontend Scripts

</code>bash
npm run dev     # Start development server
npm run build   # Build for production
npm run preview # Preview production build
npm run lint    # Run ESLint
</code>

## Development

### Adding New Questions

Questions are stored in the SQLite database. You can add new questions by:

1. Modifying the `backend/src/data/questions.js` file
2. Or implementing CSV import functionality (planned feature)

### Database Schema

The application uses SQLite with the following main tables:

- `questions` - Stores question data
- `question_attempts` - Tracks user attempts and answers

## Testing

Run the test suite:

</code>bash
# Backend tests
cd backend
npm test

# Frontend tests (if available)
cd frontend
npm test
</code>

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Exam Information

This application is designed to help prepare for the Oracle Certified Associate Java SE 8 Programmer I (1Z0-808) exam. The actual exam consists of:

- **Duration**: 150 minutes
- **Questions**: 70 multiple-choice questions
- **Passing Score**: 65%
- **Topics**: Java basics, operators, flow control, arrays, methods, encapsulation, inheritance, and exceptions

## Support

If you encounter any issues or have questions, please:

1. Check the existing issues in the repository
2. Create a new issue with detailed information about the problem
3. Include steps to reproduce the issue

---

**Note**: This is a practice application and is not affiliated with Oracle Corporation. It's designed to help with exam preparation but should be used alongside official Oracle study materials.
