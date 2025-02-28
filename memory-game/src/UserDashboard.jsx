import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
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

const UserDashboard = () => {
  const [userData, setUserData] = useState({
    name: '',
    userId: '',
    skills: {
      memoryThinking: 0,
      mathematical: 0,
      logicalReasoning: 0,
      motorSkills: 0,
      socialThinking: 0
    },
    activities: []
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('username');
        const response = await axios.get(`http://localhost:9090/api/user/${userId}`);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const chartData = {
    labels: ['Memory', 'Mathematical', 'Logical', 'Motor', 'Social'],
    datasets: [
      {
        label: 'Skills Progress',
        data: [
          userData.skills.memoryThinking,
          userData.skills.mathematical,
          userData.skills.logicalReasoning,
          userData.skills.motorSkills,
          userData.skills.socialThinking
        ],
        fill: false,
        borderColor: '#4ca7f1',
        tension: 0.4,
        pointBackgroundColor: '#2980b9',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#2980b9'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  const calculateAverage = () => {
    const skills = Object.values(userData.skills);
    return (skills.reduce((a, b) => a + b, 0) / skills.length).toFixed(1);
  };

  const getTopSkill = () => {
    return Object.entries(userData.skills)
      .sort((a, b) => b[1] - a[1])[0]?.[0]
      .split(/(?=[A-Z])/)
      .join(' ');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <motion.div 
          className="welcome-card"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Hi, {userData.name}! 👋</h1>
          <p>Welcome to your learning dashboard</p>
        </motion.div>

        <motion.div 
          className="stats-cards"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="stat-card">
            <h3>Average Performance</h3>
            <p>{calculateAverage()}%</p>
          </div>
          <div className="stat-card">
            <h3>Top Skill</h3>
            <p>{getTopSkill()}</p>
          </div>
        </motion.div>
      </div>

      <motion.div 
        className="chart-section"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2>Skills Progress</h2>
        <div className="chart-container">
          <Line data={chartData} options={chartOptions} />
        </div>
      </motion.div>

      <motion.div 
        className="activity-section"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2>Recent Activities</h2>
        <div className="activity-grid">
          {userData.activities?.map((activity, index) => (
            <div key={index} className="activity-card">
              <div className="activity-icon">🎮</div>
              <div className="activity-details">
                <h4>{activity.gameName}</h4>
                <p>Score: {activity.score}</p>
                <small>{new Date(activity.timestamp).toLocaleDateString()}</small>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default UserDashboard;