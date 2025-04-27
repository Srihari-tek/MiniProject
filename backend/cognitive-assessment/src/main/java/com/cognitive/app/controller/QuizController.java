package com.cognitive.app.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.cognitive.app.service.QuizService;


import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quiz")
@CrossOrigin(origins = "http://localhost:5173")
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    // Get quiz based on learning recommendation
    @GetMapping("/api/learning/{recommendation}")
    public List<Map<String, Object>> getLearningQuiz(@PathVariable String recommendation) {
        return quizService.getLearningQuiz(recommendation);
    }

    @GetMapping("/api/skills")
    public List<Map<String, Object>> getSkillQuiz() {
        return quizService.getSkillQuiz();
    }

    @PostMapping("/api/quiz/submit")
    public ResponseEntity<String> submitQuiz(@RequestBody Map<String, Object> quizResult) {
        quizService.saveQuizResult(quizResult); // <-- Save to DB
        return ResponseEntity.ok("Quiz result saved successfully!");
    }

}
