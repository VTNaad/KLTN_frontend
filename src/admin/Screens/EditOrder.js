import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import "../Style/editlesson.scss";

const EditOrder = () => {
  const { lessonId } = useParams(); // Lấy id bài học từ URL
  const [lesson, setLesson] = useState({ title: "", excelFile: "" });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    // Lấy thông tin bài học
    const fetchLesson = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/v1/api/lesson/${lessonId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success) {
          setLesson(response.data.lesson);
        } else {
          setError("Failed to fetch lesson data.");
        }
      } catch (error) {
        console.error("Error fetching lesson data:", error);
        setError("An error occurred while fetching lesson data.");
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Tạo form data để gửi lên API
    const formData = new FormData();
    formData.append("title", lesson.title);
    if (file) {
      formData.append("excelFile", file);
    }

    try {
      const response = await axios.put(
        `http://localhost:8080/v1/api/lesson/${lessonId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        alert("Lesson updated successfully!");
        navigate("/admin/lessons");
      } else {
        alert(response.data.message || "Failed to update lesson.");
      }
    } catch (error) {
      console.error("Error updating lesson:", error);
      setError("An error occurred while updating the lesson.");
    }
  };

  return (
    <div className="editLesson">
      <Sidebar />
      <div className="editLessonContainer">
        <Navbar />
        <div className="editlesson">
          <h2>Edit Lesson</h2>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="formGroup">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  value={lesson.title}
                  onChange={(e) =>
                    setLesson({ ...lesson, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="formGroup">
                <label htmlFor="file">Upload Excel File (Optional)</label>
                <input
                  type="file"
                  id="file"
                  onChange={handleFileChange}
                  accept=".xlsx, .xls, .csv"
                />
                {lesson.excelFile && !file && (
                  <div className="fileLink">
                    <a
                      href={lesson.excelFile}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View current Excel file
                    </a>
                  </div>
                )}
              </div>

              <button type="submit">Save</button>
            </form>
          )}

          {error && <p className="error">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default EditOrder;
