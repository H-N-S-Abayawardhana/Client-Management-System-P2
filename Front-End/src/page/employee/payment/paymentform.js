import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/templetes/empNavBar";
import Sidebar from "../../../components/templetes/ESideBar";
import Footer from '../../../components/templetes/Footer';
import axios from "axios";
import "../../../css/employee/payment/payment_method.css";
import cvvImage from '../../../assets/cvv.png';

import {toast} from "react-toastify";

function PaymentForm() {
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [invoices, setInvoices] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [error, setError] = useState(null);
    const API_URL = process.env.REACT_APP_API_URL ;
    const [formData, setFormData] = useState({
        cardType: "",
        cardNumber: "",
        expirationMonth: "",
        expirationYear: "",
        cvv: "",
    });
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(`${API_URL}/api/employee/employee/invoice`)
            .then((response) => {
                if (Array.isArray(response.data.data)) {
                    setInvoices(response.data.data);
                }
            })
            .catch((err) => {
                console.error("Error fetching invoices:", err);
            });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleInvoiceChange = (e) => {
        const invoice = invoices.find(
            (inv) => inv.invoiceID === parseInt(e.target.value)
        );
        setSelectedInvoice(invoice || null);
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        // Validate input fields
        if (!selectedInvoice || !formData.cardNumber || !formData.cvv) {
            alert("Please fill in all required fields.");
            return;
        }

        const paymentData = {
            invoiceID: selectedInvoice.invoiceID,
            EmployeeID: selectedInvoice.EmployeeID,
            card_holder_name: "Test User", // Replace with real user data
            card_number: formData.cardNumber,
            expiry_date: `${formData.expirationYear}-${formData.expirationMonth}-01`,
            cvc: formData.cvv,
            amount: selectedInvoice.total_cost,
            payment_status: "Completed",
            payment_date: new Date().toISOString(),
        };
        try {
            // Correct API request using axios.post
            const response = await axios.post(
                `${API_URL}/api/employee/payment`,
                paymentData
            );
            // Handle successful response
            if (response.status === 200 && response.data?.data) {
                const response1 = await axios.put(
                    `${API_URL}/api/employee/update/invoice/${selectedInvoice.invoiceID}`
                );
            } else {
                toast.error("Network error or server unreachable (in)");
            }
            toast.success("Payment saved successfully!");
        } catch (err) {
            console.error("Payment error:", err);
            setError(err.message);
            toast.error(`Payment failed: ${err.message}`);
        }
    };
    return (
        <div>
            <Navbar />
            <div className="msa-form-wrapper">
                <nav className="msa-breadcrumb" aria-label="breadcrumb">
                    <p className="msa-profile-breadcrumb">
                        <span className="home">Home</span> / <span className="home">My Payment</span> / <span className='contact'>Payment</span>
                    </p>
                </nav>
                <div className="msa-payment-form-container">
                    <div className="msa-head-name">
                        <h1>Payments</h1>
                    </div>

                    <div className="msa-paymentform-container">
                        <div className="msa-paymentform-header">
                            <h2>Let’s make payment</h2>
                            <select
                                className="msa-invoice-dropdown"
                                onChange={handleInvoiceChange}
                                defaultValue=""
                            >
                                <option value="" disabled>
                                    Select Invoice ID
                                </option>
                                {invoices.map((invoice) => (
                                    <option key={invoice.invoiceID} value={invoice.invoiceID}>
                                        {invoice.invoiceID}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <form className="msa-payment-form" onSubmit={handlePayment}>
                            <div className="msa-form-section msa-card-type">
                                <label>Card Type*</label>
                                <div className="msa-card-options">
                                    <label>
                                        <input
                                            type="radio"
                                            name="cardType"
                                            value="Visa"
                                            onChange={handleInputChange}
                                        />
                                        <img
                                            src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
                                            alt="Visa"
                                            className="msa-card-logo"
                                        />
                                        Visa
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="cardType"
                                            value="MasterCard"
                                            onChange={handleInputChange}
                                        />
                                        <img
                                            src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                                            alt="MasterCard"
                                            className="msa-card-logo"
                                        />
                                        Master Card
                                    </label>
                                </div>
                            </div>

                            <div className="msa-form-section">
                                <label>Card Number*</label>
                                <input
                                    type="text"
                                    name="cardNumber"
                                    placeholder="XXXX XXXX XXXX XXXX"
                                    className="msa-input-field"
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="msa-form-section msa-expiration">
                                <div>
                                    <label>Expiration Month*</label>
                                    <input
                                        type="text"
                                        name="expirationMonth"
                                        placeholder="MM"
                                        className="msa-input-field msa-small"
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label>Expiration Year*</label>
                                    <input
                                        type="text"
                                        name="expirationYear"
                                        placeholder="YYYY"
                                        className="msa-input-field msa-small"
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="msa-form-section">
                                <label>CVV*</label>
                                <text className='msa-txt'>This card is three or four digit numbers printed on back or front of the card</text><br />
                                <input
                                    type="text"
                                    name="cvv"
                                    placeholder="XXX"
                                    className="msa-input-field msa-small"
                                    onChange={handleInputChange}
                                />
                                <img
                                    src={cvvImage}
                                    alt="cvv"
                                    className="msa-cvv-logo"
                                />
                            </div>

                            <div className="msa-form-section">
                                <label>You’re paying,</label><hr />
                                <div className="msa-amount-container">
                                    <span>Total Amount</span>
                                    <span className="msa-amount">${selectedInvoice?.total_cost || "0.00"}</span>
                                </div>
                                <hr />
                            </div>

                            <div className="msa-form-section msa-buttons">
                                <button
                                    type="button"
                                    className="msa-cancel-btn"
                                    onClick={() => navigate("/employee-payment")}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="msa-pay-btn">
                                    Pay
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

            </div>

            <div className={`flex-grow-1 d-flex ${sidebarVisible ? 'show-sidebar' : ''}`}>
                <Sidebar sidebarVisible={sidebarVisible} />
            </div>
            <div className="msa-container3">
                <Footer />
            </div>
        </div>
    );
}

export default PaymentForm;
