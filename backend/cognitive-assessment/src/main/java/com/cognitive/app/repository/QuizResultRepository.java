package com.cognitive.app.repository;



import com.cognitive.app.model.QuizResultEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuizResultRepository extends JpaRepository<QuizResultEntity, Long> {
    List<QuizResultEntity> findByUserId(String userId);
}

