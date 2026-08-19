package com.jobhub.controller;

import com.jobhub.entity.Contact;
import com.jobhub.service.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ContactController - Contact REST Controller
 *
 * This class exposes all contact related API endpoints
 * that the React frontend calls for the Contact Us page.
 *
 * Base URL: /api/contact
 *
 * Endpoints:
 *  POST   /api/contact        → Submit a contact message (public)
 *  GET    /api/contact        → Get all messages (ADMIN only)
 *  DELETE /api/contact/{id}   → Delete a message (ADMIN only)
 *
 * The POST endpoint is public — anyone can submit a message
 * without being logged in. This is configured in SecurityConfig.
 *
 * GET and DELETE require ADMIN role JWT token.
 */
@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ContactController {

    private final ContactService contactService;

    /**
     * Submit a new contact message.
     * Public endpoint — no token required.
     * Called when visitor submits the Contact Us form.
     *
     * @param contact - name, email and message from React form
     * @return 200 OK with saved contact message
     */
    @PostMapping
    public ResponseEntity<Contact> submitMessage(
            @RequestBody Contact contact) {
        return ResponseEntity.ok(contactService.saveMessage(contact));
    }

    /**
     * Get all submitted contact messages.
     * Requires ADMIN role JWT token.
     * Used on the Admin Panel to view visitor inquiries.
     *
     * @return 200 OK with list of all contact messages
     */
    @GetMapping
    public ResponseEntity<List<Contact>> getAllMessages() {
        return ResponseEntity.ok(contactService.getAllMessages());
    }

    /**
     * Delete a contact message by ID.
     * Requires ADMIN role JWT token.
     * Called when Admin has handled a message and wants to remove it.
     *
     * @param id - ID of the message to delete
     * @return 204 No Content on successful deletion
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable Long id) {
        contactService.deleteMessage(id);
        return ResponseEntity.noContent().build();
    }
}