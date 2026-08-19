package com.jobhub.repository;

import com.jobhub.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

/**
 * UserRepository
 *
 * This interface handles all database operations for the User entity.
 *
 * By extending JpaRepository, Spring Data JPA automatically provides
 * the following operations without writing a single SQL query:
 *  - save()        : Insert or update a user
 *  - findById()    : Find user by their ID
 *  - findAll()     : Get all users
 *  - deleteById()  : Delete a user by ID
 *  - count()       : Count total users
 *
 * The two custom methods below are automatically implemented by Spring
 * just by following the naming convention — no SQL needed.
 */
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Finds a user by their email address.
     * Used during login to fetch the user and verify their password.
     * Returns Optional to safely handle the case where email is not found.
     */
    Optional<User> findByEmail(String email);

    /**
     * Checks if a user with the given email already exists in the database.
     * Used during registration to prevent duplicate accounts.
     * Returns true if email exists, false if it is available.
     */
    boolean existsByEmail(String email);

    /**
     * Count users by role
     */
    long countByRole(User.Role role);
}