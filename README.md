Intelligent Learning Platform for Neurodiverse Students
This project is an end-to-end intelligent learning platform designed to support neurodiverse learners (aged 6–15) by understanding their cognitive abilities through interactive assessments and delivering customized educational resources. It combines game-based skill testing, machine learning-powered learning suggestions, quizzes, and progress tracking in a unified ecosystem.

🧩 Problem Statement
Neurodiverse students often struggle with traditional one-size-fits-all education systems due to varied strengths in memory, logic, attention, and motor skills. Our platform aims to:

Identify individual cognitive strengths and weaknesses.

Recommend personalized learning content aligned with the student’s profile.

Track progress over time through quizzes and interactive feedback.

Empower educators and parents with insightful dashboards.

🔥 Key Features
🧠 Cognitive Skill Assessment

Interactive assessment games for evaluating memory, logic, attention, math, motor, and social skills.

Scores saved and analyzed for personalization.

🤖 Learning Recommendation Engine

ML-based strategy predictor (Random Forest Classifier).

Suggests study techniques (visual/audio/video/textual) based on cognitive profiles.

📝 Quiz Module

Post-learning and skill evaluation quizzes.

Instant feedback and performance tracking.

🔁 Reinforcement Learning Engine

Adjusts learning paths based on prior performance and behavior.

Helps refine content delivery over time.

📊 Visual Dashboard (React)

Shows skill ratings, progress, quiz scores, and learning tips.

Interactive UI with charts and rating buttons (👍/⭐).

🔐 User Management

Secure login, profile creation, session tracking, and category-based tagging.

🛠️ Tech Stack
Layer	Technology
Frontend	React.js, Chart.js, CSS
Backend	Spring Boot (Java)
ML Model	Python + Flask
Database	PostgreSQL
Tools	Git, Postman, VS Code, Maven

📁 Folder Structure
MiniProject
├── frontend/
├── backend/
│   └── cognitive-assessment/
|   └── Flask
├── ml_model/
│   └── neurodiverse_students_dataset 
├── README.md
⚙️ Setup Instructions

Clone the Repository
git clone https://github.com/Srihari-tek/MiniProject.git
cd MiniProject

Start the Backend (Spring Boot)
cd backend/cognitive-assessment
./mvnw spring-boot:run

Start the ML Model (Flask)
cd backend/Flask
python -m venv venv
python app.py

Start the Frontend (React)
cd frontend
npm install
npm run dev

📊 Architecture Overview
Frontend (React) communicates via REST APIs with Spring Boot backend.

Spring Boot sends and receives data from PostgreSQL and ML model.

Flask hosts the trained Random Forest Classifier for predicting learning strategies.

All results (games/quizzes) are stored in PostgreSQL and visualized on the dashboard.


🧠 Machine Learning Model
Model: Random Forest Classifier

Input: Cognitive assessment scores across 5–6 skill domains

Output: Suitable learning method (e.g., visual, audio, text, animation)

Training Data: Simulated dataset based on neurodiverse learning profiles

🔐 User Categorization
Based on cognitive results, users are tagged:

Low

Moderate

High

These tags influence the learning resources and quiz difficulty.

🎯 Future Enhancements
Speech-based accessibility support

Expanded reinforcement logic using student interaction history

Notifications and calendar reminders for learning plans

Teacher/Admin analytics dashboard

Support for multilingual content
