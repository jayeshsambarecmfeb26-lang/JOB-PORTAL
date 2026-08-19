package com.jobhub.service;

import com.jobhub.dto.*;
import com.jobhub.entity.*;
import com.jobhub.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * ApplicationService - Application Business Logic
 *
 * This class handles all business logic related to job applications:
 *  - Candidate applies for a job
 *  - Candidate views their own applications
 *  - Company views all applicants for a specific job
 *  - Company accepts or rejects an application
 *  - Admin views all applications across the platform
 *
 * Flow:
 *  React sends request
 *  → ApplicationController receives it
 *  → ApplicationService processes the business logic
 *  → ApplicationRepository talks to the database
 *  → Response sent back to React
 */
@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    /**
     * Submits a new job application.
     * Called when a Candidate clicks "Apply" on a job listing.
     *
     * Steps:
     *  1. Find the logged in candidate by email
     *  2. Find the job they are applying for
     *  3. Check if they already applied for this job
     *  4. Build and save the new application
     *
     * @param request - application data from React (jobId, coverLetter)
     * @param email   - email of the logged in candidate from JWT token
     * @return newly created Application entity
     */
    public Application applyForJob(ApplicationRequest request, String email) {

        // Step 1: Find the logged in candidate by email
        User candidate = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Step 2: Find the job they are applying for
        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found"));

        // Step 3: Check if job is still open
        if (job.getStatus() == Job.JobStatus.CLOSED) {
            throw new RuntimeException("This job is no longer accepting applications");
        }

        // Step 4: Check if candidate already applied for this job
        if (applicationRepository.existsByCandidateIdAndJobId(
                candidate.getId(), job.getId())) {
            throw new RuntimeException("You have already applied for this job");
        }

        // Step 5: Build the application entity
        // Status is automatically set to PENDING via @PrePersist
        Application application = Application.builder()
                .candidate(candidate)
                .job(job)
                .coverLetter(request.getCoverLetter())
                .build();

        // Step 6: Save and return the new application
        return applicationRepository.save(application);
    }

    /**
     * Returns all applications submitted by the logged in candidate.
     * Used on the My Applications page to show application history
     * and current status of each application.
     *
     * @param email - email of the logged in candidate from JWT token
     * @return list of all applications by this candidate
     */
    public List<Application> getMyApplications(String email) {

        // Find the candidate by email
        User candidate = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Return all applications submitted by this candidate
        return applicationRepository.findByCandidateId(candidate.getId());
    }

    /**
     * Returns all applications received for a specific job.
     * Used on the Company Dashboard when company clicks on
     * a job listing to see who has applied.
     *
     * @param jobId - ID of the job to fetch applications for
     * @return list of all applications for this job
     */
    public List<Application> getApplicationsByJob(Long jobId) {
        return applicationRepository.findByJobId(jobId);
    }

    /**
     * Updates the status of an application.
     * Called when a Company accepts or rejects a candidate.
     *
     * Steps:
     *  1. Find the application by ID
     *  2. Update the status to ACCEPTED or REJECTED
     *  3. Save and return the updated application
     *
     * @param id      - ID of the application to update
     * @param request - new status decision from the company
     * @return updated Application entity
     */
    public Application updateApplicationStatus(
            Long id, ApplicationStatusRequest request) {

        // Step 1: Find the application by ID
        Application application = applicationRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Application not found with id: " + id));

        // Step 2: Update the status
        application.setStatus(
                Application.ApplicationStatus.valueOf(request.getStatus())
        );

        // Step 3: Save and return updated application
        return applicationRepository.save(application);
    }

    /**
     * Returns all applications across the entire platform.
     * Used by Admin to monitor all hiring activity.
     *
     * @return list of all applications in the system
     */
    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }
}