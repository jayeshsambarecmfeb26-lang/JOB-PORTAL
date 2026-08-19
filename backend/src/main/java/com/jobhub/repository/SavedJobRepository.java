package com.jobhub.repository;

import com.jobhub.entity.SavedJob;
import com.jobhub.entity.User;
import com.jobhub.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {
    List<SavedJob> findByUserOrderBySavedAtDesc(User user);
    Optional<SavedJob> findByUserAndJob(User user, Job job);
    List<SavedJob> findByJob(Job job);
    boolean existsByUserAndJob(User user, Job job);
    long countByUser(User user);
}
