package com.jobhub.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

/**
 * JwtUtil - JWT Token Utility Class
 *
 * This class is responsible for everything related to JWT tokens:
 *  - Generating a new token when user logs in
 *  - Extracting user information from a token
 *  - Validating whether a token is valid or expired
 *
 * JWT Token Structure:
 *  Header    : algorithm used (HS256)
 *  Payload   : user data stored inside (email, role, expiry)
 *  Signature : secret key signature to verify token is not tampered
 *
 * Flow:
 *  User logs in → JwtUtil generates token → token sent to React
 *  → React stores token → sends token in every request header
 *  → JwtUtil validates token → user is identified
 */
@Component
public class JwtUtil {

    /**
     * Secret key read from application.properties.
     * Used to sign and verify every JWT token.
     * Must be kept secret — never expose this value.
     */
    @Value("${app.jwt.secret}")
    private String jwtSecret;

    /**
     * Token expiry duration read from application.properties.
     * Default is 86400000 milliseconds = 24 hours.
     * After this time the token expires and user must login again.
     */
    @Value("${app.jwt.expiration}")
    private long jwtExpiration;

    /**
     * Converts the secret string into a cryptographic Key object
     * that can be used for signing and verifying tokens.
     */
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    /**
     * Generates a new JWT token for a successfully logged in user.
     * Stores the user's email as the subject inside the token.
     * Token is signed with the secret key and set to expire in 24 hours.
     *
     * @param email - email of the logged in user
     * @return signed JWT token string
     */
    public String generateToken(String email, String role, String name) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .claim("name", name)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Extracts the email address stored inside the JWT token.
     * Used to identify which user is making the request.
     *
     * @param token - JWT token from the request header
     * @return email address of the user
     */
    public String extractEmail(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    /**
     * Validates the JWT token by checking:
     *  1. Token signature matches our secret key (not tampered)
     *  2. Token has not expired
     *
     * @param token - JWT token from the request header
     * @return true if token is valid, false if invalid or expired
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}