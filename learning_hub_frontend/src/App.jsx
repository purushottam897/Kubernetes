import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/login";
import Register from "./Components/register";
import Course from "./Components/course";
import Courses from "./Components/Courses";
import Profile from "./Components/profile";
import Learnings from "./Components/learnings";
import Home from "./Components/Home";
import AddCourse from "./Components/AddCourse";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./Components/DashBoard/Dashboard";
import "boxicons/css/boxicons.min.css";
import EditCourse from "./Components/EditCourses";
import DUsers from "./Components/DashBoard/DUsers";
import DCourses from "./Components/DashBoard/DCourses";
import Assessment from "./Components/Assessment";
import ErrorPage from "./Components/ErrorPage";
import AddQuestions from "./Components/AddQuestions";
import Performance from "./Components/DashBoard/Performance";
import DTutors from "./Components/DashBoard/DTutors";
import Certificate from "./Components/certificate";
import Forum from "./Components/forum";
import axios from "axios";
import AdminDashboard from "./Components/DashBoard/AdminDashboard";

// Axios interceptor to include JWT token in requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Public / general routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Courses & learning */}
          <Route path="/courses" element={<Courses />} />
          <Route path="/course/:id" element={<Course />} />
          <Route path="/discussion/:id" element={<Forum />} />
          <Route path="/certificate/:id" element={<Certificate />} />
          <Route path="/assessment/:id" element={<Assessment />} />
          <Route path="/learnings" element={<Learnings />} />
          <Route path="/profile" element={<Profile />} />

          {/* Course management */}
          <Route path="/addcourse" element={<AddCourse />} />
          <Route path="/editCourse/:id" element={<EditCourse />} />
          <Route path="/addquestions/:id" element={<AddQuestions />} />

          {/* Admin / dashboard area */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/Dusers" element={<DUsers />} />
          {/* 👇 match what you use in SideBar: "/DCourses" */}
          <Route path="/DCourses" element={<DCourses />} />
          <Route path="/Dtutors" element={<DTutors />} />
          <Route path="/Performance" element={<Performance />} />

          {/* ✅ Admin Dashboard route */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Fallback */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
      <ToastContainer />
    </div>
  );
}

export default App;
