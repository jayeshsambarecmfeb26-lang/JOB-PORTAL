package com.jobhub.controller;

import com.jobhub.entity.Company;
import com.jobhub.entity.Job;
import com.jobhub.repository.CompanyRepository;
import com.jobhub.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class CompanyController {

    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllCompanies() {
        List<Company> companies = companyRepository.findAll();
        
        List<Map<String, Object>> response = companies.stream().map(company -> {
            long activeJobs = jobRepository.findByCompanyId(company.getId()).stream()
                    .filter(job -> job.getStatus() == Job.JobStatus.OPEN)
                    .count();
            
            return Map.<String, Object>of(
                    "id", company.getId(),
                    "name", company.getName(),
                    "description", company.getDescription() != null ? company.getDescription() : "",
                    "location", company.getLocation() != null ? company.getLocation() : "Remote",
                    "activeJobs", activeJobs
            );
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
}
