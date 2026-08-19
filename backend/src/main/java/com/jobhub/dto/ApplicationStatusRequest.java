package com.jobhub.dto;

import jakarta.validation.constraints.*;
import lombok.*;

/**
 * ApplicationStatusRequest DTO
 *
 * This class represents the data sent from React when a
 * Company updates the status of a candidate's application.
 *
 * Used for:
 *  PUT /api/applications/{id}/status
 *
 * The company simply sends the new status decision
 * and the backend updates the application record.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationStatusRequest {

    /**
     * New status decision made by the company.
     * Accepted values: ACCEPTED or REJECTED
     */
    @NotBlank(message = "Status is required")
    private String status;
}