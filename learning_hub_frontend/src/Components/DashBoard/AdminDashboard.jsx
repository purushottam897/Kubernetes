import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import SideBar from "./SideBar";
import apiClient from "../../apiClient"; // axios instance with JWT
import { useNavigate } from "react-router-dom";
import "./dstyle.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalFeedbacks: 0,
  });
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, usersRes, coursesRes] = await Promise.all([
          apiClient.get("/api/admin/stats"),
          apiClient.get("/api/admin/users"),
          apiClient.get("/api/admin/courses"),
        ]);

        setStats(statsRes.data || {});
        setUsers(usersRes.data || []);
        setCourses(coursesRes.data || []);
      } catch (err) {
        console.error("Error loading admin dashboard:", err);

        // if not admin, backend returns 403
        if (err.response && err.response.status === 403) {
          alert("You are not authorized to view the admin dashboard");
          navigate("/");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content">
          {/* ✅ highlight admin in sidebar even while loading */}
          <SideBar current="admin" />
          <div className="dashboard-page">
            <h2>Loading...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-main">
      <Navbar />
      <div className="dashboard-content">
        {/* ✅ highlight Admin Panel in sidebar */}
        <SideBar current="admin" />

        <div className="dashboard-page">
          <h1 className="dashboard-title">Admin Dashboard</h1>

          {/* STAT CARDS */}
          <div className="stats-grid">
            <StatCard label="Total Users" value={stats.totalUsers} />
            <StatCard label="Total Courses" value={stats.totalCourses} />
            <StatCard label="Total Enrollments" value={stats.totalEnrollments} />
            <StatCard label="Total Feedbacks" value={stats.totalFeedbacks} />
          </div>

          <div className="tables-grid">
            {/* USERS TABLE */}
            <div className="table-card">
              <h2 className="table-title">Users</h2>
              <div className="table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Profession</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td>{u.id}</td>
                        <td>{u.username}</td>
                        <td>{u.email}</td>
                        <td>{u.profession}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* COURSES TABLE */}
            <div className="table-card">
              <h2 className="table-title">Courses</h2>
              <div className="table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Instructor</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((c) => (
                      <tr key={c.courseId ?? c.course_id}>
                        <td>{c.courseId ?? c.course_id}</td>
                        <td>{c.courseName ?? c.course_name}</td>
                        <td>{c.instructor}</td>
                        <td>{c.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Small card used for stats
const StatCard = ({ label, value }) => (
  <div className="stat-card">
    <div className="stat-label">{label}</div>
    <div className="stat-value">{value}</div>
  </div>
);

export default AdminDashboard;
