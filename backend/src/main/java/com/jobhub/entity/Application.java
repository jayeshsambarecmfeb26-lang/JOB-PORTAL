package com.jobhub.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Application Entity
 *
 * This class represents the "applications" table in the MySQL database.
 * It stores all job applications submitted by candidates on the JobHub platform.
 *
 * An Application acts as a bridge between a Candidate (User) and a Job.
 * It tracks which candidate applied for which job and what the current
 * status of that application is.
 *
 * Key Relationships:
 *  - Many Applications can be submitted by One Candidate (@ManyToOne)
 *    Example: One candidate can apply for 10 different jobs
 *  - Many Applications can belong to One Job (@ManyToOne)
 *    Example: One job can receive 100 applications from different candidates
 *
 * Application Status Flow:
 *  Candidate applies for a job
 *  → Application saved with status PENDING automatically
 *  → Company reviews the application
 *  → Company either ACCEPTS or REJECTS the application
 *  → Candidate can see the updated status in My Applications page
 *
 * Example flow:
 *  Candidate clicks "Apply" on a job listing
 *  → Writes a cover letter
 *  → Application is created linking that Candidate and that Job
 *  → Company sees this application in their dashboard
 *  → Company updates status to ACCEPTED or REJECTED
 */
@Entity
@Table(name = "applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application {

    /** Unique identifier for each application. Auto-incremented by the database. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The Candidate who submitted this application.
     *
     * @ManyToOne means one Candidate can submit many Applications.
     * @JoinColumn creates a foreign key column "candidate_id" in the
     * applications table that references the id in the users table.
     */
    @ManyToOne
    @JoinColumn(name = "candidate_id", nullable = false)
    private User candidate;

    /**
     * The Job this application was submitted for.
     *
     * @ManyToOne means one Job can receive many Applications.
     * @JoinColumn creates a foreign key column "job_id" in the
     * applications table that references the id in the jobs table.
     */
    @ManyToOne
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    /**
     * Current status of this application.
     * Automatically set to PENDING when application is first submitted.
     * Updated by the Company after reviewing the application.
     * Stored as text in the database for readability.
     */
    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;

    /**
     * Optional cover letter written by the candidate.
     * Explains why the candidate is a good fit for the job.
     * Stored as TEXT in MySQL to support long content.
     */
    @Column(columnDefinition = "TEXT")
    private String coverLetter;

    /**
     * Timestamp of when this application was submitted.
     * Set automatically when the record is first saved.
     * Cannot be modified after creation.
     */
    @Column(updatable = false)
    private LocalDateTime appliedAt;

    /**
     * Automatically sets the submission timestamp and default status
     * just before the application record is saved to the database.
     * Ensures every new application starts with PENDING status.
     */
    @PrePersist
    protected void onCreate() {
        appliedAt = LocalDateTime.now();
        status = ApplicationStatus.PENDING;
    }

    /**
     * Defines the possible states of a job application.
     * Reflects the hiring decision made by the Company.
     */
    public enum ApplicationStatus {
        PENDING,   // Application submitted, awaiting company review
        ACCEPTED,  // Company has selected this candidate
        REJECTED   // Company has declined this candidate
    }
}