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
  const [answers, setAnswers] = useState({});

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
      question: "What should you do when someone is talking to you?",
      image: "listening.png",
      options: [
        { text: "Look away and ignore them", isCorrect: false },
        { text: "Listen attentively and respond politely", isCorrect: true },
        { text: "Interrupt them to talk about yourself", isCorrect: false },
      ],
    },
    {
      id: 4,
      question: "How can you show kindness to a new student at school?",
      image: "kindness.png",
      options: [
        { text: "Introduce yourself and offer to show them around", isCorrect: true },
        { text: "Ignore them because they are new", isCorrect: false },
        { text: "Make fun of them", isCorrect: false },
      ],
    },
    {
      id: 5,
      question: "If you borrow something from a friend, what should you do?",
      image: "borrow.png",
      options: [
        { text: "Return it in good condition and say thank you", isCorrect: true },
        { text: "Keep it because they forgot about it", isCorrect: false },
        { text: "Lose it and not tell them", isCorrect: false },
      ],
    },
    {
      id: 6,
      question: "How can you make a friend feel included in a game?",
      image: "include.png",
      options: [
        { text: "Invite them to join and explain the rules", isCorrect: true },
        { text: "Tell them they can only watch", isCorrect: false },
        { text: "Ignore them if they ask to play", isCorrect: false },
      ],
    },
    {
      id: 7,
      question: "What should you do if someone is being bullied?",
      image: "bully.png",
      options: [
        { text: "Tell a trusted adult and support the person being bullied", isCorrect: true },
        { text: "Join in with the bullying", isCorrect: false },
        { text: "Pretend you didn’t see anything", isCorrect: false },
      ],
    },
    {
      id: 8,
      question: "How should you respond when someone shares good news with you?",
      image: "happy_news.png",
      options: [
        { text: "Congratulate them and show excitement", isCorrect: true },
        { text: "Tell them your news is better", isCorrect: false },
        { text: "Ignore them and change the subject", isCorrect: false },
      ],
    },
    {
      id: 9,
      question: "What should you do when you make a mistake?",
      image: "mistake.png",
      options: [
        { text: "Deny it and blame someone else", isCorrect: false },
        { text: "Admit it, apologize, and try to fix it", isCorrect: true },
        { text: "Pretend it never happened", isCorrect: false },
      ],
    },
    {
      id: 10,
      question: "If you see a friend struggling with something, what can you do?",
      image: "help_friend.png",
      options: [
        { text: "Offer to help them", isCorrect: true },
        { text: "Laugh and make fun of them", isCorrect: false },
        { text: "Walk away and let them figure it out alone", isCorrect: false },
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
      "Welcome to the Social Thinking Ability Quiz. Please choose the most appropriate answer.";
    speakText(instructions);
  }, []);

  const handleOptionSelect = (questionId, isCorrect) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: isCorrect,
    }));
  };

  const handleNext = () => {
    const currentQuestion = selectedQuestions[currentQuestionIndex];
    const selected = document.querySelector(`input[name="q${currentQuestion.id}"]:checked`);
    if (selected) {
      handleOptionSelect(currentQuestion.id, JSON.parse(selected.value));
    }
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handleSubmit = () => {
    const currentQuestion = selectedQuestions[currentQuestionIndex];
    const selected = document.querySelector(`input[name="q${currentQuestion.id}"]:checked`);
    if (selected) {
      handleOptionSelect(currentQuestion.id, JSON.parse(selected.value));
    }

    const finalAnswers = { ...answers };
    if (selected) {
      finalAnswers[currentQuestion.id] = JSON.parse(selected.value);
    }

    const newScore = Object.values(finalAnswers).filter(Boolean).length;
    setScore(newScore);

    const newCategory =
      newScore >= 3 ? "High" : newScore === 2 ? "Moderate" : "Low";
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
    <div className="social-thinking-game">
      <div className="social-container">
        <div className="game-header">
          <h1>Social Thinking Ability Quiz</h1>
          <p>
            In this quiz, you'll be presented with various scenarios about social behavior. Choose the best answer.
          </p>
          <button 
            className="btn speak-btn" 
            onClick={() => speakText("In this quiz, you'll be presented with various scenarios about social behavior.")}
          >
            🔊 Hear Instructions
          </button>
        </div>

        {!gameOver ? (
          selectedQuestions.length > 0 && currentQuestionIndex < selectedQuestions.length ? (
            <motion.div
              className="question-card"
              key={currentQuestionIndex}
              initial={{ x: "100vw" }}
              animate={{ x: 0 }}
              transition={{ type: "spring", stiffness: 50 }}
            >
              <img
                src={selectedQuestions[currentQuestionIndex]?.image}
                alt="Question"
                style={{ width: "150px", marginBottom: "20px" }}
              />
              <h2 className="question">{selectedQuestions[currentQuestionIndex]?.question}</h2>
              <div className="answers-grid">
                {selectedQuestions[currentQuestionIndex]?.options.map((option, index) => (
                  <div key={index} className="answer-option">
                    <input
                      type="radio"
                      id={`option${index}`}
                      name={`q${selectedQuestions[currentQuestionIndex]?.id}`}
                      value={option.isCorrect}
                      onChange={() =>
                        handleOptionSelect(selectedQuestions[currentQuestionIndex]?.id, option.isCorrect)
                      }
                    />
                    <label htmlFor={`option${index}`}>
                      <span>{option.text}</span>
                    </label>
                  </div>
                ))}
              </div>
              {currentQuestionIndex < selectedQuestions.length - 1 ? (
                <button onClick={handleNext} className="btn">
                  Next Question
                </button>
              ) : (
                <button onClick={handleSubmit} className="btn">
                  Submit Quiz
                </button>
              )}
            </motion.div>
          ) : (
            <div className="question-card">
              <p>Loading questions...</p>
            </div>
          )
        ) : (
          <motion.div 
            className="result"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 1 }}
          >
            <h2>
              You answered {score} out of {selectedQuestions.length} correctly.
            </h2>
            <h3>Your category is: {category}</h3>
            <button
              className="btn speak-btn"
              onClick={() =>
                speakText(`You answered ${score} out of ${selectedQuestions.length} correctly. Your category is ${category}.`)
              }
            >
              🔊 Hear Result
            </button>
            <button className="btn" onClick={() => navigate("/dashboard")}>
              Return to Homepage
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};


export default SocialThinkingQuiz;
