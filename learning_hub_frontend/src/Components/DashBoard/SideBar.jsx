import React from "react";
import { Link } from "react-router-dom";
import img1 from "../images/user.png";

function SideBar(props) {
  const { current } = props;
  const email = localStorage.getItem("email"); // get login email

  return (
    <div id="sidebar">

      {/* BRAND */}
      <Link to={"/dashboard"} className="brand a">
        <img src={img1} alt="" />
        <span className="text" id="admin">LMS Admin</span>
      </Link>

      {/* MENU LIST */}
      <ul className="side-menu">

        {/* Dashboard */}
        <li className={current === "dashboard" ? "active" : ""}>
          <Link to={"/dashboard"} className="a">
            <i className="bx bxs-dashboard" id="i"></i>
            <span className="text">Dashboard</span>
          </Link>
        </li>

        {/* Users */}
        <li className={current === "user" ? "active" : ""}>
          <Link to={"/Dusers"} className="a">
            <i className="bx bxs-group" id="i"></i>
            <span className="text">Users</span>
          </Link>
        </li>

        {/* Courses */}
        <li className={current === "courses" ? "active" : ""}>
          <Link to={"/DCourses"} className="a">
            <i className="bx bxs-book" id="i"></i>
            <span className="text">Courses</span>
          </Link>
        </li>

        {email === "admin@gmail.com" && (
  <li className={current === "admin" ? "active" : ""}>
    <Link to={"/admin"} className="a">
      <i className='bx bxs-cog' id="i"></i>
      <span className="text">Admin Panel</span>
    </Link>
  </li>
)}

      </ul>
    </div>
  );
}

export default SideBar;
