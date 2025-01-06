import React, { useEffect, useState } from "react";
import '../../../css/admin/payment/paymentTable.css';
import Navbar from "../../../components/templetes/adminNavBar";
import Footer from '../../../components/templetes/Footer';
import Sidebar from "../../../components/templetes/SideBar";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // useNavigate import
import {toast ,ToastContainer} from "react-toastify";

import 'bootstrap/dist/css/bootstrap.min.css';

const PaymentsTable = () => {
    const [payments, setPayments] = useState([]); // Ensure it's an array
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate(); // useNavigate hook

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };
    // Fetch payments from the API
    useEffect(() => {
        axios
            .get("http://localhost:5000/api/admin/payment")
            .then((response) => {
                if (Array.isArray(response.data.data)) {
                    setPayments(response.data.data);
                } else {
                    setError("Invalid response format. Expected an array.");
                }
                setLoading(false);
            })
            .catch((err) => {
                setError("Failed to fetch payments.");
                setLoading(false);
                toast.error("Error fetching payments");
            });
    }, []);
    // Handle Delete Payment
    const handleDelete = (paymentID) => {
        if (window.confirm("Are you sure you want to delete this payment?")) {
            axios
                .delete(`http://localhost:5000/api/admin/payment/${paymentID}`)
                .then(() => {
                    setPayments(
                        payments.filter((payment) => payment.paymentID !== paymentID)
                    );
                })

                .catch((error) => {
                    toast.error("Error deleting payment");
                });
        }
        toast.success('Payment deleted successfully.');
    };
    // Handle View Button
    const handleView = (invoiceID) => {
        navigate(`/admin-payment-information/${invoiceID}`); // Navigate to the PaymentInformation page with invoiceID

    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB");
    };

    return (
        <div className="d-flex flex-column msa-admin-payment-container">
            <ToastContainer position="top-right" autoClose={3000} />
            <Navbar />
            <div className="d-flex flex-grow-1" style={{ flexWrap: "nowrap" }}>
                {/* Sidebar */}
                <div
                    className={`msa-sidebar-container ${sidebarVisible ? "show-sidebar" : ""}`}
                    style={{ flexShrink: 0 }}
                >
                    <Sidebar sidebarVisible={sidebarVisible} />
                </div>
                <div className="d-flex flex-column flex-grow-1">
                    <div className="msa-content-container flex-grow-1 p-4">
                        <nav>
                            <p className="msa-profile-breadcrumb">
                                <span className="home">Home</span> / <span className="home">Invoice</span> / <span className="contact">All Invoices</span>
                            </p>
                        </nav>
                    </div>
                    <div className="card mt-2 msa-card-container-height border-0">
                        <div className="card-body">
                            <h1 className="msa-head text-center mt-1">Payments</h1>
                            <div className="msa-admin-payment-table-container mt-1">
                                {loading && <p>Loading invoices...</p>}
                                {error && <p style={{ color: "red" }}>{error}</p>}
                                <table className='table table-bordered msa-admin-payment-table'>
                                    <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Invoice ID</th>
                                        <th>Employee ID</th>
                                        <th>Amount</th>
                                        <th>Payment date</th>
                                        <th>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {payments.map((payment, index) => (
                                        <tr key={payment.paymentID}>
                                            <td>{payment.paymentID}</td>
                                            <td>{payment.invoiceID}</td>
                                            <td>{payment.EmployeeID}</td>
                                            <td>{payment.amount}</td>
                                            <td>{formatDate(payment.payment_date)}</td>
                                            <td>
                                                <button
                                                    className="msa-view-btn"
                                                    onClick={() => handleView(payment.paymentID)} // Call handleView on "View" button click
                                                >
                                                    View
                                                </button>
                                                <button
                                                    className="msa-delete-btn"
                                                    onClick={() => handleDelete(payment.paymentID)} // Delete payment on "Delete" button click
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
export default PaymentsTable;
