import React, {useEffect, useState} from "react";
import {toast, ToastContainer} from 'react-toastify';
import Footer from '../../../components/templetes/Footer';
import Sidebar from '../../../components/templetes/ESideBar';
import Navbar from "../../../components/templetes/empNavBar";
import AddAttendancePopup from "./AddAttendancePopup";
import circlePlusIcon from "../../../assets/plusIcon.png";
import searchIcon from "../../../assets/image.png"
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../../css/employee/attendance/EmployeeAttendance.css";
import "../../../css/admin/attendance/AdminAttendance.css";

function EmployeeAttendance() {
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [allAttendances, setAllAttendances] = useState([]);
    const [inputData, setInputData] = useState(null);
    const [openPopup, setOpenPopup] = useState(false);
    const [loggedUser, setLoggeduser] = useState([]);

    const formatDateToDMY = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }; 

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    }; 

    const getLoggedUserData = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/employee/current/profile", {
                method: 'GET',
                headers: {
                    'Content-Type':'application/json',
                }
            });
            const responseData = await response.json();
            if(!response.ok) {
                console.log('Error Occured !');
                return;
            } else {
                console.log(responseData);
                console.log(responseData.Name);
                setLoggeduser(responseData);
                console.log('success');
                return;
            }
        } catch (error) {
            console.log(error);
        }
    };

    const viewAllAttendances = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/employee/ViewAllAttendances', {
                method: 'GET',
                headers: {
                    'Content-Type':'application/json',
                }
            })
            const responseData = await response.json();
            if(!response.ok) {
                console.log('No Attendance Records Found !');
                return;
            } else {
                console.log(response);
                setData(responseData);
                setAllAttendances(responseData); // Store all data
                console.log('success');
                return;
            }
        } catch (error) {
            console.log(error);
        }
    };

    const searchAttendance = async (input) => {
        try {
            console.log(input);
            setInputData(input);
            const response = await fetch(`http://localhost:5000/api/employee/attendance/${input}`, {
                method: 'GET',
                headers: {
                    'Content-Type':'application/json',
                }
            })
            const responseData = await response.json();
            if(!response.ok) {
                //toast.error('Error Occured !');
                console.log('Error Occured !', responseData);
                setData([]); // Clear data to show "No matching records found" ...
                return;
            } else {
                console.log(response);
                setData(responseData);
                console.log("data:", data);
                console.log(responseData);
                if(responseData.length > 0) {
                    console.log('success');
                    return;
                } else {
                    console.log('empty');
                    setData([]); // Show "No matching records found" for empty results ...
                    console.log('No matching records found');
                    return;
                }
            }
        } catch (error) {
            console.log(error);
            setData([]); // Clear data to show "No matching records found" ...
        }
    };

    // Function to handle changes in the search input field
    const handleSearchChange = (e) => {
        const input = e.target.value;
        setSearchTerm(input); // Update the search term
        if (input) {
            searchAttendance(input);
        } else {
            setData(allAttendances);  // Clear data if input is empty
        }
    };

    const addAttendance = () => {
        setOpenPopup(true);
        console.log('Opening the Popup --');
    };

    const closePopup = () => {
        setOpenPopup(false);
    };

    useEffect(() => {
        viewAllAttendances(); // Fetch all attendances on mount ...
        getLoggedUserData(); // Fetch logged user details ...
    }, []);

    return (
        <div className="d-flex flex-column ekr-attendance-module" style={{ minHeight: "100vh" }}>
            <ToastContainer position="top-right" autoClose={3000} />
            <Navbar />
            <button className="sidebar-toggle ekr-tog" onClick={toggleSidebar}>
                ☰
            </button>
            <div className="d-flex flex-grow-1" style={{ flexWrap: "nowrap" }}>
                {/* Sidebar */}
                <div
                    className={`ekr-sidebar-container ${sidebarVisible ? "show-sidebar" : ""}`}
                    style={{ flexShrink: 0 }}
                >
                    <Sidebar sidebarVisible={sidebarVisible} />
                </div>

                {/* Content and Footer Container */}
                <div className="d-flex flex-column flex-grow-1">
                    {/* Content */}
                    <div className="ekr-content-container flex-grow-1 p-4">
                        <h5 className="mt-5">
                            Home / <span style={{ color: "#24757E" }}>Attendance</span>
                        </h5>
                        <div className="card mt-2 ekr-card-container-height border-0">
                            <div className="card-body">
                                <h4 className="ekr-employee-attendance-page-title text-center mt-1">Attendance</h4>
                                <div className="ekr-employee-button-container d-flex justify-content-between mt-1 mb-2">
                                    {/* Search Bar */}
                                    <div className="ekr-employee-search-bar-container position-relative d-flex ms-2">
                                        <input
                                            type="text"
                                            className="form-control ekr-employee-search-bar"
                                            placeholder="Search"
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                        />
                                        <button className="btn ekr-employee-search-bar-icon">
                                            <img alt="Search Icon" src={searchIcon} className="ekr-search-bar-icon" />
                                        </button>
                                    </div>
                                    {/* Add Attendance Button */}
                                    <button
                                        className="ekr-add-attendance-button me-2"
                                        onClick={addAttendance}
                                    >
                                        Add Attendance
                                        <img
                                            alt="Add Icon"
                                            src={circlePlusIcon}
                                            className="ekr-add-attendance-button-icon"
                                        />
                                    </button>
                                </div>
                                {/* Table */}
                                <div className="ekr-employee-attendance-table-container mt-1">
                                    <table className="table table-bordered ekr-employee-attendance-table">
                                        <thead className="thead-light">
                                            <tr className="text-center">
                                                <th className="ekr-w-10">No</th>
                                                <th>Employee Name</th>
                                                <th>Date</th>
                                                <th>Email</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody id="employee-table-body">
                                            {data.length > 0 ? (
                                                data.map((element, index) => (
                                                    <tr key={element.id} className="w-100">
                                                        <td className="ekr-w-10">{String(element.RowNumber).padStart(2, "0")}</td>
                                                        <td>{element.name}</td>
                                                        <td>{formatDateToDMY(new Date(element.date))}</td>
                                                        <td>{element.email}</td>
                                                        <td>{element.status}</td>
                                                    </tr>
                                                ))
                                            ) : (
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

                    {/* Footer */}
                    <Footer />
                </div>
            </div>

            {/* Popup */}
            {openPopup && (
                <div className="ekr-popup-overlay">
                    <div className="ekr-popup-content" onClick={(e) => e.stopPropagation()}>
                        <AddAttendancePopup closePopup={closePopup} data={loggedUser} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default EmployeeAttendance;
