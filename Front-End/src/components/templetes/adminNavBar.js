import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import arrow from '../../assets/arrow.png';
import logo from '../../assets/logo.png';
import user from '../../assets/user.png';
import logoutIcon from '../../assets/logout.png';
import menuIcon from '../../assets/menu.png';
import attendence from '../../assets/attendence.png';
import dashboard from '../../assets/dashboard.png';
import invoice from '../../assets/invoice.png';
import employee from '../../assets/employee.png';
import payment from '../../assets/payment.png';
import task from '../../assets/task.png';
import mail from '../../assets/mail.png';
import user2 from '../../assets/myprofile.png';
import logout2 from '../../assets/logout2.png';
import changepswd from '../../assets/cpswd.png';

export default function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [logoutError, setLogoutError] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();

  const toggleNavbar = () => {
    setShowDropdown(!showDropdown);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const navigateToDashboard = () => {
    navigate('/admin-dashboard');
    setShowSidebar(false);
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      imageUrl: logoutIcon,
      imageWidth: 50,
      imageHeight: 50,
      title: 'Do you want to logout?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonColor: '#24757e',
      cancelButtonColor: '#D3D3D3',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-popup',
      },
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch('http://localhost:5000/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        localStorage.clear();

        if (response.ok) {
          navigate('/login');
        } else {
          const data = await response.json();
          setLogoutError(data.message);
        }
      } catch (error) {
        console.error('Error during logout:', error);
        setLogoutError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="adm-nav-bar">
      <nav
        className="navbar navbar-expand-lg fixed-top"
        style={{ backgroundColor: '#24757e', color: '#ffffff' }}
      >
        <div className="container-fluid">
          <div className="d-flex align-items-center flex-wrap flex-lg-nowrap w-100">
            <div className="d-flex align-items-center flex-grow-1">
              <img
                src={logo}
                alt="Logo"
                style={{ width: '40px', height: '40px' }}
                className="me-2"
              />
              <span className="text-white fs-6 fs-md-4" style={{ lineHeight: '1.2' }}>
                <a href="/admin-dashboard" style={{ textDecoration: "none", color: "white" }}>
                  GAMAGE RECRUITERS
                </a>
              </span>
            </div>

            <ul
              className="navbar-nav d-flex flex-row justify-content-center justify-content-lg-end w-auto mt-2 mt-lg-0"
              style={{ display: showSidebar ? 'none' : 'flex' }}
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
                  <img src={arrow} alt="arrow" style={{ width: '15px' }} />
                </a>

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
                      <a className="dropdown-item d-flex align-items-center" href="/admin-profile">
                        <img src={user2} alt="Profile" style={{ width: '20px', marginRight: '14px' }} />
                        My Profile
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item d-flex align-items-center" href="/adminChange-password">
                        <img src={changepswd} alt="Change Password" style={{ width: '20px', marginRight: '14px' }} />
                        Change Password
                      </a>
                    </li>
                    <li>
                      <button
                        className="dropdown-item d-flex align-items-center text-danger"
                        onClick={handleLogout}
                        style={{
                          border: 'none',
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 20px',
                          background: 'none'
                        }}
                      >
                        <img src={logout2} alt="Logout" style={{ width: '20px', marginRight: '14px' }} />
                        Log out
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            </ul>

            <img
              src={menuIcon}
              alt="Menu"
              className="d-lg-none"
              onClick={toggleSidebar}
              style={{
                width: '30px',
                height: '30px',
                position: 'absolute',
                top: '10px',
                right: '20px',
                cursor: 'pointer',
              }}
            />
          </div>
        </div>
      </nav>

      {showSidebar && (
        <div
          className="sidebar bg-light position-fixed top-0 start-0 h-100 overflow-auto"
          style={{ 
            width: '250px', 
            zIndex: 1050,
            backgroundColor: '#b9c2c1' 
          }}
        >
          <div className="d-flex justify-content-between align-items-center p-3">
          <h2 
              className="mb-0" 
              style={{ 
                color: '#1c5d5f', 
                cursor: 'pointer',
                fontSize: '1.5rem'
              }}
              onClick={navigateToDashboard}
            >
              Dashboard
            </h2>
            <button
              className="btn-close"
              onClick={toggleSidebar}
              aria-label="Close"
            ></button>
          </div>

          <ul className="list-group mt-2">
            {[
              { href: '/admin-profile', icon: user2, text: 'My Profile' },
              { href: '/admin-attendance', icon: attendence, text: 'Attendance' },
              { href: '/admin-invoice', icon: invoice, text: 'Invoice' },
              { href: '/view-employees', icon: employee, text: 'Employers' },
              { href: '/admin-payment', icon: payment, text: 'Payment' },
              { href: '/admin-manage-task', icon: task, text: 'Task' },
              { href: '/admin-mailbox', icon: mail, text: 'Mail-Box' },
              { href: '/adminChange-password', icon: changepswd, text: 'Change Password' }
            ].map((item, index) => (
              <li key={index} className="sidebar-item">
                <a href={item.href} className="sidebar-link">
                  <img src={item.icon} alt={item.text} style={{ width: '25px', marginRight: '10px' }} />
                  <span>{item.text}</span>
                </a>
              </li>
            ))}
            <li className="sidebar-item">
              <button onClick={handleLogout} className="sidebar-link logout-btn">
                <img src={logout2} alt="Logout" style={{ width: '25px', marginRight: '15px' }} />
                <span>Log out</span>
              </button>
            </li>
          </ul>
        </div>
      )}

      <style>
        {`
          .rounded-popup {
            border-radius: 15px !important;
          }
          .swal2-popup {
            width: 300px !important;
          }
          .swal2-title {
            font-size: 18px !important;
          }
          .swal2-confirm, .swal2-cancel {
            padding: 8px 20px !important;
            font-size: 14px !important;
          }
          .swal2-cancel {
            color: #333 !important;
          }
          @media (max-width: 991px) {
            .sidebar {
              background-color: #b9c2c1 !important;
            }
            .sidebar-item {
              border: none !important;
              margin-top: 10px !important;
              padding: 0 !important;
              background-color: #b9c2c1 !important;
            }
            .sidebar-link {
              display: flex;
              align-items: center;
              text-decoration: none;
              color: #1c5d5f !important;
              padding: 8px 15px;
              background-color: #b9c2c1;
              width: 100%;
              border: none;
            }
            .logout-btn {
              background: none;
              border: none;
              width: 100%;
              text-align: left;
              padding: 8px 15px;
              color: #1c5d5f !important;
              margin-left:8px;
            }
          }
        `}
      </style>

      {logoutError && (
        <div
          className="alert alert-danger position-fixed top-0 start-50 translate-middle-x mt-5"
          role="alert"
        >
          {logoutError}
        </div>
      )}
    </div>
  );
}