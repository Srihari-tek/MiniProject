🧠 AI-Based Personalized Learning Platform for Neurodiverse Students

This project is an intelligent, adaptive learning platform that provides personalized educational resources and skill-building activities for neurodiverse learners (such as students with autism, ADHD, or learning difficulties). It integrates cognitive assessment, machine learning, and personalized recommendation delivery through a modular, full-stack architecture.

🚀 Project Highlights

Interactive cognitive games to evaluate 5 core skills: Memory, Logic, Math, Motor, and Social Understanding

ML-driven personalized learning strategy recommendation

Dynamic quiz generation and result tracking

Modular Spring Boot + Flask backend with RESTful APIs

React.js frontend dashboard with user profile, recommendations, and progress tracking

Data stored in PostgreSQL, with export options for analysis

🎯 Problem Statement

Traditional learning platforms offer uniform content to all users, ignoring individual cognitive strengths and weaknesses. Neurodiverse students often need content that aligns with their specific abilities. This platform addresses that gap by:

Assessing cognitive skills via targeted games

Classifying users into categories (High, Medium, Low) for each skill

Recommending learning resources tailored to individual cognitive profiles

Tracking learning progress and quiz performance

🧩 Modules Overview

Cognitive Assessment Module
→ Games that assess skills like memory, pattern recognition, math reasoning, motor response, and social logic.
→ Game scores and categories stored in PostgreSQL via Spring Boot.

User Profile Module
→ Allows users to register/login and view their cognitive profile, task history, and category-wise performance.

Learning Recommendation Engine
→ Spring Boot sends user cognitive data to a Flask ML service.
→ Flask (Random Forest Classifier) returns a learning recommendation string (e.g., “Use memory games”).
→ Resources (articles, videos, games) are mapped to recommendations.

Quiz Module
→ Quizzes generated dynamically based on recommended topics.
→ User answers and scores are stored and used for evaluation.

Backend APIs (Spring Boot)
→ Manages game results, user data, quizzes, and integrates with Flask for ML inference.

Frontend (React)
→ Intuitive dashboard shows current recommendation, resources, skill categories, and quizzes.
→ Features emoji-based rating system and calendar-like task layout.

Database (PostgreSQL)
→ Stores all game results, quiz results, and user metadata.
→ Also used for generating exportable performance reports.

🧪 Machine Learning Model

Model: Random Forest Classifier (via scikit-learn)

Input features: Age, Gender, Diagnosis, Cognitive skill scores & levels

Output: Personalized learning recommendation

Trained on: Synthetic dataset modeled after cognitive performance profiles

📂 Folder Structure

.
├── backend
│ ├── cognitive-assessment(SpringBoot) # Java backend with REST API
│ └── flask # Python ML recommendation engine
├── frontend # React.js user dashboard
├── ml-model # Jupyter notebook and model training scripts
├── README.md # Project overview
└── ...

⚙️ Tech Stack

Frontend: React.js

Backend: Spring Boot (Java)

ML Engine: Flask + scikit-learn (Python)

Database: PostgreSQL

Styling: CSS

Tools: Maven, npm, joblib

📦 API Highlights

GET /api/recommendation/{userId}
→ Fetch ML-based learning recommendation

POST /api/quiz-results
→ Submit quiz performance for evaluation

GET /api/quiz/api/learning/{topic}
→ Get quiz questions based on recommended strategy

💡 Sample Recommendations

"Use memory games"

"Apply visual math tools"

"Incorporate motor skill exercises"

"Include logical puzzles"

"Use peer modeling and social stories"


🧠 How to Run

Frontend

cd frontend
npm install
npm run dev

Spring Boot Backend

cd backend/cognitive-assessment
mvn spring-boot:run

Flask ML Server

cd backend/flask
python -m venv venv
source venv/bin/activate (or venv\Scripts\activate on Windows)
python app.py

PostgreSQL

Make sure PostgreSQL is running and matches your application.properties settings.
