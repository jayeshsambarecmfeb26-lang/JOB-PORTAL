package com.jobhub.dto;

import jakarta.validation.constraints.*;
import lombok.*;

/**
 * JobRequest DTO
 *
 * This class represents the data sent from the React frontend
 * when a Company creates or updates a job listing.
 *
 * Used for both:
 *  - POST /api/jobs       → creating a new job
 *  - PUT  /api/jobs/{id}  → updating an existing job
 *
 * The company information is not included here because it is
 * extracted automatically from the JWT token of the logged in
 * company user — no need to send it from the frontend.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobRequest {

    /**
     * Title of the job position.
     * Example: "Java Backend Developer", "React Frontend Engineer"
     */
    @NotBlank(message = "Job title is required")
    private String title;

    /**
     * Full description of the job.
     * Includes responsibilities, requirements, and other details.
     */
    @NotBlank(message = "Job description is required")
    private String description;

    /** Location where the job is based. Example: "Mumbai", "Remote" */
    @NotBlank(message = "Location is required")
    private String location;

    /** Offered salary. Optional field. */
    private Double salary;

    /**
     * Type of employment.
     * Accepted values: FULL_TIME, PART_TIME, INTERNSHIP, REMOTE
     */
    @NotBlank(message = "Job type is required")
    private String type;
}