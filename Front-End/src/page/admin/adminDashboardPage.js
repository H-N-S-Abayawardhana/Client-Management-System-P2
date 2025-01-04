import React, { useState, useEffect } from 'react';
import Navbar from '../../components/templetes/adminNavBar';
import Footer from '../../components/templetes/Footer';
import Sidebar from '../../components/templetes/SideBar';
import attendImage from '../../assets/attend-image.png';
import InfoInvoice from '../../assets/pending-invoice.png';
import InfoPay from '../../assets/total-pay.png';

import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '../../css/admin/admindash.css';

function AdminDashboard() {
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

  const getAttendCount = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/admin/attendCount')
      const responseData = await response.json()
      if (!response.ok) {
        console.log("error")
      }
      else {
        console.log(responseData)
        const count = responseData.toString().padStart(2, '0');
        console.log(count)
        setAttendCount(count)
      }
    }
    catch (error) {
      console.log(error)
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
    <div className="ae-d-flex flex-column" style={{ minHeight: '100vh' }}>
      <Navbar />
      <div className="ae-breadcrumb">
        <span className="ae-breadcrumb-item">Home</span>
        <span className="ae-breadcrumb-separator">/</span>
        <span className="ae-breadcrumb-item">Dashboard</span>
      </div>
      <button className="ae-sidebar-toggle" onClick={toggleSidebar}>☰</button>

      <div className={`ae-flex-grow-1 d-flex ${sidebarVisible ? 'show-sidebar' : ''}`}>
        <Sidebar sidebarVisible={sidebarVisible} />

        <div className="ae-main-content">
          <div className="ae-grid-container">
            <div className="ae-video-section">
              <div className="ae-info-card green">
                <div className="ae-info-header-content">
                  <img src={attendImage} alt="Attend" style={{ marginLeft: '60px', height: '35px', width: '35px' }} />
                  <div className="ae-info-header">Today <br />Attendance</div>
                </div>
                <div className="ae-info-value-box">
                  <div className="ae-info-value gray">{attendance}</div>
                </div>
              </div>

              <div className="ae-info-card green">
                <div className="ae-info-header-content">
                  <img src={InfoInvoice} alt="InfoInvoice" style={{ marginLeft: '60px', height: '30px', width: '30px' }} />
                  <div className="ae-info-header">Total <br />Employees</div>
                </div>
                <div className="ae-info-value-box">
                  <div className="ae-info-value gray">{employee}</div>
                </div>
              </div>

              <div className="ae-info-card green">
                <div className="ae-info-header-content">
                  <img src={InfoPay} alt="InfoPay" style={{ marginLeft: '60px', height: '40px', width: '40px' }} />
                  <div className="ae-info-header">Pending <br />Invoices</div>
                </div>
                <div className="ae-info-value-box">
                  <div className="ae-info-value gray">{invoice}</div>
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
                <p className="ae-task-title">Received Tasks</p>
                <div className="ae-table-container">
                  <table className="ae-task-table">
                    <thead>
                      <tr>
                        <th>Task ID</th>
                        <th>Employee ID</th>
                        <th>Task Name</th>
                        <th>Description</th>
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
          </div>
        </div>
      </div>

                  <div className="container3">
                      <Footer />
                  </div>
    </div>
  );
}

export default AdminDashboard;