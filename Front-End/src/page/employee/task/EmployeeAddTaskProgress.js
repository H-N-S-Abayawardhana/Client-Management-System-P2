import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "../../../css/employee/(apwgr)EmployeeAddTaskProgress.css";
import Navbar from "../../../components/templetes/empNavBar";
import Footer from "../../../components/templetes/Footer";
import Sidebar from "../../../components/templetes/ESideBar";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

const EmployeeAddTaskProgress = () => {
  const navigate = useNavigate();

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [TaskName, setTaskTitle] = useState("");
  const [TaskID, setTaskID] = useState("");
  const [TaskDescription, setTaskDescription] = useState("");
  const [file, setFile] = useState(null);
  const [EmployeeID, setEmployeeID] = useState(null); // Dynamic EmployeeID
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch EmployeeID from profile API
    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/employee/current/profile"
        );
        if (response.status === 200) {
          setEmployeeID(response.data.EmployeeID); // Set the EmployeeID dynamically
        } else {
          throw new Error("Failed to fetch employee data");
        }
      } catch (error) {
        console.error("Error fetching EmployeeID:", error);
        setError("Failed to fetch EmployeeID. Please try again later.");
      }
    };

    fetchEmployeeData();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!EmployeeID) {
      alert("Unable to fetch EmployeeID. Please refresh and try again.");
      return;
    }

    const formData = new FormData();
    formData.append("TaskID", TaskID);
    formData.append("EmployeeID", EmployeeID); // Use fetched EmployeeID
    formData.append("TaskName", TaskName);
    formData.append("TaskDescription", TaskDescription);

    if (file) {
      formData.append("Attachment", file);
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/employee/task/task-progress",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        alert("Task Progress Updated Successfully!");
        setTaskTitle("");
        setTaskID("");
        setTaskDescription("");
        setFile(null);
      } else {
        alert("Failed to Update the Task Progress.");
      }
    } catch (error) {
      console.error("Error Updating the Task:", error);
      alert("An Error Occurred while Updating the Task Progress.");
    }
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div>
      <Navbar />

      <div className="apwgr-main-tasks-container">
        <nav className="breadcrumb" aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a className="text-decoration-none" href="/employee-dashboard">
                Home
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Send Task Progress
            </li>
          </ol>
        </nav>

        <div className="apwgr-head">
          <h1 className="text-center">Send Tasks Progress</h1>
        </div>

        <div className="apwgr-back-button-area">
          <div className="apwgr-but-inside">
            <button
              className="btn apwgr-back-btn my-3"
              onClick={() => navigate("/employee-manage-task-prgress")}
            >
              <span className="bi bi-arrow-left m-3"> Back </span>
            </button>
          </div>
        </div>

        <div className="apwgr-add-task-container">
          <div className="apwgr-content">
            {error && <p className="text-danger">{error}</p>}
            <form className="apwgr-task-form" onSubmit={handleFormSubmit}>
              <label>
                <input
                  type="text"
                  name="TaskName"
                  id="TaskName"
                  placeholder="Task Name"
                  value={TaskName}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  required
                />
              </label>
              <label>
                <input
                  type="text"
                  name="TaskID"
                  id="TaskID"
                  placeholder="Task ID"
                  value={TaskID}
                  onChange={(e) => setTaskID(e.target.value)}
                  required
                />
              </label>
              <label>
                <textarea
                  name="TaskDescription"
                  id="TaskDescription"
                  placeholder="Task Description"
                  value={TaskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  required
                ></textarea>
              </label>
              <label>
                <input
                  type="file"
                  id="fileUpload"
                  name="Attachment"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </label>
              <div className="apwgr-back-button-area">
                <button type="submit" className="apwgr-send-btn">
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <button className="apwgr-sidebar-toggle" onClick={toggleSidebar}>
        ☰
      </button>
      <div
        className={`flex-grow-1 d-flex ${
          sidebarVisible ? "show-sidebar" : ""
        }`}
      >
        <Sidebar sidebarVisible={sidebarVisible} />
      </div>
      <div className="container3">
        <Footer />
      </div>
    </div>
  );
};

export default EmployeeAddTaskProgress;
