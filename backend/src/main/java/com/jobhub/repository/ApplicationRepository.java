package com.jobhub.repository;

import com.jobhub.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

/**
 * ApplicationRepository
 *
 * This interface handles all database operations for the Application entity.
 *
 * Extends JpaRepository to get all standard CRUD operations for free.
 * All custom methods below are auto-implemented by Spring Data JPA
 * based on their method names — no SQL needed.
 */
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    /**
     * Finds all applications submitted by a specific candidate.
     * Used on the My Applications page to show a candidate
     * all the jobs they have applied for and their current status.
     */
    List<Application> findByCandidateId(Long candidateId);

    /**
     * Finds all applications received for a specific job.
     * Used on the Company Dashboard to show all candidates
     * who have applied for a particular job listing.
     */
    List<Application> findByJobId(Long jobId);

    /**
     * Checks if a candidate has already applied for a specific job.
     * Used before saving a new application to prevent
     * the same candidate from applying to the same job twice.
     * Returns true if application already exists, false otherwise.
     */
    boolean existsByCandidateIdAndJobId(Long candidateId, Long jobId);
}