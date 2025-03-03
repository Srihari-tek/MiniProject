import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./BoxClickGame.css";

const BoxClickGame = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [gameOverMessage, setGameOverMessage] = useState("");
  const [currentColor, setCurrentColor] = useState("blue");
  const navigate = useNavigate(); // For navigation
  const colors = ["red", "blue", "green", "yellow", "purple"];

  const gameDescription =
    "Welcome to the Box Click Game! Click the blue circle to earn points. The game lasts 30 seconds. Try to get the highest score!";

  useEffect(() => {
    speakText(gameDescription); // Automatically read instructions when the game loads
  }, []);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setIsGameRunning(true);
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

    if (timeLeft === 0) {
      setIsGameRunning(false);
      showFinalScore();
    }
  }, [isGameRunning, timeLeft]);

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
    if (score >= 8) return "Advanced";
    if (score >= 5) return "Intermediate";
    return "Beginner";
  };

  const showFinalScore = () => {
    const category = categorizeScore();
    const finalMessage = `Game Over! Your final score is ${score}. Category: ${category}`;
    setGameOverMessage(finalMessage);
    speakText(finalMessage); // Speak final score and category
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

  // Navigate to next game
  const goToNextGame = () => {
    navigate("/pattern"); // Change this to the actual next game's route
  };

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

      <button className="start-button" onClick={startGame} disabled={isGameRunning}>
        Start Game
      </button>

      {gameOverMessage && <div className="game-over-popup">{gameOverMessage}</div>}

      <button className="next-btn" onClick={goToNextGame}>Next Game</button>
    </div>
  );
};

export default BoxClickGame;
