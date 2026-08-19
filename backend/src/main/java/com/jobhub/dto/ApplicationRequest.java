package com.jobhub.dto;

import jakarta.validation.constraints.*;
import lombok.*;

/**
 * ApplicationRequest DTO
 *
 * This class represents the data sent from React when a
 * Candidate applies for a job listing.
 *
 * The candidate information is extracted automatically from
 * the JWT token — no need to send it from the frontend.
 * Only the job ID and optional cover letter are needed.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationRequest {

    /**
     * ID of the job the candidate is applying for.
     * Used to find the job in the database and link
     * it to the new application record.
     */
    @NotNull(message = "Job ID is required")
    private Long jobId;

    /**
     * Optional cover letter from the candidate.
     * Explains why they are a good fit for the position.
     */
    private String coverLetter;
}