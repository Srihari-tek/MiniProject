// RecommendationDisplay.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RecommendationDisplay.css';

const RecommendationDisplay = ({ userId }) => {
  const navigate = useNavigate();
  const effectiveUserId = userId || 'guest';
  const [recommendation, setRecommendation] = useState(null);
  const [resources, setResources] = useState([]);
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

  const handleProgress = (status) => {
    setProgress(status);
  };

  const handleRating = (value) => {
    setRating(value);
  };

  const handleStartQuiz = () => {
    navigate('/quiz', { state: { recommendation } }); // Pass recommendation to quiz page
  };

  const handleViewResources = () => {
    navigate('/resources', { state: { resources } }); // Pass resources to resources page
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="logo">SynapLearn</div>
        <nav className="nav-menu">
          <button className="nav-item" onClick={() => navigate('/dashboard')}>Dashboard</button>
          <button className="nav-item active">Classes</button>
          <button className="nav-item" onClick={handleViewResources}>Resources</button>
        </nav>
      </aside>

      <main className="resource-container">
        <h2>🧠 Classes for Today</h2>
        {recommendation ? (
          <div className="resource-card">
            <button className="view-resources-button" onClick={handleViewResources}>
              📖 View Resources
            </button>


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

            <button className="quiz-button" onClick={handleStartQuiz}>
              🎯 Start Quiz
            </button>

          </div>
        ) : (
          <p>Loading recommendation...</p>
        )}
      </main>
    </div>
  );
};

export default RecommendationDisplay;
