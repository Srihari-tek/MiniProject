import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MemoryGame from "./components/game/MemoryGame";
import PatternGame from "./components/game/PatternGame";
import BoxClickGame from "./components/game/BoxClickGame";
import MathReasoningGame from "./components/game/MathReasoningGame";
import SocialThinkingQuiz from "./components/game/SocialThinkingQuiz";
import UserDashboard from "./components/home/UserDashboard";
import Classes from './components/home/Classes';
import './App.css';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          {/* Default route redirects to MemoryGame */}
          <Route path="/" element={<Navigate to="/memory" />} />

          {/* Game routes */}
          <Route path="/memory" element={<MemoryGame />} />
          <Route path="/boxclickgame" element={<BoxClickGame />} />
          <Route path="/pattern" element={<PatternGame />} />
          <Route path="/mathreasoning" element={<MathReasoningGame />} />
          <Route path="/socialthinking" element={<SocialThinkingQuiz />} />
          
          {/* User Dashboard Route */}
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/classes" element={<Classes />} />

          {/* Fallback route for unknown paths */}
          <Route path="*" element={<Navigate to="/memory" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
