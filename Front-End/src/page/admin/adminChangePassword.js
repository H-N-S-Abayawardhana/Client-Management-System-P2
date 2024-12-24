import React, { useState } from 'react';
import Footer from '../../components/templetes/Footer';
import Navbar from '../../components/templetes/empNavBar';
import '../../css/admin/adminChangePassword.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function AdminChangePassword() {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error('All fields are required.');
      return;
    }

    try {
      const token = localStorage.getItem('token'); // Fetch JWT token
      if (!token) {
        toast.error('Unauthorized. Please log in again.');
        navigate('/login');
        return;
      }

      // Call backend API to change password
      const response = await fetch('http://localhost:5000/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
        body: JSON.stringify({
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Password updated successfully! Redirecting to Sign In...');
        setTimeout(() => {
          localStorage.removeItem('token'); // Clear token
          navigate('/login'); // Redirect to Sign In page
        }, 3000);
      } else {
        toast.error(data.message || 'Failed to update password. Try again.');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
      <Navbar />
      <div className="flex-grow-1 d-flex justify-content-center align-items-center">
        <div className="mk-admin-change-password-container">
          <h2 className="text-center">Change Password</h2>
          <form className="mk-admin-change-password-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="password"
                name="oldPassword"
                className="form-control"
                placeholder="Old Password"
                value={formData.oldPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                name="newPassword"
                className="form-control"
                placeholder="New Password"
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              Reset
            </button>
          </form>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default AdminChangePassword;
