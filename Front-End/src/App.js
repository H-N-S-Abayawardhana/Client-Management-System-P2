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
import PaymentInformation from './page/admin/payemnt/paymentinformation';
import Payment from './page/admin/payemnt/payment';
import InvoiceTable from './page/admin/invoice/AllInvoices';
import Invoice from './page/admin/invoice/invoice';
import CreateInvoice from "./page/admin/invoice/addService";
import AdminAttendance from './page/admin/attendance/Adminattendence.js';
import AdminMailBox from './page/admin/mailbox/AdminMailBox.js';
import RegisterEmployee from './page/admin/employers/RegisterEmployee.js';
import UpdateEmployee from './page/admin/employers/UpdateEmployee.js';
import ViewEmployee from './page/admin/employers/ViewEmployees.js';

//Employee
import EmployeeDashboard from './page/employee/employeeDashboard';
import ForgotPassword from './page/employee/forgotPassword';
import EmployeeProfile from './page/employee/employeeProfile';
import ViewPay from './page/employee/payment/emppayment';
import Paymentform from './page/employee/payment/paymentform';
import Notification from './page/employee/payment/notification';
import EmployeeAttenance from './page/employee/attendance/EmployeeAttendance.js';
import EmployeeMailBox from './page/employee/mailbox/EmployeeMailBox.js';

//Protected Routes
import ProtectedRoute from './Routes/ProtectedRoute';
import EmployeeProtectedRoute from './Routes/EmployeeProtectedRoute.js';
import AdminProtectedRoute from './Routes/AdminProtectedRoute.js';





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
        <Route path="/admin-Dashboard" element={<AdminProtectedRoute><AdminDashboard/></AdminProtectedRoute>} />
        <Route path="/adminChange-password" element={<AdminProtectedRoute><AdminChangePassword /></AdminProtectedRoute>} />
        <Route path="/admin-profile" element={<AdminProtectedRoute><AdminProfile /></AdminProtectedRoute>} />
        <Route path="/edit-admin-profile" element={<AdminProtectedRoute><EditAdminProfile /></AdminProtectedRoute>} />
        <Route path="/payment" element={<Payment/>} />
        <Route path="/payment-information/:selectedPaymentId" element={<PaymentInformation />} />
        <Route path="/All-invoice" element={<InvoiceTable/>} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/Add-Service" element={<CreateInvoice/>} />
        <Route path="/admin-attendance" element={<AdminAttendance/>} />
        <Route path="/admin-mailbox" element={<AdminMailBox />} />
        <Route path="/register-employee" element={<RegisterEmployee />} />
        <Route path="/update-employee/:id" element={<UpdateEmployee />} />
        <Route path="/view-employees" element={<ViewEmployee />} />

        {/* Employee-Side Routes */}
        <Route path="/employee-dashboard" element={<EmployeeProtectedRoute><EmployeeDashboard/></EmployeeProtectedRoute>}/>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/employee-profile" element={<EmployeeProtectedRoute><EmployeeProfile /></EmployeeProtectedRoute>} />
        <Route path="/employee-payment" element={<ViewPay/>} />
        <Route path='/employee-pay' element={<Paymentform/>} />
        <Route path='/employee-noti' element={<Notification/>} />
        <Route path="/employee-attendance" element={<EmployeeAttenance />} />
        <Route path="/employee-mailbox" element={<EmployeeMailBox />} />

      </Routes>
    </Router>
  );
}

export default App;
