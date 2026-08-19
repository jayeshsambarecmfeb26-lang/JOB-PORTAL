package com.jobhub.service;

import com.jobhub.dto.JobRequest;
import com.jobhub.entity.*;
import com.jobhub.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * JobService - Job Business Logic
 *
 * This class handles all business logic related to job listings:
 *  - Fetching all open jobs for candidates to browse
 *  - Fetching a single job by its ID
 *  - Searching jobs by keyword
 *  - Creating a new job listing (Company only)
 *  - Updating an existing job listing (Company only)
 *  - Deleting a job listing (Company only)
 *  - Closing a job listing (Company only)
 *  - Fetching all jobs posted by a specific company
 *
 * Flow:
 *  React sends request
 *  → JobController receives it
 *  → JobService processes the business logic
 *  → JobRepository talks to the database
 *  → Response sent back to React
 */
@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;
    private final SavedJobRepository savedJobRepository;

    /**
     * Returns all open job listings.
     * Used on the public Job Listings page visible to everyone.
     *
     * @return list of all jobs with status OPEN
     */
    public List<Job> getAllOpenJobs() {
        return jobRepository.findByStatus(Job.JobStatus.OPEN);
    }

    /**
     * Returns all jobs regardless of status.
     * Used by Admin Dashboard.
     */
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    /**
     * Returns a single job by its ID.
     * Used on the Job Detail page when candidate clicks on a job.
     *
     * @param id - ID of the job to fetch
     * @return Job entity if found
     */
    public Job getJobById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));
    }

    /**
     * Searches for jobs where title contains the given keyword.
     * Case insensitive search — "java" matches "Java" and "JAVA".
     * Used for the search bar on the Job Listings page.
     *
     * @param keyword - search term entered by the candidate
     * @return list of matching jobs
     */
    public List<Job> searchJobs(String keyword) {
        return jobRepository.findByTitleContainingIgnoreCase(keyword);
    }

    /**
     * Returns all jobs posted by a specific company.
     * Used on the Company Dashboard to show their own listings.
     *
     * @param email - email of the logged in company user
     * @return list of jobs posted by this company
     */
    public List<Job> getJobsByCompany(String email) {

        // Find the user by email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Find the company profile linked to this user
        Company company = companyRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Company profile not found"));

        // Return all jobs posted by this company
        return jobRepository.findByCompanyId(company.getId());
    }

    /**
     * Creates a new job listing.
     * Called when a Company fills in the Post Job form.
     *
     * Steps:
     *  1. Find the logged in company user by email
     *  2. Find their company profile
     *  3. Build a new Job entity from the JobRequest DTO
     *  4. Save and return the new job
     *
     * @param request - job details from React Post Job form
     * @param email   - email of the logged in company user from JWT token
     * @return newly created Job entity
     */
    public Job createJob(JobRequest request, String email) {

        // Step 1: Find the logged in user by email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Step 2: Find the company profile linked to this user
        Company company = companyRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Company profile not found"));

        // Step 3: Build Job entity from request data
        // Status is automatically set to OPEN via @PrePersist in Job entity
        Job job = Job.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .location(request.getLocation())
                .salary(request.getSalary())
                .type(Job.JobType.valueOf(request.getType()))
                .company(company)
                .build();

        // Step 4: Save and return the new job
        return jobRepository.save(job);
    }

    /**
     * Updates an existing job listing.
     * Called when a Company edits one of their posted jobs.
     *
     * @param id      - ID of the job to update
     * @param request - updated job details from React
     * @param email   - email of the logged in company user
     * @return updated Job entity
     */
    public Job updateJob(Long id, JobRequest request, String email) {

        // Find the existing job
        Job job = getJobById(id);

        // Update the fields with new values from the request
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setLocation(request.getLocation());
        job.setSalary(request.getSalary());
        job.setType(Job.JobType.valueOf(request.getType()));

        // Save and return the updated job
        return jobRepository.save(job);
    }

    /**
     * Deletes a job listing permanently.
     * Called when a Company removes one of their posted jobs.
     *
     * @param id - ID of the job to delete
     */
    public void deleteJob(Long id) {
        Job job = getJobById(id);
        
        // Cascade delete: applications
        List<Application> applications = applicationRepository.findByJobId(id);
        applicationRepository.deleteAll(applications);
        
        // Cascade delete: saved jobs
        List<SavedJob> savedJobs = savedJobRepository.findByJob(job);
        savedJobRepository.deleteAll(savedJobs);
        
        jobRepository.deleteById(id);
    }

    /**
     * Closes a job listing so no more applications are accepted.
     * The job still exists in the database but status becomes CLOSED.
     * Used when a Company has found enough candidates.
     *
     * @param id - ID of the job to close
     * @return updated Job entity with CLOSED status
     */
    public Job closeJob(Long id) {
        Job job = getJobById(id);
        job.setStatus(Job.JobStatus.CLOSED);
        return jobRepository.save(job);
    }

    /**
     * Toggles a job listing's status between OPEN and CLOSED.
     * Used when a Company wants to easily open/close a job.
     *
     * @param id - ID of the job to toggle
     * @return updated Job entity
     */
    public Job toggleJobStatus(Long id) {
        Job job = getJobById(id);
        if (job.getStatus() == Job.JobStatus.OPEN) {
            job.setStatus(Job.JobStatus.CLOSED);
        } else {
            job.setStatus(Job.JobStatus.OPEN);
        }
        return jobRepository.save(job);
    }
}