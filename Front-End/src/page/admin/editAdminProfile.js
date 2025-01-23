import React, { useState, useEffect } from "react";
import Navbar from "../../components/templetes/adminNavBar";
import Footer from "../../components/templetes/Footer";
import "../../css/admin/editAdminProfile.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditAdminProfile = () => {
  const [admin, setAdmin] = useState({
    Name: "",
    Username: "",
    Email: "",
    ContactNumber: "",
    RegistrationDate: "",
    AdminID: "" 
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL ;

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
        // Store the raw date string from MySQL
        setAdmin({
          ...data,
          RegistrationDate: data.RegistrationDate.split('T')[0] // Format YYYY-MM-DD
        });
      } catch (error) {
        console.error("Error fetching admin data:", error);
        setError("Error fetching admin data");
      }
    };

    fetchAdminData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmin(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Updating profile...");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/admin/current/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(admin), // Send the admin object directly
      });

      if (!response.ok) {
        throw new Error("Failed to update admin details");
      }

      const data = await response.json();
      toast.dismiss(loadingToast);
      toast.success("Profile updated successfully!");
      
      setTimeout(() => {
        navigate("/admin-profile");
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      toast.dismiss(loadingToast);
      toast.error("Failed to update profile. Please try again.");
      setError("Error updating admin details");
    }
  };

  return (
    <div className="hmr-edit-admin-page">
      <Navbar />
      <div className="hmr-edit-admin-container">
              <button
          className="hmr-edit-admin-profile-back-button"
          onClick={() => navigate("/admin-profile")}
          aria-label="Back to Profile"
        >
          <span>Back</span>
        </button>
        <h1 className="hmr-edit-admin-title">Edit Profile Details</h1>

        {error && <p className="hmr-edit-admin-error-message">{error}</p>}

        <form className="hmr-edit-admin-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="Name"
            placeholder="Admin Name"
            value={admin.Name || ""}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="Username"
            placeholder="User Name"
            value={admin.Username || ""}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="Email"
            placeholder="Email"
            value={admin.Email || ""}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="ContactNumber"
            placeholder="Contact Number"
            value={admin.ContactNumber || ""}
            onChange={handleChange}
            required
          />

          <input
            type="date"
            name="RegistrationDate"
            value={admin.RegistrationDate || ""}
            onChange={handleChange}
            required
          />

          <button type="submit" className="hmr-edit-admin-update-button">
            Update
          </button>
        </form>
      </div>
      <Footer />
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default EditAdminProfile;