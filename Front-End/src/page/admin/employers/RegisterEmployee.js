import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import Sidebar from "../../../components/templetes/SideBar";
import Navbar from "../../../components/templetes/adminNavBar";
import Footer from '../../../components/templetes/Footer';
import '../../../css/admin/employers/RegisterEmployee.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const UpdateEmployee = () => {
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility ...
    const [name, setName] = useState("");
    const [designation, setDesignation] = useState("");
    const [workStartDate, setWorkStartDate] = useState("");
    const [email, setEmail] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [address, setAddress] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible); // Toggle password visibility ...
    };

    const formatDateToMMDDYYYY = (date) => {
        const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed ...
        const dd = String(date.getDate()).padStart(2, '0'); 
        const yyyy = date.getFullYear();
        return `${yyyy}-${mm}-${dd}`;
    };

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    const validatePhoneNumber = (phoneNumber) => {
        const phoneRegex = /^(?:0[1-9]\d{1}|\+94[1-9]\d{1})\d{7}$/;
        return phoneRegex.test(phoneNumber);
    };

    const handleSubmit = (event) => {
        event.preventDefault(); // Always prevent default at the start ...

        // Input validation
        if (!name) {
            toast.error("Name is required!");
            return;
        }
        if (!designation) {
            toast.error("Designation is required!");
            return;
        }
        if (!workStartDate) {
            toast.error("Work Start Date is required!");
            return;
        }
        if (!email) {
            toast.error("Email is required!");
            return;
        }
        if (!contactNumber) {
            toast.error("Contact Number is required!");
            return;
        }
        if (!address) {
            toast.error("Address is required!");
            return;
        }
        if (!userName) {
            toast.error("User Name is required!");
            return;
        }
        if (!password) {
            toast.error("Password is required!");
            return;
        }
        if(!validateEmail(email)) {
            toast.error("Invalid email address!");
            return;
        }
        if(!validatePhoneNumber(contactNumber)) {
            toast.error("Invalid contact number!");
            return;
        }

        // Submit the form data to the API
        axios.post("http://localhost:5000/api/admin/register", {
            Name: name,
            Designation: designation,
            WorkStartDate: workStartDate,
            Email: email,
            ContactNumber: contactNumber,
            Address: address,
            UserName: userName,
            Password: password,
        })
        .then((res) => {
            toast.success("Employee added successfully!");
            console.log(res.data);
            // navigate after successful submission ...
            navigate('/view-employees');
        })
        .catch((err) => {
            console.error("Error posting data:", err.response?.data || err.message);
            toast.error(err.response?.data?.message || "Error adding employee!");
        });
    }

    return (
        <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
            <ToastContainer position="top-right" autoClose={3000} />
            <Navbar />

            <div className="d-flex flex-grow-1" style={{ flexWrap: "nowrap" }}>
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
                        Home / Employees / <span style={{ color: "#24757E" }}>Register Employee</span>
                    </h5>

                    <div className="card waw-card-container-height border-0">
                        <div className="card-body">
                            <h4 className="waw-employee-update-page-title text-center" style={{ color: "#24757E" }}>Register Employee</h4>
                            {/* form */}
                            <div className="waw-form-container">
                                <form className='waw-form'>
                                    {/* EmployeeID Field */}
                                    {/* <div className="waw-form-row">
                                        <label htmlFor="employeeID">EmployeeID</label>
                                        <input type="text" id="employeeID" className="form-control" placeholder="Enter ID" onChange={(e) => setEmployeeId(e.target.value)}/>
                                    </div> */}

                                    {/* Employee Name Field */}
                                    <div className="waw-form-row">
                                        <label htmlFor="employeeName">Employee Name</label>
                                        <input type="text" id="employeeName" className="form-control mt-2 waw-input" placeholder="Enter Name" onChange={(e) => setName(e.target.value)}/>
                                    </div>

                                    {/* Designation Field */}
                                    <div className="waw-form-row">
                                        <label htmlFor="designation">Designation</label>
                                        <input type="text" id="designation" className="form-control waw-input" placeholder="Enter Designation" onChange={(e) => setDesignation(e.target.value)}/>
                                    </div>

                                    {/* Work Starting Date Field */}
                                    <div className="waw-form-row">
                                        <label htmlFor="workStartDate">Work Starting Date</label>
                                        <input type="date" id="workStartDate" className="form-control waw-input" placeholder="Enter Date" onChange={(e) => setWorkStartDate(e.target.value)}/>
                                    </div>

                                    {/* Contact Number Field */}
                                    <div className="waw-form-row">
                                        <label htmlFor="contactNumber">Contact Number</label>
                                        <input type="text" id="contactNumber" className="form-control waw-input" placeholder="Enter Contact Number" onChange={(e) => setContactNumber(e.target.value)}/>
                                    </div>

                                    {/* Address Field */}
                                    <div className="waw-form-row">
                                        <label htmlFor="address">Address</label>
                                        <input type="text" id="address" className="form-control waw-input" placeholder="Enter Address" onChange={(e) => setAddress(e.target.value)}/>
                                    </div>

                                    {/* Email Field */}
                                    <div className="waw-form-row">
                                        <label htmlFor="email">Email</label>
                                        <input type="text" id="email" className="form-control waw-input" placeholder="Enter Email" onChange={(e) => setEmail(e.target.value)}/>
                                    </div>

                                    {/* User Name Field */}
                                    <div className="waw-form-row">
                                        <label htmlFor="userName">User Name</label>
                                        <input type="text" id="userName" className="form-control waw-input" placeholder="Enter User Name" onChange={(e) => setUserName(e.target.value)}/>
                                    </div>

                                    {/* Password Field */}
                                    <div className="waw-form-row">
                                        <label htmlFor="password">Password</label>
                                        <div className="waw-password-input-wrapper">
                                            <input
                                                type={passwordVisible ? "text" : "password"}
                                                id="password"
                                                className="form-control waw-input"
                                                placeholder="Enter password"
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <span
                                                className="waw-password-toggle-btn"
                                                onClick={togglePasswordVisibility}
                                            >
                                                <i className={`fa ${passwordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="waw-form-row">
                                        <button type="submit" className="btn" onClick={handleSubmit}>Save</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className={`flex-grow-1 d-flex ${sidebarVisible ? 'show-sidebar' : ''}`}>
                <Sidebar sidebarVisible={sidebarVisible} />
            </div>
            <div className="container3">
                <Footer />
            </div>
        </div>
  );
}

export default UpdateEmployee;

// //import React from 'react';
// import React, { useState } from 'react';
// import axios from 'axios';
// import Navbar from '../../components/templetes/Navbar';
// import Footer from '../../components/PagesFooter';
// import Sidebar from '../../components/templetes/SideBar';
// // import '../css/adminManageEmployee/employee.css';
// import '../../css/admin/RegisterEmployee.css';
// import {useNavigate} from 'react-router-dom';
// //import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import usePasswordToggle from '../../components/Hooks/usePasswordToggle';

// function RegisterEmployee() {
//     const [sidebarVisible, setSidebarVisible] = useState(false);
//     const [PasswordInputType , ToggleIcon]= usePasswordToggle();

//   const toggleSidebar = () => {
//     setSidebarVisible(!sidebarVisible);
//   };
  
//     //<div>Employee</div>

// //const [employeeId, setID] = useState("");
// const [Name, setName] = useState("");
// const [Designation, setDesignation] = useState("");
// const [Workstartdate,setWorkedStartdate] = useState("");
// const [ContactNumber, setContactNumber] = useState("");
// const [Address, setAddress] = useState("");
// const [Email, setEmail] = useState("");
// const [Username, setUsername] = useState("");
// const [Password, setPassword] = useState("");

// const navigate = useNavigate();





// function handleSubmit(event){
//   event.preventDefault();
//   axios.post("http://localhost:8081/employee", {
//     Name, Designation, Workstartdate, ContactNumber, Address, Email, Username, Password
//   })
//   .then(res => {
//     console.log(res);
//     navigate('/');
//   }).catch(err => {
//     console.error("Error posting data:", err.response?.data || err.message);
//   });
  
//   //  axios.post("http://localhost:8081/employee" , {Name,Designation,Workstartdate,ContactNumber,Address,Email,Username,Password})
//   // // axios.post("http://localhost:8081/employee", {
//   // //   Name, Designation, Workstartdate, ContactNumber, Address, Email, Username, Password
//   // // })
  
//   //  .then(res => {
//   //   console.log(res);
//   //   navigate('/');
//   //   }).catch(err => {
//   //   console.error("Error posting data:", err.response?.data || err.message);
//   //  });
  
//   }

//   return (
    
// <div>
//     <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
//       <Navbar /> 
//       <button className="sidebar-toggle" onClick={toggleSidebar}>☰</button>
//       <div className={`flex-grow-1 d-flex ${sidebarVisible ? 'show-sidebar' : ''}`}>
//         <Sidebar sidebarVisible={sidebarVisible} />
    
    
// <br></br>
// <br></br>

// <br></br>
// <br></br>

// <h6> Home / Employee /  Register Employee</h6>

// <h2>Register Employee</h2>

//     <div className='waw-emp-Form'>
//     <form onSubmit={handleSubmit}>
//        {/* <label>
//         <input
//           type="integer" 
//           value={employeeId}
//           placeholder='Employee ID'
//           onChange={(e) => setID(e.target.value)}
//         />
//       </label> 
//       <br></br> */}
//       <label>
//         <input
//           type="text" 
//           value={Name}
//           placeholder='Employee Name'
//           onChange={(e) => setName(e.target.value)}
//           required
//         />
//       </label><br></br>
//       <label>
//         <input
//           type="text" 
//           value={Designation}
//           placeholder='Designation'
//           onChange={(e) => setDesignation(e.target.value)}
//           required
//         />
//       </label><br></br>
//       <label>
//         <input
//           type="date" 
//           value={Workstartdate}
//           placeholder='Worked Start date  '
//           onChange={(e) => setWorkedStartdate (e.target.value)}
//           required
//         />
//       </label><br></br>
//       <label>
//         <input
//           type="number" 
//           value={ContactNumber}
//           placeholder='Contact Number'
//           onChange={(e) => setContactNumber(e.target.value)}
//           required
//         />
//       </label><br></br>
//       <label>
//         <input
//           type="text" 
//           value={Address}
//           placeholder='Address'
//           onChange={(e) => setAddress(e.target.value)}
//           required
//         />
//       </label><br></br>
//       <label>
//         <input
//           type="Email" 
//           value={Email}
//           placeholder='Email'
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//       </label><br></br>
//       <label>
//         <input
//           type="text" 
//           value={Username}
//           placeholder='Username'
//           onChange={(e) => setUsername(e.target.value)}
//           required
//         />
//       </label><br></br>
//       <label>
//         <input
//           type={PasswordInputType}
//           value={Password}
//           placeholder='Password'
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <span className="waw-password-toggle-icon">{ToggleIcon}</span>
        
//       </label><br></br>
//       <center>
//       <button type="submit" className="waw-save-button">
//       Save
//     </button>
//     </center>
//     </form>
//     </div>

    
//     </div>
//     <br></br>
//     </div>
//     <Footer/>
//     </div>
//   )
    
  
// }

// export default RegisterEmployee;