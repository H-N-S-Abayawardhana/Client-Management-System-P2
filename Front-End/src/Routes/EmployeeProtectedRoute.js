import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EmployeeProtectedRoute = ({ children }) => {
  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        localStorage.clear();
        window.location.href = '/login';
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime || decodedToken.userType !== 'Employee') {
          handleLogout();
        }
      } catch (error) {
        console.error('Token validation error:', error);
        handleLogout();
      }
    };

    const handleLogout = async () => {
      const token = localStorage.getItem('token');
      const API_URL = process.env.REACT_APP_API_URL ;

      try {
        toast.info('Session Expired or Unauthorized! Redirecting to sign in...', {
          position: "top-center",
          autoClose: 2000,
        });

        await new Promise(resolve => setTimeout(resolve, 1000));

        await fetch(`${API_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        localStorage.clear();
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      }
    };

    checkTokenExpiration();
    const intervalId = setInterval(checkTokenExpiration, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" />;
  }

  const decodedToken = jwtDecode(token);
  if (decodedToken.userType !== 'Employee') {
    return <Navigate to="/unauthorized" />;
  }

  return (
    <>
      <ToastContainer autoClose={2000} hideProgressBar pauseOnHover theme="light" />
      {children}
    </>
  );
};

export default EmployeeProtectedRoute;
