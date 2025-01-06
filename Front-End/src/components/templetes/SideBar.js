import React from 'react';
import '../../css/Sidebar.css';
import attendence from '../../assets/attendence.png';
import dashboard from '../../assets/dashboard.png';
import mail from '../../assets/mail.png';
import task from '../../assets/task.png';
import payment from '../../assets/payment.png';
import invoice from '../../assets/invoice.png';
import employee from '../../assets/employee.png';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Dashboard</h2>
      <ul>
      <li><a href="/admin-dashboard"><img src={dashboard} alt="Dashboard" style={{ width: '20px', marginRight: '14px' }} /><span>Dashboard</span></a></li>
        <li><a href="admin-attendance"><img src={attendence} alt="Attendance" style={{ width: '20px', marginRight: '14px' }} /><span>Attendance</span></a></li>
        <li><a href="/admin-invoice"><img src={invoice} alt="Invoice" style={{ width: '25px', marginRight: '10px' }}/><span>Invoice</span></a></li>
        <li><a href="/view-employees"><img src={employee} alt="employees" style={{ width: '25px', marginRight: '10px',boxShadow: 'none' }}/><span>Employers</span></a></li>
        <li><a href="/admin-payment"><img src={payment} alt="Payment" style={{ width: '25px', marginRight: '10px' }}/><span>Payment</span></a></li>
        <li><a href="/admin-manage-task"><img src={task} alt="Task" style={{ width: '25px', marginRight: '10px' }}/><span>Task</span></a></li>
        <li><a href="/admin-mailbox"><img src={mail} alt="Mailbox" style={{ width: '25px', marginRight: '10px' }}/><span>Mail-Box</span></a></li>
      </ul>
    </div>
  );
};

export default Sidebar;
