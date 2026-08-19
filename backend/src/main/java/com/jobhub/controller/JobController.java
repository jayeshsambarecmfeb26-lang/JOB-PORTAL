package com.jobhub.controller;

import com.jobhub.dto.JobRequest;
import com.jobhub.entity.Job;
import com.jobhub.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * JobController - Job REST Controller
 *
 * This class exposes all job related API endpoints
 * that the React frontend calls for job operations.
 *
 * Base URL: /api/jobs
 *
 * Endpoints:
 *  GET    /api/jobs              → Get all open jobs (public)
 *  GET    /api/jobs/{id}         → Get job by ID (public)
 *  GET    /api/jobs/search       → Search jobs by keyword (public)
 *  GET    /api/jobs/my           → Get company's own jobs (COMPANY)
 *  POST   /api/jobs              → Post a new job (COMPANY)
 *  PUT    /api/jobs/{id}         → Update a job (COMPANY)
 *  DELETE /api/jobs/{id}         → Delete a job (COMPANY)
 *  PUT    /api/jobs/{id}/close   → Close a job (COMPANY)
 *
 * Authentication object is injected automatically by Spring Security
 * from the JWT token — gives us the logged in user's email.
 */
@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class JobController {

    private final JobService jobService;

    /**
     * Get all open job listings.
     * Public endpoint — no token required.
     * Used on the Job Listings page visible to everyone.
     *
     * @return 200 OK with list of open jobs
     */
    @GetMapping
    public ResponseEntity<List<Job>> getAllOpenJobs() {
        return ResponseEntity.ok(jobService.getAllOpenJobs());
    }

    /**
     * Get a single job by its ID.
     * Public endpoint — no token required.
     * Used on the Job Detail page.
     *
     * @param id - job ID from the URL path
     * @return 200 OK with job details
     */
    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    /**
     * Search jobs by keyword in the title.
     * Public endpoint — no token required.
     * Used by the search bar on Job Listings page.
     *
     * Example: GET /api/jobs/search?keyword=java
     *
     * @param keyword - search term from the search bar
     * @return 200 OK with list of matching jobs
     */
    @GetMapping("/search")
    public ResponseEntity<List<Job>> searchJobs(
            @RequestParam String keyword) {
        return ResponseEntity.ok(jobService.searchJobs(keyword));
    }

    /**
     * Get all jobs posted by the logged in company.
     * Requires COMPANY role JWT token.
     * Used on the Company Dashboard.
     *
     * Authentication object is injected by Spring Security
     * and contains the logged in user's email from the JWT token.
     *
     * @param authentication - logged in user info from JWT token
     * @return 200 OK with list of company's job listings
     */
    @GetMapping("/my")
    public ResponseEntity<List<Job>> getMyJobs(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(jobService.getJobsByCompany(email));
    }

    /**
     * Post a new job listing.
     * Requires COMPANY role JWT token.
     * Called when Company submits the Post Job form.
     *
     * @param request        - job details from React Post Job form
     * @param authentication - logged in company user from JWT token
     * @return 200 OK with the newly created job
     */
    @PostMapping
    public ResponseEntity<Job> createJob(
            @Valid @RequestBody JobRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(jobService.createJob(request, email));
    }

    /**
     * Update an existing job listing.
     * Requires COMPANY role JWT token.
     *
     * @param id             - ID of the job to update
     * @param request        - updated job details from React
     * @param authentication - logged in company user from JWT token
     * @return 200 OK with updated job
     */
    @PutMapping("/{id}")
    public ResponseEntity<Job> updateJob(
            @PathVariable Long id,
            @Valid @RequestBody JobRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(jobService.updateJob(id, request, email));
    }

    /**
     * Delete a job listing permanently.
     * Requires COMPANY role JWT token.
     *
     * @param id - ID of the job to delete
     * @return 204 No Content on successful deletion
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Close a job listing.
     * Job remains in database but stops accepting applications.
     * Requires COMPANY role JWT token.
     *
     * @param id - ID of the job to close
     * @return 200 OK with updated job showing CLOSED status
     */
    @PutMapping("/{id}/close")
    public ResponseEntity<Job> closeJob(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.closeJob(id));
    }

    /**
     * Toggles a job listing's status between OPEN and CLOSED.
     * Requires COMPANY role JWT token.
     *
     * @param id - ID of the job to toggle
     * @return 200 OK with updated job showing the new status
     */
    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<Job> toggleJobStatus(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.toggleJobStatus(id));
    }
}