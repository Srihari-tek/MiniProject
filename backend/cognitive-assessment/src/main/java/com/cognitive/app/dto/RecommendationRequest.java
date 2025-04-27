package com.cognitive.app.dto;

import java.util.Map;

public class RecommendationRequest {
    private String userId;
    private Map<String, Object> results;

    public RecommendationRequest() {
    }

    public RecommendationRequest(String userId, Map<String, Object> results) {
        this.userId = userId;
        this.results = results;
    }

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

    @Override
    public String toString() {
        return "RecommendationRequest{" +
                "userId='" + userId + '\'' +
                ", results=" + results +
                '}';
    }

}
