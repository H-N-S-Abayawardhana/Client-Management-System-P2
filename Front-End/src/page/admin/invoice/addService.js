import React, { useState } from "react";
import { useSnapshot } from "valtio";
import { useNavigate } from "react-router-dom";
import { serviceState } from "../../../utils";
import Navbar from "../../../components/templetes/adminNavBar";
import Footer from "../../../components/PagesFooter";
import Sidebar from "../../../components/templetes/SideBar";
import '../../../css/admin/invoice/addservice.css';

const CreateInvoice = () => {
    const state = useSnapshot(serviceState);
    const navigate = useNavigate();
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [newService, setNewService] = useState({
        description: "",
        cost: "",
    });
    const [nextId, setNextId] = useState(1); // Start ID tracking from 1

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewService((prev) => ({ ...prev, [name]: value }));
    };
    const handleAddService = () => {
        const id = nextId; // Use the tracked ID
        serviceState.addService({ id, ...newService });
        setNewService({ description: "", cost: "" }); // Reset form
        setNextId(id + 1); // Increment the ID for the next service
    };
    const handleRemoveService = (id) => {
        serviceState.removeService(id);
        // Optional: Recalculate IDs (if services need renumbering after deletion)
        setNextId(state.services.length > 0 ? Math.max(...state.services.map(s => s.id)) + 1 : 1);
    };

    return (
        <div>
            <Navbar />
            <div className="yks-container">
                <nav>
                    <p className="yks-profile-breadcrumb">
                        <span className="home">Home</span> /
                        <span className="home"> Invoice</span> /
                        <span className="contact"> Add Invoices</span> /
                        <span className="contact"> Add Services </span>
                    </p>
                </nav>

                <div className='yks-head'>
                    <h1 className="text-center">Add Invoice Details</h1>
                </div>

                {/* Form Container */}
                <div className="yks-form-container">
                    <form>
                        <div className="row g-3">
                            <div className="col-md-4">
                                <label htmlFor="description" className="form-label">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    className="form-control yks-input"
                                    id="description"
                                    name="description"
                                    value={newService.description}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="cost" className="form-label">
                                    Cost
                                </label>
                                <input
                                    type="text"
                                    className="form-control yks-input"
                                    id="cost"
                                    name="cost"
                                    value={newService.cost}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </form>
                </div>

                {/* Buttons for Add and Reset */}
                <div className="yks-btn-groupup">
                    <button
                        type="button"
                        className="yks-view-btn"
                        onClick={handleAddService}
                    >
                        Add
                    </button>
                    <button
                        type="reset"
                        className="yks-view-btn"
                        onClick={() => setNewService({ description: "", cost: "" })}
                    >
                        Reset
                    </button>
                </div>

                {/* Services Table */}
                <div className="yks-service-table">
                    <table className="yks-serve-tbl">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th className="text-center">Description</th>
                            <th className="text-center">Cost</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {state.services.map((service) => (
                            <tr key={service.id}>
                                <td>{service.id}</td>
                                <td className="text-center">{service.description}</td>
                                <td className="text-center">Rs.{service.cost}</td>
                                <td>
                                    <button
                                        className="yks-delete-btn"
                                        onClick={() => handleRemoveService(service.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Navigation Button */}
                <div className="yks-btn-groupup">
                    <button
                        className="yks-back-btn"
                        onClick={() => navigate("/admin-invoice")}
                    >
                        Back to Invoice
                    </button>
                </div>
            </div>
            <button className="sidebar-toggle" onClick={toggleSidebar}>☰</button>
            <div className={`flex-grow-1 d-flex ${sidebarVisible ? 'show-sidebar' : ''}`}>
                <Sidebar sidebarVisible={sidebarVisible} />
            </div>
            <div className="container3">
                <Footer />
            </div>
        </div>
    );
};

export default CreateInvoice;
