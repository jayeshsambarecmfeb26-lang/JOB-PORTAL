package com.jobhub.controller;

import com.jobhub.entity.SavedJob;
import com.jobhub.service.SavedJobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/saved-jobs")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class SavedJobController {

    private final SavedJobService savedJobService;

    @PostMapping("/{jobId}")
    public ResponseEntity<SavedJob> saveJob(@PathVariable Long jobId, Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(savedJobService.saveJob(email, jobId));
    }

    @DeleteMapping("/{jobId}")
    public ResponseEntity<Void> unsaveJob(@PathVariable Long jobId, Authentication authentication) {
        String email = authentication.getName();
        savedJobService.unsaveJob(email, jobId);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<SavedJob>> getSavedJobs(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(savedJobService.getSavedJobs(email));
    }
}
