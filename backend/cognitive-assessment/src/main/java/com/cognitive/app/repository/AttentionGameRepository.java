package com.cognitive.app.repository;

import com.cognitive.app.model.AttentionGameResult;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AttentionGameRepository extends JpaRepository<AttentionGameResult, Long> {
    List<AttentionGameResult> findByUserId(String userId);
}
