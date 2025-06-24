package com.cognitive.app.config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.http.HttpMethod;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // optional
                .and()
                .authorizeHttpRequests()
                .requestMatchers(HttpMethod.POST, "/api/auth/signup", "/api/auth/login","api/auth/parentEmail").permitAll()
                .requestMatchers("/api/**").permitAll()
                .anyRequest().authenticated()
                .and()
                .formLogin().disable();

        return http.build();
    }
}