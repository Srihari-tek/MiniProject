package com.cognitive.app.controller;

import com.cognitive.app.model.AttentionGameResult;
import com.cognitive.app.service.AttentionGameService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/game-result")
@CrossOrigin(origins = "http://localhost:5173")
public class AttentionGameController {

    private final AttentionGameService attentionGameService;

    public AttentionGameController(AttentionGameService attentionGameService) {
        this.attentionGameService = attentionGameService;
    }

    @PostMapping("/submit")
    public AttentionGameResult submitResult(@RequestBody AttentionGameResult result) {
        return attentionGameService.saveResult(result);
    }

    @GetMapping("/{userId}")
    public List<AttentionGameResult> getUserResults(@PathVariable String userId) {
        return attentionGameService.getResultsByUser(userId);
    }

    @GetMapping("/{userId}/gamescores")
    public List<Map<String, String>> getUserGameScores(@PathVariable String userId) {
        return attentionGameService.getUserGameScores(userId);
    }
}
