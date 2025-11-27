package com.example.demo.repository;

import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
    User findByEmailAndPassword(String email, String password);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.learningCourses WHERE u.id = :id")
    User findByIdWithLearningCourses(@Param("id") Long id);
}
