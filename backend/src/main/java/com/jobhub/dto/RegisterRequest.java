package com.jobhub.dto;

import jakarta.validation.constraints.*;
import lombok.*;

/**
 * RegisterRequest DTO (Data Transfer Object)
 *
 * This class represents the data that the React frontend sends
 * to the backend when a new user fills in the Registration form.
 *
 * DTO means this class is only used to carry data between
 * frontend and backend. It is never saved directly to the database.
 * The data from this DTO is first validated, then transferred
 * into a User entity and saved.
 *
 * Validation annotations ensure the data is clean and correct
 * before any processing happens — no manual if-else checks needed.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {

    /**
     * Full name of the user.
     * Cannot be blank — must contain at least one character.
     */
    @NotBlank(message = "Name is required")
    private String name;

    /**
     * Email address of the user.
     * Must be a valid email format (example@domain.com).
     * Cannot be blank.
     */
    @NotBlank(message = "Email is required")
    @Email(message = "Enter a valid email address")
    private String email;

    /**
     * Password chosen by the user.
     * Must be at least 6 characters long.
     * Will be encrypted before saving to the database.
     */
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    /**
     * Role the user is registering as.
     * Accepted values: CANDIDATE or COMPANY
     * ADMIN accounts are created manually — not through registration.
     */
    @NotBlank(message = "Role is required")
    private String role;

    /** Optional phone number of the user. */
    private String phone;
    
    private String website;
}