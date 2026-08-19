package com.jobhub.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * User Entity
 * 
 * This class represents the "users" table in the MySQL database.
 * It stores all registered users of the JobHub platform regardless of their role.
 * 
 * A User can be one of three types:
 *  - ADMIN     : Has full control over the platform
 *  - COMPANY   : Can post jobs and manage applications
 *  - CANDIDATE : Can browse jobs and apply for them
 * 
 * Lombok annotations are used to reduce boilerplate code by auto-generating
 * getters, setters, and constructors at compile time.
 * 
 * JPA/Hibernate annotations handle the mapping between this Java class
 * and the corresponding MySQL table automatically.
 */
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    /** Unique identifier for each user. Auto-incremented by the database. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Full name of the user. Cannot be empty. */
    @Column(nullable = false)
    private String name;

    /** Email address used for login. Must be unique across all users. */
    @Column(nullable = false, unique = true)
    private String email;

    /** 
     * User's password. 
     * Stored in encrypted form using BCrypt — never stored as plain text.
     */
    @Column(nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private String password;

    /** 
     * Role of the user in the system.
     * Determines which pages and features the user can access after login.
     * Stored as text (ADMIN / COMPANY / CANDIDATE) in the database.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    /** Optional contact number of the user. */
    private String phone;

    /** 
     * Path or URL to the user's uploaded resume.
     * Only relevant for CANDIDATE role.
     */
    @Column(name = "resume_url")
    private String resumeUrl;

    /** 
     * Timestamp of when the user registered.
     * Set automatically when the record is first saved.
     * Cannot be changed once set.
     */
    @Column(updatable = false)
    private LocalDateTime createdAt;

    /** 
     * Automatically sets the registration timestamp
     * just before the user record is saved to the database.
     */
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    /** 
     * Defines the three roles available in the JobHub system.
     * Each role has different access permissions throughout the application.
     */
    public enum Role {
        ADMIN,      // Manages users, jobs, and the entire platform
        COMPANY,    // Posts jobs and reviews candidate applications
        CANDIDATE   // Searches and applies for jobs
    }
}