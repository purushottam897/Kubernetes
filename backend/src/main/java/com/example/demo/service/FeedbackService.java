package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.FeedbackRequest;
import com.example.demo.entity.Course;
import com.example.demo.entity.Feedback;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.FeedbackRepository;

import java.util.Collections;
import java.util.List;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private CourseRepository courseRepository;

    public List<Feedback> getFeedbacksForCourse(Long courseId) {
        Course course = courseRepository.findById(courseId).orElse(null);
        if (course != null) {
            return course.getFeedbacks();
        }
        return Collections.emptyList();  // 🔥 instead of null
    }

    public String submitFeedback(FeedbackRequest fr) {
        Course course = courseRepository.findById(fr.getCourse_id()).orElse(null);

        if (course == null) {
            return "Feedback submission failed: Invalid course ID";
        }

        Feedback feedback = new Feedback();
        feedback.setCourse(course);
        feedback.setComment(fr.getComment());

        feedbackRepository.save(feedback);

        return "Feedback submitted successfully";
    }
}
