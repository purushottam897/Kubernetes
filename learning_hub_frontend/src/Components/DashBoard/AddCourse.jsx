import React, { useState } from "react";
import SideBar from "./SideBar";
import Navbar from "./Navbar";
import apiClient from "../apiClient";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function AddCourse() {
  const navigate = useNavigate();
  const [course, setCourse] = useState({
    course_name: "",
    price: "",
    instructor: "",
    description: "",
    p_link: "",
    y_link: "",
  });

  // 🛡️ Admin Access Check
  if (localStorage.getItem("role") !== "ADMIN") {
    toast.error("Admins only!");
    navigate("/dashboard");
  }

  function handleChange(e) {
    setCourse({ ...course, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await apiClient.post("/api/courses", course);
      toast.success("Course Added Successfully!");
      navigate("/admin/courses");
    } catch (err) {
      console.error(err);
      toast.error("Failed to Add Course");
    }
  }

  return (
    <div>
      <SideBar current={"admin_courses"} />
      <section id="content">
        <Navbar />
        <main style={{ padding: "15px" }}>
          <h2>Add New Course</h2>

          <form onSubmit={handleSubmit} style={{ maxWidth: "600px" }}>
            <input type="text" name="course_name" placeholder="Course Name" required onChange={handleChange} />
            <input type="number" name="price" placeholder="Price" required onChange={handleChange} />
            <input type="text" name="instructor" placeholder="Instructor" required onChange={handleChange} />
            <textarea name="description" placeholder="Description" required onChange={handleChange}></textarea>
            <input type="text" name="p_link" placeholder="Image Link" required onChange={handleChange} />
            <input type="text" name="y_link" placeholder="Video Link" required onChange={handleChange} />

            <button type="submit" style={{ marginTop: "10px", backgroundColor: "green", color: "white" }}>
              Save Course
            </button>
          </form>
        </main>
      </section>
    </div>
  );
}

export default AddCourse;
