import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {ToastContainer} from 'react-toastify';
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
   const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getFullYear()}`;
};


    return (
        <div className="d-flex flex-column msa-emp-payment-container">
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
                                <span className="home">Home</span> / <span className="contact">My Payment</span>
                            </p>
                        </nav>
                    </div>
                    <div className="card mt-2 msa-card-container-height border-0">
                        <div className="card-body">
                            <h1 className="msa-head text-center mt-1">My Payments</h1>
                            {/*MakePayment*/}
                            <button
                                className="msa-add-payment-button me-5"
                                onClick={() => navigate("/employee-pay")}
                            >
                                Make Payment
                            </button>
                            {loading && <p>Loading payments...</p>}
                            {error && <p style={{ color: "red" }}>{error}</p>}
                            <div className="msa-employee-payment-table-container mt-1">
                                <table className="table table-bordered msa-employee-payment-table">
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
