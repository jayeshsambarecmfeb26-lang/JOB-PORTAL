package com.jobhub.service;

import com.jobhub.dto.*;
import com.jobhub.entity.Company;
import com.jobhub.entity.User;
import com.jobhub.repository.CompanyRepository;
import com.jobhub.repository.UserRepository;
import com.jobhub.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * AuthService - Authentication Business Logic
 *
 * This class handles all the business logic for:
 *  - User Registration
 *  - User Login
 *
 * It sits between the AuthController (which receives requests)
 * and the UserRepository (which talks to the database).
 *
 * Flow for Registration:
 *  React sends RegisterRequest
 *  → AuthController receives it
 *  → AuthService validates, encrypts password, saves user
 *  → Returns AuthResponse with JWT token
 *
 * Flow for Login:
 *  React sends LoginRequest
 *  → AuthController receives it
 *  → AuthService verifies credentials
 *  → Returns AuthResponse with JWT token
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    /**
     * Registers a new user in the system.
     *
     * Steps:
     *  1. Check if email is already taken
     *  2. Encrypt the password using BCrypt
     *  3. Convert RegisterRequest DTO into a User entity
     *  4. Save the user to the database
     *  5. Generate a JWT token for the new user
     *  6. Return AuthResponse with token and user details
     *
     * @param request - registration data from React frontend
     * @return AuthResponse containing JWT token and user info
     */
    public AuthResponse register(RegisterRequest request) {

        // Step 1: Check if email already exists in the database
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already registered");
        }

        // Step 2 & 3: Build User entity from the request data
        // Password is encrypted using BCrypt before saving
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.valueOf(request.getRole()))
                .phone(request.getPhone())
                .build();

        // Step 4: Save the new user to the database
        userRepository.save(user);

        // Auto-create company profile if role is COMPANY
        
        
        if (user.getRole() == User.Role.COMPANY) {
            Company company = Company.builder()
                    .name(user.getName())
                    .user(user)
                    .website(request.getWebsite()) // <-- This is the line we added
                    .build();
            companyRepository.save(company);
        }
//        if (user.getRole() == User.Role.COMPANY) {
//            Company company = Company.builder()
//                    .name(user.getName())
//                    .user(user)
//                    .build();
//            companyRepository.save(company);
//        }

        // Step 5: Generate JWT token using the user's email, role, and name
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getName());

        // Step 6: Return response with token and user details
        return AuthResponse.builder()
                .token(token)
                .role(user.getRole().name())
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }

    /**
     * Logs in an existing user.
     *
     * Steps:
     *  1. Use Spring Security's AuthenticationManager to verify credentials
     *  2. If credentials are wrong, exception is thrown automatically
     *  3. Load the user from database
     *  4. Generate a JWT token
     *  5. Return AuthResponse with token and user details
     *
     * @param request - login credentials from React frontend
     * @return AuthResponse containing JWT token and user info
     */
    public AuthResponse login(LoginRequest request) {

        // Step 1: Verify email and password using Spring Security
        // This internally loads the user and checks BCrypt password match
        // Throws BadCredentialsException automatically if wrong
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // Step 2: Load user from database after successful authentication
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Step 3: Generate JWT token for the logged in user
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getName());

        // Step 4: Return response with token and user details
        return AuthResponse.builder()
                .token(token)
                .role(user.getRole().name())
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }
}