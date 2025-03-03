import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import "./math.css"; // Import CSS file

const MathReasoningGame = () => {
  const navigate = useNavigate(); // React Router navigation hook

  const questionsData = [
    { question: "5 + 3 × 2 =", options: [10, 11, 12], answer: 11 },
    { question: "10 ÷ 2 + 4 =", options: [9, 8, 7], answer: 9 },
    { question: "6 × 3 - 5 =", options: [13, 12, 11], answer: 13 },
    { question: "8 × 2 - 6 =", options: [8, 10, 12], answer: 10 },
    { question: "12 ÷ 3 + 7 =", options: [10, 11, 12], answer: 11 },
    { question: "4 × (5 + 2) =", options: [28, 30, 32], answer: 28 },
    { question: "(9 + 3) ÷ 3 =", options: [4, 6, 5], answer: 4 },
    { question: "7 × (4 + 3) - 5 =", options: [44, 42, 40], answer: 44 },
    { question: "12 ÷ (3 + 3) × 2 =", options: [4, 5, 6], answer: 4 },
    { question: "(8 + 6) × 2 =", options: [28, 26, 24], answer: 28 },
  ];

  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showRules, setShowRules] = useState(true);

  // Text-to-speech function
  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const shuffledQuestions = [...questionsData].sort(() => 0.5 - Math.random()).slice(0, 5);
    setSelectedQuestions(shuffledQuestions);

    const instructions = "Welcome to the Math Reasoning Game. Solve math problems using the BODMAS rule.";
    speakText(instructions);

    const timer = setTimeout(() => {
      setShowRules(false);
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  const handleOptionChange = (event) => {
    setSelectedAnswer(parseInt(event.target.value));
  };

  const handleOptionClick = (option) => {
    setSelectedAnswer(option);
  };

  const confirmSelection = () => {
    if (selectedAnswer !== null) {
      if (selectedAnswer === selectedQuestions[currentQuestionIndex].answer) {
        setScore(score + 1);
      }
      setSelectedAnswer(null);
      if (currentQuestionIndex < selectedQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setGameOver(true);
      }
    }
  };

  const getCategory = () => {
    if (score >= 4) return "Smart";
    if (score === 3) return "Intermediate";
    return "Beginner";
  };

  const submitResult = async () => {
    const userId = localStorage.getItem("username") || "guest";
    const data = {
      userId,
      gameName: "Math Reasoning Game",
      score,
      correctAnswers: score,
      totalQuestions: selectedQuestions.length,
      timeTaken: 120, // Example time
      category: getCategory(),
    };

    try {
      const response = await axios.post("http://localhost:9090/api/game-result/submit", data, {
        headers: { "Content-Type": "application/json" }
      });
      console.log("Game result sent:", response.data);
      alert(`Your category: ${getCategory()}`);
      navigate("/socialthinking"); // Navigate to the next game
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  return (
    <div className="math-game-container">
      <h1>Math Reasoning Game</h1>
      <p className="game-description">
        Solve math problems using the BODMAS rule.
      </p>
      <button className="speak-btn" onClick={() => speakText("Solve math problems using the BODMAS rule.")}>
        🔊 Hear Game Description
      </button>
      
      {showRules ? (
        <div className="math-rules-container">
          <div className="math-rules-content">
            <h2>BODMAS Rules</h2>
            <ul>
              <li><strong>B</strong>rackets</li>
              <li><strong>O</strong>rders (Exponents)</li>
              <li><strong>D</strong>ivision</li>
              <li><strong>M</strong>ultiplication</li>
              <li><strong>A</strong>ddition</li>
              <li><strong>S</strong>ubtraction</li>
            </ul>
            <button onClick={() => setShowRules(false)}>Start Game</button>
          </div>
        </div>
      ) : (
        <>
          {!gameOver ? (
            <>
              <p className="question fade-in">{selectedQuestions[currentQuestionIndex]?.question}</p>
              <div className="math-options">
                {selectedQuestions[currentQuestionIndex]?.options.map((option, index) => (
                  <div className="math-option fade-in" key={index} onClick={() => handleOptionClick(option)}>
                    <input
                      type="radio"
                      id={`option-${index}`}
                      name="answer"
                      value={option}
                      checked={selectedAnswer === option}
                      onChange={handleOptionChange}
                    />
                    <label htmlFor={`option-${index}`}>{option}</label>
                  </div>
                ))}
              </div>
              <button onClick={confirmSelection} disabled={selectedAnswer === null}>
                Confirm Selection
              </button>
            </>
          ) : (
            <>
              <p className="math-result fade-in">Your Score: {score} / {selectedQuestions.length}</p>
              <p className="math-result fade-in">Category: {getCategory()}</p>
              <button className="next-btn" onClick={submitResult}>
                Next Game
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default MathReasoningGame;
