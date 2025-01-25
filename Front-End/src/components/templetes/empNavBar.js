import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import arrow from '../../assets/arrow.png';
import logo from '../../assets/logo.png';
import user from '../../assets/user.png';
import logoutuser from '../../assets/logout.png';
import signout from '../../assets/signout.png';
import menuIcon from '../../assets/menu.png';
import attendence from '../../assets/attendence.png';
import invoice from '../../assets/invoice.png';
import payment from '../../assets/payment.png';
import task from '../../assets/task.png';
import mail from '../../assets/mail.png';
import myprofile from '../../assets/myprofile.png';
import user1 from '../../assets/user1.png';


export default function EmpNavbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [logoutError, setLogoutError] = useState(null);
  const [employeeName, setEmployeeName] = useState("");
   const [error, setError] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL ;

  const toggleNavbar = () => {
    setShowDropdown(!showDropdown);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      imageUrl: logoutuser,
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

        const response = await fetch(`${API_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
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

  const navigateToDashboard = () => {
    navigate('/employee-dashboard');
    setShowSidebar(false);
  };


  useEffect(() => {
    const fetchEmployeeName = async () => {
        try {
            const token = localStorage.getItem("token");
            const email = localStorage.getItem("email");
            const userType = localStorage.getItem("type");

            if (!token || !email || !userType) {
                navigate("/login");
                throw new Error("Missing authentication data");
            }

            if (userType !== "Employee") {
                navigate("/login");
                throw new Error("Unauthorized access");
            }

            // Fetch the Name of employee to dropdown
            const response = await fetch(`${API_URL}/api/employee/employee/name/${email}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch employee name");
            }

            const data = await response.json();
            setEmployeeName(data.name); // Assuming you're storing the name in state
        } catch (error) {
            console.error("Error fetching employee name:", error);
            setError("Error fetching employee name");
        }
    };

    fetchEmployeeName();
}, [navigate]);


  return (
    <div className="emp-nav-bar">
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
                <button
                  className="nav-link d-flex align-items-center text-white bg-transparent border-0"
                  onClick={toggleNavbar}
                >
                  <img
                    src={user}
                    alt="user"
                    style={{ width: '37px', paddingRight: '9px', marginRight: '5px' }}
                  />
                  <img src={arrow} alt="arrow" style={{ width: '15px' }} />
                </button>

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
                      <a className="dropdown-item d-flex align-items-center" href="/employee-profile">
                        <img src={myprofile} alt="Profile" style={{ width: '20px', marginRight: '14px' }} />
                        {employeeName}
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item d-flex align-items-center" href="/employee-profile">
                        <img src={user1} alt="Profile" style={{ width: '20px', marginRight: '14px' }} />
                        My Profile
                      </a>
                    </li>
                    <li>
                      <button
                        className="dropdown-item d-flex align-items-center"
                        onClick={handleLogout}
                        style={{ border: 'none', width: '100%', textAlign: 'left', padding: '8px 20px' }}
                      >
                        <img src={signout} alt="Logout" style={{ width: '20px', marginRight: '14px' }} />
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
          className="sidebar position-fixed top-0 start-0 h-100"
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
              { href: '/employee-profile', icon: myprofile, text: 'My Profile' },
              { href: '/employee-attendance', icon: attendence, text: 'Attendance' },
              { href: '/employee-invoice', icon: invoice, text: 'Invoice' },
              { href: '/employee-payment', icon: payment, text: 'Payment' },
              { href: '/employee-manage-task-prgress', icon: task, text: 'Task' },
              { href: '/employee-mailbox', icon: mail, text: 'Mail-Box' }
            ].map((item, index) => (
              <li key={index} className="sidebar-item">
                <a href={item.href} className="sidebar-link">
                  <img src={item.icon} alt={item.text} style={{ width: '20px', marginRight: '14px' }} />
                  <span>{item.text}</span>
                </a>
              </li>
            ))}
            <li className="sidebar-item">
              <button onClick={handleLogout} className="sidebar-link logout-btn">
                <img src={signout} alt="Logout" style={{ width: '20px', marginRight: '14px' }} />
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
              margin: 0 !important;
              padding: 0 !important;
              background-color: #b9c2c1 !important;
              margin-top: 20px !important;
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
              margin-left:10px;
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