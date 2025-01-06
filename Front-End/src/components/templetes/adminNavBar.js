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
    <div>
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
                <a href="/" style={{ textDecoration: "none", color: "white" }}>
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

            {/* Menu Icon for Mobile */}
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

      {/* Sidebar */}
      {showSidebar && (
        <div
          className="sidebar bg-light position-fixed top-0 start-0 h-100 overflow-auto"
          style={{ width: '250px', zIndex: 1050 }}
        >
          <button
            className="btn-close mt-2 ms-3"
            onClick={toggleSidebar}
            aria-label="Close"
          ></button>
          <ul className="list-group mt-2">
            <li className="list-group-item py-2">
              <a href="/admin-profile" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                <img src={user2} alt="Profile" style={{ width: '25px', marginRight: '10px' }} />
                <span>My Profile</span>
              </a>
            </li>
            <li className="list-group-item py-2">
              <a href="/admin-dashboard" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                <img src={dashboard} alt="Dashboard" style={{ width: '20px', marginRight: '14px' }} />
                <span>Dashboard</span>
              </a>
            </li>
            <li className="list-group-item py-2">
              <a href="/admin-attendance" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                <img src={attendence} alt="Attendance" style={{ width: '20px', marginRight: '14px' }} />
                <span>Attendance</span>
              </a>
            </li>
            <li className="list-group-item py-2">
              <a href="/admin-invoice" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                <img src={invoice} alt="Invoice" style={{ width: '25px', marginRight: '10px' }} />
                <span>Invoice</span>
              </a>
            </li>
            <li className="list-group-item py-2">
              <a href="/view-employees" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                <img src={employee} alt="Employees" style={{ width: '25px', marginRight: '10px' }} />
                <span>Employers</span>
              </a>
            </li>
            <li className="list-group-item py-2">
              <a href="/admin-payment" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                <img src={payment} alt="Payment" style={{ width: '25px', marginRight: '10px' }} />
                <span>Payment</span>
              </a>
            </li>
            <li className="list-group-item py-2">
              <a href="/admin-manage-task" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                <img src={task} alt="Task" style={{ width: '25px', marginRight: '10px' }} />
                <span>Task</span>
              </a>
            </li>
            <li className="list-group-item py-2">
              <a href="/admin-mailbox" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                <img src={mail} alt="Mailbox" style={{ width: '25px', marginRight: '10px' }} />
                <span>Mail-Box</span>
              </a>
            </li>
            <li className="list-group-item py-2">
              <a href="/adminChange-password" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                <img src={changepswd} alt="Change Password" style={{ width: '25px', marginRight: '10px' }} />
                <span>Change Password</span>
              </a>
            </li>
            <li className="list-group-item py-2">
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: 'none',
                  background: 'none',
                  padding: 0,
                  color: '#dc3545',
                  width: '100%',
                  textAlign: 'left'
                }}
              >
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
          .list-group-item a, .list-group-item button {
            text-decoration: none;
            color: inherit;
          }
          .list-group-item {
            border-radius: 0 !important;
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