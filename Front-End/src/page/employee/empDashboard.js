import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/templetes/empNavBar';
import Footer from '../../components/templetes/Footer';
import Sidebar from '../../components/templetes/ESideBar';
import attendImage from '../../assets/attend-image.png';
import InfoInvoice from '../../assets/pending-invoice.png';
import InfoPay from '../../assets/total-pay.png';
import '../../css/employee/empdashboard.css'

function EmpDashboard() {
  const navigate = useNavigate();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [attendance, setAttendCount] = useState(null);
  const [payment, setPaymentCount] = useState([]);
  const [invoice, setInvoiceCount] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;

  const checkSession = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
  };

  const makeAuthenticatedRequest = async (url) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('token');
        navigate('/login');
        return null;
      }

      return response;
    } catch (error) {
      console.error('Request error:', error);
      return null;
    }
  };

  const getAttendCount = async () => {
    try {
      const response = await makeAuthenticatedRequest(`${API_URL}/api/employee/employee/attendCount`);
      if (response) {
        const responseData = await response.json();
        const count = responseData.toString().padStart(2, '0');
        setAttendCount(count);
      }
    } catch (error) {
      console.error('Attendance count error:', error);
    }
  };

  const getPaymentCount = async () => {
    try {
      const response = await makeAuthenticatedRequest(`${API_URL}/api/employee/employee/paymentCount`);
      if (response) {
        const responseData = await response.json();
        const count = responseData.paymentCount.toString().padStart(2, '0');
        setPaymentCount(count);
      }
    } catch (error) {
      console.error('Payment count error:', error);
    }
  };

  const getInvoiceCount = async () => {
    try {
      const response = await makeAuthenticatedRequest(`${API_URL}/api/employee/employee/invoiceCount`);
      if (response) {
        const responseData = await response.json();
        const count = responseData.invoiceCount.toString().padStart(2, '0');
        setInvoiceCount(count);
      }
    } catch (error) {
      console.error('Invoice count error:', error);
    }
  };

  const fetchEmployeeTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("email");
      const userType = localStorage.getItem("type");
  
      if (!token || !email || !userType) {
        navigate("/login");
        setError("Missing authentication data");
        return;
      }
  
      if (userType !== "Employee") {
        navigate("/login");
        setError("Unauthorized: Only employees can access this page");
        return;
      }
  
      // Simplify the API endpoint and use makeAuthenticatedRequest
      const response = await fetch(
        `${API_URL}/api/employee/api/employee/tasks/${email}`,
        {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json' // Explicitly request JSON response
          },
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // Check content type of response
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Received non-JSON response from server");
      }
  
      const data = await response.json();
      
      // Validate the response data
      if (!Array.isArray(data)) {
        console.error("Received non-array data:", data);
        setTasks([]);
        setError("Invalid data format received");
        return;
      }
  
      setTasks(data);
      setError(""); // Clear any previous errors
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError(error.message);
      setTasks([]); // Reset tasks on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        await Promise.all([
          getAttendCount(),
          getPaymentCount(),
          getInvoiceCount(),
          fetchEmployeeTasks()
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
    const sessionCheckInterval = setInterval(checkSession, 30000);
    return () => clearInterval(sessionCheckInterval);
  }, []);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const formatDateToDMY = (date) => {
    try {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid Date';
    }
  };

  return (
    <div className="ae-emp-dashboard-container">
      <Navbar />
      <div className="ae-emp-main-content">
        <Sidebar />
        <div className="ae-emp-dashboard-right">
          <div className="ae-emp-breadcrumb">
            Home / Dashboard
          </div>
          
          <div className="ae-emp-content-wrapper">
            <h1 className="ae-emp-dashboard-title">Dashboard</h1>

            {/* Info Cards Section */}
            <div className="ae-emp-info-cards">
              <div className="ae-emp-info-card">
                <div className="ae-emp-card-left">
                  <span className="ae-emp-att-text">Today<br />Attendance</span>
                  <img className="ae-emp-att-img" src={attendImage} alt="Attendance" />
                </div>
                <div className="ae-emp-card-right">
                  <span>{attendance || '00'}</span>
                </div>
              </div>

              <div className="ae-emp-info-card">
                <div className="ae-emp-card-left">
                  <span className="ae-emp-inv-text">Pending<br />Invoices</span>
                  <img className="ae-emp-inv-img" src={InfoInvoice} alt="Pending Invoices" />
                </div>
                <div className="ae-emp-card-right">
                  <span>{invoice || '00'}</span>
                </div>
              </div>

              <div className="ae-emp-info-card">
                <div className="ae-emp-card-left">
                  <span className="ae-emp-pay-text">Total<br />Payments</span>
                  <img className="ae-emp-pay-img" src={InfoPay} alt="Total Payments" />
                </div>
                <div className="ae-emp-card-right">
                  <span>{payment || '00'}</span>
                </div>
              </div>
            </div>

            {/* Mobile reorder wrapper */}
            <div className="ae-emp-mobile-reorder">
              {/* Overview Section */}
              <div className="ae-emp-right-content">
                <h2 className="ae-emp-overview-title">Overview</h2>
                <div className="ae-emp-overview-section">
                  <h3 className="ae-emp-overview-title-mobile">Overview</h3>
                  <h3 className="ae-emp-overview-sub-titles">Our Mission</h3>
                  <p className='ae-emp-overview-para'>Our mission is to showcase emerging market talent globally, to provide a genuinely local solution to organizational needs.</p>
                  
                  <h3 className="ae-emp-overview-sub-titles">Our Vision</h3>
                  <p className='ae-emp-overview-para'>We aspire to be the premier choice for all human resource and business solution. By extending our services across borders, We tap into a broad spectrum of talent from emerging countries and industries, providing diversity in the workplace and ensuring companies find the leadership talent they need.</p>
                  
                  <h3 className="ae-emp-overview-sub-titles">Our Services</h3>
                  <ul className='ae-emp-overview-section-ulist'>
                    <li className="ae-emp-overview-section-li">Headhunting</li>
                    <li className="ae-emp-overview-section-li">Professional Resume Writing</li>
                    <li className="ae-emp-overview-section-li">Interview Preparation</li>
                    <li className="ae-emp-overview-section-li">HR Consultancy</li>
                  </ul>
                </div>
              </div>

              {/* Tasks Section */}
              <div className="ae-emp-tasks-section">
                <h2 className="ae-emp-mytask-title">My Tasks</h2>
                <div className="ae-emp-tasks-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Task Name</th>
                        <th>Deadline</th>
                        <th>Budget</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="4" className="text-center">Loading tasks...</td>
                        </tr>
                      ) : error ? (
                        <tr>
                          <td colSpan="4" className="text-center text-red-500">Error: {error}</td>
                        </tr>
                      ) : tasks.length > 0 ? (
                        tasks.map((Task, index) => (
                          <tr key={index}>
                            <td>{Task.TaskName}</td>
                            <td>{formatDateToDMY(new Date(Task.Deadline))}</td>
                            <td>{Task.BudgetInfo}</td>
                            <td>{Task.Description}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center">No tasks found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="ae-emp-container3">
        <Footer />
      </div>
    </div>
  );
}

const withAuth = (WrappedComponent) => {
  return function WithAuthComponent(props) {
    const navigate = useNavigate();

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
      }
    }, [navigate]);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth(EmpDashboard);