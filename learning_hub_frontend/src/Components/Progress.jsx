import React, { useState, useEffect } from "react";
import apiClient from "../apiClient";

function Progress({ userId, courseId }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    async function fetchProgress() {
      try {
        const response = await apiClient.get(`/api/progress/${userId}/${courseId}`);
        setProgress(response.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchProgress();
  }, [userId, courseId]);

  return (
    <div className="progress-container">
      <div className="progress-bar" style={{ width: `${progress}%` }}></div>
    </div>
  );
}

export default Progress;
