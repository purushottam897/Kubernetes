import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ReactPlayer from "react-player";
import { Progress } from "antd";
import { Button, Modal } from "antd";

import Forum from "./forum";
import Feedback from "./Feedback";
import apiClient from "../apiClient"; // ✅ use configured axios (with JWT)

const Course = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => setIsModalOpen(true);
  const handleOk = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);

  const [course, setCourse] = useState({
    course_id: null,
    course_name: "",
    instructor: "",
    price: null,
    description: "",
    y_link: "",
    p_link: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [duration, setDuration] = useState(null);   // total video duration (seconds)
  const [played, setPlayed] = useState(0);          // current played seconds
  const [lastSynced, setLastSynced] = useState(0);  // last time we synced to backend

  const [popup, setPopup] = useState(false);

  const [userId] = useState(localStorage.getItem("id"));
  const navigate = useNavigate();
  const location = useLocation();
  const courseId = location.pathname.split("/")[2]; // from /course/:id

  const playerRef = useRef(null);

  // 1) Fetch course details
  useEffect(() => {
    async function fetchCourse() {
      try {
        setLoading(true);
        const response = await apiClient.get(`/api/courses/${courseId}`);
        const fetchedCourse = response.data;
        setCourse(fetchedCourse);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching course:", err);
        setError(true);
        setLoading(false);
      }
    }
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  // 2) Handle duration (called by ReactPlayer)
  const handleDuration = async (dur) => {
    setDuration(dur);
    if (!dur || dur === 0) return;

    try {
      await apiClient.put("/api/progress/update-duration", {
        userId,
        courseId,
        duration: dur,
      });
    } catch (err) {
      console.error("Error updating duration:", err);
    }
  };

  // 3) Fetch initial played time (progress) from backend
  useEffect(() => {
    async function fetchProgress() {
      if (!userId || !courseId) return;

      try {
        const response = await apiClient.get(
          `/api/progress/${userId}/${courseId}`
        );
        const value = Number(response.data) || 0;
        setPlayed(value);
        setLastSynced(value);
      } catch (err) {
        console.error("Error fetching initial progress:", err);
      }
    }

    fetchProgress();
  }, [userId, courseId]);

  // 4) Whenever played increases, periodically sync to backend
  useEffect(() => {
    if (!userId || !courseId || !duration) return;
    if (played <= lastSynced) return;

    const timeout = setTimeout(async () => {
      try {
        await apiClient.put("/api/progress/update-progress", {
          userId,
          courseId,
          playedTime: played,
          duration,
        });
        setLastSynced(played);
      } catch (err) {
        console.error("Error updating progress:", err);
      }
    }, 1000); // sync 1s after last change

    return () => clearTimeout(timeout);
  }, [played, lastSynced, userId, courseId, duration]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !course) {
    return <div>Something went wrong!</div>;
  }

  // Safely compute percentage (avoid NaN / Infinity)
  const percent =
    duration && duration > 0
      ? Math.min(100, Math.ceil((played / duration) * 100))
      : 0;

  const canTakeQuiz = percent >= 98;

  return (
    <div>
      <h3
        style={{
          textAlign: "center",
          color: "white",
          padding: "10px",
          fontSize: "900",
          fontStyle: "italic",
          backgroundColor: "darkblue",
          width: "100%",
          height: "-19px",
        }}
      >
        The Complete {course.course_name} Course - 2023
      </h3>

      <div
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: "30px",
        }}
      >
        <div key={courseId} className="course">
          <div style={{ display: "flex", gap: "20px" }}>
            {/* Video Player */}
            <ReactPlayer
              ref={playerRef}
              url={course.y_link}
              controls
              type="video/mp4"
              width="60%"
              height="440px"
              onDuration={handleDuration}
              onProgress={(progress) => {
                // progress.playedSeconds is current play time
                setPlayed(progress.playedSeconds);
              }}
              style={{
                boxShadow: "0 0 20px rgba(0, 0, 0, 0.52)",
                padding: "8px",
                backgroundColor: "darkgrey",
                borderRadius: "10px",
              }}
            />

            {/* Side description card */}
            <div
              style={{
                width: "50%",
                boxShadow: "0 0 20px rgba(0, 0, 0, 0.52)",
                borderRadius: "10px",
              }}
            >
              <h4>Course Format:</h4>
              <p>
                This is a self-paced online course, consisting of video
                lectures, hands-on coding exercises, and quizzes. You can
                complete the course at your own pace within the 8-week access
                period.
              </p>

              <h4>Prerequisites:</h4>
              <p>
                No prior programming experience is required, but basic computer
                literacy is recommended.
              </p>

              <h4>Who Should Take This Course:</h4>
              <ul>
                <li>Beginners interested in learning programming.</li>
                <li>
                  Individuals looking to add {course.course_name} to their
                  skillset.
                </li>
                <li>Students preparing for computer science courses.</li>
              </ul>

              <h4>Evaluate Yourself:</h4>
              <p>
                The assessments are designed to reinforce your learning and
                provide valuable feedback on your progress throughout the
                course.
              </p>
              <p>
                Click the below <b>"Take Quizz"</b> button to take the
                assessment
              </p>

              {canTakeQuiz ? (
                <button
                  className="enroll-button"
                  onClick={() => navigate(`/assessment/${course.course_id}`)}
                >
                  Quizz
                </button>
              ) : (
                <button className="enroll-button-deactive" onClick={showModal}>
                  Quizz
                </button>
              )}
            </div>
          </div>

          {/* Description */}
          <h4
            style={{
              marginTop: "20px",
              boxShadow: "0 0 20px rgba(0, 0, 0, 0.52)",
              borderRadius: "10px",
            }}
          >
            Description:{" "}
            <span style={{ fontStyle: "italic", color: "grey" }}>
              {course.description}
            </span>
          </h4>

          <p
            style={{
              width: "85%",
              marginBottom: "10px",
              textAlign: "center",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            This online programming course provides a comprehensive introduction
            to the {course.course_name}. Whether you're a beginner or looking to
            expand your coding skills, this course will cover{" "}
            {course.course_name} fundamentals and prepare you for more advanced
            challenges.
          </p>

          <h4 style={{ marginBottom: "10px" }}>
            Instructor: {course.instructor}
          </h4>
          <h4>Content type: Video</h4>

          <div>
            <button
              className="enroll-button"
              onClick={() => navigate("/learnings")}
            >
              Back
            </button>

            <Modal
              title="Note:"
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              <p
                style={{
                  color: "black",
                  fontWeight: "bold",
                  fontSize: "15px",
                }}
              >
                Complete 100% of your course to take Quizz
              </p>
            </Modal>

            {popup && (
              <p
                style={{
                  backgroundColor: "#017bff",
                  width: "30%",
                  padding: "8px",
                  borderRadius: "10px",
                  color: "white",
                  marginLeft: "703px",
                  marginTop: "10px",
                }}
              >
                Complete 100% of your course to take Quizz
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Progress + report section */}
      <div className="pro-report">
        <div className="progress-report-section">
          <div className="progress-section">
            <h3 className="section-title">Progress:</h3>
            <Progress
              percent={percent}
              status="active"
              strokeColor={{
                "0%": "#108ee9",
                "100%": "#87d068",
              }}
              showInfo={false}
            />
          </div>
          <div className="report-section">
            <h3 className="section-title">Report:</h3>
            <p className="completion-text">
              You have completed{" "}
              <span className="completion-percent">{percent}%</span> of this
              course.
            </p>
          </div>
        </div>
      </div>

      <button
        className="enroll-button"
        onClick={() => navigate(`/discussion/${courseId}`)}
      >
        discussion
      </button>

      <Feedback courseid={courseId} />
    </div>
  );
};

export default Course;
