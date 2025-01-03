import React, { useState } from "react";
import { useSnapshot } from "valtio";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import Axios for API calls
import "../../../css/admin/invoice/invoice.css";
import { serviceState } from "../../../utils";
import {toast} from "react-toastify";
import Navbar from "../../../components/templetes/adminNavBar";
import Sidebar from "../../../components/templetes/SideBar";
import Footer from "../../../components/PagesFooter";

const Invoice = () => {
  const navigate = useNavigate();
  const state = useSnapshot(serviceState);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [formData, setFormData] = useState({
    invoiceID: "",
    EmployeeID: "",
    contact_name: "",
    AcountId: "",
    invoice_date: "",
    total_cost: state.totalCost,
    description: state.services.map((s) => s.description).join(", "), // Optional description aggregation
  });
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const saveInvoice = async () => {
    if (state.services.length === 0) {
      toast.error("No services added to the invoice.");
      return;
    }

    try {
      // Step 1: Create the invoice
      const invoiceResponse = await axios.post("http://localhost:5000/api/admin/invoice", formData);
      const createdInvoice = invoiceResponse.data.data;

      if (createdInvoice) {
        formData.invoiceID = createdInvoice.invoiceID; // Use actual invoice ID

        // Step 2: Save all services for this invoice
        const servicePromises = state.services.map((service) => {
          const serviceData = {
            invoiceID: formData.invoiceID,
            service_description: service.description,
            cost: service.cost,
          };
          return axios.post("http://localhost:5000/api/admin/service", serviceData);
        });

        // Step 3: Wait for all service saving to complete
        await Promise.all(servicePromises);
      }

      toast.success("Invoice and services saved successfully!");
      clearFields();
    } catch (error) {
      // Enhanced error logging
      console.error("Error creating invoice and saving services:", error);

      if (error.response) {
        console.error("Error Response:", error.response);
        toast.error(`Error: ${error.response.data.message || "Something went wrong"}`);
      } else {
        toast.error("Network error or server unreachable");
      }
    }

  };
  const clearFields = () => {
    setFormData({
      invoiceID: "",
      EmployeeID: "",
      contact_name: "",
      AcountId: "",
      invoice_date: "",
      total_cost: 0.0, // Reset total cost to 0.0
      description: "", // Clear description as well
    });
    serviceState.services = []; // Clear all services from the state
  };

  return (
      <div>
        <Navbar />
        <div className="yks-invoice-page">
          {/* Breadcrumb Navigation */}
          <nav>
            <p className="yks-profile-breadcrumb">
              <span className="home">Home</span> /
              <span className="home"> Invoice</span> /
              <span className="contact"> Add Invoices</span>
            </p>
          </nav>
          {/* Page Title */}
          <div className="yks-head">
            <h1 className="text-center">Add Invoice Details</h1>
          </div>

          {/* Invoice Form Section */}
          <div className="yks-invoice-box">
            <div className="yks-invoice-form">
              <div className="yks-form-group">
                <label htmlFor="invoiceID">Invoice ID</label>
                <input
                    type="text"
                    id="invoiceID"
                    name="invoiceID"
                    className="yks-form-control"
                    value={formData.invoiceID}
                    onChange={handleInputChange}
                />
              </div>

              <div className="yks-form-group">
                <label htmlFor="EmployeeID">Employee ID</label>
                <input
                    type="text"
                    id="EmployeeID"
                    name="EmployeeID"
                    className="yks-form-control"
                    value={formData.EmployeeID}
                    onChange={handleInputChange}
                />
              </div>

              <div className="yks-form-group">
                <label htmlFor="AcountId">Account ID</label>
                <input
                    type="text"
                    id="AcountId"
                    name="AcountId"
                    className="yks-form-control"
                    value={formData.AcountId}
                    onChange={handleInputChange}
                />
              </div>

              <div className="yks-form-group">
                <label htmlFor="invoice_date">Invoice Date</label>
                <input
                    type="date"
                    id="invoice_date"
                    name="invoice_date"
                    className="yks-form-control"
                    value={formData.invoice_date}
                    onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          {/* Service Details Section */}
          <div className='service-detail-section'>
            <h5>Service Details</h5>
            <button
                className="yks-view-btn"
                onClick={() => navigate("/admin-Add-Service")}
            >
              Add Service
            </button>
            {state.services.length === 0 && <p>No services added yet!</p>}
          </div>

          {/* Total Cost Section */}
          <div className="mt-3 total-cost-section">
            <h5>
              Total Cost: <span>{`LKR ${state.totalCost?.toFixed(2)}`}</span>
            </h5>
          </div>

          {/* Action Buttons */}
          <div className="yks-button-group mt-4">
            <button className="yks-save-btn" onClick={saveInvoice}>
              Save Invoice
            </button>
            <button
                className="yks-all-btn"
                onClick={() => navigate("/admin-All-invoice")}
            >
              All Invoices
            </button>
          </div>

        </div>
        <button className="sidebar-toggle" onClick={toggleSidebar}>☰</button>
        <div className={`flex-grow-1 d-flex ${sidebarVisible ? 'show-sidebar' : ''}`}>
          <Sidebar sidebarVisible={sidebarVisible} />
        </div>
        <div className="container3">
          <Footer />
        </div>
      </div>
  );
};

export default Invoice;
