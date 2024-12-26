import React, { useState, useEffect } from 'react';
import Navbar from '../../components/templetes/adminNavBar';
import Footer from '../../components/PagesFooter';
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
    try{
        const response = await fetch('http://localhost:8800/api/attendCount')
        const responseData = await response.json()
        if(!response.ok){
          console.log("error")
        }
        else{
           console.log(responseData)
          const count = responseData.toString().padStart(2, '0');
          console.log(count)
         
          setAttendCount(count)
          
        }
    }
    catch(error){
         console.log(error)
    }
  };

  const getEmpCount = async () => {
    try{
        const response = await fetch('http://localhost:8800/api/empCount')
        const responseData = await response.json()
        if(!response.ok){
          console.log("error")
        }
        else{
          console.log(responseData)
          const count = responseData.toString().padStart(2, '0');
          setEmpCount(count)
        }
    }
    catch(error){
         console.log(error)
    }
  };

  const getInvoiceCount = async () => {
    try{
        const response = await fetch('http://localhost:8800/api/invoiceCount')
        const responseData = await response.json()
        if(!response.ok){
          console.log("error")
        }
        else{
          console.log(responseData)
          const count = responseData.toString().padStart(2, '0');
          setInvoiceCount(count)
        }
    }
    catch(error){
         console.log(error)
    }
  };

  const getData = async () => {
    try{
      const response = await fetch('http://localhost:8800/api/received')
      const responseData = await response.json()
      if(!response.ok){
        console.log("error")
      }
      else{
        console.log(responseData)
        setData(responseData)
      }
  }
  catch(error){
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
    <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
      <Navbar />
      <button className="sidebar-toggle" onClick={toggleSidebar}>☰</button>

      <div className={`flex-grow-1 d-flex ${sidebarVisible ? 'show-sidebar' : ''}`}>
        <Sidebar sidebarVisible={sidebarVisible} />

        <div className="main-content">
          <div className="grid-container">
            <div className="video-section">

              <div className="info-card green">
                            <div className="info-header-content">
                            <img src={attendImage} alt="Attend" style={{ marginLeft: '60px', height:'35px', width:'35px' }}/>
                              <div className="info-header">Today <br />Attendance</div>
                              </div>
                              <div className="info-value-box">
                                <div className="info-value gray">{attendance }</div>
                              </div>
                            </div>
              
              
                            <div className="info-card green">
                            <div className="info-header-content">
                            <img src={InfoInvoice} alt="InfoInvoice" style={{ marginLeft: '60px', height:'30px', width:'30px' }}/>
                              <div className="info-header">Total <br />Employees</div>
                              </div>
                              <div className="info-value-box">
                                <div className="info-value gray">{employee }</div>
                              </div>
                            </div>
              
              
              
                            <div className="info-card green">
                             <div className="info-header-content">
                            <img src={InfoPay} alt="InfoPay" style={{ marginLeft: '60px', height:'40px', width:'40px' }}/>
                              <div className="info-header">Pending <br />Invoices</div>
                              </div>
                              <div className="info-value-box">
                                <div className="info-value gray">{invoice }</div>
                              </div>
                            </div>

            </div>

            <div className="sidebar-section">
              <div className="overview-ae">Overview</div>
              <h3 className="vision-title-ae">Our Mission</h3>
              <p className="mission-vision-text-ae">
                Our mission is to showcase emerging market talent globally to provide a genuinely local solution to organizational needs
              </p>
              <h3 className="vision-title-ae">Our Vision</h3>
              <p className="mission-vision-text-ae">
                We aspire to be the premier choice for all human resource and business solutions. By extending our services across borders, we tap into a broad spectrum of talent from emerging countries and industries, providing diversity in the workplace and ensuring companies find the leadership talent they need.
              </p>
              <div className="vision-title-ae">
                <h3 className="vision-title-ae">Our Services</h3>
                <ul className="mission-vision-text-ae">
                  <li>Headhunting</li>
                  <li>Professional Resume Writing</li>
                  <li>Interview Preparation</li>
                  <li>HR Consultancy</li>
                </ul>
              </div>
            </div>

            <div className="content-section">
              <div className="my-tasks">
                <p className="task-title">Received Tasks</p>
                <div className="table-container">
                  <table className="task-table">
                    <thead>
                      <tr>
                        <th>Employee Name</th>
                        <th>Company</th>
                        <th>Task Name</th>
                        <th>Deadline</th>
                        <th>Budget</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.length > 0 ? (
                        data.map((task, index) => (
                          <tr key={index}>
                            <td>{task.Employee_name}</td>
                            <td>{task.Company}</td>
                            <td>{task.Task_name}</td>
                            <td>{formatDateToDMY(new Date(task.Deadline))}</td>
                            <td>{task.Budget}</td>
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

      <Footer />
    </div>
  );
}

export default AdminDashboard;
