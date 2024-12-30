import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProtectedRoute = ({ children }) => {
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

        if (decodedToken.exp < currentTime) {
          // Token has expired
          handleLogout();
        }
      } catch (error) {
        console.error('Token validation error:', error);
        handleLogout();
      }
    };

    const handleLogout = async () => {
      const token = localStorage.getItem('token');
      
      try {
        // Show toast message
        toast.info('Session Expired! Redirecting to sign in...', {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        // Wait for toast to be visible
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Call logout API
        await fetch('http://localhost:5000/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        localStorage.clear();
        // Delay redirect slightly to ensure toast is visible
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      }
    };

    // Check token immediately
    checkTokenExpiration();

    // Set up interval to check token expiration
    const intervalId = setInterval(checkTokenExpiration, 5000); // Check every 5 seconds

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {children}
    </>
  );
};

export default ProtectedRoute;