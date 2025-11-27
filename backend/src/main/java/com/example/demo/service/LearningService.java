package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.demo.dto.EnrollRequest;
import com.example.demo.entity.Course;
import com.example.demo.entity.Learning;
import com.example.demo.entity.Progress;
import com.example.demo.entity.User;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.LearningRepository;
import com.example.demo.repository.ProgressRepository;
import com.example.demo.repository.UserRepository;
import java.util.*;

@Service
public class LearningService {

    @Autowired
    private LearningRepository learningRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private ProgressRepository progressRepository;

    public List<Course> getLearningCourses(Long userId) {
        Optional<User> optionalUser = userRepository.findById(userId);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            List<Course> learningCourses = new ArrayList<>();

            for (Learning learning : user.getLearningCourses()) {
                Course course = learning.getCourse();
                learningCourses.add(course);
            }

            return learningCourses;
        }

        return new ArrayList<>();
    }
    
    public List<Learning> getEnrollments() {
    	return learningRepository.findAll();
    }

    @Transactional
    public String enrollCourse(EnrollRequest enrollRequest) {
        try {
            User user = userRepository.findById(enrollRequest.getUserId()).orElse(null);
            Course course = courseRepository.findById(enrollRequest.getCourseId()).orElse(null);

            if (user == null || course == null) {
                throw new IllegalArgumentException("Invalid userId or courseId");
            }

            Learning existingLearning = learningRepository.findByUserAndCourse(user, course);
            if (existingLearning != null) {
                return "Course already enrolled";
            }

            Learning learning = new Learning();
            learning.setUser(user);
            learning.setCourse(course);
            learningRepository.save(learning);

            // After saving learning, add progress linked to the saved learning
            Progress progress = new Progress();
            progress.setUser(user);
            progress.setCourse(course);
            progressRepository.save(progress);

            user.getLearningCourses().add(learning);
            userRepository.save(user);

            return "Enrolled successfully";
        } catch (Exception e) {
            e.printStackTrace();
            return "Failed to enroll due to server error: " + e.getMessage();
        }
    }


    public void unenrollCourse(Long id) {
        learningRepository.deleteById(id);
    }
}

