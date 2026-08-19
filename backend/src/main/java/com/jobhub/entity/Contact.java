package com.jobhub.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Contact Entity
 *
 * This class represents the "contacts" table in the MySQL database.
 * It stores all messages submitted by visitors through the Contact Us page.
 *
 * Unlike other entities, Contact is not linked to any User account.
 * Anyone — registered or not — can submit a contact message.
 * The Admin can view all submitted messages from the Admin Panel.
 *
 * Example flow:
 *  Visitor opens the Contact Us page
 *  → Fills in their name, email and message
 *  → Clicks Submit
 *  → Message is saved in the database
 *  → Admin can view and respond to the message from the Admin Panel
 */
@Entity
@Table(name = "contacts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contact {

    /** Unique identifier for each contact message. Auto-incremented by the database. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Name of the person who submitted the message. */
    private String name;

    /** Email address of the person. Used to reply back to them. */
    private String email;

    /**
     * The actual message content submitted by the visitor.
     * Stored as TEXT in MySQL to support long messages.
     */
    @Column(columnDefinition = "TEXT")
    private String message;

    /**
     * Timestamp of when this message was submitted.
     * Set automatically when the record is first saved.
     * Cannot be modified after creation.
     */
    @Column(updatable = false)
    private LocalDateTime submittedAt;

    /**
     * Automatically sets the submission timestamp
     * just before the contact record is saved to the database.
     */
    @PrePersist
    protected void onCreate() {
        submittedAt = LocalDateTime.now();
    }
}