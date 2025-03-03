import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./BoxClickGame.css";

const BoxClickGame = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false); // New state to prevent duplicate API calls
  const [gameOverMessage, setGameOverMessage] = useState("");
  const [currentColor, setCurrentColor] = useState("blue");
  const navigate = useNavigate(); 
  const colors = ["red", "blue", "green", "yellow", "purple"];

  const gameDescription =
    "Welcome to the Box Click Game! Click the blue circle to earn points. The game lasts 30 seconds. Try to get the highest score!";

  useEffect(() => {
    speakText(gameDescription);
  }, []);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setIsGameRunning(true);
    setIsGameOver(false); // Reset game over flag
    setGameOverMessage("");
    changeColor();
  };

  useEffect(() => {
    if (isGameRunning && timeLeft > 0) {
      const gameInterval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
        changeColor();
      }, 1000);
      return () => clearInterval(gameInterval);
    }

    if (timeLeft === 0 && isGameRunning && !isGameOver) {
      showFinalScore();
    }
  }, [isGameRunning, timeLeft, isGameOver]);

  const changeColor = () => {
    const newColor = colors[Math.floor(Math.random() * colors.length)];
    setCurrentColor(newColor);
  };

  const handleClick = () => {
    if (currentColor === "blue") {
      setScore((prevScore) => prevScore + 1);
    }
    changeColor();
  };

  const categorizeScore = () => {
    if (score >= 8) return "Basic-Smart";
    if (score >= 5) return "Basic-Intermediate";
    return "Basic-Beginner";
  };

  const showFinalScore = () => {
    if (isGameOver) return; // Prevent duplicate execution

    setIsGameOver(true); // Mark game as over
    setIsGameRunning(false);
    
    const category = categorizeScore();
    const finalMessage = `Game Over! Your final score is ${score}. Category: ${category}.`;
    setGameOverMessage(finalMessage);
    speakText(finalMessage);
    sendGameResult(score, category);
  };

  const sendGameResult = async (score, category) => {
    const userId = localStorage.getItem("username") || "guest";
    const data = {
      userId,
      gameName: "BoxClickGame",
      score,
      correctAnswers: score,
      totalQuestions: 10,
      timeTaken: 30 - timeLeft,
      category,
    };

    try {
      await axios.post("http://localhost:9090/api/game-result/submit", data, {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  const speakText = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.rate = 1;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
  };

  const goToNextGame = () => {
    navigate("/pattern");
  };
  // ... existing code ...

  return (
    <div className="game-container">
      <h1>Box Click Game</h1>
      <p className="game-description">{gameDescription}</p>
      <button className="tts-button" onClick={() => speakText(gameDescription)}>
        🔊 Hear Instructions
      </button>

      <div className="score-timer">
        <p>Time Left: {timeLeft}s</p>
        <p>Score: {score}</p>
      </div>

      <div className="circle" style={{ backgroundColor: currentColor }} onClick={handleClick}></div>

      {!isGameRunning && !isGameOver && (
        <button className="start-button" onClick={startGame}>
          Start Game
        </button>
      )}

      {gameOverMessage && <div className="game-over-popup">{gameOverMessage}</div>}

      {isGameOver && (
        <button className="next-btn" onClick={goToNextGame}>Next Game</button>
      )}
    </div>
  );
};

export default BoxClickGame;