import React, { useState } from 'react';
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
import './HomePage.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const HomePage = ({ gameScores, onStartNewSession }) => {
  const [userData] = useState({
    name: 'Anna Morrison',
    level: 'High Intermediate',
    languages: ['English', 'Spanish']
  });

  const chartData = {
    labels: ['Memory', 'Box Click', 'Pattern', 'Math', 'Social'],
    datasets: [{
      label: 'Cognitive Performance',
      data: Object.values(gameScores),
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
        text: 'Time spent on learning'
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
            {Object.entries(gameScores).map(([game, score]) => (
              <div key={game} className="stat-card">
                <h3>{game}</h3>
                <p>{score}%</p>
              </div>
            ))}
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

export default HomePage;