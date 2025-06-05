import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';

const gameSkillMap = {
  "Memory Game": 'Memory Skills',
  "BoxClickGame": 'Attention Focus Skills',
  "Pattern Recognition Game": 'Logical Thinking Skills',
  "Math Reasoning Game": 'Mathematical Knowledge',
  "Social Thinking Quiz": 'Social Understanding'
};

const UserDashboard = ({ onStartNewSession }) => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [userData, setUserData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [gameScores, setGameScores] = useState([]);
  const [showDetailedResults, setShowDetailedResults] = useState(false);
  const [showProgressDetails, setShowProgressDetails] = useState(false);

  useEffect(() => {
    const storedParentEmail = localStorage.getItem('parentEmail');
  
    if (!storedParentEmail) {
      console.error('Parent email not found in localStorage.');
    }
  
    const fetchUserByEmail = async () => {
      try {
        const response = await fetch(`http://localhost:9090/api/auth/parentEmail/${storedParentEmail}`);
        if (!response.ok) throw new Error('Failed to fetch user by parent email');
  
        const user = await response.json();
  
        setUserId(user.username);
        setUserData({
          name: user.studentName,
          languages: ['English']
        });
  
        localStorage.setItem('userId', user.username);
      } catch (err) {
        console.error('Error fetching user from email:', err);
        setUserId('guest');
        setUserData({
          name: 'Guest User',
          level: 'Beginner',
          languages: ['English']
        });
      }
    };
  
    fetchUserByEmail();
  }, []);
  
  useEffect(() => {
    if (!userId) return;

    const fetchProgressData = async () => {
      try {
        const response = await fetch(`http://localhost:9090/api/progress/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch progress data');
        const data = await response.json();
        setProgressData(data);
      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    };

    const fetchGameScores = async () => {
      try {
        const response = await fetch(`http://localhost:9090/api/game-result/${userId}/gamescores`);
        if (!response.ok) throw new Error('Failed to fetch game scores');
        const data = await response.json();
        setGameScores(data);
      } catch (error) {
        console.error('Error fetching game scores:', error);
      }
    };

    fetchProgressData();
    fetchGameScores();

    const interval = setInterval(() => {
      fetchGameScores();
    }, 5000);

    return () => clearInterval(interval);
  }, [userId]);

  const categoryToScore = (category) => {
    switch (category) {
      case 'Smart': return 100;
      case 'Intermediate': return 75;
      case 'Beginner': return 50;
      default: return 0;
    }
  };

  const handleStartNewSession = () => {
    onStartNewSession();
    navigate('/game');
  };

  // Toggle between dashboard and detailed results
  const toggleDetailedResults = () => {
    setShowDetailedResults(!showDetailedResults);
    setShowProgressDetails(false);
  };

  // Toggle between dashboard and progress details
  const toggleProgressDetails = () => {
    setShowProgressDetails(!showProgressDetails);
    setShowDetailedResults(false);
  };

  // Render detailed game results
  const renderGameResultsDetail = () => {
    return (
      <div className="game-results-detail">
        <div className="game-results-header">
          <button className="back-button" onClick={toggleDetailedResults}>
            ← Back to Dashboard
          </button>
          <h1>Game Performance Details</h1>
        </div>
        
        <div className="game-results-grid">
          {gameScores.map(({ game, category }) => (
            <div key={game} className="game-result-card">
              <div className="game-info">
                <h2>{game}</h2>
                <p className="skill-type">{gameSkillMap[game]}</p>
              </div>
              <div className={`category-indicator ${category.toLowerCase()}`}>
                <span className="category-label">{category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render progress details
  const renderProgressDetails = () => {
    return (
      <div className="progress-details">
        <div className="progress-details-header">
          <button className="back-button" onClick={toggleProgressDetails}>
            ← Back to Dashboard
          </button>
          <h1>Learning Progress Details</h1>
        </div>
        
        <div className="progress-details-content">
          {progressData ? (
            <>
              <div className="progress-summary">
                <div className="progress-stat">
                  <h3>Total Quizzes</h3>
                  <div className="stat-value">{progressData.totalQuizzes}</div>
                </div>
                <div className="progress-stat">
                  <h3>Average Score</h3>
                  <div className="stat-value">{progressData.averageScore.toFixed(2)}%</div>
                </div>
              </div>

              <h2>Skill Progress</h2>
              <table className="progress-table">
                <thead>
                  <tr>
                    <th>Skill</th>
                    <th>Last Month</th>
                    <th>This Month</th>
                    <th>Average</th>
                    <th>Category</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {progressData.skillProgressList.map((skill, index) => (
                    <tr key={index}>
                      <td>{skill.skillName}</td>
                      <td>{skill.lastMonthScore.toFixed(1)}%</td>
                      <td>{skill.thisMonthScore.toFixed(1)}%</td>
                      <td>{skill.averageScore.toFixed(1)}%</td>
                      <td>{skill.currentCategory}</td>
                      <td>{skill.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h2>Recent Activities</h2>
              <div className="activities-list">
                {progressData.recentActivities.map((activity, index) => (
                  <div key={index} className="activity-card">
                    <div className="activity-date">{activity.date}</div>
                    <div className="activity-details">
                      <h3>{activity.quizType} quiz</h3>
                      <p>Topic: <strong>{activity.referenceName}</strong></p>
                      <p>Score: {activity.correctAnswers}/{activity.totalQuestions}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p>Loading progress data...</p>
          )}
        </div>
      </div>
    );
  };

  // Main dashboard render
  const renderDashboard = () => {
    return (
      <div className="dashboard-layout">
        <aside className="sidebar">
          <div className="logo">SynapLearn</div>
          <nav className="nav-menu">
            <button className="nav-item active">Dashboard</button>
            <button className="nav-item" onClick={() => navigate('/recommendation')}>Classes</button>
            <button className="nav-item" onClick={() => navigate('/resources')}>Resources</button>
          </nav>
        </aside>

        <main className="main-content">
          <header className="main-header">
            <div className="search-bar">
              <input type="search" placeholder="Search..." />
            </div>
            <div className="user-profile">
              <span>{userData?.name || 'Loading...'}</span>
              <div className="avatar">👤</div>
            </div>
          </header>

          <div className="dashboard-content">
            <section className="welcome-banner">
              <div className="welcome-text">
                <h1>Welcome, {userData?.name || 'User'}!</h1>
                <p>"Excited to have you here! Let's begin your learning journey."</p>
              </div>
            </section>

            <div className="dashboard-grid two-column-layout">
              {/* Left Column - Cognitive Results */}
              <div className="left-column">
                <div className="cognitive-results-box">
                  <h2>Cognitive Performance</h2>
                  <div className="summary-stats">
                    <div className="total-games">
                      <span className="number">{gameScores.length}</span>
                      <span className="label">Games Played</span>
                    </div>
                  </div>
                  
                  <button className="view-detailed-results-btn" onClick={toggleDetailedResults}>
                    View Detailed Game Results
                  </button>
                </div>
              </div>

              {/* Right Column - Progress Tracking Button */}
              <div className="right-column">
                <div className="progress-tracking-box">
                  <h2>📈 Progress Tracking</h2>
                  <p>View your learning progress, skill development, and recent activities.</p>
                  
                  <button className="view-progress-btn" onClick={toggleProgressDetails}>
                    View Learning Progress
                  </button>
                </div>
              </div>
            </div>

            <button className="start-session" onClick={handleStartNewSession}>
              Start New Training Session
            </button>
          </div>
        </main>
      </div>
    );
  };

  if (showDetailedResults) {
    return renderGameResultsDetail();
  } else if (showProgressDetails) {
    return renderProgressDetails();
  } else {
    return renderDashboard();
  }
};

UserDashboard.defaultProps = {
  userId: 'guest'
};

export default UserDashboard;
