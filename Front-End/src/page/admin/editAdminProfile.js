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
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

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

            const response = await fetch(`http://localhost:5000/api/admin/admin/profile/${email}`, {
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

  const formatDateToDDMMYYYY = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const convertDDMMYYYYToDate = (dateString) => {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmin({ ...admin, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Show loading toast
    const loadingToast = toast.loading("Updating profile...");

    const formattedDate = convertDDMMYYYYToDate(admin.RegistrationDate);
    const updatedAdmin = {
      ...admin,
      RegistrationDate: formattedDate
    };

    fetch('http://localhost:5000/api/admin/current/update', {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedAdmin),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update admin details");
        }
        return response.json();
      })
      .then((data) => {
        // Dismiss loading toast and show success
        toast.dismiss(loadingToast);
        toast.success("Profile updated successfully!");
        
        // Navigate after a short delay to allow toast to be seen
        setTimeout(() => {
          navigate("/admin-profile");
        }, 1500);
      })
      .catch((error) => {
        console.error("Error:", error);
        setError("Error updating admin details");
        
        // Dismiss loading toast and show error
        toast.dismiss(loadingToast);
        toast.error("Failed to update profile. Please try again.");
      });
  };

  return (
    <div className="hmr-edit-admin-page">
      <Navbar />
      <div className="hmr-edit-admin-container">
        <button
          className="hmr-edit-admin-back-button"
          onClick={() => navigate("/admin-profile")}
          aria-label="Back to dashboard"
        >
          &#171;
        </button>
        <h1 className="hmr-edit-admin-title">Edit Profile Details</h1>

        {error && <p className="hmr-error-message">{error}</p>}

        <form className="hmr-edit-admin-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="AdminName"
            placeholder="Admin Name"
            value={admin.Name}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="UserName"
            placeholder="User Name"
            value={admin.Username}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="Email"
            placeholder="Email"
            value={admin.Email}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="ContactNumber"
            placeholder="Contact Number"
            value={admin.ContactNumber}
            onChange={handleChange}
            required
          />

          <input
            type="date"
            name="RegistrationDate"
            value={convertDDMMYYYYToDate(admin.RegistrationDate)}
            onChange={handleChange}
            required
          />

          <button type="submit" className="hmr-update-button">
            Update
          </button>
        </form>
      </div>
      <Footer />
      
      {/* Toast Container */}
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