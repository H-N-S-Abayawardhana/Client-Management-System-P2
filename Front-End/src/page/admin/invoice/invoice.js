import React, { useState } from "react";
import { useSnapshot } from "valtio";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Import Axios for API calls
import Container from "../../../components/container/Container";
import "../../../css/admin/invoice/invoice.css";
import { serviceState } from "../../../utils";
import {toast} from "react-toastify";

const Invoice = () => {
  const navigate = useNavigate();
  const state = useSnapshot(serviceState);

  const [formData, setFormData] = useState({
    invoiceID: "",
    EmployeeID: "",
    contact_name: "",
    AcountId: "",
    invoice_date: "",
    total_cost: state.totalCost,
    description: state.services.map((s) => s.description).join(", "), // Optional description aggregation
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const saveInvoice = async () => {
    try {
      // Create the invoice first
      const invoiceResponse = await axios.post("http://localhost:5000/api/admin/invoice", formData);
      const createdInvoice = invoiceResponse.data.data;
      if (createdInvoice) {
        // Now, save all services for this invoice
        const services = state.services;
        for (let service of services) {
          const serviceData = {
            serviceID: service.id,
            invoiceID: formData.invoiceID,
            service_description: service.description,
            cost: service.cost,
          };
          await axios.post("http://localhost:5000/api/admin/service", serviceData);
        }
      }
    } catch (error) {
      console.error("Error creating invoice and saving services:", error);
      toast.error("Something went wrong..");
    }
    toast.success("Saved invoiced Successfully");
  };
  return (
      <Container
          child={
            <div className="yks-invoice-page">
              {/* Breadcrumb Navigation */}
              <nav>
                <p className="msa-profile-breadcrumb">
                  <span className="home">Home</span> /
                  <span className="home"> Invoice</span> /
                  <span className="contact"> Add Invoices</span>
                </p>
              </nav>

              {/* Page Title */}
              <div className="yks-head">
                <h1>Add Invoice Details</h1>
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
                    <label htmlFor="AccountID">Account ID</label>
                    <input
                        type="text"
                        id="AccountID"
                        name="AccountID"
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
              <div>
                <h5>Service Details</h5>
                <button
                    className="yks-view-btn"
                    onClick={() => navigate("/admin-add-service")}
                >
                  Add Service
                </button>
                {state.services.length === 0 && <p>No services added yet!</p>}
              </div>

              {/* Total Cost Section */}
              <div className="mt-3">
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
                    className="yks-view-btn"
                    onClick={() => navigate("/All-invoice")}
                >
                  All Invoices
                </button>
              </div>
            </div>
          }
      />
  );
};

export default Invoice;
