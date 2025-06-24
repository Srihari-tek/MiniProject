package com.cognitive.app.service;

import com.cognitive.app.model.Users;
import com.cognitive.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public String signup(Users user) {
        Optional<Users> existingUser = userRepository.findByParentEmail(user.getParentEmail());

        if (existingUser.isPresent()) {
            return "Email already registered.";
        }

        // Generate username using studentName and id (after save, when id is assigned)
        Users savedUser = userRepository.save(user);

        String username = generateUsername(savedUser.getStudentName(), savedUser.getId());
        savedUser.setUsername(username);
        userRepository.save(savedUser);

        return "Signup successful.";
    }

    private String generateUsername(String studentName, Long id) {
        String cleanName = studentName.trim().toLowerCase().replaceAll("\\s+", "");
        return cleanName + id;
    }


    public String login(String email, String password) {
        Optional<Users> userOptional = userRepository.findByParentEmail(email);

        if (userOptional.isEmpty()) {
            return "No account found.";
        }

        Users user = userOptional.get();

        if (user.getPassword().equals(password)) {
            return "Login successful.";
        } else {
            return "Incorrect password.";
        }
    }
}

