import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import '../../../css/employee/task/(apwgr)EmployeeReceivedTask.css';


import Navbar from '../../../components/templetes/empNavBar';
import Footer from '../../../components/templetes/Footer';
import Sidebar from '../../../components/templetes/ESideBar';

import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Get the logged-in employee's ID (EmployeeID)
import useEmployeeProfile from '../../../Routes/useEmployeeProfile';


const EmployeeReceivedTask = () => {
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const API_URL = process.env.REACT_APP_API_URL ;
    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);

    // Get the logged-in user EmployeeID
    const EmployeeID = useEmployeeProfile();
    console.log('empl ID task prog - ', EmployeeID);

    // Fetch tasks from the API
    const fetchTasks = async () => {
        if (!EmployeeID) {
            console.error('EmployeeID is missing or not available yet');
            return;
        }

        try {
            const response = await axios.get(`${API_URL}/employee/task/tasks/${EmployeeID}`); 
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    useEffect(() => {
        if (EmployeeID) {
            fetchTasks();
            
        }
    }, [EmployeeID]);


    // Function to format the deadline
    const formatDate = (datetime) => {
        if (!datetime) return '';
        return new Date(datetime).toISOString().split('T')[0];
    };

    return (
        <div>
            <Navbar />
            <div className="apwgr-recived-tasks-container">
                <nav className="breadcrumb" aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a className="text-decoration-none" href="/employee-dashboard">Home</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Employee Received Task</li>
                    </ol>
                </nav>

                <div className="apwgr-tasks-container">
                    <div className='apwgr-headManage'>
                        <h1 className="text-center">Received Tasks</h1>
                    </div>

                    <div className="apwgr-emp-back-button-area">
                        <div className="apwgr-but-inside">
                            <button className="btn apwgr-back-btn my-3" onClick={() => navigate('/employee-manage-task-prgress')}>
                                <span className="bi bi-arrow-left m-3"> Back </span>
                            </button>
                        </div>
                    </div>

                    <div className="apwgr-tasks-table-container">
                        <table className="apwgr-tasks-table">
                            <thead>
                                <tr>
                                    <th>Task ID</th>
                                    <th>Employee ID</th>
                                    <th>Task Name</th>
                                    <th>Budget Info</th>
                                    <th>Description</th>
                                    <th>Deadline</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map((task) => (
                                    <tr key={task.TaskID}>
                                        <td>{task.TaskID}</td>
                                        <td>{task.EmployeeID}</td>
                                        <td>{task.TaskName}</td>
                                        <td>{task.BudgetInfo}</td>
                                        <td>{task.Description}</td>
                                        <td>{formatDate(task.Deadline)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            
            <div className={`flex-grow-1 d-flex ${sidebarVisible ? 'show-sidebar' : ''}`}>
                <Sidebar sidebarVisible={sidebarVisible} />
            </div>
            <div className="container3">
                <Footer />
            </div>
        </div>
    );
};

export default EmployeeReceivedTask;
