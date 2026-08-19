package com.jobhub.security;

import com.jobhub.entity.User;
import com.jobhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * UserDetailsServiceImpl
 *
 * This class is required by Spring Security's AuthenticationManager.
 * When AuthService calls authenticationManager.authenticate(),
 * Spring Security internally calls this class to:
 *  1. Load the user from the database by email
 *  2. Return a UserDetails object with email, encrypted password, and role
 *  3. Spring Security then compares the passwords automatically
 *
 * Without this class, the AuthenticationManager won't know
 * how to find and verify users from our database.
 */
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    /**
     * Loads a user from the database by their email address.
     * Called automatically by Spring Security during login.
     *
     * @param email - email address used as username in this system
     * @return UserDetails object containing credentials and role
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        // Find user by email — throw exception if not found
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found with email: " + email)
                );

        // Return Spring Security's UserDetails with email, password and role
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );
    }
}