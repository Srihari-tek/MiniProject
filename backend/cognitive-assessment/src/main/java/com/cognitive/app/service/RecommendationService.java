package com.cognitive.app.service;

import com.cognitive.app.model.AttentionGameResult;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RecommendationService {

    private final AttentionGameService attentionGameService;
    private final RestTemplate restTemplate;

    public RecommendationService(AttentionGameService attentionGameService, RestTemplate restTemplate) {
        this.attentionGameService = attentionGameService;
        this.restTemplate = restTemplate;
    }

    public String getLearningRecommendation(String userId) {
        // Step 1: Fetch cognitive scores from DB
        List<AttentionGameResult> results = attentionGameService.getResultsByUser(userId);

        // Step 2: Map data to Flask model format
        Map<String, Object> flaskInput = new HashMap<>();
        flaskInput.put("Age", 9); // Placeholder - update with actual data
        flaskInput.put("Gender", "Other"); // Placeholder
        flaskInput.put("Diagnosis", "Autism"); // Placeholder

        // You should ideally fetch and compute average scores for these categories
        flaskInput.put("Memory_Score", getScoreFor(results, "Memory Game"));
        flaskInput.put("Memory_Level", getCategoryFor(results, "Memory Game"));

        flaskInput.put("Math_Reasoning_Score", getScoreFor(results, "Math Reasoning Game"));
        flaskInput.put("Math_Reasoning_Level", getCategoryFor(results, "Math Reasoning Game"));

        flaskInput.put("Logical_Thinking_Score", getScoreFor(results, "Pattern Recognition Game"));
        flaskInput.put("Logical_Thinking_Level", getCategoryFor(results, "Pattern Recognition Game"));

        flaskInput.put("Motor_Skills_Score", getScoreFor(results, "BoxClickGame"));
        flaskInput.put("Motor_Skills_Level", getCategoryFor(results, "BoxClickGame"));

        flaskInput.put("Social_Understanding_Score", getScoreFor(results, "Social Thinking Quiz"));
        flaskInput.put("Social_Understanding_Level", getCategoryFor(results, "Social Thinking Quiz"));

        // Step 3: Send to Flask
        String flaskUrl = "http://localhost:5000/predict";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(flaskInput, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(flaskUrl, request, String.class);
            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"recommendation\": \"Error fetching recommendation\"}";
        }
    }

    private double getScoreFor(List<AttentionGameResult> results, String gameName) {
        return results.stream()
                .filter(r -> r.getGameName().equalsIgnoreCase(gameName))
                .mapToInt(AttentionGameResult::getScore)
                .average()
                .orElse(0);
    }

    private String getCategoryFor(List<AttentionGameResult> results, String gameName) {
        return results.stream()
                .filter(r -> r.getGameName().equalsIgnoreCase(gameName))
                .map(AttentionGameResult::getCategory)
                .findFirst()
                .orElse("Low");
    }
}
