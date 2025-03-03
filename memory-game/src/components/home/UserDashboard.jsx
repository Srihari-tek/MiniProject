import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom'; // ✅ Use navigate instead of refreshing
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './UserDashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const gameSkillMap = {
  "Memory Game": 'Memory Skills',
  "BoxClickGame": 'Motor Skills',
  "Pattern Recognition Game": 'Logical Thinking Skills',
  "Math Reasoning Game": 'Mathematical Knowledge',
  "Social Thinking Quiz": 'Social Understanding'
};

const UserDashboard = ({ onStartNewSession }) => {
  const navigate = useNavigate(); // ✅ React Router navigation
  const storedUserId = localStorage.getItem('userId') || 'guest';
  const [userId, setUserId] = useState(storedUserId);
  const [userData, setUserData] = useState({
    name: 'Anna Morrison',
    level: 'High Intermediate',
    languages: ['English', 'Spanish']
  });

  const [gameScores, setGameScores] = useState([]);

  useEffect(() => {
    if (userId !== 'guest') {
      localStorage.setItem('userId', userId);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    const fetchGameScores = async () => {
      try {
        const response = await fetch(`http://localhost:9090/api/game-result/${userId}/gamescores`);
        if (!response.ok) {
          throw new Error('Failed to fetch game scores');
        }
        const data = await response.json();
        setGameScores(data);
      } catch (error) {
        console.error('Error fetching game scores:', error);
      }
    };

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

  const chartData = {
    labels: gameScores.map(score => gameSkillMap[score.game] || score.game),
    datasets: [{
      label: 'Cognitive Performance',
      data: gameScores.map(score => categoryToScore(score.category)),
      borderColor: '#4A90E2',
      backgroundColor: 'rgba(74, 144, 226, 0.1)',
      tension: 0.4,
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Cognitive Performance Over Time' }
    }
  };

  const handleStartNewSession = () => {
    onStartNewSession();
    navigate('/game');
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="logo">Linglee</div>
        <nav className="nav-menu">
          <button className="nav-item active">Dashboard</button>
          <button className="nav-item">Classes</button>
          <button className="nav-item">Resources</button>
          <button className="nav-item">Learning Plan</button>
          <button className="nav-item">Chat</button>
        </nav>
      </aside>

      <main className="main-content">
        <header className="main-header">
          <div className="search-bar">
            <input type="search" placeholder="Search..." />
          </div>
          <div className="user-profile">
            <span>{userData.name}</span>
            <div className="avatar">👤</div>
          </div>
        </header>

        <div className="dashboard-content">
          <section className="welcome-banner">
            <div className="welcome-text">
              <h1>Welcome back, {userData.name}!</h1>
              <p>You've learned 80% of your goal this week!</p>
            </div>
            <div className="welcome-image">
              <img src="/avatar.png" alt="Welcome" />
            </div>
          </section>

          <section className="stats-grid">
            {gameScores.length > 0 ? (
              gameScores.map(({ game, category }) => (
                <div key={game} className="stat-card">
                  <h3>{gameSkillMap[game] || game}</h3>
                  <p>{category}</p>
                  <div className="progress-bar">
                    <div className={`progress ${category.toLowerCase()}`} style={{ width: `${categoryToScore(category)}%` }}></div>
                  </div>
                </div>
              ))
            ) : (
              <p>No game scores available</p>
            )}
          </section>

          <section className="growth-monitor">
            <h2>Growth Monitor</h2>
            <div className="chart-container">
              <Line data={chartData} options={chartOptions} />
            </div>
          </section>

          <button className="start-session" onClick={handleStartNewSession}>
            Start New Training Session
          </button>
        </div>
      </main>
    </div>
  );
};

UserDashboard.defaultProps = {
  userId: 'guest'
};

export default UserDashboard;
