package com.example.demo.controller;

import com.example.demo.dto.AdminStatsDTO;
import com.example.demo.entity.User;
import com.example.demo.entity.Course;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.LearningRepository;
import com.example.demo.repository.FeedbackRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private LearningRepository learningRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    private boolean isAdmin(Authentication authentication) {
        // assumes authentication.getName() = email from JWT
        return authentication != null &&
               authentication.getName() != null &&
               authentication.getName().equalsIgnoreCase("admin@gmail.com");
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats(Authentication authentication) {
        if (!isAdmin(authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        long totalUsers = userRepository.count();
        long totalCourses = courseRepository.count();
        long totalEnrollments = learningRepository.count();
        long totalFeedbacks = feedbackRepository.count();

        AdminStatsDTO stats = new AdminStatsDTO(
            totalUsers,
            totalCourses,
            totalEnrollments,
            totalFeedbacks
        );

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(Authentication authentication) {
        if (!isAdmin(authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/courses")
    public ResponseEntity<?> getAllCourses(Authentication authentication) {
        if (!isAdmin(authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        List<Course> courses = courseRepository.findAll();
        return ResponseEntity.ok(courses);
    }
}
