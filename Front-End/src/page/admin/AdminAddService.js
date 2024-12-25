import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import "../../css/admin/(apwgr)adminAddService.css";

import Navbar from '../../components/templetes/Navbar';
import Footer from '../../components/templetes/Footer';
import Sidebar from '../../components/templetes/SideBar';

import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

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
    const [services, setServices] = useState([]);
    const [idCounter, setIdCounter] = useState(1);

    const navigate = useNavigate();

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setServiceData({ ...serviceData, [name]: value });
    };

    // Add new service to the table
    const handleAddService = () => {
        if (serviceData.ServiceName && serviceData.Description && serviceData.Cost) {
            const newService = {
                id: idCounter,
                ...serviceData,
            };
            setServices([...services, newService]);
            setIdCounter(idCounter + 1);
            setServiceData({ ServiceName: '', Description: '', Cost: '' });
        } else {
            alert('Please fill in all fields.');
        }
    };

    // Reset the input fields
    const handleReset = () => {
        setServiceData({ ServiceName: '', Description: '', Cost: '' });
    };

    // Delete a service from the table
    const handleDeleteService = (id) => {
        const updatedServices = services.filter((service) => service.id !== id);
        setServices(updatedServices);
    };

    return (
        <div>
            <Navbar />

            <div className="apwgr-main-service-container">
                <nav className="breadcrumb" aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a className="text-decoration-none" href="/admin-Dashboard">Home</a></li>
                        <li className="breadcrumb-item"><a className="text-decoration-none" href="/admin-manage-service">Manage Services</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Add Service</li>
                    </ol>
                </nav>

                <div className="apwgr-head">
                    <h1 className="text-center">Add Service</h1>
                </div>



                {/* Input Fields Row */}
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
                                <tr key={service.id}>
                                    <td>{service.id}</td>
                                    <td>{service.ServiceName}</td>
                                    <td>{service.Description}</td>
                                    <td>{service.Cost}</td>
                                    <td>
                                        <button
                                            className="delete-button"
                                            onClick={() => handleDeleteService(service.id)}
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
