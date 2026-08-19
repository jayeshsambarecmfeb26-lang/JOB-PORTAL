package com.jobhub.security;

import com.jobhub.entity.User;
import com.jobhub.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * JwtFilter - JWT Authentication Filter
 *
 * This filter runs automatically on every incoming HTTP request
 * before it reaches any controller.
 *
 * Its job is to:
 *  1. Check if the request has a JWT token in the Authorization header
 *  2. Validate the token using JwtUtil
 *  3. Extract the user's email from the token
 *  4. Load the user from the database
 *  5. Set the user as authenticated in Spring Security
 *
 * If the token is missing or invalid, the request is not authenticated
 * and Spring Security will block access to protected endpoints.
 *
 * Flow:
 *  React sends request with header: "Authorization: Bearer <token>"
 *  → JwtFilter intercepts the request
 *  → Extracts and validates the token
 *  → Identifies the user and their role
 *  → Passes the request to the controller
 */
@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // Step 1: Read the Authorization header from the request
        // Expected format: "Bearer eyJhbGciOiJIUzI1NiJ9..."
        String authHeader = request.getHeader("Authorization");

        // Step 2: Check if header exists and starts with "Bearer "
        // If not present, skip authentication and continue the filter chain
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Step 3: Extract just the token part by removing "Bearer " prefix
        String token = authHeader.substring(7);

        // Step 4: Validate the token — check signature and expiry
        if (jwtUtil.validateToken(token)) {

            // Step 5: Extract the email stored inside the token
            String email = jwtUtil.extractEmail(token);

            // Step 6: Load the full user object from the database using email
            User user = userRepository.findByEmail(email).orElse(null);

            if (user != null) {
                // Step 7: Create an authentication object with the user's role
                // "ROLE_" prefix is required by Spring Security
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                user.getEmail(), // FIXED: Store the email string as the principal, NOT the User object
                                null,
                                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
                        );

                // Step 8: Register the authenticated user in Spring Security context
                // This tells Spring Security that this request is authenticated
                // and which role the user has for authorization checks
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        // Step 9: Pass the request along to the next filter or controller
        filterChain.doFilter(request, response);
    }
}