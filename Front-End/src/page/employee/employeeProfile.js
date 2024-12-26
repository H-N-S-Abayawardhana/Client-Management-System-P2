import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import Navbar from "../../components/templetes/empNavBar";
import Footer from "../../components/templetes/Footer";
import "../../css/employee/employeeprofile.css";
import profileIcon from "../../assets/employee2.png";

const EmployeeProfile = () => {
  const [employee, setEmployee] = useState(null);
  const [isMobile, setIsMobile] = useState(window.matchMedia("(max-width: 768px)").matches);
  const [error, setError] = useState("");
  const navigate = useNavigate(); 

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    };

    const mediaQuery = window.matchMedia("(max-width: 768px)");
    mediaQuery.addEventListener("change", handleResize);

    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  useEffect(() => {
    const employeeID = 1; // Replace with the actual employee ID

    fetch(`http://localhost:5000/api/employee/${employeeID}`)
      .then((response) => {
        if(!response.ok)  {
          throw new Error("Failed to fetch user data");
        }
         return response.json();
        })
      .then((data) => {
        setEmployee(data);
      })
      .catch((error) => {
        console.error("Error fetching employee data:", error);
        setError("Error fetching employee data");
      });

  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    if (isMobile) {
      return date.toLocaleDateString("en-GB");
    } else {
      const day = date.getDate().toString().padStart(2, "0");
      const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
      const year = date.getFullYear();
      return `${day} - ${month} - ${year}`;
    }
  };

  if (!employee) {
    return <div><h1>Something went wrong</h1></div>;
  }

  return (
    <div>
      <Navbar />

      <div className="hmr-profile-container">
        <button 
          className="hmr-emp-back-button" 
          onClick={() => navigate("/employee-dashboard")}
          aria-label="Back to dashboard"
        >
          &#171;
        </button>
        <h1 className="hmr-profile-title">My Profile</h1>

        {/* Profile Header */}
        <div className="hmr-profile-header-card">
          <img
            src={profileIcon}
            alt="Employee Avatar"
            className="hmr-profile-avatar"
          />
          <div className="hmr-profile-info">
            <h3 className="hmr-profile-name">{employee.Name}</h3>
            <p className="hmr-profile-id">{employee.EmployeeID}</p>
            <p className="hmr-profile-designation">{employee.Designation}</p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="hmr-profile-details-card">
          <div className="hmr-details-row">
            <div className="hmr-details-item">
              <h4>Employee ID</h4>
              <p>{employee.EmployeeID}</p>
            </div>
            <div className="hmr-details-item">
              <h4>Designation</h4>
              <p>{employee.Designation}</p>
            </div>
          </div>
          <div className="hmr-details-row">
            <div className="hmr-details-item">
              <h4>Work Start Date</h4>
              <p>{formatDate(employee.WorkStartDate)}</p>
            </div>
            <div className="hmr-details-item">
              <h4>Contact Number</h4>
              <p>{employee.ContactNumber}</p>
            </div>
          </div>
          <div className="hmr-details-row">
            <div className="hmr-details-item">
              <h4>Email</h4>
              <p>{employee.Email}</p>
            </div>
            <div className="hmr-details-item">
              <h4>Address</h4>
              <p>
                {employee.Address.split(",").map((line, index, array) => (
                  <span key={index}>
                    {line.trim()}
                    {index < array.length - 1 && ","}
                    <br />
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EmployeeProfile;
