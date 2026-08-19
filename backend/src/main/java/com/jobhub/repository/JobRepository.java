package com.jobhub.repository;

import com.jobhub.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

/**
 * JobRepository
 *
 * This interface handles all database operations for the Job entity.
 *
 * Extends JpaRepository to get all standard CRUD operations for free.
 * All three custom methods below are auto-implemented by Spring Data JPA
 * based on their method names — no SQL needed.
 */
public interface JobRepository extends JpaRepository<Job, Long> {

    /**
     * Finds all jobs with a specific status.
     * Used on the Job Listings page to show only OPEN jobs to candidates.
     * Example: findByStatus(JobStatus.OPEN) returns all available jobs.
     */
    List<Job> findByStatus(Job.JobStatus status);

    /**
     * Finds all jobs posted by a specific company.
     * Used on the Company Dashboard to show that company's own job listings.
     * Example: findByCompanyId(5) returns all jobs posted by company with ID 5.
     */
    List<Job> findByCompanyId(Long companyId);

    /**
     * Searches for jobs where the title contains the given keyword.
     * Case insensitive — searching "java" also matches "Java" and "JAVA".
     * Used for the job search feature on the listings page.
     */
    List<Job> findByTitleContainingIgnoreCase(String keyword);

    /**
     * Count jobs by status
     */
    long countByStatus(Job.JobStatus status);
}