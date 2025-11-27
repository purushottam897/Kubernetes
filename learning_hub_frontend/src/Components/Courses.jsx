import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiClient from "../apiClient";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  // 👤 Check Login and Set User ID
  useEffect(() => {
    const storedUserId = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    if (!storedUserId || storedUserId === "null" || !token) {
      toast.error("Please login to view courses");
      navigate("/login");
      return;
    }

    setUserId(storedUserId);
  }, [navigate]);

  // 🎓 Fetch Available Courses from Backend
  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await apiClient.get("/api/courses");
        setCourses(res.data);
      } catch (err) {
        console.error("Error loading courses:", err);
        toast.error("Failed to load courses");
      }
    }
    fetchCourses();
  }, []);

  // 📌 Fetch User Enrolled Courses
  useEffect(() => {
    async function fetchEnrolled() {
      if (!userId) return;
      try {
        const response = await apiClient.get(`/api/learnings/${userId}`);
        setEnrolled(response.data.map((c) => c.course_id));
      } catch (err) {
        console.error("Error fetching enrolled:", err);
      }
    }
    fetchEnrolled();
  }, [userId]);

  // 🛒 Enroll Action
  async function enrollCourse(courseId) {
    if (enrolled.includes(courseId)) return;

    try {
      await apiClient.post("/api/learnings", {
        userId: parseInt(userId, 10),
        courseId,
      });
      setEnrolled((prev) => [...prev, courseId]);
      toast.success("Course Enrolled Successfully!");
      navigate("/learnings");
    } catch (err) {
      toast.error("Failed to enroll");
    }
  }

  return (
    <div>
      <Navbar page={"courses"} />
      <div className="courses-container" style={{ marginTop: "20px" }}>
        {courses.map((course) => (
          <div key={course.course_id} className="course-card">
            <img src={course.p_link} alt={course.course_name} className="course-image" />
            <div className="course-details">
              <h3 className="course-heading">{course.course_name}</h3>
              <p className="course-description" style={{ color: "grey" }}>
                Price: Rs.{course.price}
              </p>
              <p className="course-description">Instructor: {course.instructor}</p>
            </div>

            {enrolled.includes(course.course_id) ? (
              <button
                className="enroll-button"
                style={{
                  color: "#F4D03F",
                  backgroundColor: "darkblue",
                  fontWeight: "bold",
                }}
                onClick={() => navigate("/learnings")}
              >
                Enrolled
              </button>
            ) : (
              <button className="enroll-button" onClick={() => enrollCourse(course.course_id)}>
                Enroll
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Courses;
