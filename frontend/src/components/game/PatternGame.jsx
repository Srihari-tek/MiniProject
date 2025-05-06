import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './PatternGame.css';

const PatternGame = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());

  const totalQuestions = 10;

  const questions = [
    { question: "Which shape completes the pattern? ◼ ◻ ◼ ◻ ___", options: ["◼", "◻", "🔺"], correctAnswer: "◼", type: "pattern" },
    { question: "What comes next in the sequence? A, C, E, G, ___", options: ["H", "I", "J"], correctAnswer: "I", type: "letter" },
    { question: "Listen to the pattern: Clap, Stomp, Clap, Stomp, ___", options: ["Clap", "Snap", "Stomp"], correctAnswer: "Clap", type: "sound" },
    { question: "Which color comes next? 🔴🟡🔴🟡 ___", options: ["🟢", "🔴", "🔵"], correctAnswer: "🔴", type: "color" },
    { question: "Which object fits the pattern? 🚗 🚲 🚗 🚲 ___", options: ["🚗", "🚲", "🛴"], correctAnswer: "🚗", type: "object" },
    { question: "What comes next? 2, 4, 8, 16, ___", options: ["24", "32", "64"], correctAnswer: "32", type: "number" },
    { question: "Which day comes next? Monday, Wednesday, Friday, ___", options: ["Saturday", "Sunday", "Tuesday"], correctAnswer: "Sunday", type: "day" },
    { question: "What is missing in the sequence? 🟠🔺🟠🔺 ___", options: ["🟠", "🔺", "🔵"], correctAnswer: "🟠", type: "shape" },
    { question: "Which note comes next? 21, 18, 15, 12, ___", options: ["8", "9", "10"], correctAnswer: "9", type: "math" },
    { question: "What comes next? Apple, Banana, Apple, Banana, ___", options: ["Apple", "Banana", "Grapes"], correctAnswer: "Apple", type: "fruit" }
  ];

  const [shuffledQuestions] = useState([...questions].sort(() => 0.5 - Math.random()).slice(0, 5));

  const speakText = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.rate = 1;
    window.speechSynthesis.speak(speech);
  };

  useEffect(() => {
    const instructions = "Welcome to the Pattern Recognition Game. In this game, you will be asked pattern-based questions. Select the correct answer to complete each pattern. Good luck!";
    speakText(instructions);
  }, []);

  const handleAnswerClick = (option) => {
    if (!answeredQuestions.has(currentQuestion)) {
      if (option === shuffledQuestions[currentQuestion].correctAnswer) {
        setScore(score + 1);
      }
      setAnsweredQuestions(prev => new Set([...prev, currentQuestion]));
    }
    setSelectedAnswer(option);
  };

  const nextQuestion = () => {
    if (currentQuestion + 1 < shuffledQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setGameOver(true);
      sendGameResult();
      speakText(`Game Over! Your score is ${score} out of 5. You are categorized as ${categorizeScore()}.`);
    }
  };

  const categorizeScore = () => {
    if (score >= 4) return "High";
    if (score >= 2) return "Moderate";
    return "Low";
  };

  const sendGameResult = async () => {
    const userId = localStorage.getItem("username") || "guest";
    const data = {
      userId,
      gameName: "Pattern Recognition Game",
      score,
      correctAnswers: score,
      totalQuestions: shuffledQuestions.length,
      timeTaken: 120,
      category: categorizeScore(),
    };

    try {
      const response = await axios.post("http://localhost:9090/api/game-result/submit", data, {
        headers: { "Content-Type": "application/json" }
      });
      console.log("Game result sent:", response.data);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  const handleNextGame = () => {
    navigate("/mathreasoning");
  };

  return (
    <div className="pattern-game">
      <div className="game-container">
        <div className="profile-container">
          <h1>Pattern Recognition Game</h1>
          <p>
            In this game, you will be presented with a series of questions that test your ability to recognize patterns.
          </p>
          <button 
            className="speak-btn" 
            onClick={() => speakText("In this game, you will be presented with a series of questions that test your ability to recognize patterns.")}
          >
            🔊 Hear Instructions
          </button>
          
          {gameOver ? (
            <div className="profile-card">
              <h2>Game Over! Your Score: {score} / 5</h2>
              <p>Kindly press next game button to move to next game</p>
              <button className="next-btn" onClick={handleNextGame}>
                Next Game
              </button>
            </div>
          ) : (
            <div className="profile-card">
              <p className="question-text">
                {shuffledQuestions[currentQuestion].question}
              </p>
              <div className="option-container">
                {shuffledQuestions[currentQuestion].options.map((option) => (
                  <div key={option} className="option">
                    <input
                      type="radio"
                      id={option}
                      name="answer"
                      value={option}
                      checked={selectedAnswer === option}
                      onChange={() => handleAnswerClick(option)}
                    />
                    <label htmlFor={option}>
                      {option}
                    </label>
                  </div>
                ))}
              </div>
              <button 
                onClick={nextQuestion} 
                className="profile-details"
                disabled={selectedAnswer === null}
              >
                Next Question
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatternGame;
