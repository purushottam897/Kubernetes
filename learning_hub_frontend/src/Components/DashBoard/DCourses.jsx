import React, { useState, useEffect } from "react";
import "./dstyle.css";
import { useNavigate } from "react-router-dom";
import SideBar from "./SideBar";
import Navbar from "./Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Modal } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiClient from "../../apiClient"; // <-- adjust path if needed

function Courses() {
  const [courses, setCourses] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [cid, setCid] = useState(null);
  const navigate = useNavigate();

  // Load courses from backend
  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await apiClient.get("/api/courses");
        setCourses(res.data || []);
      } catch (err) {
        console.error("Error loading courses:", err);
        toast.error("Failed to load courses");
      }
    }
    fetchCourses();
  }, []);

  const showModal = (courseId) => {
    setCid(courseId);
    setOpenModal(true);
  };

  const handleCancel = () => {
    setCid(null);
    setOpenModal(false);
  };

  // Delete from backend + update UI
  const handleOk = async () => {
    if (!cid) return;
    try {
      await apiClient.delete(`/api/courses/${cid}`);
      setCourses((prev) => prev.filter((course) => course.course_id !== cid));
      toast.success("Course deleted successfully");
    } catch (err) {
      console.error("Error deleting course:", err);
      toast.error("Failed to delete course");
    } finally {
      setCid(null);
      setOpenModal(false);
    }
  };

  function editCourse(course_id) {
    navigate(`/editCourse/${course_id}`);
  }

  function addquestions(course_id) {
    navigate(`/addquestions/${course_id}`);
  }

  return (
    <>
      <div style={{ backgroundColor: "#eee" }}>
        <SideBar current={"courses"} />
        <section id="content">
          <Navbar />
          <main className="t">
            <div className="table-data" style={{ marginTop: "-10px" }}>
              <div className="order">
                <div id="course" className="todo">
                  <div className="head" style={{ marginTop: "-100px" }}>
                    <h3 style={{ color: "white" }}>Courses</h3>
                    <button
                      onClick={() => navigate("/addcourse")}
                      style={{
                        backgroundColor: "darkblue",
                        borderRadius: "10px",
                        color: "white",
                        border: "none",
                        padding: "8px",
                        fontWeight: "500",
                      }}
                    >
                      Add Course <FontAwesomeIcon icon={faPlus} />
                    </button>
                  </div>
                  <ul className="todo-list">
                    {courses.map((course) => (
                      <div key={course.course_id}>
                        <li
                          className="completed"
                          style={{
                            marginTop: "10px",
                            backgroundColor: "white",
                            color: "black",
                          }}
                        >
                          <p>{course.course_name}</p>
                          <div
                            style={{
                              width: "50px",
                              display: "flex",
                            }}
                          >
                            {/* Delete */}
                            <button
                              onClick={() => showModal(course.course_id)}
                              style={{
                                marginLeft: "-100px",
                                marginRight: "40px",
                                backgroundColor: "white",
                              }}
                              className="delete-button"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>

                            {/* Edit */}
                            <button
                              onClick={() => editCourse(course.course_id)}
                              style={{
                                marginRight: "40px",
                                backgroundColor: "white",
                              }}
                              className="edit-button"
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>

                            {/* Test / Add Questions */}
                            <button
                              onClick={() => addquestions(course.course_id)}
                              style={{
                                backgroundColor: "#457BC1",
                                borderRadius: "10px",
                                color: "white",
                                border: "none",
                                padding: "8px",
                                fontWeight: "500",
                              }}
                            >
                              Test
                            </button>
                          </div>
                        </li>
                      </div>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </main>
        </section>
      </div>

      <Modal
        id="poppup"
        open={openModal}
        onOk={handleOk}
        onCancel={handleCancel}
        style={{ padding: "10px" }}
      >
        <h3>Are you sure you want to delete this course?</h3>
      </Modal>
    </>
  );
}

export default Courses;
