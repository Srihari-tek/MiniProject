import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import "./SocialThinkingGame.css";

const SocialThinkingQuiz = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [category, setCategory] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  const allQuestions = [
    {
      id: 1,
      question: "How should you behave when someone accidentally bumps into you?",
      image: "bump.png",
      options: [
        { text: "Yell at them", isCorrect: false },
        { text: "Politely tell them it's okay", isCorrect: true },
        { text: "Ignore them and walk away", isCorrect: false },
      ],
    },
    {
      id: 2,
      question: "What should you do if you see someone feeling sad?",
      image: "sad.png",
      options: [
        { text: "Ask if they're okay and offer help", isCorrect: true },
        { text: "Laugh at them", isCorrect: false },
        { text: "Ignore them", isCorrect: false },
      ],
    },
    {
      id: 3,
      question: "If you're in a group conversation, what should you do?",
      image: "group.png",
      options: [
        { text: "Interrupt others when you have something to say", isCorrect: false },
        { text: "Talk over others to be heard", isCorrect: false },
        { text: "Listen carefully and wait for your turn to speak", isCorrect: true },
      ],
    },
    {
      id: 4,
      question: "How do you show empathy to a friend?",
      image: "empathy.png",
      options: [
        { text: "Ignore them", isCorrect: false },
        { text: "Listen and validate their feelings", isCorrect: true },
        { text: "Tell them to move on", isCorrect: false },
      ],
    },
    {
      id: 5,
      question: "What should you do when someone is talking to you?",
      image: "listening.png",
      options: [
        { text: "Make eye contact and respond appropriately", isCorrect: true },
        { text: "Look away and ignore them", isCorrect: false },
        { text: "Interrupt them with your own story", isCorrect: false },
      ],
    },
    {
      id: 6,
      question: "How can you include someone who feels left out?",
      image: "inclusion.png",
      options: [
        { text: "Ignore them", isCorrect: false },
        { text: "Make fun of them", isCorrect: false },
        { text: "Invite them to join the conversation", isCorrect: true },
      ],
    },
  ];


  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    setSelectedQuestions(allQuestions.sort(() => 0.5 - Math.random()).slice(0, 5));
    const instructions =
      "Welcome to the Social Thinking Ability Quiz. In this quiz, you will be asked questions about how to behave in various social situations. Please choose the most appropriate answer for each question. Good luck!";
    speakText(instructions);
  }, []);

  const handleNext = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handleSubmit = () => {
    let newScore = 0;
    selectedQuestions.forEach((q) => {
      const selected = document.querySelector(`input[name="q${q.id}"]:checked`);
      if (selected && JSON.parse(selected.value)) {
        newScore++;
      }
    });

    setScore(newScore);
    let newCategory = newScore >= 3 ? "Smart" : newScore === 2 ? "Intermediate" : "Beginner";
    setCategory(newCategory);
    setGameOver(true);
    speakText(`You answered ${newScore} out of ${selectedQuestions.length} correctly. Your category is ${newCategory}.`);
    sendGameResult(newScore, newCategory);
  };

  const sendGameResult = async (score, category) => {
    const userId = localStorage.getItem("username") || "guest";
    const data = {
      userId,
      gameName: "Social Thinking Quiz",
      score,
      totalQuestions: selectedQuestions.length,
      category,
    };

    try {
      await axios.post("http://localhost:9090/api/game-result/submit", data, {
        headers: { "Content-Type": "application/json" },
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  return (
    <motion.div
      style={{ textAlign: "center", padding: "20px", fontFamily: "Arial, sans-serif" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <h1>Social Thinking Ability Quiz</h1>
      <p>
        In this quiz, you'll be presented with various scenarios about social behavior. Choose the answer you believe best demonstrates appropriate social thinking.
      </p>
      <button className="speak-btn" onClick={() => speakText("In this quiz, you'll be presented with various scenarios about social behavior. Choose the answer you believe best demonstrates appropriate social thinking.")}> 🔊 Hear Instructions </button>
      {!gameOver ? (
        selectedQuestions.length > 0 && currentQuestionIndex < selectedQuestions.length ? (
          <motion.div key={currentQuestionIndex} initial={{ x: "100vw" }} animate={{ x: 0 }} transition={{ type: "spring", stiffness: 50 }}>
            <img src={selectedQuestions[currentQuestionIndex]?.image} alt="Question" style={{ width: "100px", marginBottom: "10px" }} />
            <h2>{selectedQuestions[currentQuestionIndex]?.question}</h2>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              {selectedQuestions[currentQuestionIndex]?.options.map((option, index) => (
                <motion.label key={index} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }} whileHover={{ scale: 1.1 }}>
                  <input type="radio" name={`q${selectedQuestions[currentQuestionIndex]?.id}`} value={option.isCorrect} style={{ marginRight: "10px" }} />
                  {option.text}
                </motion.label>
              ))}
            </div>
            {currentQuestionIndex < selectedQuestions.length - 1 ? (
              <button onClick={handleNext} className="btn"> Next </button>
            ) : (
              <button onClick={handleSubmit} className="btn"> Submit </button>
            )}
          </motion.div>
        ) : (
          <p>Loading questions...</p>
        )
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <h2>You answered {score} out of {selectedQuestions.length} correctly.</h2>
          <h3>Your category is: {category}</h3>
          <button className="speak-btn" onClick={() => speakText(`You answered ${score} out of ${selectedQuestions.length} correctly. Your category is ${category}.`)}> 🔊 Hear Result </button>
          <button className="next-btn" onClick={() => navigate("/dashboard")}> Homepage </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SocialThinkingQuiz;
