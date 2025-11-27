import React, { useEffect, useState } from "react";
import apiClient from "../apiClient";
import Navbar from "./Navbar";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "./UserContext";

function Learnings() {
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState({});
  const navigate = useNavigate();
  const { user } = useUserContext();

  // Fetch enrolled courses for the logged-in user
  useEffect(() => {
    async function fetchCourses() {
      try {
        if (!user || !user.id) {
          console.error("User ID is null or undefined");
          return;
        }

        console.log("Fetching learnings for user:", user.id);

        const response = await apiClient.get(`/api/learnings/${user.id}`);
        const fetchedCourses = response.data || [];

        console.log("Fetched courses:", fetchedCourses);

        setCourses(fetchedCourses);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    }

    if (user && user.id) {
      fetchCourses();
    }
  }, [user]);

  // Fetch progress for each course
  useEffect(() => {
    async function fetchProgressForAllCourses() {
      if (!user || !user.id) return;
      if (!courses || courses.length === 0) return;

      const progressData = {};

      for (const course of courses) {
        // Try to determine the correct courseId field from the object
        const courseId = course.courseId ?? course.course_id ?? course.id;

        if (!courseId) {
          console.error("courseId is missing for course:", course);
          continue;
        }

        try {
          console.log(
            `Fetching progress for user ${user.id}, course ${courseId}`
          );

          const response = await apiClient.get(
            `/api/progress/${user.id}/${courseId}`
          );

          // Assuming backend returns a number like 0–100
          progressData[courseId] = response.data ?? 0;
        } catch (err) {
          console.error(
            `Error fetching progress for user ${user.id}, course ${courseId}:`,
            err
          );
          progressData[courseId] = 0;
        }
      }

      console.log("Progress data:", progressData);
      setProgress(progressData);
    }

    fetchProgressForAllCourses();
  }, [courses, user]);

  // If no courses enrolled
  if (!courses || courses.length === 0) {
    return (
      <>
        <Navbar page="learnings" />
        <div style={{ textAlign: "center", marginTop: "10%" }}>
          <h1 style={{ fontSize: "30px", marginBottom: "20px" }}>
            You have not enrolled in any courses yet...!!!
          </h1>
          <p style={{ color: "#666", fontSize: "18px" }}>
            Explore our courses and start your learning journey.
          </p>
          <button
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#017bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginTop: "20px",
            }}
            onClick={() => navigate("/courses")}
          >
            Explore Courses
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar page="learnings" />
      <div className="learn-courses-container" style={{ marginTop: "20px" }}>
        {courses.map((course) => {
          // Resolve courseId consistently
          const courseId = course.courseId ?? course.course_id ?? course.id;
          const courseProgress = progress[courseId] || 0;

          return (
            <div key={courseId} className="learn-course-card">
              <img
                src={course.p_link}
                alt={course.courseName}
                className="learn-course-image"
              />

              <div className="course-details">
                <h3 className="course-heading">
                  {course.courseName.length < 8
                    ? `${course.courseName} Tutorial`
                    : course.courseName}
                </h3>
                <p className="course-description">by {course.instructor}</p>
              </div>

              {/* Progress bar */}
              <div className="progress-container">
                <div
                  className="progress-bar"
                  style={{
                    width: `${courseProgress}%`,
                  }}
                ></div>
              </div>

              {/* Start / Continue button */}
              <Link
                to={`/course/${courseId}`}
                style={{ textDecoration: "none" }}
              >
                <button className="learn-course-button">
                  Start Learning
                </button>
              </Link>

              {/* Certificate button */}
              <button
                className="learn-course-button"
                onClick={() => {
                  if (courseProgress >= 100) {
                    navigate(`/certificate/${courseId}`);
                  } else {
                    alert("Please complete the course to get the certificate.");
                  }
                }}
                style={{
                  backgroundColor:
                    courseProgress >= 100 ? "#4CAF50" : "#ccc",
                  cursor: courseProgress >= 100 ? "pointer" : "not-allowed",
                }}
              >
                Get Certificate
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Learnings;
