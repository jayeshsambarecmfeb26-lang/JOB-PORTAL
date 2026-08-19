package com.jobhub.service;

import com.jobhub.entity.Contact;
import com.jobhub.repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * ContactService - Contact Business Logic
 *
 * This class handles all business logic related to
 * the Contact Us page submissions:
 *  - Saving a new contact message from any visitor
 *  - Admin fetching all submitted contact messages
 *  - Admin deleting a contact message after reading
 *
 * This is the simplest service in the project since
 * Contact has no relationships with other entities.
 *
 * Flow:
 *  Visitor fills Contact Us form on React frontend
 *  → ContactController receives the request
 *  → ContactService saves the message to database
 *  → Admin can view all messages from Admin Panel
 */
@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository contactRepository;

    /**
     * Saves a new contact message submitted from the Contact Us page.
     * Available to everyone — no login required.
     *
     * @param contact - contact message data from React form
     * @return saved Contact entity with generated ID and timestamp
     */
    public Contact saveMessage(Contact contact) {
        return contactRepository.save(contact);
    }

    /**
     * Returns all contact messages submitted by visitors.
     * Used by Admin on the Admin Panel to read and respond
     * to visitor inquiries.
     *
     * @return list of all contact messages
     */
    public List<Contact> getAllMessages() {
        return contactRepository.findAll();
    }

    /**
     * Deletes a contact message by its ID.
     * Used by Admin after reading and handling a message.
     *
     * @param id - ID of the contact message to delete
     */
    public void deleteMessage(Long id) {
        contactRepository.deleteById(id);
    }
}