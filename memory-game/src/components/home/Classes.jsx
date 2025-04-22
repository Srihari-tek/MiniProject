import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Classes.css';

const Classes = () => {
    const [recommendations, setRecommendations] = useState({});
    const [activeSkill, setActiveSkill] = useState('Memory Skills');
    const userId = localStorage.getItem('userId') || 'guest';
  
    const skillsMap = {
      'Memory Skills': {
        icon: '🧠',
        color: '#4A90E2',
        description: 'Enhance your memory retention and recall abilities',
        keywords: ['memory', 'recall', 'retention']
      },
      'Attention Focus Skills': {
        icon: '👁️',
        color: '#50C878',
        description: 'Improve your concentration and attention span',
        keywords: ['attention', 'focus', 'concentration']
      },
      'Logical Thinking Skills': {
        icon: '🎯',
        color: '#9B59B6',
        description: 'Develop pattern recognition and logical reasoning',
        keywords: ['logic', 'pattern', 'reasoning']
      },
      'Mathematical Knowledge': {
        icon: '🔢',
        color: '#E74C3C',
        description: 'Strengthen your mathematical problem-solving abilities',
        keywords: ['math', 'calculation', 'arithmetic']
      },
      'Social Understanding': {
        icon: '👥',
        color: '#F1C40F',
        description: 'Enhance your social cognition and interaction skills',
        keywords: ['social', 'interaction', 'communication']
      }
    };
    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
              const response = await fetch("http://localhost:9090/api/get-recommendations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({"user_id": "guest"}),
              });
          
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
          
              const textData = await response.text(); // Read response as text first
          
              try {
                const data = JSON.parse(textData); // Try parsing as JSON
                const allRecommendations = data.recommendations || [];
                
                // Categorizing recommendations
                const categorizedRecommendations = Object.keys(skillsMap).reduce((acc, skill) => {
                  acc[skill] = allRecommendations.filter(rec => {
                    const resourceNameLower = rec.resource_name.toLowerCase();
                    return skillsMap[skill].keywords.some(keyword => 
                      resourceNameLower.includes(keyword.toLowerCase())
                    );
                  });
                  return acc;
                }, {});
          
                setRecommendations(categorizedRecommendations);
              } catch (error) {
                console.error("Error parsing JSON:", error, "Raw response:", textData);
              }
            } catch (error) {
              console.error("Error fetching recommendations:", error);
            }
          };
          
    
        fetchRecommendations();
      }, [userId]);
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="logo">SynapLearn</div>
        <nav className="nav-menu">
          <button className="nav-item">Dashboard</button>
          <button className="nav-item active">Classes</button>
          <button className="nav-item">Resources</button>
          <button className="nav-item">Learning Plan</button>
          <button className="nav-item">Chat</button>
        </nav>
      </aside>

      <main className="main-content">
        <header className="main-header">
          <h1>Learning Resources</h1>
          <div className="user-profile">
            <span>Guest</span>
            <div className="avatar">👤</div>
          </div>
        </header>

        <div className="classes-container">
          <div className="skills-nav">
            {Object.entries(skillsMap).map(([skill, { icon, color }]) => (
              <motion.button
                key={skill}
                className={`skill-tab ${activeSkill === skill ? 'active' : ''}`}
                onClick={() => setActiveSkill(skill)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  borderColor: activeSkill === skill ? color : 'transparent'
                }}
              >
                <span className="skill-icon">{icon}</span>
                {skill}
              </motion.button>
            ))}
          </div>

          <motion.div
            className="skill-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="skill-header" style={{ backgroundColor: skillsMap[activeSkill].color }}>
              <h2>{activeSkill}</h2>
              <p>{skillsMap[activeSkill].description}</p>
            </div>

            <div className="resources-grid">
              {recommendations[activeSkill]?.map((resource, index) => (
                <motion.a
                  key={index}
                  href={resource.resource_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resource-card"
                  whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="resource-icon">{skillsMap[activeSkill].icon}</div>
                  <h3>{resource.resource_name}</h3>
                  <span className="resource-link">Learn More →</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Classes;