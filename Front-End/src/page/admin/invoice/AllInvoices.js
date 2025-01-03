import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../../../css/admin/invoice/invoiceTable.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../../../components/templetes/adminNavBar";
import Sidebar from "../../../components/templetes/SideBar";

import Footer from '../../../components/templetes/Footer';

import Footer from "../../../components/templetes/Footer";


const InvoiceTable = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sidebarVisible, setSidebarVisible] = useState(false);

    const navigate = useNavigate();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB");
    };
    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
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
        <div>
            <Navbar />
            <div className="yks-invoice-container">
                <nav>
                    <p className="yks-profile-breadcrumb">
                        <span className="home">Home</span> / <span className="home">Invoice</span> / <span className="contact">All Invoices</span>
                    </p>
                </nav>
                <div className="yks-invoice-table-container">
                    <div className="yks-head">
                        <h1>All Invoice Details</h1>
                    </div>


                    {/* Show loading or error messages */}
                    {loading && <p>Loading invoices...</p>}
                    {error && <p style={{ color: "red" }}>{error}</p>}

                    {/* Render the table when payments data is loaded */}
                    {!loading && !error && (
                        <div className="yks-container-table">
                            <table className="yks-serve-tbl">
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
                    )}


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

export default InvoiceTable;
