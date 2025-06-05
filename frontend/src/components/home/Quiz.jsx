// Quiz.js
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Quiz.css';

const Quiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { recommendation } = location.state || {};
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});

  const userId = localStorage.getItem('userId') || 'guest';

  useEffect(() => {
    if (recommendation) {
      const parts = recommendation.split(',').map((part) => part.trim());

      Promise.all(
        parts.map((part) => {
          const formattedPart = part.replace(/\s+/g, '_');
          return fetch(`http://localhost:9090/api/quiz/api/learning/${formattedPart}`)
            .then((res) => res.json());
        })
      )
        .then((allQuizzes) => {
          const combinedQuestions = allQuizzes.flat();
          setQuizQuestions(combinedQuestions);
        })
        .catch((err) => console.error('Error fetching quizzes:', err));
    }
  }, [recommendation]);

  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const handleSubmitQuiz = () => {
    const selectedAnswers = quizQuestions.map((question, index) => userAnswers[index] || "");
    let correctCount = 0;

    quizQuestions.forEach((question, index) => {
      if (userAnswers[index] === question.answer) {
        correctCount += 1;
      }
    });

    const payload = {
      userId: userId || 'guest', // Replace with actual userId if needed
      quizType: "learning",
      referenceName: recommendation.replace(/\s+/g, '_').toLowerCase(),
      totalQuestions: quizQuestions.length,
      correctAnswers: correctCount,
      answers: selectedAnswers,
    };

    fetch('http://localhost:9090/api/quiz/api/quiz/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (res.ok) {
          alert('Quiz submitted successfully!');
          navigate('/recommendation'); // Navigate back to the recommendation page
        } else {
          alert('Failed to submit quiz.');
        }
      })
      .catch((err) => console.error('Error submitting quiz:', err));
  };

  return (
    <div className="quiz-section">
      {quizQuestions.length > 0 ? (
        <form onSubmit={(e) => { e.preventDefault(); handleSubmitQuiz(); }}>
          <h3>📝 Quiz Time!</h3>
          {quizQuestions.map((question, index) => (
            <div key={index} className="quiz-question">
              <p>{index + 1}. {question.question}</p>
              {question.options.map((option, optIdx) => (
                <div key={optIdx} className="quiz-option">
                  <input
                    type="radio"
                    id={`question_${index}_${optIdx}`}
                    name={`question_${index}`}
                    value={option}
                    checked={userAnswers[index] === option}
                    onChange={() => handleAnswerChange(index, option)}
                  />
                  <label htmlFor={`question_${index}_${optIdx}`}>{option}</label>
                </div>
              ))}
            </div>
          ))}
          <button type="submit" className="submit-quiz-button">Submit Quiz</button>
        </form>
      ) : (
        <p>Loading quiz questions...</p>
      )}
    </div>
  );
};

export default Quiz;
