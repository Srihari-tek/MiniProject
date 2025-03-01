import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
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

const UserDashboard = ({ userId, onStartNewSession }) => {
  const [userData, setUserData] = useState({
    name: 'Anna Morrison',
    level: 'High Intermediate',
    languages: ['English', 'Spanish']
  });

  const [gameScores, setGameScores] = useState([]);

  useEffect(() => {
    const fetchGameScores = async () => {
      try {
        const response = await fetch(`http://localhost:9090/api/user/${userId}/gamescores`);
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
  
    // Poll for new scores every 5 seconds
    const interval = setInterval(() => {
      fetchGameScores();
    }, 5000);
  
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [userId]);
  

  // Convert category into a numerical score
  const categoryToScore = (category) => {
    switch (category) {
      case 'Smart': return 100;
      case 'Intermediate': return 75;
      case 'Beginner': return 50;
      default: return 0;
    }
  };

  const chartData = {
    labels: gameScores.map(score => score.game), // Use game names as labels
    datasets: [{
      label: 'Cognitive Performance',
      data: gameScores.map(score => categoryToScore(score.category)), // Convert categories to numbers
      borderColor: '#4A90E2',
      backgroundColor: 'rgba(74, 144, 226, 0.1)',
      tension: 0.4,
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Cognitive Performance Over Time'
      }
    }
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
                  <h3>{game}</h3>
                  <p>{category}</p>
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

          <section className="language-progress">
            <div className="language-card">
              <h3>English</h3>
              <div className="progress-bar">
                <div className="progress" style={{ width: '82%' }}></div>
              </div>
              <span>B2 - High Intermediate</span>
            </div>
            <div className="language-card">
              <h3>Spanish</h3>
              <div className="progress-bar">
                <div className="progress" style={{ width: '65%' }}></div>
              </div>
              <span>C1 - Advanced</span>
            </div>
          </section>

          <button className="start-session" onClick={onStartNewSession}>
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
