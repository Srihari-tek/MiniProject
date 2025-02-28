package com.cognitive.app.service;

import com.cognitive.app.model.AttentionGameResult;
import com.cognitive.app.repository.AttentionGameRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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
}
