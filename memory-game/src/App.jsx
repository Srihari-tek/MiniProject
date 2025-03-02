import React, { useState } from "react";
import MemoryGame from "./MemoryGame";
import PatternGame from "./PatternGame";
import BoxClickGame from "./BoxClickGame";
import MathReasoningGame from "./MathReasoningGame";
import SocialThinkingQuiz from "./SocialThinkingQuiz";
import UserDashboard from "./UserDashboard";
import './App.css'

const App = () => {
  const [gameStage, setGameStage] = useState("memory");

  return (
    <div>
      {gameStage === "memory" ? (
        <MemoryGame onNextGame={() => setGameStage("boxclickgame")} />
      ) :  gameStage === "boxclickgame" ? (
        <BoxClickGame onNextGame={() => setGameStage("pattern")} />
      ) : gameStage === "pattern" ? (
        <PatternGame onNextGame={() => setGameStage("mathreasoning")} />
      ) : gameStage === "mathreasoning" ? (
        <MathReasoningGame onNextGame={() => setGameStage("socialthinking")} />
      ) : gameStage === "socialthinking" ? (
        <SocialThinkingQuiz onNextGame={() => setGameStage("userdashboard")} />
      ) : ( 
        <UserDashboard/>
      )}
    </div>
  );
};

export default App;
