import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/templetes/adminNavBar";
import Footer from "../../components/templetes/Footer";
import "../../css/admin/adminprofile.css";
import profileIcon from "../../assets/employee2.png";

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL ;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); 
  };

  useEffect(() => {
    const fetchAdminData = async () => {
        try {
            const token = localStorage.getItem("token");
            const email = localStorage.getItem("email");
            const userType = localStorage.getItem("type");

            if (!token || !email || !userType) {
                navigate("/login");
                throw new Error("Missing authentication data");
            }

            if (userType !== "Admin") {
                navigate("/login");
                throw new Error("Unauthorized access");
            }

            const response = await fetch(`${API_URL}/api/admin/admin/profile/${email}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch admin data");
            }

            const data = await response.json();
            setAdmin(data);
        } catch (error) {
            console.error("Error fetching admin data:", error);
            setError("Error fetching admin data");
        }
    };

    fetchAdminData();
}, [navigate]);

  if (!admin) {
    return (
      <div>
        <h1>Something went wrong</h1>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="hmr-admin-profile-container">
              <button
          className="hmr-admin-profile-back-button"
          onClick={() => navigate("/admin-dashboard")}
          aria-label="Back to dashboard"
        >
          <span>Back</span>
        </button>
        <h1 className="hmr-admin-profile-title">Admin Profile</h1>

        {/* Profile Header */}
        <div className="hmr-admin-profile-header-card">
          <img
            src={profileIcon}
            alt="Admin Avatar"
            className="hmr-admin-profile-avatar"
          />
          <div className="hmr-admin-profile-info">
            <h3 className="hmr-admin-profile-name">{admin.Name}</h3>
            <p className="hmr-admin-profile-role">Gamage Recruiters - Admin</p>
          </div>
          <button
            className="hmr-edit-profile-button"
            onClick={() => navigate("/edit-admin-profile")}
          >
            Edit Profile
          </button>
        </div>

        {/* Profile Details */}
        <div className="hmr-admin-profile-details-card">
          <div className="hmr-details-row">
            <div className="hmr-details-item">
              <h4>Admin Name</h4>
              <p>{admin.Name}</p>
            </div>
            <div className="hmr-details-item">
              <h4>User Name</h4>
              <p>{admin.Username}</p>
            </div>
          </div>
          <div className="hmr-details-row">
            <div className="hmr-details-item">
              <h4>Email</h4>
              <p>{admin.Email}</p>
            </div>
            <div className="hmr-details-item">
              <h4>Contact Number</h4>
              <p>{admin.ContactNumber}</p>
            </div>
          </div>
          <div className="hmr-details-row">
            <div className="hmr-details-item">
              <h4>Admin Registration Date</h4>
              <p>{formatDate(admin.RegistrationDate)}</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminProfile;