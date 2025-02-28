import React, { useState, useEffect } from "react";
import axios from "axios";
import "./math.css"; // Import CSS file

const MathReasoningGame = ({ onNextGame }) => {
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
  const [showRules, setShowRules] = useState(true); // Show BODMAS instructions

  // Text-to-speech function
  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    // Shuffle and select 5 random questions from the pool of questions
    const shuffledQuestions = [...questionsData].sort(() => 0.5 - Math.random()).slice(0, 5);
    setSelectedQuestions(shuffledQuestions);

    // Speak game description and rules when the game loads
    const instructions = "Welcome to the Math Reasoning Game. In this game, you will solve math problems based on the BODMAS rule. Please pay attention to the rules displayed on the screen.";
    speakText(instructions);

    // Hide rules after 15 seconds
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
      timeTaken: 120, // Example: 120 seconds (you can dynamically track time)
      category: getCategory(),
    };

    try {
      const response = await axios.post("http://localhost:9090/api/game-result/submit", data, {
        headers: { "Content-Type": "application/json" }
      });
      console.log("Game result sent:", response.data);
      alert(`Your category: ${getCategory()}`);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  const closeRules = () => {
    setShowRules(false);
  };

  return (
    <div className="math-game-container">
      <h1>Math Reasoning Game</h1>
      {/* Clear Game Description */}
      <p className="game-description">
        In this game, you'll solve math problems using the BODMAS rule. First, read the rules, then answer each question by selecting the correct option. Try to get as many correct as possible!
      </p>
      <button className="speak-btn" onClick={() => speakText("In this game, you'll solve math problems using the BODMAS rule. First, read the rules, then answer each question by selecting the correct option. Try to get as many correct as possible!")}>
        🔊 Hear Game Description
      </button>
      
      {showRules ? (
        <div className="math-rules-container">
          <div className="math-rules-content">
            <h2>BODMAS Rules</h2>
            <p><strong>BODMAS</strong> stands for:</p>
            <ul>
              <li><strong>B</strong>rackets (Parentheses)</li>
              <li><strong>O</strong>rders (Exponents)</li>
              <li><strong>D</strong>ivision</li>
              <li><strong>M</strong>ultiplication</li>
              <li><strong>A</strong>ddition</li>
              <li><strong>S</strong>ubtraction</li>
            </ul>
            <p>BODMAS specifies the order in which we should perform mathematical operations.</p>
            <p><strong>Order of operations:</strong></p>
            <ol>
              <li>First, solve anything inside <strong>brackets</strong>.</li>
              <li>Next, handle any <strong>orders</strong> (exponents or square roots).</li>
              <li>Then, perform any <strong>division</strong> and <strong>multiplication</strong> (from left to right).</li>
              <li>Finally, perform any <strong>addition</strong> and <strong>subtraction</strong> (from left to right).</li>
            </ol>
            <p><strong>Example:</strong>  
              Solve <code>5 + 3 × 2</code>.<br/>
              According to BODMAS, you do multiplication first: <code>3 × 2 = 6</code>, then add: <code>5 + 6 = 11</code>.
            </p>
            <button onClick={closeRules}>Start Game</button>
            <button className="speak-btn" onClick={() => speakText("Here are the BODMAS rules. B stands for brackets, O stands for orders, D for division, M for multiplication, A for addition and S for subtraction. Solve the math problems accordingly.")}>
              🔊 Hear Rules
            </button>
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
              <button className="next-btn" onClick={() => { submitResult(); onNextGame(); }}>
                Next Game
              </button>
              <button className="speak-btn" onClick={() => speakText(`Your Score is ${score} out of ${selectedQuestions.length}. You are categorized as ${getCategory()}.`)}>
                🔊 Hear Result
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default MathReasoningGame;
