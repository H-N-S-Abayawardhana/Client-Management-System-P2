import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "../../../css/employee/invoice/invoiceForm.css";
import axios from "axios";
import Navbar from "../../../components/templetes/empNavBar";
import Sidebar from "../../../components/templetes/ESideBar";

import Footer from '../../../components/templetes/Footer';


import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

function InvoiceForm() {
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [invoiceDetails, setInvoiceDetails] = useState(null);
    const [employeeDetails, setEmployeeDetails] = useState(null);
    const [serviceDetails, setServiceDetails] = useState([]); // Initialize as an empty array
    const [error, setError] = useState(null);
    const { selectedInvoiceId } = useParams();
    const navigate = useNavigate();
    const invoiceDetailRef = useRef(null);

    // Toggle Sidebar
    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    useEffect(() => {
        if (!selectedInvoiceId) {
            setError("Invoice ID is missing");
            return;
        }

        const fetchInvoiceDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/employee/invoice/${selectedInvoiceId}`);
                if (!response.ok) throw new Error("Failed to fetch invoice details");
                const data = await response.json();
                if (data.data) {
                    setInvoiceDetails(data.data);
                } else {
                    throw new Error("Invoice details not found");
                }
            } catch (err) {
                setError(err.message);
            }
        };

        fetchInvoiceDetails();
    }, [selectedInvoiceId]);

    useEffect(() => {
        if (invoiceDetails?.EmployeeID) {
            const fetchEmployeeDetails = async () => {
                try {
                    const response = await fetch(`http://localhost:5000/api/employee/emp/${invoiceDetails.EmployeeID}`);
                    if (!response.ok) throw new Error("Failed to fetch employee details");
                    const data = await response.json();
                    if (data?.data) {
                        setEmployeeDetails(data.data);
                    } else {
                        throw new Error("Employee details not found");
                    }
                } catch (err) {
                    setError(err.message);
                }
            };

            fetchEmployeeDetails();
        }
    }, [invoiceDetails]);

    useEffect(() => {
        if (invoiceDetails?.invoiceID) {
            console.log(invoiceDetails.invoiceID);
            const fetchServiceDetails = async () => {
                try {
                    // const response = await fetch(`http://localhost:5000/api/admin/service/8`);
                    const response = await fetch(`http://localhost:5000/api/admin/service/${invoiceDetails.invoiceID}`);
                    console.log(response);
                    if (!response.ok) throw new Error("Failed to fetch service details");
                    const data = await response.json();
                    console.log(data);
                    console.log(data.data);
                    if (data?.data) {
                        setServiceDetails(data.data); // Ensure serviceDetails is an array
                    } else {
                        throw new Error("Service details not found");
                    }
                } catch (err) {
                    setError(err.message);
                }
            };

            fetchServiceDetails();
        }
    }, [invoiceDetails]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB");
    };

    const downloadPDF = async () => {
        try {
            const element = invoiceDetailRef.current;
            if (!element) {
                alert("Invoice card is not ready yet. Please try again.");
                return;
            }
            const canvas = await html2canvas(element);
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight);
            pdf.save(`invoice_${invoiceDetails.invoiceID}.pdf`);
        } catch (err) {
            console.error("Error generating PDF:", err);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="yks-invoice-page">
                <nav className="yks-breadcrumb" aria-label="breadcrumb">
                    <p className="yks-profile-breadcrumb">
                        <span className="home">Home</span> / <span className="home">Invoices</span> / <span className="contact">View Invoice</span>
                    </p>
                </nav>

                <div className="yks-invoice-container">
                    <div className="yks-head-invoice">
                        <h1>Invoice</h1>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}
                    {!invoiceDetails && !error && (
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    )}

                    {invoiceDetails && (
                        <div>
                            <header className="yks-empinvoice-header">
                                <button className="yks-empinvoice-btn" onClick={() => navigate('/employee-pay')}>
                                    Make Payment
                                </button>
                            </header>

                            <div className="card yks-card">
                                <div className="card-body" ref={invoiceDetailRef}>
                                    <div className="row">
                                        <div className="col-12">
                                            <h5>Invoice {invoiceDetails.invoiceID}</h5>
                                        </div>
                                    </div>

                                    {/* Client Details */}
                                    <div className="table-responsive">
                                        <table className="table table-bordered">
                                            <thead className="bg-light">
                                            <tr>
                                                <th colSpan="4">Client Details</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <td><strong>Company Name</strong></td>
                                                <td>Gamage Recruiters</td>
                                                <td><strong>Contact Name</strong></td>
                                                <td>{employeeDetails?.Name || "N/A"}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Contact No</strong></td>
                                                <td>{employeeDetails?.ContactNumber || "N/A"}</td>
                                                <td><strong>Email</strong></td>
                                                <td>
                                                    <a href={`mailto:${employeeDetails?.Email}`} className="text-primary">
                                                        {employeeDetails?.Email || "N/A"}
                                                    </a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><strong>Account ID</strong></td>
                                                <td>8704072</td>
                                                <td><strong>Invoice Date</strong></td>
                                                <td>{formatDate(invoiceDetails.invoice_date)}</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Service Details */}
                                    <div className="table-responsive">
                                        <table className="table table-bordered">
                                            <thead className="bg-light">
                                            <tr>
                                                <th colSpan="3">Service Details</th>
                                            </tr>
                                            <tr>
                                                <th>No</th>
                                                <th>Service</th>
                                                <th>Cost</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {Array.isArray(serviceDetails) && serviceDetails.length > 0 ? (
                                                serviceDetails.map((service, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{service.service_description}</td>
                                                        <td>${service.cost}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="3" className="text-center">No service details available</td>
                                                </tr>
                                            )}
                                            <tr>
                                                <td colSpan="2" className="text-end"><strong>Grand Total</strong></td>
                                                <td><strong>${invoiceDetails?.total_cost || "0.00"}</strong></td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                {/* Report Button */}
                                <div className="mt-4">
                                    <button className="report-btn" onClick={downloadPDF}>
                                        <i className="fas fa-download me-2"></i>Report
                                    </button>
                                </div>
                            </div>
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
}

export default InvoiceForm;
