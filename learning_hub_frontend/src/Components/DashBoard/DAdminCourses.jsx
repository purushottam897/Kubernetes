import React, { useEffect, useState } from "react";
import SideBar from "./SideBar";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import apiClient from "../apiClient";
import { Modal } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";

function DAdminCourses() {
  const [courses, setCourses] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  // 🛡️ Allow only admin
  useEffect(() => {
    if (localStorage.getItem("role") !== "ADMIN") {
      alert("Access Denied! Admins only.");
      navigate("/dashboard");
    }
  }, [navigate]);

  // 📌 Fetch courses
  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    try {
      const res = await apiClient.get("/api/courses");
      setCourses(res.data);
    } catch (err) {
      console.error("Error loading courses:", err);
    }
  }

  // 🔴 Delete Course
  async function handleDelete() {
    try {
      await apiClient.delete(`/api/courses/${deleteId}`);
      setCourses(courses.filter((c) => c.course_id !== deleteId));
      setOpenModal(false);
      setDeleteId(null);
    } catch (err) {
      console.error("Delete Failed:", err);
    }
  }

  return (
    <div>
      <SideBar current={"admin_courses"} />
      <section id="content">
        <Navbar />
        <main style={{ padding: "10px" }}>
          <div className="head" style={{ display: "flex", justifyContent: "space-between" }}>
            <h2>Manage Courses</h2>
            <button
              onClick={() => navigate("/admin/add-course")}
              style={{ backgroundColor: "darkblue", color: "white", padding: "8px", borderRadius: "8px" }}
            >
              Add Course <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>

          <table style={{ width: "100%", marginTop: "20px", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#aaa", color: "white" }}>
                <th>Image</th>
                <th>Name</th>
                <th>Instructor</th>
                <th>Price</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.course_id}>
                  <td><img src={course.p_link} alt="" width="70" /></td>
                  <td>{course.course_name}</td>
                  <td>{course.instructor}</td>
                  <td>₹ {course.price}</td>
                  <td>{course.description}</td>
                  <td>
                    <button
                      onClick={() => navigate(`/admin/edit-course/${course.course_id}`)}
                      style={{ marginRight: "10px" }}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>

                    <button
                      onClick={() => { setDeleteId(course.course_id); setOpenModal(true); }}
                      style={{ color: "red" }}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </section>

      <Modal open={openModal} onOk={handleDelete} onCancel={() => setOpenModal(false)}>
        <h3>Are you sure want to delete this course?</h3>
      </Modal>
    </div>
  );
}

export default DAdminCourses;
