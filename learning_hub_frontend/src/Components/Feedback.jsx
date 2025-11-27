import React, { useEffect, useState } from "react";
import apiClient from "../apiClient";

const Feedback = (props) => {
  const [feedback, setFeedback] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);

  const courseId = props.courseid;

  // Fetch feedbacks
  useEffect(() => {
    async function fetchFeedbacks() {
      if (!courseId) return;

      try {
        const res = await apiClient.get(`/api/feedbacks/${courseId}`);
        const data = res.data || [];
        setFeedbacks(data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
    }

    fetchFeedbacks();
  }, [courseId]);

  const sendFeedback = async () => {
    if (!courseId) {
      alert("Course ID is missing");
      return;
    }
    if (!feedback || feedback.trim() === "") {
      alert("Please enter feedback to submit");
      return;
    }

    try {
      await apiClient.post("/api/feedbacks", {
        comment: feedback,
        course_id: Number(courseId),   // 🟢 matches FeedbackRequest.course_id
      });

      setFeedback("");
      // Optimistically add feedback to list
      setFeedbacks((prev) => [{ comment: feedback }, ...prev].slice(0, 3));
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback");
    }
  };

  return (
    <div className="feedback-main">
      <div className="get-input">
        <label>Your Feedback</label>
        <input
          type="text"
          className="form-control"
          style={{ width: "100%", marginRight: "50px" }}
          onChange={(e) => setFeedback(e.target.value)}
          value={feedback}
        />
        <button
          onClick={sendFeedback}
          style={{
            marginTop: "5px",
            padding: "5px",
            backgroundColor: "darkviolet",
            borderRadius: "5px",
            color: "white",
          }}
        >
          Submit
        </button>
      </div>
      <div className="feedback-list">
        <h3>Recent Feedbacks:</h3>
        <ul>
          {feedbacks.map((item, index) => (
            <li key={index}>{item.comment}</li>
          ))}
        </ul>
      </div>
      <br />
    </div>
  );
};

export default Feedback;
