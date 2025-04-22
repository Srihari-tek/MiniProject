package com.cognitive.app.dto;

import java.util.Map;

public class RecommendationRequest {
    private String userId;
    private Map<String, Object> results; // Use Map<String, Object> to match the Flask model format

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Map<String, Object> getResults() {
        return results;
    }

    public void setResults(Map<String, Object> results) {
        this.results = results;
    }
}
