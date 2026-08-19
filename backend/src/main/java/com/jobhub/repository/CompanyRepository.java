package com.jobhub.repository;

import com.jobhub.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

/**
 * CompanyRepository
 *
 * This interface handles all database operations for the Company entity.
 *
 * Extends JpaRepository to get all standard CRUD operations for free.
 * The custom method below is auto-implemented by Spring Data JPA
 * based on the method name — no SQL needed.
 */
public interface CompanyRepository extends JpaRepository<Company, Long> {

    /**
     * Finds a company profile by the User ID linked to it.
     * Used after login to load the company profile of the logged in user.
     * Example: When a COMPANY user logs in, we fetch their company
     * details using their user ID to show on the dashboard.
     */
    Optional<Company> findByUserId(Long userId);
}