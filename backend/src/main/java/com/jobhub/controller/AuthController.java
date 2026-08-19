package com.jobhub.controller;

import com.jobhub.dto.*;
import com.jobhub.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * AuthController - Authentication REST Controller
 *
 * This class exposes the login and registration API endpoints
 * that the React frontend calls when a user signs up or logs in.
 *
 * Base URL: /api/auth
 *
 * Endpoints:
 *  POST /api/auth/register  → Register a new user
 *  POST /api/auth/login     → Login existing user
 *
 * Both endpoints are public — no JWT token required.
 * This is configured in SecurityConfig under permitAll().
 *
 * @RestController  — marks this as a REST API controller
 *                    automatically converts return objects to JSON
 * @RequestMapping  — sets the base URL for all endpoints in this class
 * @CrossOrigin     — allows React (port 3000) to call these endpoints
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthService authService;

    /**
     * Register a new user.
     *
     * URL     : POST /api/auth/register
     * Access  : Public — no token required
     * Request : RegisterRequest JSON body from React
     * Response: AuthResponse with JWT token and user details
     *
     * @Valid triggers Spring Validation on the RegisterRequest fields
     * If any validation fails, Spring automatically returns 400 Bad Request
     *
     * @param request - registration data from React registration form
     * @return 200 OK with AuthResponse containing token and user info
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request) {

        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Login an existing user.
     *
     * URL     : POST /api/auth/login
     * Access  : Public — no token required
     * Request : LoginRequest JSON body from React
     * Response: AuthResponse with JWT token and user details
     *
     * @param request - login credentials from React login form
     * @return 200 OK with AuthResponse containing token and user info
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request) {

        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}