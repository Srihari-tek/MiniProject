// App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MemoryGame from "./components/game/MemoryGame";
import PatternGame from "./components/game/PatternGame";
import BoxClickGame from "./components/game/BoxClickGame";
import MathReasoningGame from "./components/game/MathReasoningGame";
import SocialThinkingQuiz from "./components/game/SocialThinkingQuiz";
import UserDashboard from "./components/home/UserDashboard";
import RecommendationWrapper from './components/home/RecommendationWrapper';
import Quiz from './components/home/Quiz';
import Resources from './components/home/Resources'; // Import Resources component
import Login from "./components/user/Login";
import Signup from "./components/user/Signup";
import './App.css';

// Protects routes if user is not logged in
const PrivateRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem("isLoggedIn") === "true";
  return isAuthenticated ? element : <Navigate to="/login" />;
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
  }, []);

  return (
    <Router>
      <div>
        <Routes>
          {/* Default route redirects to login */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Game and Dashboard routes */}
          <Route path="/memory" element={<PrivateRoute element={<MemoryGame />} />} />
          <Route path="/boxclickgame" element={<PrivateRoute element={<BoxClickGame />} />} />
          <Route path="/pattern" element={<PrivateRoute element={<PatternGame />} />} />
          <Route path="/mathreasoning" element={<PrivateRoute element={<MathReasoningGame />} />} />
          <Route path="/socialthinking" element={<PrivateRoute element={<SocialThinkingQuiz />} />} />
          <Route path="/dashboard" element={<PrivateRoute element={<UserDashboard />} />} />
          <Route path="/recommendation" element={<RecommendationWrapper />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/resources" element={<Resources />} /> {/* Add Resources route */}

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
