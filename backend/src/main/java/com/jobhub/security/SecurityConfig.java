package com.jobhub.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.http.HttpMethod;

import java.util.List;

/**
 * SecurityConfig - Spring Security Configuration
 *
 * This class configures the entire security setup for the JobHub backend.
 * It defines:
 *  - Which API endpoints are public (no login required)
 *  - Which endpoints require authentication
 *  - Which endpoints are restricted to specific roles
 *  - JWT filter registration
 *  - Password encryption method
 *  - CORS policy to allow React frontend to communicate with this backend
 *
 * Since we are using JWT, there are no sessions stored on the server.
 * Every request must carry a valid JWT token to prove identity.
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    /**
     * Main security filter chain configuration.
     * Defines all the security rules for the application.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Disable CSRF — not needed for REST APIs using JWT
            .csrf(csrf -> csrf.disable())

            // Enable CORS so React (port 3000) can talk to Spring Boot (port 8080)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // Define which endpoints are public and which require login
            .authorizeHttpRequests(auth -> auth

                // Public endpoints — no token required
                .requestMatchers("/api/auth/**").permitAll()       // login, register
                .requestMatchers("/api/stats").permitAll()         // public stats
                .requestMatchers("/resumes/**").permitAll()        // uploaded resumes
                .requestMatchers(HttpMethod.GET, "/api/jobs", "/api/jobs/{id}").permitAll() // browse jobs and detail
                .requestMatchers(HttpMethod.GET, "/api/companies", "/api/companies/**").permitAll() // browse companies
                .requestMatchers(org.springframework.http.HttpMethod.POST,
                        "/api/contact").permitAll()                 // contact form submit
                .requestMatchers("/api/contact").hasRole("ADMIN")   // contact read/delete

                // Company only endpoints
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/jobs").hasRole("COMPANY")
                .requestMatchers("/api/applications/job/**").hasRole("COMPANY")

                // Candidate only endpoints
                .requestMatchers("/api/applications/my").hasRole("CANDIDATE")
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/applications").hasRole("CANDIDATE")

                // Admin only endpoints
                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                // All other endpoints require authentication
                .anyRequest().authenticated()
            )

            // Use STATELESS session — no server side sessions
            // Every request must carry JWT token to prove identity
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            // Register our JWT filter to run before Spring's default auth filter
            // This ensures token is validated before any request hits the controller
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Password Encoder Bean
     *
     * BCrypt is a strong one-way hashing algorithm for passwords.
     * Passwords are never stored as plain text in the database.
     * When user registers   → password is encrypted using BCrypt before saving
     * When user logs in     → entered password is matched against stored hash
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Authentication Manager Bean
     * Used in AuthService to authenticate user credentials during login.
     */
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * CORS Configuration
     *
     * CORS (Cross Origin Resource Sharing) policy allows the React frontend
     * running on http://localhost:3000 to make API calls to the Spring Boot
     * backend running on http://localhost:8080.
     * Without this, the browser blocks all cross-origin requests.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // Allow requests from React frontend
        config.setAllowedOrigins(List.of("http://localhost:3000"));

        // Allow all standard HTTP methods
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Allow Authorization header so JWT token can be sent
        config.setAllowedHeaders(List.of("*"));

        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}