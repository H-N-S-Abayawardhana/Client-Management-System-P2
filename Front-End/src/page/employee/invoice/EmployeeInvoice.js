import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "../../../css/employee/invoice/EmployeeInvoice.css";
import axios from "axios";
import Navbar from "../../../components/templetes/empNavBar";
import Sidebar from "../../../components/templetes/ESideBar";
import Footer from '../../../components/templetes/Footer';


function EmployeeInvoice() {
  const [searchTerm, setSearchTerm] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const navigate = useNavigate();

  // Toggle Sidebar
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

  // Fetch invoice details based on employee ID
  useEffect(() => {
    if (!employee?.EmployeeID) return;

    const fetchInvoiceDetails = async () => {
      try {
        const response = await fetch(
            `http://localhost:5000/api/employee/employee/invoice/${employee.EmployeeID}`
        );
        if (!response.ok) throw new Error("Failed to fetch payment details");
        const data = await response.json();

        if (Array.isArray(data?.data)) {
          setInvoices(data.data);
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

    fetchInvoiceDetails();
  }, [employee?.EmployeeID]);


  // Fetch invoices from the API
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

  // Handle View Invoice
  const handleView = (invoiceID) => {
    navigate(`/employee-invoice-detail/${invoiceID}`); // Navigate to the PaymentInformation page with invoiceID

  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  // Filter invoices by search term
  const filteredInvoices = invoices.filter((invoice) =>
    Object.values(invoice).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
      <div>
        <Navbar />
        <div className="yks-employee-invoice-page">
          <nav>
            <p className="yks-profile-breadcrumb">
              <span className="home">Home</span> / <span className="contact">Invoices</span>
            </p>
          </nav>
          <div className="yks-emp-invoice-container">

            <div className="yks-head">
              <h1>Invoices</h1>
            </div>

            {/* Search Bar */}
            <div className="search-container">
              <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-bar"
              />
              <i className="fas fa-search search-icon"></i>
            </div>

            {/* Show loading or error messages */}
            {loading && <p>Loading invoices...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Render the table when invoices data is loaded */}
            {!loading && !error && (
                <div className="yks-table-container">
                  <table className="yks-invoice-tbl">
                    <thead>
                    <tr>
                      <th>Invoice ID</th>
                      <th>Account ID</th>
                      <th>
                        <div className="header-split">
                          <span>Invoice</span>
                          <br />
                          <span>Date</span>
                        </div>
                      </th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredInvoices.map((invoice) => (
                        <tr key={invoice.invoiceID}>
                          <td>{invoice.invoiceID}</td>
                          <td>{invoice.AcountId}</td>
                          <td>{formatDate(invoice.invoice_date)}</td>
                          <td>{invoice.total_cost}</td>
                          <td>{invoice.status}</td>
                          <td>
                            <button
                                className="msa-view-btn"
                                onClick={() => handleView(invoice.invoiceID)}
                            >
                              View
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

export default EmployeeInvoice;
