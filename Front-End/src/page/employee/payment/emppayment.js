import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/templetes/empNavBar";
import Footer from "../../../components/templetes/Footer";
import Sidebar from "../../../components/templetes/ESideBar";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../css/employee/payment/empPaymentTable.css";

const PaymentsTable = () => {
    const [payments, setPayments] = useState([]);
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [employee, setEmployee] = useState(null);

    const navigate = useNavigate();

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    // Fetch employee details
    useEffect(() => {
        const email = localStorage.getItem("email");
        if (email) {
            const fetchEmployeeDetails = async () => {
                try {
                    const response = await fetch(`http://localhost:5000/api/employee/employee/${email}`);
                    if (!response.ok) throw new Error("Failed to fetch employee details");
                    const data = await response.json();
                    if (data?.data) {
                        setEmployee(data.data);
                    } else {
                        throw new Error("Employee details not found");
                    }
                } catch (err) {
                    console.error("Error fetching employee details:", err);
                    setError(err.message);
                }
            };

            fetchEmployeeDetails();
        }
    }, []);

    // Fetch payment details based on employee ID
    useEffect(() => {
        if (!employee?.EmployeeID) return;

        const fetchPaymentDetails = async () => {
            try {
                const response = await fetch(
                    `http://localhost:5000/api/employee/employee/payment/${employee.EmployeeID}`
                );
                if (!response.ok) throw new Error("Failed to fetch payment details");
                const data = await response.json();

                if (Array.isArray(data?.data)) {
                    setPayments(data.data);
                } else {
                    throw new Error("Invalid payment data format");
                }
            } catch (err) {
                console.error("Error fetching payments:", err);
                setError(err.message);
            } finally {
                setLoading(false); // Stop loading spinner
            }
        };

        fetchPaymentDetails();
    }, [employee?.EmployeeID]);

    const handleView = () => {
        navigate(`/employee-pay`);
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
                    <div className="head">
                        <h1 className="text-center">My Payments</h1>
                    </div>

                    <header className="msa-emppayment-header">
                        <button className="msa-emppay-btn" onClick={() => navigate("/employee-pay")}>
                            Make Payment
                        </button>
                    </header>

                    {loading && <p>Loading payments...</p>}
                    {error && <p style={{ color: "red" }}>{error}</p>}

                    {!loading && !error && payments.length > 0 && (
                        <div className="msa-table-wrapper">
                            <table className="msa-emppayment-table">
                                <thead>
                                <tr>
                                    <th>Payment ID</th>
                                    <th>Invoice ID</th>
                                    <th>Amount</th>
                                    <th>Payment Date</th>
                                </tr>
                                </thead>
                                <tbody>
                                {payments.map((payment) => (
                                    <tr key={payment.paymentID}>
                                        <td>{payment.paymentID}</td>
                                        <td>{payment.invoiceID}</td>
                                        <td>{payment.amount}</td>
                                        <td>{formatDate(payment.payment_date)}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {!loading && !error && payments.length === 0 && <p>No payment records found.</p>}
                </div>
            </div>

            
            <div className={`flex-grow-1 d-flex ${sidebarVisible ? "show-sidebar" : ""}`}>
                <Sidebar sidebarVisible={sidebarVisible} />
            </div>
            <div className="msa-container3">
                <Footer />
            </div>
        </div>
    );
};

export default PaymentsTable;
