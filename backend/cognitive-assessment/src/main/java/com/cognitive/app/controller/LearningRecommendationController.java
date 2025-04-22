package com.cognitive.app.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpStatusCodeException;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class LearningRecommendationController {

    private final String FLASK_API_URL = "http://localhost:5000/recommend";
    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/get-recommendations")
    public ResponseEntity<?> getRecommendations(@RequestBody Map<String, String> requestBody) {
        try {
            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Create request entity
            HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(requestBody, headers);

            // Make request to Flask API
            ResponseEntity<Map> response = restTemplate.exchange(FLASK_API_URL, HttpMethod.POST, requestEntity, Map.class);

            return ResponseEntity.ok(response.getBody());

        } catch (HttpStatusCodeException e) {
            // Log HTTP errors
            return ResponseEntity.status(e.getStatusCode()).body("Error from Flask API: " + e.getResponseBodyAsString());
        } catch (Exception e) {
            // Log other errors
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal Server Error: " + e.getMessage());
        }
    }
}
