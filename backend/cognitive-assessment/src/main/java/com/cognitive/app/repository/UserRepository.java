package com.cognitive.app.repository;

import com.cognitive.app.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<Users, Long> {
    Optional<Users> findByParentEmail(String parentEmail);
    Optional<Users> findByUsername(String username);
}
