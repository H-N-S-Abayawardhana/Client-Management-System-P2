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
import EmployeeProtectedRoute from './Routes/EmployeeProtectedRoute.js';
import AdminProtectedRoute from './Routes/AdminProtectedRoute.js';

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Routes */}
        <Route path="/" element={< MainPage/>} />
        <Route path="/login" element={<SigninPage/>} />
        
        {/* Admin-Side Routes */}
        <Route path="/admin-Dashboard" element={<AdminProtectedRoute><AdminDashboard/></AdminProtectedRoute>} />
        <Route path="/adminChange-password" element={<AdminProtectedRoute><AdminChangePassword /></AdminProtectedRoute>} />

        {/* Task - Routes */}
        <Route path="/admin-manage-task" element={<AdminProtectedRoute><AdminManageTask/></AdminProtectedRoute>}/>
        <Route path="/admin-add-task" element={<AdminProtectedRoute><AdminAddTask/></AdminProtectedRoute>}/>
        <Route path="/admin-recived-task" element={<AdminProtectedRoute><AdminReceivedTask/></AdminProtectedRoute>}/>
        {/* Service - Routes */}
        <Route path="/admin-add-service" element={<AdminProtectedRoute><AdminAddService/></AdminProtectedRoute>}/>


        {/* Employee-Side Routes */}
        <Route path="/employee-dashboard" element={<EmployeeProtectedRoute><EmployeeDashboard/></EmployeeProtectedRoute>}/>

        {/* Task - Routes */}
        <Route path="/employee-progress-task" element={<EmployeeProtectedRoute><EmployeeAddTaskProgress/></EmployeeProtectedRoute>}/>
        <Route path="/employee-recived-task" element={<EmployeeProtectedRoute><EmployeeReceivedTask/></EmployeeProtectedRoute>}/>
        <Route path="/employee-manage-task-prgress" element={<EmployeeProtectedRoute><EmployeeManageTask/></EmployeeProtectedRoute>}/>

      </Routes>
    </Router>
  );
}

export default App;
