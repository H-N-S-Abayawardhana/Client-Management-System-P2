import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

import "../../../css/admin/task/(apwgr)adminManageTask.css";

import Navbar from '../../../components/templetes/adminNavBar';
import Footer from '../../../components/templetes/Footer';
import Sidebar from '../../../components/templetes/SideBar';

import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminManageTask = () => {
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const API_URL = process.env.REACT_APP_API_URL ;
    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);

    // Fetch tasks from the API
    const fetchTasks = async () => {
        try {
            const response = await axios.get(`${API_URL}/admin/task/tasks`);
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    // Delete a task with confirmation
    const deleteTask = async (taskId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to delete this task? This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${API_URL}/admin/task/tasks/${taskId}`);
                    setTasks(tasks.filter(task => task.TaskID !== taskId));
                    Swal.fire('Deleted!', 'The task has been deleted.', 'success');
                } catch (error) {
                    console.error('Error deleting task:', error);
                    Swal.fire('Error!', 'Failed to delete the task.', 'error');
                }
            }
        });
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <div>
            <Navbar />
            <div className="apwgr-manage-tasks-container">
                <nav className="breadcrumb" aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a className="text-decoration-none" href="/admin-Dashboard">Home</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Manage Task</li>
                    </ol>
                </nav>

                <div className="apwgr-tasks-container">
                    <div className='apwgr-headManage'>
                        <h1 className="text-center">Tasks</h1>
                    </div>

                    <header className="apwgr-tasks-header">
                        <button className="apwgr-add-task-btn" onClick={() => navigate('/admin-add-task')}>Add Task</button>
                        <button className="apwgr-progress-btn" onClick={() => navigate('/admin-recived-task')}>Received Progress</button>
                    </header>

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
                                    <th>Action</th>
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
                                        <td>{new Date(task.Deadline).toISOString().split('T')[0]}</td>
                                        <td>
                                            <button
                                                className="apwgr-delete-btn"
                                                onClick={() => deleteTask(task.TaskID)}
                                            >
                                                Delete
                                            </button>
                                        </td>
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

export default AdminManageTask;
