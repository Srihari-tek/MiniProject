import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MemoryGame.css"; 
import apple from "../../assets/images/apple.png";
import banana from "../../assets/images/banana.png";
import cherry from "../../assets/images/cherry.png";
import grape from "../../assets/images/grape.png";
import mango from "../../assets/images/mango.png";
import orange from "../../assets/images/orange.png";
import peach from "../../assets/images/peach.png";
import pear from "../../assets/images/pear.png";
import plum from "../../assets/images/plum.png";
import strawberry from "../../assets/images/strawberry.png";

const fruitsList = [
  { name: "Apple", image: apple },
  { name: "Banana", image: banana },
  { name: "Cherry", image: cherry },
  { name: "Grape", image: grape },
  { name: "Mango", image: mango },
  { name: "Orange", image: orange },
  { name: "Peach", image: peach },
  { name: "Pear", image: pear },
  { name: "Plum", image: plum },
  { name: "Strawberry", image: strawberry }
];

const MemoryGame = () => {
  const navigate = useNavigate();
  const [fruits, setFruits] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showFruits, setShowFruits] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [category, setCategory] = useState("");
  const totalQuestions = 5;
  const [timeTaken, setTimeTaken] = useState(0);

  useEffect(() => {
    const shuffledFruits = [...fruitsList].sort(() => Math.random() - 0.5).slice(0, 5);
    setFruits(shuffledFruits);
    let elapsedTime = 0;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        elapsedTime++;
        if (prev === 1) {
          clearInterval(timer);
          setShowFruits(false);
          setTimeTaken(elapsedTime);
          speakText("Now, recall and type the names of the fruits in order.");
        }
        return prev - 1;
      });
    }, 1000);

    speakText("Welcome to the Memory Game! Memorize the names of the fruits displayed. You will have 30 seconds. After that, recall and type the fruit names in order.");
    
    return () => clearInterval(timer);
  }, []);

  const speakText = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.rate = 1;
    window.speechSynthesis.speak(speech);
  };

  const handleInputChange = (index, value) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[index] = value;
    setUserAnswers(updatedAnswers);
  };

  const checkAnswers = () => {
    let correctCount = 0;
    for (let i = 0; i < fruits.length; i++) {
      if (userAnswers[i]?.toLowerCase() === fruits[i].name.toLowerCase()) {
        correctCount++;
      }
    }
    setScore(correctCount);

    let category = "Basic-Beginner";
    if (correctCount >= 4) category = "Basic-Smart";
    else if (correctCount >= 2) category = "Basic-Intermediate";
    setCategory(category);
    setGameOver(true);

    speakText(`Game Over! You scored ${correctCount} out of 5. You are categorized as ${category}.`);

    sendGameResult(correctCount, category);
  };

  const sendGameResult = async (correctAnswers, category) => {
    const userId = localStorage.getItem("username") || "guest";
    const data = {
      userId,
      gameName: "Memory Game",
      score: correctAnswers,
      correctAnswers,
      totalQuestions,
      timeTaken,
      category,
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

  return (
    <div className="game-container">
      <h1>Memory Game</h1>
      <p>
        In this game, you will see a set of five fruits for 30 seconds. Memorize them carefully. 
        After the time is up, you will be asked to recall and type their names in the correct order.
      </p>
      <button className="speak-btn" onClick={() => speakText("In this game, you will see a set of five fruits for 30 seconds. Memorize them carefully. After the time is up, you will be asked to recall and type their names in the correct order.")}>
        🔊 Hear Instructions
      </button>
      
      {showFruits ? (
        <>
          <h2>Memorize these fruits ({timeLeft}s left)</h2>
          <div className="fruit-grid">
            {fruits.map((fruit, index) => (
              <div key={index} className="fruit-card">
                <img src={fruit.image} alt={fruit.name} className="fruit-image"/>
                <span className="fruit-name">{fruit.name}</span>
              </div>
            ))}
          </div>
        </>
      ) : !gameOver ? (
        <>
          <h2>Enter the fruits in order:</h2>
          {fruits.map((_, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Fruit ${index + 1}`}
              onChange={(e) => handleInputChange(index, e.target.value)}
              className="input-field"
            />
          ))}
          <br />
          <button className="submit-btn" onClick={checkAnswers}>Submit</button>
        </>
      ) : (
        <>
          <h2>Game Over! You are categorized as: {category}</h2>
          <h3>Score: {score}/5</h3>
          <button className="speak-btn" onClick={() => speakText(`Game Over! You scored ${score} out of 5. You are categorized as ${category}.`)}>
            🔊 Hear Result
          </button>
          <button className="next-btn" onClick={() => navigate("/boxclickgame")}>Next Game</button>
        </>
      )}
    </div>
  );
};

export default MemoryGame;
