import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import arrow from '../../assets/arrow.png';
import logo from '../../assets/logo.png';
import user from '../../assets/user.png';

export default function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [logoutError, setLogoutError] = useState(null);
  const navigate = useNavigate();

  const toggleNavbar = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, redirecting to login');
        navigate('/login');
        return;
      }

      // Make the logout request
      const response = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Clear local storage regardless of response
      localStorage.clear();

      if (response.ok) {
        console.log('Logout successful');
        navigate('/login');
      } else {
        const errorData = await response.json();
        console.error('Logout failed:', errorData.message);
        setLogoutError(errorData.message);
        // Still redirect to login even if the server request fails
        navigate('/login');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      // Clear storage and redirect even if there's an error
      localStorage.clear();
      navigate('/login');
    }
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.nav-item.dropdown')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div>
      <nav className="navbar navbar-expand-lg fixed-top" style={{ backgroundColor: '#24757e', color: '#ffffff' }}>
        <div className="container-fluid">
          {/* Logo and Branding */}
          <div className="d-flex align-items-center flex-wrap flex-lg-nowrap w-100">
            <div className="d-flex align-items-center flex-grow-1">
              <img
                src={logo}
                alt="Logo"
                style={{ width: '40px', height: '40px' }}
                className="me-2"
              />
              <span className="text-white fs-6 fs-md-4" style={{ lineHeight: '1.2' }}>
                GAMAGE RECRUITERS
              </span>
            </div>

            {/* Navigation Links */}
            <ul className="navbar-nav d-flex flex-row justify-content-center justify-content-lg-end w-auto mt-2 mt-lg-0">
              <li className="nav-item me-3">
                <a className="nav-link text-white" href="/aboutus">About Us</a>
              </li>
              <li className="nav-item me-3">
                <a className="nav-link text-white" href="/services">Services</a>
              </li>
              <li className="nav-item me-5">
                <a className="nav-link text-white" href="/contactus">Contact Us</a>
              </li>

              {/* Profile Dropdown */}
              <li className="nav-item dropdown">
                <button
                  className="nav-link d-flex align-items-center text-white bg-transparent border-0"
                  onClick={toggleNavbar}
                >
                  <img
                    src={user}
                    alt="user"
                    style={{ width: '37px', paddingRight: '9px', marginRight: '5px' }}
                  />
                  <img
                    src={arrow}
                    alt="arrow"
                    style={{ width: '15px' }}
                  />
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <ul className="dropdown-menu dropdown-menu-end show"
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '100%',
                      minWidth: '150px',
                    }}>
                    <li>
                      <a className="dropdown-item" href="/employee-profile">
                        My Profile
                      </a>
                    </li>
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={handleLogout}
                        style={{ border: 'none', width: '100%', textAlign: 'left', padding: '8px 20px' }}
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

      {/* Error Alert */}
      {logoutError && (
        <div className="alert alert-danger position-fixed top-0 start-50 translate-middle-x mt-5" role="alert">
          {logoutError}
        </div>
      )}
    </div>
  );
}