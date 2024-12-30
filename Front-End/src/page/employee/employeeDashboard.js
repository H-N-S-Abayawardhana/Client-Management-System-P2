import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/templetes/empNavBar';
import Footer from '../../components/PagesFooter';
import Sidebar from '../../components/templetes/SideBar';
import attendImage from '../../assets/attend-image.png';
import InfoInvoice from '../../assets/pending-invoice.png';
import InfoPay from '../../assets/total-pay.png';

import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '../../css/employee/empdash.css';

function EmployeeDashboard() {
  const navigate = useNavigate();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [attendance, setAttendCount] = useState(null);
  const [employee, setEmpCount] = useState([]);
  const [invoice, setInvoiceCount] = useState([]);
  const [data, setData] = useState([]);

  // Check token and session on component mount
  useEffect(() => {
    checkSession();
  }, []);

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
      const response = await makeAuthenticatedRequest('http://localhost:5000/api/employee/employee/attendCount');
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
      const response = await makeAuthenticatedRequest('http://localhost:5000/api/employee/employee/empCount');
      if (response) {
        const responseData = await response.json();
        const count = responseData.empCount.toString().padStart(2, '0');
        setEmpCount(count);
      }
    } catch (error) {
      console.error('Employee count error:', error);
    }
  };

  const getInvoiceCount = async () => {
    try {
      const response = await makeAuthenticatedRequest('http://localhost:5000/api/employee/employee/invoiceCount');
      if (response) {
        const responseData = await response.json();
        const count = responseData.invoiceCount.toString().padStart(2, '0');
        setInvoiceCount(count);
      }
    } catch (error) {
      console.error('Invoice count error:', error);
    }
  };

  const getData = async () => {
    try {
      const response = await makeAuthenticatedRequest('http://localhost:5000/api/employee/employee/task');
      if (response) {
        const responseData = await response.json();
        setData(responseData);
      }
    } catch (error) {
      console.error('Task data error:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        getAttendCount(),
        getEmpCount(),
        getInvoiceCount(),
        getData()
      ]);
    };

    fetchData();

    // Set up interval to check session every 30 seconds
    const sessionCheckInterval = setInterval(checkSession, 30000);

    return () => clearInterval(sessionCheckInterval);
  }, []);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const formatDateToDMY = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };
  return (
    <div className="ae-d-flex flex-column" style={{ minHeight: '100vh' }}>
      <Navbar />
      <button className="ae-sidebar-toggle" onClick={toggleSidebar}>☰</button>

      <div className={`flex-grow-1 d-flex ${sidebarVisible ? 'show-sidebar' : ''}`}>
        <Sidebar sidebarVisible={sidebarVisible} />
       

        <div className="ae-main-content">
          <div className="ae-grid-container">
            <div className="ae-video-section">

              <div className="ae-info-card green">
              <div className="ae-info-header-content">
              <img src={attendImage} alt="Attend" style={{ marginLeft: '60px', height:'35px', width:'35px' }}/>
                <div className="ae-info-header">Today <br />Attendance</div>
                </div>
                <div className="ae-info-value-box">
                <div className="ae-info-value gray">{attendance }</div>
                </div>
              </div>


              <div className="ae-info-card green">
              <div className="ae-info-header-content">
              <img src={InfoInvoice} alt="InfoInvoice" style={{ marginLeft: '60px', height:'30px', width:'30px' }}/>
                <div className="ae-info-header">Total <br/> Employees</div>
                </div>
                <div className="ae-info-value-box">
                  <div className="ae-info-value gray"> {employee }</div>
                </div>
              </div>



              <div className="ae-info-card green">
               <div className="ae-info-header-content">
              <img src={InfoPay} alt="InfoPay" style={{ marginLeft: '60px', height:'40px', width:'40px' }}/>
                <div className="ae-info-header">Pending <br />Invoices</div>
                </div>
                <div className="ae-info-value-box">
                  <div className="ae-info-value gray">{invoice }</div>
                </div>
              </div>
              
            </div>


            <div className="ae-sidebar-section">
              <div className="ae-overview-ae">Overview</div>
              <h3 className="ae-vision-title-ae">Our Mission</h3>
              <p className="ae-mission-vision-text-ae">
                Our mission is to showcase emerging market talent globally to provide a genuinely local solution to organizational needs
              </p>
              <h3 className="ae-vision-title-ae">Our Vision</h3>
              <p className="ae-mission-vision-text-ae">
                We aspire to be the premier choice for all human resource and business solutions. By extending our services across borders, we tap into a broad spectrum of talent from emerging countries and industries, providing diversity in the workplace and ensuring companies find the leadership talent they need.
              </p>
              <div className="ae-vision-title-ae">
                <h3 className="ae-vision-title-ae">Our Services</h3>
                <ul className="ae-mission-vision-text-ae">
                  <li>Headhunting</li>
                  <li>Professional Resume Writing</li>
                  <li>Interview Preparation</li>
                  <li>HR Consultancy</li>
                </ul>
              </div>
            </div>

            <div className="ae-content-section">
              <div className="ae-my-tasks">
                <p className="ae-task-title">My Tasks</p>

                
                  <div className="ae-table-container">
                    <table className="ae-task-table">
                      <thead>
                        <tr>
                          <th>Task Name</th>
                          <th>Deadline</th>
                          <th>Budget</th>
                          <th>Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.length > 0 ? (
                          data.map((task, index) => (
                            <tr key={index}>
                              <td>{task.TaskName}</td>
                              <td>{formatDateToDMY(new Date(task.Deadline))}</td>
                              <td>{task.Budget}</td>
                              <td>{task.Description}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4">No tasks found</td>
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
     
      <Footer />
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

export default withAuth(EmployeeDashboard);