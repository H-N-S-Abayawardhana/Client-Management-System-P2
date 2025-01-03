import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/templetes/empNavBar';
import Footer from '../../../components/templetes/Footer';
import Sidebar from '../../../components/templetes/ESideBar';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import '../../../css/employee/payment/empPaymentTable.css';

const PaymentsTable = () => {
    const [invoices, setInvoices] = useState([]);
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };
    const navigate = useNavigate();
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
                console.error("Error fetching invoices:", err);
                setError("Failed to fetch invoices.");
                setLoading(false);
            });
    }, []);

    // Handle View Button
    const handleView = () => {
        navigate(`/employee-pay`); // Navigate to the PaymentInformation page with invoiceID
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB");
    };
    return (
        <div>
            <Navbar />
            <div className="msa-emp-payment-container">
                <nav className="msa-breadcrumb" aria-label="breadcrumb">
                    <p className="msa-profile-breadcrumb">
                        <span className="home">Home</span> / <span className="contact">My Payment</span>
                    </p>
                </nav>
                <div className="msa-emppay-container">
                    <div className='head'>
                        <h1 className="text-center">My Payments</h1>
                    </div>

                    <header className="msa-emppayment-header">
                        <button className="msa-emppay-btn" onClick={() => navigate('/employee-pay')}>Make Payment</button>
                    </header>

                    {loading && <p>Loading payments...</p>}
                    {error && <p style={{ color: "red" }}>{error}</p>}

                    {!loading && !error && (
                        <div className='msa-table-wrapper'>
                            <table className="msa-emppayment-table">
                                <thead>
                                <tr>
                                    <th>Invoice ID</th>
                                    <th>Employee ID</th>
                                    <th>Account Number</th>
                                    <th>Description</th>
                                    <th>Invoice Date</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {invoices.map((invoice) => (
                                    <tr key={invoice.invoiceID}>
                                        <td>{invoice.invoiceID}</td>
                                        <td>{invoice.EmployeeID}</td>
                                        <td>{invoice.AcountId}</td>
                                        <td>{invoice.description}</td>
                                        <td>{formatDate(invoice.invoice_date)}</td>
                                        <td>
                                            <button className="msa-view-btn" onClick={() => handleView()}>View</button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <button className="msa-sidebar-toggle" onClick={toggleSidebar}>☰</button>
            <div className={`flex-grow-1 d-flex ${sidebarVisible ? 'show-sidebar' : ''}`}>
                <Sidebar sidebarVisible={sidebarVisible} />
            </div>
            <div className="msa-container3">
                <Footer />
            </div>
        </div>
    );
};

export default PaymentsTable;
