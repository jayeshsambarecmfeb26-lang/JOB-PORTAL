package com.jobhub.controller;

import com.jobhub.dto.*;
import com.jobhub.entity.Application;
import com.jobhub.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ApplicationController - Application REST Controller
 *
 * This class exposes all application related API endpoints
 * that the React frontend calls for job application operations.
 *
 * Base URL: /api/applications
 *
 * Endpoints:
 *  POST /api/applications                    → Apply for a job (CANDIDATE)
 *  GET  /api/applications/my                 → My applications (CANDIDATE)
 *  GET  /api/applications/job/{jobId}        → Applicants for a job (COMPANY)
 *  PUT  /api/applications/{id}/status        → Accept or Reject (COMPANY)
 *  GET  /api/applications/all               → All applications (ADMIN)
 */
@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ApplicationController {

    private final ApplicationService applicationService;

    /**
     * Submit a new job application.
     * Requires CANDIDATE role JWT token.
     * Called when Candidate clicks Apply on a job listing.
     *
     * @param request        - jobId and coverLetter from React
     * @param authentication - logged in candidate from JWT token
     * @return 200 OK with newly created application
     */
    @PostMapping
    public ResponseEntity<Application> applyForJob(
            @Valid @RequestBody ApplicationRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(
                applicationService.applyForJob(request, email));
    }

    /**
     * Get all applications submitted by the logged in candidate.
     * Requires CANDIDATE role JWT token.
     * Used on the My Applications page.
     *
     * @param authentication - logged in candidate from JWT token
     * @return 200 OK with list of candidate's applications
     */
    @GetMapping("/my")
    public ResponseEntity<List<Application>> getMyApplications(
            Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(
                applicationService.getMyApplications(email));
    }

    /**
     * Get all applications received for a specific job.
     * Requires COMPANY role JWT token.
     * Used on Company Dashboard when viewing applicants.
     *
     * @param jobId - ID of the job from URL path
     * @return 200 OK with list of applications for this job
     */
    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<Application>> getApplicationsByJob(
            @PathVariable Long jobId) {
        return ResponseEntity.ok(
                applicationService.getApplicationsByJob(jobId));
    }

    /**
     * Update the status of an application.
     * Requires COMPANY role JWT token.
     * Called when Company accepts or rejects a candidate.
     *
     * @param id      - ID of the application to update
     * @param request - new status (ACCEPTED or REJECTED)
     * @return 200 OK with updated application
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<Application> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody ApplicationStatusRequest request) {
        return ResponseEntity.ok(
                applicationService.updateApplicationStatus(id, request));
    }

    /**
     * Get all applications across the platform.
     * Requires ADMIN role JWT token.
     * Used on the Admin Panel to monitor all activity.
     *
     * @return 200 OK with list of all applications
     */
    @GetMapping("/all")
    public ResponseEntity<List<Application>> getAllApplications() {
        return ResponseEntity.ok(applicationService.getAllApplications());
    }
}