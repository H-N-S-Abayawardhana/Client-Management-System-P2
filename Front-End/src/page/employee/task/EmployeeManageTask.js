import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import "../../../css/employee/task/(apwgr)EmployeeManageTask.css";

import Navbar from '../../../components/templetes/empNavBar';
import Footer from '../../../components/templetes/Footer';
import Sidebar from '../../../components/templetes/ESideBar';

import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Get the logged-in employee's ID (EmployeeID)
import useEmployeeProfile from '../../../Routes/useEmployeeProfile';

const EmployeeManageTask = () => {
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    const navigate = useNavigate();
    const [TaskProgress, setTasks] = useState([]);

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
            const response = await axios.get(`http://localhost:5000/employee/task/employee-sended-tasks-progress/${EmployeeID}`);
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    useEffect(() => {
        if (EmployeeID) {
            fetchTasks();
            //console.log('emp mange task EmployeeID = ', EmployeeID);
        }
    }, [EmployeeID]); // Trigger the effect when EmployeeID changes

    

    return (
        <div>
            <Navbar />
            <div className="apwgr-manage-tasks-container">
                <nav className="breadcrumb" aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a className="text-decoration-none" href="/employee-Dashboard">Home</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Task Progress</li>
                    </ol>
                </nav>

                <div className="apwgr-tasks-container">
                    <div className='apwgr-headManage'>
                        <h1 className="text-center">Tasks Progresses</h1>
                    </div>

                    <header className="apwgr-tasks-header">
                        <button className="apwgr-add-task-btn" onClick={() => navigate('/employee-progress-task')}>Send Progress</button>
                        <button className="apwgr-progress-btn" onClick={() => navigate('/employee-recived-task')}>Received Tasks</button>
                    </header>

                    <div className="apwgr-tasks-prog-table-container">
                        <table className="apwgr-tasks-prog-table">
                            <thead>
                                <tr>
                                    <th>Task ID</th>
                                    <th>Employee ID</th>
                                    <th>Task Name</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                            {TaskProgress.map((TaskProgress) => (
                                    <tr key={TaskProgress.TaskProgressID}>
                                        <td>{TaskProgress.TaskID}</td>
                                        <td>{TaskProgress.EmployeeID}</td>
                                        <td>{TaskProgress.TaskName}</td>
                                        <td>{TaskProgress.TaskDescription}</td>

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

export default EmployeeManageTask;
