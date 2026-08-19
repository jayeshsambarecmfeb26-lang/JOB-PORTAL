package com.jobhub.service;

import com.jobhub.entity.User;
import com.jobhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final com.jobhub.repository.ApplicationRepository applicationRepository;
    private final com.jobhub.repository.SavedJobRepository savedJobRepository;
    private final com.jobhub.repository.CompanyRepository companyRepository;
    private final com.jobhub.repository.JobRepository jobRepository;
    private final String UPLOAD_DIR = "uploads/resumes/";

    public User updateProfile(String email, String name, String phone, MultipartFile resume) throws IOException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (name != null && !name.trim().isEmpty()) {
            user.setName(name);
        }
        if (phone != null) {
            user.setPhone(phone);
        }

        if (resume != null && !resume.isEmpty()) {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String filename = UUID.randomUUID().toString() + "_" + resume.getOriginalFilename();
            Path filePath = uploadPath.resolve(filename);
            Files.copy(resume.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            user.setResumeUrl("/resumes/" + filename);
        }

        return userRepository.save(user);
    }

    public void updatePassword(String email, String currentPassword, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
    
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(Long id) {
        // Find user first to make sure they exist
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getRole() == User.Role.CANDIDATE) {
            // Delete applications
            java.util.List<com.jobhub.entity.Application> apps = applicationRepository.findByCandidateId(id);
            applicationRepository.deleteAll(apps);
            
            // Delete saved jobs
            java.util.List<com.jobhub.entity.SavedJob> saved = savedJobRepository.findByUserOrderBySavedAtDesc(user);
            savedJobRepository.deleteAll(saved);
        } else if (user.getRole() == User.Role.COMPANY) {
            // Find company
            companyRepository.findByUserId(id).ifPresent(company -> {
                // Find all jobs by this company
                java.util.List<com.jobhub.entity.Job> jobs = jobRepository.findByCompanyId(company.getId());
                for (com.jobhub.entity.Job job : jobs) {
                    // Cascade delete for each job
                    applicationRepository.deleteAll(applicationRepository.findByJobId(job.getId()));
                    savedJobRepository.deleteAll(savedJobRepository.findByJob(job));
                    jobRepository.delete(job);
                }
                companyRepository.delete(company);
            });
        }

        userRepository.deleteById(id);
    }
}
