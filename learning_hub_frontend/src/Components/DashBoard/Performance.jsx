import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './dstyle.css';
import { useNavigate } from 'react-router-dom';


const Performance = () => {
  const [performanceData , setPerfomanceData] = useState([]);
  const [enrolledcourses, setEnrolledCourses] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchCourse() {
      try {
        const userId = localStorage.getItem("id");
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:8082/api/learnings/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const fetchedCourse = response.data;
        setEnrolledCourses(fetchedCourse);
      } catch (err) {
        console.log(err);
      }
    }
    fetchCourse();
  }, []);

  useEffect(()=>{
    const userId = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    fetch(`http://localhost:8082/api/assessments/performance/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPerfomanceData(data);
        } else {
          setPerfomanceData([]);
          console.error("Expected array but got:", data);
        }
      })
      .catch((error) => {
        setPerfomanceData([]);
        console.error("Error fetching performance data:", error);
      });
  },[])

  function certifiedUser(id){
    navigate(`/certificate/${id}`);
  }

  return (
    <div className="performance-container" style={{ marginTop: '70px' }}>
  <div style={{ marginBottom: '80px' }}>
    <h2 style={{ color: 'darkblue' }}>Courses Enrolled</h2>
    <table className="performance-table" style={{ width: '40%' }}>
      <thead>
        <tr>
          <th>Courses</th>
        </tr>
      </thead>
      <tbody>
        {enrolledcourses.map((data, index) => (
          <tr key={index}>
            <td>{data.course_name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  <div>
    <h2 style={{ color: 'darkblue' }}>PERFORMANCE</h2>
    <table className="performance-table" style={{ marginBottom: '40px' }}>
      <thead>
        <tr>
          <th>Courses</th>
          <th>Progress</th>
          <th>Marks</th>
          <th>Certificate</th>
        </tr>
      </thead>
      <tbody>
        {performanceData.map((data, index) => (
          <tr key={index}>
            <td>{data.course.course_name}</td>
            <td className={data.marks !== 0 ? 'completed-status' : 'pending-status'}>{data.marks !== 0 ? 'Completed' : 'Pending'}</td>
            <td>{data.marks}</td>
            <td className={data.marks !== 0 ? 'completed-certificate' : 'pending-certificate'} onClick={()=>certifiedUser(data.course.id)}>{data.marks !== 0 ? 'Download Certificate' : 'Not Available'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

  );
};

export default Performance;
