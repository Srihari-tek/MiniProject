package com.cognitive.app.service;

import com.cognitive.app.model.AttentionGameResult;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class RecommendationService {

    private final AttentionGameService attentionGameService;
    private final RestTemplate restTemplate;

    public RecommendationService(AttentionGameService attentionGameService, RestTemplate restTemplate) {
        this.attentionGameService = attentionGameService;
        this.restTemplate = restTemplate;
    }

    public Map<String, Object> getLearningRecommendation(String userId) {
        List<AttentionGameResult> results = attentionGameService.getResultsByUser(userId);

        Map<String, Object> flaskInput = new HashMap<>();
        flaskInput.put("Age", 9); // Placeholder
        flaskInput.put("Gender", "Other"); // Placeholder
        flaskInput.put("Diagnosis", "Autism"); // Placeholder

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

        String flaskUrl = "http://localhost:5000/predict";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(flaskInput, headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(flaskUrl, HttpMethod.POST, request, Map.class);
            Map<String, Object> responseBody = response.getBody();

            String recommendation = responseBody.get("recommendation").toString();

            // ⚡ NEW: Handle multiple recommendations
            List<String> learningResources = new ArrayList<>();
            String[] individualRecommendations = recommendation.split(",");

            for (String rec : individualRecommendations) {
                rec = rec.trim(); // remove spaces
                learningResources.addAll(mapRecommendationToResources(rec));
            }

            Map<String, Object> finalResult = new HashMap<>();
            finalResult.put("recommendation", recommendation);
            finalResult.put("resources", learningResources);
            return finalResult;

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("recommendation", "Error fetching recommendation");
            error.put("resources", Collections.emptyList());
            return error;
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

    private List<String> mapRecommendationToResources(String recommendation) {
        Map<String, List<String>> mapping = new HashMap<>();

        mapping.put("Maintain current learning strategy", Arrays.asList(
                "https://www.researchgate.net/publication/334548277_Supporting_Learners_to_Sustain_Their_Learning_Strategies",
                "https://resilienteducator.com/classroom-resources/maintaining-effective-study-habits/"
        ));

        mapping.put("Incorporate motor skill exercises", Arrays.asList(
                "https://www.theottoolbox.com/motor-planning-activities/",
                "https://www.parentcircle.com/article/10-gross-motor-activities-for-kids/"
        ));

        mapping.put("Use peer modeling and social stories", Arrays.asList(
                "https://www.autismspeaks.org/social-stories",
                "https://www.do2learn.com/SocialSkills/",
                "https://www.youtube.com/watch?v=5aZ6Fd0gzxk"
        ));

        mapping.put("Use memory games", Arrays.asList(
                "https://www.memozor.com/memory-games/for-kids",
                "https://www.education.com/games/memory/"
        ));

        mapping.put("Apply visual math tools", Arrays.asList(
                "https://www.mathlearningcenter.org/resources/apps",
                "https://www.coolmath4kids.com/manipulatives"
        ));

        mapping.put("Include logical puzzles", Arrays.asList(
                "https://www.mathplayground.com/logicgames.html",
                "https://www.brainzilla.com/logic/logic-grid/"
        ));

        return mapping.getOrDefault(recommendation, List.of("No specific resources available for this recommendation"));
    }
}
