package com.cognitive.app.controller;

import com.cognitive.app.model.Users;
import com.cognitive.app.repository.UserRepository;
import com.cognitive.app.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")  // Allow frontend React
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public String signup(@RequestBody Users user) {
        return authService.signup(user);
    }

    @PostMapping("/login")
    public String login(@RequestBody Users loginRequest) {
        return authService.login(loginRequest.getParentEmail(), loginRequest.getPassword());
    }

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/username/{username}")
    public ResponseEntity<Users> getUserByUsername(@PathVariable String username) {
        Optional<Users> user = userRepository.findByUsername(username);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @GetMapping("/parentEmail/{email}")
    public ResponseEntity<Users> getUserByParentEmail(@PathVariable String email) {
        Optional<Users> userOpt = userRepository.findByParentEmail(email);
        return userOpt.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

}
