package com.cognitive.app.service;

import com.cognitive.app.model.AttentionGameResult;
import com.cognitive.app.repository.AttentionGameRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;

@Service
public class AttentionGameService {

    private final AttentionGameRepository attentionGameRepository;

    public AttentionGameService(AttentionGameRepository attentionGameRepository) {
        this.attentionGameRepository = attentionGameRepository;
    }

    @Transactional
    public AttentionGameResult saveResult(AttentionGameResult result) {
        return attentionGameRepository.save(result);
    }

    public List<AttentionGameResult> getResultsByUser(String userId) {
        return attentionGameRepository.findByUserId(userId);
    }

    public List<Map<String, String>> getUserGameScores(String userId) {
        List<AttentionGameResult> results = attentionGameRepository.findByUserId(userId);

        return results.stream().map(result -> {
            Map<String, String> gameData = new HashMap<>();
            gameData.put("game", result.getGameName());
            gameData.put("category", result.getCategory());
            return gameData;
        }).collect(Collectors.toList());
    }
}
