import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Bootstrap JS for dropdowns
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import arrow from '../../assets/arrow.png';
import logo from '../../assets/logo.png';
import user from '../../assets/user.png';

export default function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate(); // Use navigate for redirection

  const toggleNavbar = () => {
    setShowDropdown(!showDropdown);
  };

  // Logout function
  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redirect if no token is present
      return;
    }

    try {
      // Call the backend API to logout
      const response = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Pass the JWT token
        },
      });

      if (response.ok) {
        // Clear token and redirect to login page
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        const data = await response.json();
        console.error('Logout failed:', data.message);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div>
      <nav
        className="navbar navbar-expand-lg fixed-top"
        style={{ backgroundColor: '#24757e', color: '#ffffff' }}
      >
        <div className="container-fluid">
          {/* Logo and Branding */}
          <div className="d-flex align-items-center flex-wrap flex-lg-nowrap w-100">
            <div className="d-flex align-items-center flex-grow-1">
              <img
                src={logo}
                alt="Logo"
                style={{ width: '40px', height: '40px' }}
                className="me-2"
                href="/login"
              />
              <span
                className="text-white fs-6 fs-md-4"
                style={{ lineHeight: '1.2' }}
              >
                GAMAGE RECRUITERS
              </span>
            </div>

            {/* Navigation Links */}
            <ul
              className="navbar-nav d-flex flex-row justify-content-center justify-content-lg-end w-auto mt-2 mt-lg-0"
            >
              <li className="nav-item me-3">
                <a className="nav-link text-white" href="/aboutus">
                  About Us
                </a>
              </li>
              <li className="nav-item me-3">
                <a className="nav-link text-white" href="/services">
                  Services
                </a>
              </li>
              <li className="nav-item me-5">
                <a className="nav-link text-white" href="/contactus">
                  Contact Us
                </a>
              </li>

              {/* Profile Dropdown */}
              <li className="nav-item dropdown">
                <a
                  className="nav-link d-flex align-items-center text-white"
                  href="#"
                  onClick={toggleNavbar}
                >
                  <img
                    src={user}
                    alt="user"
                    style={{
                      width: '37px',
                      paddingRight: '9px',
                      marginRight: '5px',
                    }}
                  />
                  <img
                    src={arrow}
                    alt="arrow"
                    style={{ width: '15px' }}
                  />
                </a>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <ul
                    className="dropdown-menu dropdown-menu-end show"
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '100%',
                      minWidth: '150px',
                    }}
                  >
                    <li>
                      <a className="dropdown-item" href="/admin-profile">
                        My Profile
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="/adminChange-password">
                        Change Password
                      </a>
                    </li>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={handleLogout}
                        style={{
                          border: 'none',
                          background: 'none',
                          padding: 0,
                          marginLeft: '18px', 
                        }}
                      >
                        Log out
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
