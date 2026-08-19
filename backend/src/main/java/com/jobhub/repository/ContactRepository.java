package com.jobhub.repository;

import com.jobhub.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * ContactRepository
 *
 * This interface handles all database operations for the Contact entity.
 *
 * Extends JpaRepository to get all standard CRUD operations for free.
 * No custom methods needed here since the Admin only needs to
 * view all messages (findAll) and delete them (deleteById),
 * both of which are already provided by JpaRepository.
 */
public interface ContactRepository extends JpaRepository<Contact, Long> {
}