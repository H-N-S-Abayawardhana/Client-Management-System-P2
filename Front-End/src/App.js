import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
//Main
import MainPage from './page/mainPage';
import SigninPage from './page/signinPage';
import Services from './page/services';
import Aboutus from './page/aboutUs.js';
import ContactUs from './page/contactUs.js';

//Admin
import AdminDashboard from './page/admin/adminDashboardPage';
import AdminChangePassword from './page/admin/adminChangePassword.js';
import AdminProfile from './page/admin/adminProfile.js';
import EditAdminProfile from './page/admin/editAdminProfile.js';

//Employee 
import EmployeeDashboard from './page/employee/employeeDashboard';
import ForgotPassword from './page/employee/forgotPassword';
import EmployeeProfile from './page/employee/employeeProfile';



function App() {
  return (
    <Router>
      <Routes>
        {/* Main Routes */}

        <Route path="/" element={< MainPage/>} />
        <Route path="/login" element={<SigninPage/>} />
        <Route path="/services" element={<Services/>} />
        <Route path="/aboutus" element={<Aboutus/>} />
        <Route path="/contactus" element={<ContactUs/>} />
        

        {/* Admin-Side Routes */}
        <Route path="/admin-Dashboard" element={<AdminDashboard/>} />
        <Route path="/adminChange-password" element={<AdminChangePassword />} />
        <Route path="/admin-profile" element={<AdminProfile />} />
        <Route path="/edit-admin-profile" element={<EditAdminProfile />} />


        {/* Employee-Side Routes */}
        <Route path="/employee-dashboard" element={<EmployeeDashboard/>}/>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/employee-profile" element={<EmployeeProfile />} />

      </Routes>
    </Router>
  );
}

export default App;
