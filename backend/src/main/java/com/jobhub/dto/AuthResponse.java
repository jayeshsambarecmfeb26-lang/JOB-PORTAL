package com.jobhub.dto;

import lombok.*;

/**
 * AuthResponse DTO
 *
 * This class represents the data the backend sends BACK to React
 * after a successful login or registration.
 *
 * React receives this response and stores the JWT token
 * in localStorage so the user stays logged in.
 * The role is used to redirect the user to their correct dashboard.
 *
 * Flow:
 *  User logs in successfully
 *  → Backend returns AuthResponse with token, role, name, email
 *  → React stores the token
 *  → React reads the role and redirects to correct dashboard
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    /**
     * JWT token generated after successful login.
     * React stores this and sends it in every future request header.
     */
    private String token;

    /**
     * Role of the logged in user.
     * Used by React to redirect to the correct dashboard.
     * Values: ADMIN, COMPANY, CANDIDATE
     */
    private String role;

    /** Name of the logged in user. Displayed in the navbar. */
    private String name;

    /** Email of the logged in user. */
    private String email;
}