import React, { useEffect, useState } from "react";
import '../../../css/admin/payment/paymentTable.css';
import Navbar from "../../../components/templetes/adminNavBar";
import Footer from "../../../components/PagesFooter";
import Sidebar from "../../../components/templetes/SideBar";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // useNavigate import
import {toast} from "react-toastify";

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
                console.error("Error fetching payments:", err);
                setError("Failed to fetch payments.");
                setLoading(false);
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
                    console.error("Error deleting payment:", error);
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
        <div>
            <Navbar />
            <div className="msa-payment-container">
                <nav>
                    <p className="msa-profile-breadcrumb">
                        <span className="home">Home</span> / <span className="home">Invoice</span> / <span className="contact">All Invoices</span>
                    </p>
                </nav>
                <div className="msa-payment-table-container">
                    <div className='head'>
                        <h1 className="text-center">Payments</h1>
                    </div>


                    {/* Show loading or error messages */}
                    {loading && <p>Loading payments...</p>}
                    {error && <p style={{ color: "red" }}>{error}</p>}

                    {/* Render the table when payments data is loaded */}
                    {!loading && !error && (
                        <div className="msa-container-table">
                            <table className='msa-pyment-tbl'>
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
                                                className="view-btn"
                                                onClick={() => handleView(payment.paymentID)} // Call handleView on "View" button click
                                            >
                                                View
                                            </button>
                                            <button
                                                className="delete-btn"
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
                    )}


                </div>
            </div>
            <button className="sidebar-toggle" onClick={toggleSidebar}>☰</button>
            <div className={`flex-grow-1 d-flex ${sidebarVisible ? 'show-sidebar' : ''}`}>
                <Sidebar sidebarVisible={sidebarVisible}/>
            </div>
            <div className="container3">
                <Footer />
            </div>

        </div>
    );
};

export default PaymentsTable;
