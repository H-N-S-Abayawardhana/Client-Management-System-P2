import React, { useEffect, useState } from "react";
import axios from "axios";
import {toast, ToastContainer} from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../../../css/admin/invoice/invoiceTable.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../../../components/templetes/adminNavBar";
import Sidebar from "../../../components/templetes/SideBar";
import Footer from '../../../components/templetes/Footer';

const InvoiceTable = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${date.getFullYear()}`;
    };
    // Fetch payments from the API
    useEffect(() => {
        axios
            .get("http://localhost:5000/api/admin/invoice")
            .then((response) => {
                if (Array.isArray(response.data.data)) {
                    setInvoices(response.data.data);
                } else {
                    setError("Invalid response format. Expected an array.");
                }
                setLoading(false);
            })
            .catch((err) => {
                setError("Failed to fetch invoices.");
                setLoading(false);
                toast.error("Error fetching invoices");
            });
    }, []);
    // Handle Delete Payment
    const handleDelete = (invoiceID) => {
        if (window.confirm("Are you sure you want to delete this invoice?")) {
            axios
                .delete(`http://localhost:5000/api/admin/invoice/${invoiceID}`)
                .then(() => {
                    setInvoices((prevInvoices) =>
                        prevInvoices.filter((invoice) => invoice.invoiceID !== invoiceID)
                    );
                    toast.success("Invoice deleted successfully.");
                })
                .catch((error) => {
                    toast.error("Failed to delete invoice.");
                });
        }
    };

    return (
        <div className="d-flex flex-column yks-admin-invoice-container">
            <ToastContainer position="top-right" autoClose={3000} />
            <Navbar />
            <div className="d-flex flex-grow-1" style={{ flexWrap: "nowrap" }}>
                {/* Sidebar */}
                <div
                    className={`yks-sidebar-container ${sidebarVisible ? "show-sidebar" : ""}`}
                    style={{ flexShrink: 0 }}
                >
                    <Sidebar sidebarVisible={sidebarVisible} />
                </div>
                <div className="d-flex flex-column flex-grow-1">
                    <div className="yks-content-container flex-grow-1 p-4">
                        <nav>
                            <p className="yks-profile-breadcrumb">
                                <span className="home">Home</span> / <span className="home">Invoice</span> / <span className="contact">All Invoices</span>
                            </p>
                        </nav>
                    </div>
                    <div className="card mt-2 yks-card-container-height border-0">
                        <div className="card-body">
                            <h1 className="yks-head text-center mt-1">All Invoice Details</h1>
                            <div className="yks-admin-invoice-table-container mt-1">
                                {loading && <p>Loading invoices...</p>}
                                {error && <p style={{ color: "red" }}>{error}</p>}
                                <table className="table table-bordered yks-admin-invoice-table">
                                    <thead>
                                    <tr>
                                        <th>Invoice ID</th>
                                        <th>Employee ID</th>
                                        <th>Account ID</th>
                                        <th>
                                            <div className="header-split">
                                                <span>Invoice</span>
                                                <br />
                                                <span>Date</span>
                                            </div>
                                        </th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {invoices.map((invoice) => (
                                        <tr key={invoice.invoiceID}>
                                            <td>{invoice.invoiceID}</td>
                                            <td>{invoice.EmployeeID}</td>
                                            <td>{invoice.AcountId}</td>
                                            <td>{formatDate(invoice.invoice_date)}</td>
                                            <td>{invoice.total_cost}</td>
                                            <td>{invoice.status}</td>
                                            <td>
                                                <button
                                                    className="yks-delete-btn"
                                                    onClick={() => handleDelete(invoice.invoiceID)}
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
                    {/* Footer */}
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default InvoiceTable;
