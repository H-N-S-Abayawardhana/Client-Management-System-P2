import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import "../../css/admin/(apwgr)adminAddService.css";

import Navbar from '../../components/templetes/adminNavBar';

import Footer from '../../components/templetes/Footer';
import Sidebar from '../../components/templetes/SideBar';

import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const AdminAddService = () => {
    const [sidebarVisible, setSidebarVisible] = useState(false);

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    const [serviceData, setServiceData] = useState({
        ServiceName: '',
        Description: '',
        Cost: '',
    });

    const [services, setServices] = useState([]); // Use a single state for services
    const navigate = useNavigate();

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setServiceData({ ...serviceData, [name]: value });
    };

    // Add new service to the table
    const handleAddService = async (e) => {
        e.preventDefault();
        if (!serviceData.ServiceName || !serviceData.Description || !serviceData.Cost) {
            alert('Please fill in all fields.');
            return;
        }
        try {
            const response = await fetch('http://localhost:5000/admin/service/add-service', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(serviceData),
            });
            const result = await response.json();
            if (response.ok) {
                alert('Task added successfully!');
                // Reset fields after successful addition
                setServiceData({ ServiceName: '', Description: '', Cost: '' });
                fetchServices(); // Reload services after adding a new one
            } else {
                alert(result.message || 'Failed to add task.');
            }
        } catch (error) {
            console.error('Error adding task:', error);
            alert('Something went wrong.');
        }
    };

    // Fetch all services from the API
    const fetchServices = async () => {
        try {
            const response = await axios.get('http://localhost:5000/admin/service/services');
            setServices(response.data); // Update state with fetched data
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    // Delete a service
    const handleDeleteService = async (ServiceID) => {
        try {
            await axios.delete(`http://localhost:5000/admin/service/services/${ServiceID}`);
            setServices(services.filter(service => service.ServiceID !== ServiceID)); // Update the list after deletion
            alert('Task deleted successfully.');
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Failed to delete task.');
        }
    };

    // Reset the input fields
    const handleReset = () => {
        setServiceData({ ServiceName: '', Description: '', Cost: '' });
    };

    useEffect(() => {
        fetchServices(); // Fetch services when component mounts
    }, []);

    return (
        <div>
            <Navbar />

            <div className="apwgr-main-service-container">
                <nav className="breadcrumb" aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a className="text-decoration-none" href="#">Home</a></li>
                        <li className="breadcrumb-item"><a className="text-decoration-none" href="#">Invoice</a></li>
                        <li className="breadcrumb-item"><a className="text-decoration-none" href="#">Add Invoice</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Add Service</li>
                    </ol>
                </nav>

                <div className="apwgr-head-service">
                    <h1 className="text-center">Add Service</h1>
                </div>

                {/* Input Fields Row */}
                <div className="service-input-section">

                    <div className="input-row-continer">
                        <div className="input-group">
                            <label htmlFor="ServiceName">Service Name</label>
                            <input
                                id="ServiceName"
                                type="text"
                                name="ServiceName"
                                placeholder="Enter Service Name"
                                value={serviceData.ServiceName}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="Description">Description</label>
                            <input
                                id="Description"
                                type="text"
                                name="Description"
                                placeholder="Enter Description"
                                value={serviceData.Description}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="Cost">Cost</label>
                            <input
                                id="Cost"
                                type="number"
                                name="Cost"
                                placeholder="Enter Cost"
                                value={serviceData.Cost}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="button-row">
                        <button className="add-button" onClick={handleAddService}>Add</button>
                        <button className="reset-button" onClick={handleReset}>Reset</button>
                    </div>
                </div>

                <div className="apwgr-head-sub">
                    <h1 className="text-center">Services</h1>
                </div>

                {/* Services Table */}
                <div className="table-container">
                    <table className="services-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Service Name</th>
                                <th>Description</th>
                                <th>Cost</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.map((service) => (
                                <tr key={service.ServiceID}>
                                    <td>{service.ServiceID}</td>
                                    <td>{service.ServiceName}</td>
                                    <td>{service.Description}</td>
                                    <td>{service.Cost}</td>
                                    <td>
                                        <button
                                            className="delete-button"
                                            onClick={() => handleDeleteService(service.ServiceID)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="button-row">
                    <button className="btn back-button my-3" onClick={() => navigate('#invoice')}>
                        <span className="bi bi-arrow-left m-3">Back To Invoice</span>
                    </button>
                </div>
            </div>

            <button className="apwgr-sidebar-toggle" onClick={toggleSidebar}>☰</button>
            <div className={`flex-grow-1 d-flex ${sidebarVisible ? 'show-sidebar' : ''}`}>
                <Sidebar sidebarVisible={sidebarVisible} />
            </div>
            <div className="container3">
                <Footer />
            </div>
        </div>
    );
};

export default AdminAddService;
