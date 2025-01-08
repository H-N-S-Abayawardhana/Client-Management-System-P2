import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "../../../css/employee/invoice/EmployeeInvoice.css";
import axios from "axios";
import Navbar from "../../../components/templetes/empNavBar";
import Sidebar from "../../../components/templetes/ESideBar";
import Footer from '../../../components/templetes/Footer';
import searchIcon from "../../../assets/image.png";

// Debounce utility function
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

function EmployeeInvoice() {
  const [searchTerm, setSearchTerm] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const navigate = useNavigate();

  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms debounce

  // Fetch employee details
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      const email = localStorage.getItem("email");
      if (!email) return;

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
  }, []);

  // Fetch all invoices on component mount
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin/invoice");
        if (Array.isArray(response.data.data)) {
          setInvoices(response.data.data);
        } else {
          throw new Error("Invalid response format. Expected an array.");
        }
      } catch (err) {
        console.error("Error fetching invoices:", err);
        setError("Failed to fetch invoices.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  // Fetch filtered invoices when debounced search term changes
  useEffect(() => {
    if (!debouncedSearchTerm) {
      setInvoices([]); // Clear invoices if no search term
      return;
    }

    const searchInvoices = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/employee/invoices/${debouncedSearchTerm}`);
        const contentType = response.headers.get("content-type");

        if (!response.ok) {
          const errorData = contentType && contentType.includes("application/json")
              ? await response.json()
              : { message: "Error occurred: Invalid response format" };
          console.error("API Error:", errorData);
          toast.error(errorData.message || "Error occurred");
          setInvoices([]); // Clear data on error
          return;
        }

        const responseData = contentType && contentType.includes("application/json")
            ? await response.json()
            : [];
        if (Array.isArray(responseData)) {
          setInvoices(responseData);
        } else {
          console.error("Invalid data format:", responseData);
          setInvoices([]); // Clear data if response is invalid
        }
      } catch (error) {
        console.error("Error during search:", error);
        toast.error("Search failed due to an error.");
        setInvoices([]); // Clear data on network error
      } finally {
        setLoading(false);
      }
    };

    searchInvoices();
  }, [debouncedSearchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Update the search term
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getFullYear()}`;
  };


  return (
      <div className="d-flex flex-column yks-emp-invoice-container">
        <ToastContainer position="top-right" autoClose={3000} />
        <Navbar />
        <div className="d-flex flex-grow-1" style={{ flexWrap: "nowrap" }}>
          {/* Sidebar */}
          <div
              className={`yks-sidebar-container ${sidebarVisible ? "show-sidebar" : ""}`}
              style={{ flexShrink: 0 }}
          >
            <Sidebar sidebarVisible={sidebarVisible} />
          </div>

          {/* Content and Footer Container */}
          <div className="d-flex flex-column flex-grow-1">
            <div className="yks-content-container flex-grow-1 p-4">
              <nav>
                <p className="yks-profile-breadcrumb">
                  <span className="home">Home</span> / <span className="contact">Invoices</span>
                </p>
              </nav>
            </div>
            <div className="card mt-2 yks-card-container-height border-0">
              <div className="card-body">
                <h1 className="yks-head text-center mt-1">Invoices</h1>
                {/* Search Bar */}
                <div className="yks-employee-search-bar-container position-relative d-flex ms-2">
                  <input
                      type="text"
                      className="form-control yks-employee-search-bar"
                      placeholder="Search"
                      value={searchTerm}
                      onChange={handleSearchChange}
                  />
                  <button className="btn yks-employee-search-bar-icon">
                    <img alt="Search Icon" src={searchIcon} className="yks-search-bar-icon" />
                  </button>
                </div>
                <div className="yks-employee-invoice-table-container mt-1">
                  {loading && <p>Loading invoices...</p>}
                  {error && <p style={{ color: "red" }}>{error}</p>}
                  <table className="table table-bordered yks-employee-invoice-table">
                    <thead>
                    <tr>
                      <th>Invoice ID</th>
                      <th>Account ID</th>
                      <th>Invoice Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {invoices.map((invoice) => (
                        <tr key={invoice.invoiceID}>
                          <td>{invoice.invoiceID}</td>
                          <td>{invoice.AcountId}</td>
                          <td>{formatDate(invoice.invoice_date)}</td>
                          <td>{invoice.total_cost}</td>
                          <td>{invoice.status}</td>
                          <td>
                            <button
                                className="yks-view-btn"
                                onClick={() => navigate(`/employee-invoice-detail/${invoice.invoiceID}`)}
                            >
                              View
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
}

export default EmployeeInvoice;
