import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
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
        toast.info('Session Expired! Redirecting to sign in...', {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        await new Promise(resolve => setTimeout(resolve, 1000));

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
