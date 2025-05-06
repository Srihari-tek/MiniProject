import React, { useEffect, useState } from 'react';
import './RecommendationDisplay.css';

const RecommendationDisplay = ({ userId }) => {
  const effectiveUserId = userId || 'guest';
  const [recommendation, setRecommendation] = useState(null);
  const [resources, setResources] = useState({});
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [progress, setProgress] = useState('');
  const [rating, setRating] = useState(null);

  // Fetch recommendation for user
  useEffect(() => {
    fetch(`http://localhost:9090/api/recommendation/${effectiveUserId}`)
      .then((res) => res.json())
      .then((data) => {
        setRecommendation(data.recommendation);
        setResources(data.resources);
      })
      .catch((err) => console.error(err));
  }, [effectiveUserId]);

 

  // Fetch quiz when "Start Quiz" clicked
useEffect(() => {
  if (showQuiz && recommendation) {
    const parts = recommendation.split(',').map((part) => part.trim());

    Promise.all(
      parts.map((part) => {
        const formattedPart = part.replace(/\s+/g, '_'); 
          // <-- Replace spaces with underscores
          console.log(`${formattedPart}`);
        return fetch(`http://localhost:9090/api/quiz/api/learning/${formattedPart}`)
          .then((res) => res.json());
      })
    )
      .then((allQuizzes) => {
        const combinedQuestions = allQuizzes.flat();
        console.log(combinedQuestions);
        setQuizQuestions(combinedQuestions);
        setUserAnswers({});
      })
      .catch((err) => console.error('Error fetching quizzes:', err));
  }
}, [showQuiz, recommendation]);


  const handleProgress = (status) => {
    setProgress(status);
    console.log(`Progress marked as: ${status}`);
  };

  const handleRating = (value) => {
    setRating(value);
    console.log(`Rated with: ${value} stars`);
  };

  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const handleSubmitQuiz = () => {
    // Prepare answers array
    const selectedAnswers = quizQuestions.map((question, index) => userAnswers[index] || "");
  
    // Calculate correct answers (compare selected answer with correct answer)
    let correctCount = 0;
    quizQuestions.forEach((question, index) => {
      if (userAnswers[index] === question.answer) {
        correctCount += 1;
      }
    });
  
    // Build the payload matching backend needs
    const payload = {
      userId: effectiveUserId,
      quizType: "learning", // fixed for your case
      referenceName: recommendation.replace(/\s+/g, '_').toLowerCase(), // match your backend naming
      totalQuestions: quizQuestions.length,
      correctAnswers: correctCount,
      answers: selectedAnswers,
    };
  
    console.log('Submitting payload:', payload);
  
    fetch('http://localhost:9090/api/quiz/api/quiz/submit', {  // <-- make sure endpoint is correct
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (res.ok) {
          alert('Quiz submitted successfully!');
          setShowQuiz(false);
          setQuizQuestions([]);
          setUserAnswers({});
        } else {
          alert('Failed to submit quiz.');
        }
      })
      .catch((err) => console.error('Error submitting quiz:', err));
  };
  

  return (
    <div className="resource-container">
      <h2>🧠 Classes for Today</h2>
      {recommendation ? (
        <div className="resource-card">
          <p className="recommendation-text">{recommendation}</p>

          <div className="resource-section">
            <h4>📚 Resources:</h4>
            {resources && resources.length > 0 ? (
              <ul>
                {resources.map((link, index) => (
                  <li key={index}>
                    <a href={link} target="_blank" rel="noopener noreferrer">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No resources available</p>
            )}
          </div>


          <div className="progress-buttons">
            <button
              className={progress === 'Completed' ? 'active' : ''}
              onClick={() => handleProgress('Completed')}
            >
              ✅ Completed
            </button>
            <button
              className={progress === 'Skipped' ? 'active' : ''}
              onClick={() => handleProgress('Skipped')}
            >
              ❌ Skipped
            </button>
          </div>

          <div className="rating-bar">
            <p>Rate this suggestion:</p>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => handleRating(star)}
                style={{ cursor: 'pointer', fontSize: '22px' }}
              >
                {rating >= star ? '⭐' : '☆'}
              </span>
            ))}
          </div>

          {!showQuiz && (
            <button className="quiz-button" onClick={() => setShowQuiz(true)}>
              🎯 Start Quiz
            </button>
          )}

          {showQuiz && (
            <div className="quiz-section">
              <h3>📝 Quiz Time!</h3>
              {quizQuestions.length > 0 ? (
                <form onSubmit={(e) => { e.preventDefault(); handleSubmitQuiz(); }}>
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
          )}
        </div>
      ) : (
        <p>Loading recommendation...</p>
      )}
    </div>
  );
};

export default RecommendationDisplay;
