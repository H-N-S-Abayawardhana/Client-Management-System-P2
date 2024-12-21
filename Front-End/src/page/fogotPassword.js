import React, { useState } from 'react';
import Footer from '../components/templetes/Footer'; // Footer component
import Navbar from '../components/templetes/MainNav'; // Navbar component
import '../css/forgotPassword.css'; // Custom styles
import { useNavigate } from 'react-router-dom'; // For navigation
import { ToastContainer, toast } from 'react-toastify'; // Toast messages
import 'react-toastify/dist/ReactToastify.css'; // Toast styles

function ForgotPassword() {
  const [formData, setFormData] = useState({
    email: '',
    mobile: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  // Handle input change
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

    if (!formData.email || !formData.mobile || !formData.newPassword) {
      toast.error('All fields are required.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          mobile: formData.mobile,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Password reset successfully! Redirecting to Sign In...');
        setTimeout(() => {
          navigate('/login'); // Redirect to Sign In page
        }, 3000);
      } else {
        toast.error(data.message || 'Failed to reset password. Try again.');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('Something went wrong. Please try again later.');
    }
  };

  // Handle reset button click
  const handleResetClick = () => {
    setShowPopup(true); // Show popup
  };

  const handleClosePopup = () => {
    setShowPopup(false); // Close popup
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
      <Navbar />
      <div className="flex-grow-1 d-flex justify-content-center align-items-center">
        <div className="mk-forgot-password-container">
          <h2 className="text-center">Forgot Password</h2>

          <form className="forgot-password-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                id="mobile"
                name="mobile"
                className="form-control"
                placeholder="Mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                id="newPassword"
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
                id="confirmPassword"
                name="confirmPassword"
                className="form-control"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block"  onClick={handleResetClick}>
              Reset
            </button>
          </form>
        </div>
      </div>
      <Footer />
      <ToastContainer />

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-container">
            <button className="close-icon" onClick={() => setShowPopup(false)}>
              &times;
            </button>
            <p>Please Contact Admin</p>
            <button className="btn-ok" onClick={handleClosePopup}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ForgotPassword;
