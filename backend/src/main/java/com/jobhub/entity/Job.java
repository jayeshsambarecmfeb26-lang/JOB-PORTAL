package com.jobhub.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Job Entity
 *
 * This class represents the "jobs" table in the MySQL database.
 * It stores all job listings posted by companies on the JobHub platform.
 *
 * A Job is always linked to a Company that posted it.
 * Candidates can browse all open jobs and apply for them.
 *
 * Key Relationships:
 *  - Many Jobs can belong to One Company (@ManyToOne)
 *    Example: TCS can post 10 different job listings
 *  - One Job can receive Many Applications from candidates
 *
 * Job has two types of classifications:
 *  - JobType   : Nature of the job (Full Time, Part Time, etc.)
 *  - JobStatus : Current state of the job listing (Open or Closed)
 *
 * Example flow:
 *  Company logs in
 *  → Posts a new Job with title, description, salary, location
 *  → Job is saved with status OPEN automatically
 *  → Candidates can now see and apply for this job
 *  → Company can close the job anytime by setting status to CLOSED
 */
@Entity
@Table(name = "jobs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {

    /** Unique identifier for each job listing. Auto-incremented by the database. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Title of the job position. Example: "Java Backend Developer". Cannot be empty. */
    @Column(nullable = false)
    private String title;

    /**
     * Detailed description of the job.
     * Includes responsibilities, requirements, and other details.
     * Stored as TEXT in MySQL to support long content.
     */
    @Column(columnDefinition = "TEXT")
    private String description;

    /** City or region where the job is based. Example: "Mumbai", "Remote". */
    private String location;

    /** Offered salary for the position. Stored as a decimal number. Optional field. */
    private Double salary;

    /**
     * Type of employment being offered.
     * Stored as text in the database for readability.
     * Possible values: FULL_TIME, PART_TIME, INTERNSHIP, REMOTE
     */
    @Enumerated(EnumType.STRING)
    private JobType type;

    /**
     * Current status of the job listing.
     * OPEN   — job is visible and accepting applications from candidates.
     * CLOSED — job is no longer accepting applications.
     * Automatically set to OPEN when a new job is posted.
     */
    @Enumerated(EnumType.STRING)
    private JobStatus status;

    /**
     * The Company that posted this job.
     *
     * @ManyToOne means many Jobs can be posted by one Company.
     * @JoinColumn creates a foreign key column "company_id" in the jobs table
     * that references the id column in the companies table.
     */
    @ManyToOne
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    /**
     * Timestamp of when this job was posted.
     * Set automatically when the record is first saved.
     * Cannot be modified after creation.
     */
    @Column(updatable = false)
    private LocalDateTime postedAt;

    /**
     * Automatically sets the posted timestamp and default status
     * just before the job record is saved to the database for the first time.
     * No need to manually set these values when creating a job.
     */
    @PrePersist
    protected void onCreate() {
        postedAt = LocalDateTime.now();
        status = JobStatus.OPEN;
    }

    /**
     * Defines the type of employment for the job listing.
     * Helps candidates filter jobs based on their preference.
     */
    public enum JobType {
        FULL_TIME,   // Regular permanent position
        PART_TIME,   // Less than full working hours
        INTERNSHIP,  // Short term learning based role
        REMOTE       // Work from home position
    }

    /**
     * Defines the current availability status of the job listing.
     * Controls whether candidates can apply for this job or not.
     */
    public enum JobStatus {
        OPEN,   // Accepting applications
        CLOSED  // No longer accepting applications
    }
}