package com.jobhub.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Company Entity
 *
 * This class represents the "companies" table in the MySQL database.
 * It stores the profile information of companies registered on the JobHub platform.
 *
 * A Company is always linked to a User account with the role COMPANY.
 * This means every company must first register as a User, and then
 * their company profile is created and linked to that User.
 *
 * Key Relationship:
 *  - One Company belongs to exactly One User (@OneToOne)
 *  - One Company can have many Jobs posted under it
 *
 * Example flow:
 *  User registers with role COMPANY
 *  → Company profile is created and linked to that User
 *  → Company can now post Jobs on the platform
 */
@Entity
@Table(name = "companies")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Company {

    /** Unique identifier for each company. Auto-incremented by the database. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Official name of the company. Cannot be empty. */
    @Column(nullable = false)
    private String name;

    /** 
     * Brief description of the company.
     * Displayed on the company profile page for candidates to read.
     */
    private String description;

    /** City or region where the company is located. */
    private String location;

    /** Official website URL of the company. Optional field. */
    private String website;

    /**
     * The User account this company profile belongs to.
     * 
     * @OneToOne means one Company is linked to exactly one User.
     * @JoinColumn creates a foreign key column "user_id" in the companies table
     * that references the id column in the users table.
     * unique = true ensures no two companies can be linked to the same User account.
     */
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
}