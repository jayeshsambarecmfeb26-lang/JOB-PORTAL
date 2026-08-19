package com.jobhub.controller;

import com.jobhub.entity.Job;
import com.jobhub.entity.User;
import com.jobhub.repository.ApplicationRepository;
import com.jobhub.repository.JobRepository;
import com.jobhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * StatsController - Public Platform Statistics
 *
 * Exposes a single public endpoint that returns
 * platform-wide counts for the Home and About Us pages.
 * No authentication required — these are public numbers.
 */
@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class StatsController {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    /**
     * Returns platform statistics for public display.
     * Used on Home page and About Us page.
     *
     * GET /api/stats
     * Public — no token required.
     */
    @GetMapping
    public ResponseEntity<Map<String, Long>> getStats() {

        Map<String, Long> stats = new HashMap<>();

        // Count total candidates registered
        stats.put("candidates",
            userRepository.countByRole(User.Role.CANDIDATE));

        // Count total companies registered
        stats.put("companies",
            userRepository.countByRole(User.Role.COMPANY));

        // Count total open job listings
        stats.put("activeJobs",
            jobRepository.countByStatus(Job.JobStatus.OPEN));

        // Count total applications submitted
        stats.put("applications",
            applicationRepository.count());

        return ResponseEntity.ok(stats);
    }
}