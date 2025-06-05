// Resources.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Resources.css';

const Resources = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { resources } = location.state || { resources: [] }; // Get resources from state

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="logo">SynapLearn</div>
        <nav className="nav-menu">
          <button className="nav-item" onClick={() => navigate('/dashboard')}>Dashboard</button>
          <button className="nav-item" onClick={() => navigate('/recommendation')}>Classes</button>
          <button className="nav-item active">Resources</button>
        </nav>
      </aside>

      <main className="resource-container">
        <h2>📚 Resources</h2>
        {resources.length > 0 ? (
          <div className="resource-list">
            {resources.map((link, index) => (
              <div key={index} className="resource-item">
                <a href={link} target="_blank" rel="noopener noreferrer">
                  {link}
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p>No resources available</p>
        )}
      </main>
    </div>
  );
};

export default Resources;
