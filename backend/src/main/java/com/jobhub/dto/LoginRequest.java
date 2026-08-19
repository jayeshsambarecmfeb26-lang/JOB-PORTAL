package com.jobhub.dto;

import jakarta.validation.constraints.*;
import lombok.*;

/**
 * LoginRequest DTO
 *
 * This class represents the data sent from the React Login page
 * to the backend when a user tries to sign in.
 *
 * Only two fields are needed for login — email and password.
 * If credentials are correct, the backend returns a JWT token
 * inside an AuthResponse object.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginRequest {

    /**
     * Email address entered by the user on the login form.
     * Used to find the user account in the database.
     */
    @NotBlank(message = "Email is required")
    @Email(message = "Enter a valid email address")
    private String email;

    /**
     * Password entered by the user on the login form.
     * Compared against the encrypted password stored in the database
     * using BCrypt matching — never compared as plain text.
     */
    @NotBlank(message = "Password is required")
    private String password;
}