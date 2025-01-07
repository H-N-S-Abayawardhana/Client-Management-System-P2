import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/templetes/adminNavBar';
import Footer from '../../components/templetes/Footer';
import Sidebar from '../../components/templetes/SideBar';
import attendImage from '../../assets/attend-image.png';
import InfoInvoice from '../../assets/pending-invoice.png';
import InfoPay from '../../assets/total-pay.png';
import '../../css/admin/admindashboard.css'

function AdminDashboard() {
  const navigate = useNavigate();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [receivedTasks, setReceivedTasks] = useState([]); // State for received tasks
  const [attendance, setAttendCount] = useState([]);
  const [employee, setEmpCount] = useState([]);
  const [invoice, setInvoiceCount] = useState([]);
  const [data, setData] = useState([]);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const formatDateToDMY = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

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
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401 || response.status === 403) {
        // Token expired or invalid
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
      const response = await makeAuthenticatedRequest('http://localhost:5000/api/admin/admin/attendCount')
      if (response) {
        const responseData = await response.json();
        const count = responseData.toString().padStart(2, '0');
        setAttendCount(count);
      }
    } catch (error) {
      console.error('Attendance count error:', error);
    }
  };
      
  const getEmpCount = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/admin/empCount')
      const responseData = await response.json()
      if (!response.ok) {
        console.log("error")
      }
      else {
        console.log(responseData)
        const count = responseData.toString().padStart(2, '0');
        setEmpCount(count)
      }
    }
    catch (error) {
      console.log(error)
    }
  };

  const getInvoiceCount = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/admin/invoiceCount')
      const responseData = await response.json()
      if (!response.ok) {
        console.log("error")
      }
      else {
        console.log(responseData)
        const count = responseData.toString().padStart(2, '0');
        setInvoiceCount(count)
      }
    }
    catch (error) {
      console.log(error)
    }
  };

  const getData = async () => {
    try {
      const response = await fetch('http://localhost:5000/employee/task/admin-recived-tasks-progress')
      const responseData = await response.json()
      if (!response.ok) {
        console.log("error")
      }
      else {
        console.log(responseData)
        setData(responseData)
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getAttendCount()
    getEmpCount()
    getInvoiceCount()
    getData()
  }, []);
  return (
    <div className="ae-admin-dashboard-container">
      <Navbar />
      <div className="ae-admin-main-content">
        <Sidebar />
        <div className="ae-admin-dashboard-right">
          <div className="ae-admin-breadcrumb">
            Home / Dashboard
          </div>
          
          <div className="ae-admin-content-wrapper">
            <div className="ae-admin-left-content">
              {/*<h1 className="ae-admin-dashboard-title">Dashboard</h1>*     Use in mobile view*/}

              <div className="ae-admin-info-cards">
                <div className="ae-admin-info-card">
                  <div className="ae-admin-card-left">
                    <span>Today<br />Attendance</span>
                    <img src={attendImage} alt="Attendance" />
                  </div>
                  <div className="ae-admin-card-right">
                    <span>{attendance}</span>
                  </div>
                </div>

                <div className="ae-admin-info-card">
                  <div className="ae-admin-card-left">
                    <span>Total<br />Employers</span>
                    <img src={attendImage} alt="Pending Invoices" />
                  </div>
                  <div className="ae-admin-card-right">
                    <span>{employee}</span>
                  </div>
                </div>

                <div className="ae-admin-info-card">
                  <div className="ae-admin-card-left">
                    <span>Pending<br />Invoices</span>
                    <img src={InfoInvoice} alt="Total Payments" />
                  </div>
                  <div className="ae-admin-card-right">
                    <span>{invoice}</span>
                  </div>
                </div>
              </div>

              <div className="ae-admin-tasks-section">
                <h2 className = "ae-admin-mytask-title">Recieved Tasks</h2>
                <div className="ae-admin-tasks-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Task ID</th>
                        <th>Employee ID</th>
                        <th>Task Name</th>
                        <th>Task Description</th>
                      </tr>
                    </thead>
                    <tbody>
                    {data.length > 0 ? (
                        data.map((task, index) => (
                          <tr key={index}>
                            <td>{task.TaskID}</td>
                            <td>{task.EmployeeID}</td>
                            <td>{task.TaskName}</td>
                            <td>{task.TaskDescription}</td>
                            
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5">No tasks found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div className="ae-admin-right-content">
            <h2 className = "ae-admin-overview-title">Overview</h2>
              <div className="ae-admin-overview">                
                <div className="ae-admin-overview-section">
                  <h3 className="ae-admin-overview-sub-titles">Our Mission</h3>
                  <p className ="ae-admin-overview-para">Our mission is to showcase emerging market talent globally, to provide a genuinely local solution to organizational needs.</p>
                  
                  <h3 className="ae-admin-overview-sub-titles">Our Vision</h3>
                  <p className ="ae-admin-overview-para">We aspire to be the premier choice for all human resource and business solution. By extending our services across borders, We tap into a broad spectrum of talent from emerging countries and industries, providing diversity in the workplace and ensuring companies find the leadership talent they need.</p>
                  
                  <h3 className="ae-admin-overview-sub-titles">Our Services</h3>
                  <ul className="ae-admin-overview-ulist">
                    <li className="ae-admin-overview-list">Headhunting</li>
                    <li className="ae-admin-overview-list">Professional Resume Writing</li>
                    <li className="ae-admin-overview-list">Interview Preparation</li>
                    <li className="ae-admin-overview-list">HR Consultancy</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
          <div className="ae-admin-container3">
            <Footer />
          </div>
    </div>
  );
};
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

export default withAuth(AdminDashboard);