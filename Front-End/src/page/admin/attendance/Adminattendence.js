import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'jspdf-autotable';
import Swal from 'sweetalert2';
import Navbar from '../../../components/templetes/adminNavBar';
import Footer from '../../../components/templetes/Footer';
import Sidebar from '../../../components/templetes/SideBar';
import searchIcon from '../../../assets/image.png';
import 'react-datepicker/dist/react-datepicker.css';
import '../../../css/admin/attendance/AdminAttendance.css';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminAttendance = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleSortDateClick = () => {
    if (showDatePicker) {
      setSelectedDate(null);
    }
    setShowDatePicker(!showDatePicker);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };

  const fetchAttendanceData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/ViewAllAttendances');
      const data = await response.json();
      if (Array.isArray(data)) {
        setAttendanceData(data);
        setFilteredData(data);
      } else {
        console.error('Expected an array but got:', data);
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      toast.error('Failed to fetch attendance data.');
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const filtered = attendanceData.filter((entry) => {
      const searchMatch =
        entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.email.toLowerCase().includes(searchTerm.toLowerCase());

      const dateMatch = selectedDate
        ? formatDate(entry.date) === formatDate(selectedDate)
        : true;

      return searchMatch && dateMatch;
    });
    setFilteredData(filtered);
  }, [attendanceData, searchTerm, selectedDate]);

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/generatePDF', { method: 'GET' });
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'Attendance_Report.pdf';
      link.click();
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF.');
    }
  };

  const handleReset = async () => {
    Swal.fire({
      title: 'Confirmation About Reset Data',
      text: 'Are you sure you want to reset attendance data ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Update',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch('http://localhost:5000/api/admin/resetData', { method: 'GET' });
          const result = await response.json();
          if (response.ok) {
            setAttendanceData([]);
            setFilteredData([]);
            toast.success('Attendance data has been reset.');
            // Success message ...
            Swal.fire({
              icon: 'success',
              title: 'Data Resetted!',
              text: 'Attendance Recordes Has Been Removed And Resetted Successfully!',
              confirmButtonColor: '#3085d6',
            });
          } else {
            toast.error('Error resetting attendance data.');
            // Error message
            Swal.fire({
              icon: 'error',
              title: 'Reset Failed!',
              text: 'An error occurred while reset attendance details. Please try again.',
              confirmButtonColor: '#d33',
            });
          }
        } catch (error) {
          console.error('Error resetting attendance data:', error);
          toast.error('Error resetting attendance data.');
          // Error message
          Swal.fire({
            icon: 'error',
            title: 'Reset Failed!',
            text: 'An error occurred while reset attendance details. Please try again.',
            confirmButtonColor: '#d33',
          });
        }
      }
    });
  };

  return (
    <div className="ekr-admin-attendance-wrapper">
      <div className="ekr-admin-attendance-container d-flex flex-column" style={{ minHeight: '100vh' }}>
        <ToastContainer position="top-right" autoClose={3000} />
        <Navbar />

        <div className={`flex-grow-1 d-flex ${sidebarVisible ? 'show-sidebar' : ''}`}>
          <div className="ekr-main-content p-4 ekr-main">
            <div className="ekr-breadcrumb mb-3 mt-4">
              <h5>
                Home / <span style={{ color: '#24757E' }}>Attendance</span>
              </h5>
            </div>

            <div className="card border-0">
              <div className="card-body">
                <h4 className="ekr-page-title text-center">Attendance</h4>

                <div className="ekr-controls-section d-flex justify-content-between align-items-center my-2">
                  <div className="d-flex align-items-center position-relative">
                    <button
                      className="btn ekr-control-btn me-2 d-flex align-items-center justify-content-between mb-1 pb-1"
                      onClick={handleSortDateClick}
                    >
                      {selectedDate ? selectedDate.toLocaleDateString() : 'Sort Date'}
                      <i className="bi bi-calendar ms-2 border-0"></i>
                    </button>
                    {showDatePicker && (
                      <div className="ekr-date-picker-container position-absolute">
                        <DatePicker
                          selected={selectedDate}
                          onChange={handleDateChange}
                          dateFormat="yyyy/MM/dd"
                          className="form-control ms-2"
                          placeholderText="Select a date"
                          inline
                        />
                      </div>
                    )}
                  </div>

                  <div className="ekr-search-bar-container position-relative d-flex">
                    <input
                      type="text"
                      className="form-control ekr-search-bar me-2"
                      placeholder="Search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn ekr-search-bar-icon">
                      <img alt="Search Icon" src={searchIcon} className="ekr-search-icon" />
                    </button>
                  </div>
                </div>

                <div className="d-flex gap-2 mb-1 ekr-button-row">
                  <button className="btn ekr-reset-btn" onClick={handleReset}>
                    Reset
                  </button>
                  <button className="btn ekr-download-btn" onClick={handleDownloadPDF}>
                    Download
                  </button>
                </div>

                <div className="ekr-scrollable-table">
                  <div className="ekr-scroll-wrapper"> {/* Added scroll wrapper */}
                    <table className="ekr-attendance-table table table-bordered">
                      <thead className="thead-light">
                        <tr>
                          <th>No</th>
                          <th>Employee Name</th>
                          <th>Date</th>
                          <th>Email</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.map((entry, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{entry.name}</td>
                            <td>{formatDate(entry.date)}</td>
                            <td>{entry.email}</td>
                            <td className="fw-bold">{entry.status}</td>
                          </tr>
                        ))}
                        {filteredData.length === 0 && (
                          <tr>
                            <td colSpan="5" className="text-center fw-bold">
                              No matching records found
                            </td>
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
        <button className="apwgr-sidebar-toggle" onClick={toggleSidebar}>☰</button>
        <div className={`flex-grow-1 d-flex ${sidebarVisible ? 'show-sidebar' : ''}`}>
          <Sidebar sidebarVisible={sidebarVisible} />
        </div>
        <div className="container3">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default AdminAttendance;