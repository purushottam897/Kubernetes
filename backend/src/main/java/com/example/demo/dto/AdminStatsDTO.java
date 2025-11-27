package com.example.demo.dto;

public class AdminStatsDTO {
    private long totalUsers;
    private long totalCourses;
    private long totalEnrollments;
    private long totalFeedbacks;

    public AdminStatsDTO(long totalUsers, long totalCourses, long totalEnrollments, long totalFeedbacks) {
        this.totalUsers = totalUsers;
        this.totalCourses = totalCourses;
        this.totalEnrollments = totalEnrollments;
        this.totalFeedbacks = totalFeedbacks;
    }

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getTotalCourses() { return totalCourses; }
    public void setTotalCourses(long totalCourses) { this.totalCourses = totalCourses; }

    public long getTotalEnrollments() { return totalEnrollments; }
    public void setTotalEnrollments(long totalEnrollments) { this.totalEnrollments = totalEnrollments; }

    public long getTotalFeedbacks() { return totalFeedbacks; }
    public void setTotalFeedbacks(long totalFeedbacks) { this.totalFeedbacks = totalFeedbacks; }
}
