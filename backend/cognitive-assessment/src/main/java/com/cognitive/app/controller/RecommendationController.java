package com.cognitive.app.controller;

import com.cognitive.app.service.RecommendationService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/recommendation")
@CrossOrigin(origins = "http://localhost:5173")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping("/{userId}")
    public Map<String, Object> getRecommendation(@PathVariable String userId) {
        return recommendationService.getLearningRecommendation(userId);
    }

}
