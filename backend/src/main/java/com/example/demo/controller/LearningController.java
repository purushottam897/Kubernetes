package com.example.demo.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.EnrollRequest;
import com.example.demo.entity.Course;
import com.example.demo.entity.Learning;
import com.example.demo.service.LearningService;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/learnings")
public class LearningController {

    @Autowired
    private LearningService learningService;

    @GetMapping("/{userId}")
    public List<Course> getLearningCourses(@PathVariable Long userId) {
        return learningService.getLearningCourses(userId);
    }
    
    @GetMapping("/all")
    public List<Learning> getEnrollments() {
        return learningService.getEnrollments();
    }

    @PostMapping
    public ResponseEntity<String> enrollCourse(@RequestBody EnrollRequest enrollRequest) {
    	System.out.println(enrollRequest.getCourseId() +" = "+enrollRequest.getUserId());
        try {
            String result = learningService.enrollCourse(enrollRequest);
            if ("Enrolled successfully".equals(result)) {
                return ResponseEntity.status(HttpStatus.CREATED).body(result);
            } else if ("Course already enrolled".equals(result)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(result);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
            }
        } catch (IllegalArgumentException iae) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(iae.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server error: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public void unenrollCourse(@PathVariable Long id) {
        learningService.unenrollCourse(id);
    }
}
