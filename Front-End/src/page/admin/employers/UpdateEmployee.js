import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import Sidebar from "../../../components/templetes/SideBar";
import Navbar from "../../../components/templetes/adminNavBar";
import Footer from '../../../components/templetes/Footer';
import '../../../css/admin/employers/UpdateEmployee.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const UpdateEmployee = () => {
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility ...
    const [employeeID, setEmployeeID] = useState("");
    const [name, setName] = useState("");
    const [designation, setDesignation] = useState("");
    const [workStartDate, setWorkStartDate] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [address, setAddress] = useState(""); 
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { EmployeeID } = useParams();
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible); // Toggle password visibility
    }; 

    const formatDateToMMDDYYYY = (date) => {
        const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const dd = String(date.getDate()).padStart(2, '0'); 
        const yyyy = date.getFullYear();
        return `${yyyy}-${mm}-${dd}`;
    };

    const formatToLocalISODate = (date) => {
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) return ""; // Handle invalid dates
        return parsedDate.toISOString().split("T")[0];
        // if (!date) return ""; // Handle empty or invalid dates
        // const parsedDate = new Date(date); 
        // if (isNaN(parsedDate.getTime())) return ""; // Return empty string if invalid
    
        // // Adjust to local timezone and ensure no time offset
        // const offset = parsedDate.getTimezoneOffset();
        // parsedDate.setMinutes(parsedDate.getMinutes() - offset);
    
        // return parsedDate.toISOString().split("T")[0];
    };

    const fetchEmployeeDetails = async () => {
        console.log(EmployeeID);
        try {
            const response = await axios.get(`http://localhost:5000/api/admin/employee/${EmployeeID}`);
            if (response.data) {
                console.log(response.data);
                setEmployeeID(EmployeeID);
                setName(response.data.data.Name);
                setDesignation(response.data.data.Designation);
                setContactNumber(response.data.data.ContactNumber);
                setAddress(response.data.data.Address);
                setEmail(response.data.data.Email);
                setUsername(response.data.data.Username);
                setPassword(response.data.Password);

                const formattedDate = formatDateToMMDDYYYY(new Date(response.data.data.WorkStartDate));
                setWorkStartDate(formattedDate);
            } else {
                console.log("Employee not found.");
                toast.error("Employee not found.");
            }
        } catch (err) {
            console.error("Error fetching data:", err.message || err);
            toast.error("Failed to fetch employee details.");
        }
    };

    useEffect(() => {
        console.log(EmployeeID);
        if (EmployeeID) fetchEmployeeDetails();
    }, [EmployeeID]); 

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission ...
        Swal.fire({
            title: 'Confirmation About Update',
            text: 'Are you sure you want to update this Employee Details?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Update',
            customClass: {
              popup: 'waw-smaller-swal-popup',
              title: 'waw-smaller-swal-title',
              content: 'waw-smaller-swal-content',
            },
            width: '80%',
            padding: '20px',
            grow: 'fullscreen',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    console.log(workStartDate);
                    await axios.put(`http://localhost:5000/api/admin/update/${EmployeeID}`, {
                        Name: name,
                        Designation: designation,
                        WorkStartDate: workStartDate,
                        ContactNumber: contactNumber,
                        Address: address,
                        Email: email,
                        Username: username
                    }); 
                    toast.success("Successfully updated employee.");
                    navigate('/view-employees');
                } catch (error) {
                    console.error("Error updating employee:", error);
                    toast.error("Failed to update employee.");
                }
            }
        });
    };

    return (
        <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
            <ToastContainer className='mt-5 waw-custom-toast-container'/>
            <Navbar />
            <button className="sidebar-toggle waw-tog" onClick={toggleSidebar}>
                ☰
            </button>
            <div className={`flex-grow-1 d-flex`}>
                <div className={`waw-sidebar-container ${sidebarVisible ? 'show-sidebar' : ''}`} style={{ flexShrink: 0 }}>
                    <Sidebar sidebarVisible={sidebarVisible} />
                </div>

                {/* Content Container */}
                <div className="waw-content-container flex-grow-1 p-4" style={{
                    height: "120vh",           // Full viewport height
                    overflowY: "auto",         // Enable scrolling for the entire DOM
                    display: "flex",           // Flex layout for content flow
                    flexDirection: "column"    // Stack children vertically
                }}>
                    <h5 className="mt-5">
                        Home / Employees / <span style={{ color: "#24757E" }}>Update Employee</span>
                    </h5>

                    <div className="card waw-card-container-height border-0">
                        <div className="card-body">
                            <h4 className="waw-employee-update-page-title text-center" style={{ color: "#24757E" }}>Employee Update</h4>
                            {/* form */}
                            <div className="waw-form-container">
                                <form className='waw-update-form'>
                                    {/* EmployeeID Field */}
                                    <div className="waw-form-row">
                                        <label htmlFor="employeeID">EmployeeID</label>
                                        <input type="text" id="employeeID" className="form-control waw-update-input mt-2" placeholder="Enter ID" value={employeeID} required disabled/>
                                    </div>

                                    {/* Employee Name Field */}
                                    <div className="waw-form-row">
                                        <label htmlFor="employeeName">Employee Name</label>
                                        <input type="text" id="employeeName" className="form-control waw-update-input" placeholder="Enter Name" value={name} required onChange={(e) => setName(e.target.value)}/>
                                    </div>

                                    {/* Designation Field */}
                                    <div className="waw-form-row">
                                        <label htmlFor="designation">Designation</label>
                                        <input type="text" id="designation" className="form-control waw-update-input" placeholder="Enter Designation" value={designation} required onChange={(e) => setDesignation(e.target.value)}/>
                                    </div>

                                    {/* Work Starting Date Field */}
                                    <div className="waw-form-row">
                                        <label htmlFor="workStartDate">Work Starting Date</label>
                                        <input
                                            type="date"
                                            id="workStartDate"
                                            className="form-control waw-update-input"
                                            placeholder="Enter Date"
                                            value={formatToLocalISODate(workStartDate)} // Format date to YYYY-MM-DD // Convert to YYYY-MM-DD ...
                                            onChange={(e) => setWorkStartDate(e.target.value)}
                                            required
                                        />
                                    </div>

                                    {/* Contact Number Field */}
                                    <div className="waw-form-row">
                                        <label htmlFor="contactNumber">Contact Number</label>
                                        <input type="text" id="contactNumber" className="form-control" placeholder="Enter Contact Number" value={contactNumber} required onChange={(e) => setContactNumber(e.target.value)}/>
                                    </div>

                                    {/* Address Field */}
                                    <div className="waw-form-row">
                                        <label htmlFor="address">Address</label>
                                        <input type="text" id="address" className="form-control" placeholder="Enter Address" value={address} required onChange={(e) => setAddress(e.target.value)}/>
                                    </div>

                                    {/* Email Field */}
                                    <div className="waw-form-row">
                                        <label htmlFor="email">Email</label>
                                        <input type="text" id="email" className="form-control" placeholder="Enter Email" value={email} required onChange={(e) => setEmail(e.target.value)}/>
                                    </div>

                                    {/* User Name Field */}
                                    <div className="waw-form-row">
                                        <label htmlFor="userName">User Name</label>
                                        <input type="text" id="userName" className="form-control" placeholder="Enter User Name" value={username} required onChange={(e) => setUsername(e.target.value)}/>
                                    </div>

                                    {/* Password Field */}
                                    {/* <div className="waw-form-row">
                                        <label htmlFor="password">Password</label>
                                        <div className="ekr-password-input-wrapper">
                                            <input
                                                type={passwordVisible ? "text" : "password"}
                                                id="password"
                                                className="form-control"
                                                placeholder="Enter password"
                                                value={password}
                                                required
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <span
                                                className="ekr-password-toggle-btn"
                                                onClick={togglePasswordVisibility}
                                            >
                                                <i className={`fa ${passwordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                            </span>
                                        </div>
                                    </div> */}

                                    {/* Submit Button */}
                                    <div className="waw-form-row">
                                        <button type="submit" className="btn" onClick={handleSubmit}>Update</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <button className="apwgr-sidebar-toggle" onClick={toggleSidebar}>☰</button>
            <div className={`flex-grow-1 d-flex ${sidebarVisible ? 'show-sidebar' : ''}`}>
                <Sidebar sidebarVisible={sidebarVisible} />
            </div> */}
            <div className="container3">
                <Footer />
            </div>
        </div>
  );
}

export default UpdateEmployee;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Navbar from '../../components/templetes/Navbar';
// import Footer from '../../components/PagesFooter';
// import Sidebar from '../../components/templetes/SideBar';
// // import '../css/adminManageEmployee/update.css';
// // import'../../css/adminManageEmployee/update.css';
// import'../../css/admin/UpdateEmployee.css';
// import { useNavigate, useParams } from 'react-router-dom';
// import usePasswordToggle from '../../components/Hooks/usePasswordToggle';

// function UpdateEmployee() {
//     const [sidebarVisible, setSidebarVisible] = useState(false);
//     const [PasswordInputType, ToggleIcon] = usePasswordToggle();
//     const { EmployeeID } = useParams();
//     const navigate = useNavigate();

//     const [employee, setEmployee] = useState({
//         Name: "",
//         Designation: "",
//         Workstartdate: "",
//         ContactNumber: "",
//         Address: "",
//         Email: "",
//         Username: "",
//         Password: ""
//     });
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     const toggleSidebar = () => {
//         setSidebarVisible(!sidebarVisible);
//     };

//     useEffect(() => {
//         const fetchEmployeeDetails = async () => {
//             try {
//                 const response = await axios.get(`http://localhost:8081/employee/${EmployeeID}`);
//                 if (response.data) {
//                     setEmployee(response.data);
//                 } else {
//                     setError("Employee not found.");
//                 }
//             } catch (err) {
//                 console.error("Error fetching data:", err.message || err);
//                 setError("Failed to fetch employee details.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (EmployeeID) {
//             fetchEmployeeDetails();
//         }
//     }, [EmployeeID]);

//     const handleSubmit = async (event) => {
//         event.preventDefault();
//         try {
//             await axios.put(`http://localhost:8081/update/${EmployeeID}`, employee);
//             alert("Employee updated successfully!");
//             navigate('/');
//         } catch (err) {
//             console.error("Update error:", err);
//             alert("Error updating employee details.");
//         }
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setEmployee((prev) => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     return (
//         <div>
//             <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
//                 <Navbar />
//                 <button className="sidebar-toggle" onClick={toggleSidebar}>☰</button>
//                 <div className={`flex-grow-1 d-flex ${sidebarVisible ? 'show-sidebar' : ''}`}>
//                     <Sidebar sidebarVisible={sidebarVisible} />
//                     <br></br><br></br>
//                     <br></br>
//                     <br></br>
//                     <h6 > Home /  Employee /  Employee Update</h6>

//                     <h2>Employee Update</h2>
//                     <div className='waw-emp-Form'>
                        

//                         {loading && <p>Loading employee details...</p>}
//                         {error && <p className="error-message">{error}</p>}

//                         {!loading && !error && (
//                             <form onSubmit={handleSubmit}>
//                                 {[
//                                     {  name: "Name", type: "text" },
//                                     {  name: "Designation", type: "text" },
//                                     {  name: "Workstartdate", type: "date" },
//                                     {  name: "ContactNumber", type: "tel" },
//                                     {  name: "Address", type: "text" },
//                                     {  name: "Email", type: "email" },
//                                     { name: "Username", type: "text" },
//                                 ].map(({ label, name, type }) => (
//                                     <label key={name}>
//                                         <span>{label}</span>
//                                         <input
//                                             type={type}
//                                             name={name}
//                                             value={employee[name] || ""}
//                                             onChange={handleChange}
//                                         />
//                                     </label>
//                                 ))}
//                                 <label>
//                                     {/* <span>Password</span> */}
//                                     <div className="password-input-wrapper">
//                                         <input
//                                             type={PasswordInputType}
//                                             name="Password"
//                                             value={employee.Password || ""}
//                                             onChange={handleChange}
//                                         />
//                                         <span className="password-toggle-icon" onClick={ToggleIcon}>
//                                             {ToggleIcon}
//                                         </span>
//                                     </div>
//                                 </label>
//                                 <center>
//                                     <button type="submit" className="waw-save-button">Update</button>
//                                 </center>
//                             </form>
//                         )}
//                     </div>
//                 </div>
//             </div>
//             <br></br>
//             <Footer />
//         </div>
//     );
// }

// export default UpdateEmployee;
