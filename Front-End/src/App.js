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
import AdminManageTask from './page/admin/task/adminManageTask';
import AdminAddTask from './page/admin/task/AdminAddTask';
import AdminReceivedTask from './page/admin/task/AdminReceivedTask';
//Service - Admin Side
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
//Task - Employee Side
import EmployeeReceivedTask from './page/employee/task/EmployeeReceivedTask';
import EmployeeManageTask from './page/employee/task/EmployeeManageTask';
import EmployeeAddTaskProgress from './page/employee/task/EmployeeAddTaskProgress';


//to protect the routes
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

        {/* Task - Routes */}
        <Route path="/admin-manage-task" element={<AdminProtectedRoute><AdminManageTask/></AdminProtectedRoute>}/>
        <Route path="/admin-add-task" element={<AdminProtectedRoute><AdminAddTask/></AdminProtectedRoute>}/>
        <Route path="/admin-recived-task" element={<AdminProtectedRoute><AdminReceivedTask/></AdminProtectedRoute>}/>
        {/* Service - Routes */}
        <Route path="/admin-Dashboard" element={<AdminProtectedRoute><AdminDashboard/></AdminProtectedRoute>} />
        <Route path="/adminChange-password" element={<AdminProtectedRoute><AdminChangePassword /></AdminProtectedRoute>} />
        <Route path="/admin-profile" element={<AdminProtectedRoute><AdminProfile /></AdminProtectedRoute>} />
        <Route path="/edit-admin-profile" element={<AdminProtectedRoute><EditAdminProfile /></AdminProtectedRoute>} />
        <Route path="/admin-payment" element={<AdminProtectedRoute><Payment/></AdminProtectedRoute>} />
        <Route path="/admin-payment-information/:selectedPaymentId" element={<AdminProtectedRoute><PaymentInformation /></AdminProtectedRoute>} />
        <Route path="/admin-All-invoice" element={<AdminProtectedRoute><InvoiceTable/></AdminProtectedRoute>} />
        <Route path="/admin-invoice" element={<AdminProtectedRoute><Invoice /></AdminProtectedRoute>} />
        <Route path="/admin-Add-Service" element={<AdminProtectedRoute><CreateInvoice/></AdminProtectedRoute>} />
        <Route path="/admin-attendance" element={<AdminAttendance/>} />
        <Route path="/admin-mailbox" element={<AdminMailBox />} />
        <Route path="/register-employee" element={<RegisterEmployee />} />
        <Route path="/update-employee/:id" element={<UpdateEmployee />} />
        <Route path="/view-employees" element={<ViewEmployee />} />

        {/* Employee-Side Routes */}
        <Route path="/employee-dashboard" element={<EmployeeProtectedRoute><EmployeeDashboard/></EmployeeProtectedRoute>}/>

        {/* Task - Routes */}
        <Route path="/employee-progress-task" element={<EmployeeProtectedRoute><EmployeeAddTaskProgress/></EmployeeProtectedRoute>}/>
        <Route path="/employee-recived-task" element={<EmployeeProtectedRoute><EmployeeReceivedTask/></EmployeeProtectedRoute>}/>
        <Route path="/employee-manage-task-prgress" element={<EmployeeProtectedRoute><EmployeeManageTask/></EmployeeProtectedRoute>}/>
        <Route path="/employee-dashboard" element={<EmployeeProtectedRoute><EmployeeDashboard/></EmployeeProtectedRoute>}/>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/employee-profile" element={<EmployeeProtectedRoute><EmployeeProfile /></EmployeeProtectedRoute>} />
        <Route path="/employee-payment" element={<EmployeeProtectedRoute><ViewPay/></EmployeeProtectedRoute>} />
        <Route path='/employee-pay' element={<EmployeeProtectedRoute><Paymentform/></EmployeeProtectedRoute>} />
        <Route path='/employee-noti' element={<EmployeeProtectedRoute><Notification/></EmployeeProtectedRoute>} />
        <Route path="/employee-invoice" element={<EmployeeProtectedRoute><EmployeeInvoice/></EmployeeProtectedRoute>} />
        <Route path="/employee-invoice-detail/:selectedInvoiceId" element={<EmployeeProtectedRoute><InvoiceForm /></EmployeeProtectedRoute>} />
        <Route path="/employee-attendance" element={<EmployeeAttenance />} />
        <Route path="/employee-mailbox" element={<EmployeeMailBox />} />

      </Routes>
    </Router>
  );
}

export default App;
