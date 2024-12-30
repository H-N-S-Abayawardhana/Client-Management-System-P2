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

//Task - Admin Side
import AdminManageTask from './page/admin/adminManageTask';
import AdminAddTask from './page/admin/AdminAddTask';
import AdminReceivedTask from './page/admin/AdminReceivedTask';
//Service - Admin Side
import AdminAddService from './page/admin/AdminAddService.js';
import AdminProfile from './page/admin/adminProfile.js';
import EditAdminProfile from './page/admin/editAdminProfile.js';
import PaymentInformation from './page/admin/payemnt/paymentinformation';
import Payment from './page/admin/payemnt/payment';
import InvoiceTable from './page/admin/invoice/AllInvoices';
import Invoice from './page/admin/invoice/invoice';
import CreateInvoice from "./page/admin/invoice/addService";


//Employee
import EmployeeDashboard from './page/employee/employeeDashboard';
//Task - Employee Side
import EmployeeReceivedTask from './page/employee/EmployeeReceivedTask';
import EmployeeManageTask from './page/employee/EmployeeManageTask';
import EmployeeAddTaskProgress from './page/employee/EmployeeAddTaskProgress';


//to protect the routes
import ForgotPassword from './page/employee/forgotPassword';
import EmployeeProfile from './page/employee/employeeProfile';

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

        {/* Task - Routes */}
        <Route path="/admin-manage-task" element={<AdminProtectedRoute><AdminManageTask/></AdminProtectedRoute>}/>
        <Route path="/admin-add-task" element={<AdminProtectedRoute><AdminAddTask/></AdminProtectedRoute>}/>
        <Route path="/admin-recived-task" element={<AdminProtectedRoute><AdminReceivedTask/></AdminProtectedRoute>}/>
        {/* Service - Routes */}
        <Route path="/admin-add-service" element={<AdminProtectedRoute><AdminAddService/></AdminProtectedRoute>}/>
        <Route path="/admin-Dashboard" element={<AdminProtectedRoute><AdminDashboard/></AdminProtectedRoute>} />
        <Route path="/adminChange-password" element={<AdminProtectedRoute><AdminChangePassword /></AdminProtectedRoute>} />
        <Route path="/admin-profile" element={<AdminProtectedRoute><AdminProfile /></AdminProtectedRoute>} />
        <Route path="/edit-admin-profile" element={<AdminProtectedRoute><EditAdminProfile /></AdminProtectedRoute>} />
        <Route path="/payment" element={<Payment/>} />
        <Route path="/payment-information/:selectedPaymentId" element={<PaymentInformation />} />
        <Route path="/All-invoice" element={<InvoiceTable/>} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/Add-Service" element={<CreateInvoice/>} />


        {/* Employee-Side Routes */}
        <Route path="/employee-dashboard" element={<EmployeeProtectedRoute><EmployeeDashboard/></EmployeeProtectedRoute>}/>

        {/* Task - Routes */}
        <Route path="/employee-progress-task" element={<EmployeeProtectedRoute><EmployeeAddTaskProgress/></EmployeeProtectedRoute>}/>
        <Route path="/employee-recived-task" element={<EmployeeProtectedRoute><EmployeeReceivedTask/></EmployeeProtectedRoute>}/>
        <Route path="/employee-manage-task-prgress" element={<EmployeeProtectedRoute><EmployeeManageTask/></EmployeeProtectedRoute>}/>
        <Route path="/employee-dashboard" element={<EmployeeProtectedRoute><EmployeeDashboard/></EmployeeProtectedRoute>}/>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/employee-profile" element={<EmployeeProtectedRoute><EmployeeProfile /></EmployeeProtectedRoute>} />

      </Routes>
    </Router>
  );
}

export default App;
