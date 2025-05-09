import React, { useState, useEffect, useRef } from "react";
import '../../../css/admin/payment/payment_form.css';
import { useParams } from "react-router-dom";
import Navbar from '../../../components/templetes/adminNavBar';
import Footer from '../../../components/templetes/Footer';

import Sidebar from '../../../components/templetes/SideBar';
import { jsPDF } from "jspdf"; // Import jsPDF
import html2canvas from "html2canvas"; // Import html2canvas

const PaymentInformation = () => {
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [error, setError] = useState(null);
  const { selectedPaymentId } = useParams();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const invoiceCardRef = useRef(null);
  const API_URL = process.env.REACT_APP_API_URL ;

 const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getFullYear()}`;
};


  useEffect(() => {
    if (!selectedPaymentId) {
      setError("Payment ID is missing");
      return;
    }

    const fetchPaymentDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/api/admin/payment/${selectedPaymentId}`);
        if (!response.ok) throw new Error("Failed to fetch payment details");
        const data = await response.json();
        if (data?.data) {
          setPaymentDetails(data.data);
        } else {
          throw new Error("Payment details not found");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPaymentDetails();
  }, [selectedPaymentId]);

  useEffect(() => {
    if (paymentDetails?.invoiceID) {
      const fetchInvoiceDetails = async () => {
        try {
          const response = await fetch(`${API_URL}/api/admin/invoice/${paymentDetails.invoiceID}`);
          if (!response.ok) throw new Error("Failed to fetch invoice details");
          const data = await response.json();
          if (data?.data) {
            setInvoiceDetails(data.data);
          } else {
            throw new Error("Invoice details not found");
          }
        } catch (err) {
          setError(err.message);
        }
      };

      fetchInvoiceDetails();
    }
  }, [paymentDetails]);

  useEffect(() => {
    if (paymentDetails?.EmployeeID) {
      const fetchEmployeeDetails = async () => {
        try {
          const response = await fetch(`${API_URL}/api/admin/employee/${paymentDetails.EmployeeID}`);
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
  }, [paymentDetails]);

  const downloadPDF = async () => {
    try {
      const element = invoiceCardRef.current;
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
      pdf.save(`invoice_${paymentDetails.invoiceID}.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
    }
  };

  if (error) return <div>Error: {error}</div>;
  if (!paymentDetails || !invoiceDetails || !employeeDetails) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="msa-form-container">
        <p className="msa-profile-breadcrumb">
          <span className="home">Home</span> / <span className="home">Payment</span> / <span className='contact'>Payment Information</span>
        </p>

        <div className="msa-payment-form-container">
          <div className="head-name">
            <h1 className="payment-heading">Payment Information</h1>
          </div>

          <div className="invoice-card" ref={invoiceCardRef}>
            <h3>Invoice #{paymentDetails.invoiceID}</h3>
            <hr /> {/* New line after the Invoice Title */}
            <p>
              <strong>Invoice ID:</strong>
              <span>#{paymentDetails.invoiceID}</span>
            </p>
            <p>
              <strong>Employer Name:</strong>
              <span>{employeeDetails?.Name || "N/A"}</span>
            </p>
            <p>
              <strong>Payment Date:</strong>
              <span>{formatDate(paymentDetails.payment_date || "N/A")}</span>
            </p>
            <p>
              <strong>Invoice Date:</strong>
              <span>{formatDate(invoiceDetails?.invoice_date || "N/A")}</span>
            </p>
            <p>
              <strong>Description:</strong>
              <span>{invoiceDetails?.description || "N/A"}</span>
            </p>
            <p>
              <strong>Amount:</strong>
              <span>{paymentDetails.amount || "N/A"}</span>
            </p>

          </div>
          <button className="download-btn" onClick={downloadPDF}>Download</button>
        </div>
      </div>


      <div className={`flex-grow-1 d-flex ${sidebarVisible ? 'show-sidebar' : ''}`}>
        <Sidebar sidebarVisible={sidebarVisible} />
      </div>
      <div className="container3">
        <Footer />
      </div>
    </div>
  );
};
export default PaymentInformation;
