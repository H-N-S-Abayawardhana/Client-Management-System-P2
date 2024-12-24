import React, { useState, useEffect } from "react";
import Navbar from "../../components/templetes/adminNavBar";
import Footer from "../../components/templetes/Footer";
import "../../css/admin/editAdminProfile.css";
import { useNavigate } from "react-router-dom";

const EditAdminProfile = () => {
  const [admin, setAdmin] = useState({
    AdminName: "",
    UserName: "",
    Email: "",
    ContactNumber: "",
    RegistrationDate: "",
  });

  const [error, setError] = useState("");

  // Temporarily hardcode the admin ID ||  Simulate logged-in user's ID
  const adminID = 1;

  useEffect(() => {
    if (adminID) {
      fetch(`http://localhost:8800/api/admin/${adminID}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch admin data");
          }
          return response.json();
        })
        .then((data) => {
          if (data.RegistrationDate) {
            const date = new Date(data.RegistrationDate);
            data.RegistrationDate = formatDateToDDMMYYYY(date);
          } else {
            const currentDate = new Date();
            data.RegistrationDate = formatDateToDDMMYYYY(currentDate);
          }
          setAdmin(data);
        })
        .catch(() => {
          setError("Error fetching admin data");
          error("Error fetching admin data");
        });
    } else {
      setError("No admin ID found");
      error("No admin ID found");
    }
  }, [error]);

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

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmin({ ...admin, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedDate = convertDDMMYYYYToDate(admin.RegistrationDate);
    admin.RegistrationDate = formattedDate;

    fetch(`http://localhost:8800/api/admin/${adminID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(admin),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update admin details");
        }
        alert("Profile updated successfully!");
        navigate("/admin-profile"); 
      })
      .catch(() => {
        setError("Error updating admin details");
        alert("Error updating admin details");
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
            value={admin.AdminName}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="UserName"
            placeholder="User Name"
            value={admin.UserName}
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
      
    </div>
  );
};

export default EditAdminProfile;
