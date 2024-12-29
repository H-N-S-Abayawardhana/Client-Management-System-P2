import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
//Main
import MainPage from './page/mainPage';
import SigninPage from './page/signinPage';

//Admin
import AdminDashboard from './page/admin/adminDashboardPage';
import AdminChangePassword from './page/admin/adminChangePassword.js';

//Task - Admin Side
import AdminManageTask from './page/admin/adminManageTask';
import AdminAddTask from './page/admin/AdminAddTask';
import AdminReceivedTask from './page/admin/AdminReceivedTask';
//Service - Admin Side
import AdminAddService from './page/admin/AdminAddService.js';

//Employee 
import EmployeeDashboard from './page/employee/employeeDashboard';
//Task - Employee Side
import EmployeeReceivedTask from './page/employee/EmployeeReceivedTask';
import EmployeeManageTask from './page/employee/EmployeeManageTask';
import EmployeeAddTaskProgress from './page/employee/EmployeeAddTaskProgress';


//to protect the routes
import ProtectedRoute from './Routes/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Routes */}
        <Route path="/" element={< MainPage/>} />
        <Route path="/login" element={<SigninPage/>} />
        
        {/* Admin-Side Routes */}
        <Route path="/admin-Dashboard" element={<ProtectedRoute><AdminDashboard/></ProtectedRoute>} />
        <Route path="/adminChange-password" element={<ProtectedRoute><AdminChangePassword /></ProtectedRoute>} />

        {/* Task - Routes */}
        <Route path="/admin-manage-task" element={<ProtectedRoute><AdminManageTask/></ProtectedRoute>}/>
        <Route path="/admin-add-task" element={<ProtectedRoute><AdminAddTask/></ProtectedRoute>}/>
        <Route path="/admin-recived-task" element={<ProtectedRoute><AdminReceivedTask/></ProtectedRoute>}/>
        {/* Service - Routes */}
        <Route path="/admin-add-service" element={<ProtectedRoute><AdminAddService/></ProtectedRoute>}/>


        {/* Employee-Side Routes */}
        <Route path="/employee-dashboard" element={<EmployeeDashboard/>}/>

        {/* Task - Routes */}
        <Route path="/employee-progress-task" element={<ProtectedRoute><EmployeeAddTaskProgress/></ProtectedRoute>}/>
        <Route path="/employee-recived-task" element={<ProtectedRoute><EmployeeReceivedTask/></ProtectedRoute>}/>
        <Route path="/employee-manage-task-prgress" element={<ProtectedRoute><EmployeeManageTask/></ProtectedRoute>}/>

      </Routes>
    </Router>
  );
}

export default App;
