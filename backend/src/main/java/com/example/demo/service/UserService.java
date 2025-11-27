package com.example.demo.service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        try {
            return userRepository.findAll();
        } catch (Exception e) {
            logger.error("Failed to fetch all users", e);
            throw new RuntimeException("Failed to fetch users", e);
        }
    }

    public User getUserById(Long id) {
        try {
            User user = userRepository.findByIdWithLearningCourses(id);
            if (user != null) {
                logger.info("User found: " + user.getEmail());
                return user;
            } else {
                logger.warn("User not found with ID: " + id);
                return null;
            }
        } catch (Exception e) {
            logger.error("Failed to fetch user by ID: " + id, e);
            throw new RuntimeException("Failed to fetch user", e);
        }
    }

    public User createUser(User user) {
        try {
            // Hash the password before saving
            user.setPassword(passwordEncoder.encode(user.getPassword()));

            // Log the user data before saving
            logger.info("Attempting to save user: {}", user.getEmail());

            // Save the user
            User savedUser = userRepository.save(user);

            // Verify the user was saved by checking if it has an ID
            if (savedUser != null && savedUser.getId() != null) {
                logger.info("User saved successfully with ID: {}", savedUser.getId());
                return savedUser;
            } else {
                logger.error("User save operation failed - no ID returned");
                throw new RuntimeException("Failed to save user - no ID returned");
            }
        } catch (DataIntegrityViolationException e) {
            logger.error("Duplicate user error: {}", user.getEmail(), e);
            throw new RuntimeException("User with this email already exists.", e);
        } catch (Exception e) {
            logger.error("Error saving user: {}", user.getEmail(), e);
            throw new RuntimeException("Failed to save user to database", e);
        }
    }

    public User updateUser(Long id, User updatedUser) {
        try {
            if (userRepository.existsById(id)) {
                updatedUser.setId(id);
                return userRepository.save(updatedUser);
            }
            return null;
        } catch (Exception e) {
            logger.error("Failed to update user with ID: " + id, e);
            throw new RuntimeException("Failed to update user", e);
        }
    }



    public void deleteUser(Long id) {
        try {
            userRepository.deleteById(id);
        } catch (Exception e) {
            logger.error("Failed to delete user with ID: " + id, e);
            throw new RuntimeException("Failed to delete user", e);
        }
    }

    public User getUserByEmail(String email) {
        try {
            return userRepository.findByEmail(email);
        } catch (Exception e) {
            logger.error("Failed to fetch user by email: " + email, e);
            throw new RuntimeException("Failed to fetch user", e);
        }
    }

    public User authenticateUser(String email, String password) {
        try {
            User user = userRepository.findByEmail(email);

            if (user != null && passwordEncoder.matches(password, user.getPassword())) {
                return user;
            }

            return null;
        } catch (Exception e) {
            logger.error("Authentication failed for user: " + email, e);
            throw new RuntimeException("Authentication failure", e);
        }
    }

	public User getUserByRefreshToken(String refreshToken) {
		// TODO Auto-generated method stub
		return null;
	}
}


