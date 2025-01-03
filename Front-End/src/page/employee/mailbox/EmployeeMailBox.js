import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Add this import
import Sidebar from "../../../components/templetes/ESideBar";
import Navbar from "../../../components/templetes/empNavBar";
import Footer from "../../../components/PagesFooter";
import '../../../css/MailBox.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const EmployeeMailBox = () => {
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [formData, setFormData] = useState({
        to: "",
        subject: "",
        message: "",
        attachment: null,
    });
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    
    const handleAttachmentChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, attachment: file });
    };

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    }; 

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formDataToSend = new FormData();
        formDataToSend.append("to", formData.to);
        formDataToSend.append("subject", formData.subject);
        formDataToSend.append("message", formData.message);
        if (formData.attachment) {
            formDataToSend.append("attachment", formData.attachment);
        }
    
        try {
            const response = await fetch('http://localhost:5000/api/email/send-email', {
                method: 'POST',
                body: formDataToSend,
                credentials: 'include',
            });
    
            if (response.ok) {
                toast.success('Email sent successfully!');
                setFormData({ to: '', subject: '', message: '', attachment: null }); // Reset form
            } else {
                const errorData = await response.json();
                toast.error(`Failed to send email: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Failed to send email: ' + error.message);
        }
    }; 

    return (
        <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
            <ToastContainer position="top-right" autoClose={3000} />
            <Navbar />
            <button className="sidebar-toggle km-tog" onClick={toggleSidebar}>
                ☰
            </button>
            <div className={`flex-grow-1 d-flex`}>
                <div className={`km-sidebar-container ${sidebarVisible ? 'show-sidebar' : ''}`} style={{ flexShrink: 0 }}>
                    <Sidebar sidebarVisible={sidebarVisible} />
                </div>

                {/* Content Container */}
                <div className="km-content-container flex-grow-1 p-4" style={{
                    height: "100vh",           // Full viewport height
                    overflowY: "auto",         // Enable scrolling for the entire DOM
                    display: "flex",           // Flex layout for content flow
                    flexDirection: "column"    // Stack children vertically
                }}>
                    <h5 className="mt-5">
                        Home / <span style={{ color: "#24757E" }}>Mail-Box</span>
                    </h5>

                    <div className="card km-card-container-height border-0">
                        <div className="card-body">
                            <h4 className="km-employee-attendance-page-title text-center" style={{ color: "#24757E" }}>Mail Box</h4>

                            <div className="km-mailbox-container">
                                <form onSubmit={handleSubmit} className='km-form'>
                                    <h6 className="text-start fw-bold mb-2 mt-3">Send Email</h6>

                                    <input
                                        type="email"
                                        id="to"
                                        name="to"
                                        placeholder="To:"
                                        required
                                        className="km-mailbox-input form-control mb-2" // Use Bootstrap's form-control for consistent styling
                                        style={{
                                            fontSize: "0.875rem",
                                            backgroundColor: "#f0f0f0"
                                        }}
                                        value={formData.to}
                                        onChange={handleChange}
                                    />

                                    <input
                                        type="text"
                                        id="subject"
                                        placeholder="Subject"
                                        name="subject"
                                        required
                                        className="km-mailbox-input form-control mb-2"
                                        style={{
                                            fontSize: "0.875rem",
                                            backgroundColor: "#f0f0f0"
                                        }}
                                        value={formData.subject}
                                        onChange={handleChange}
                                    />

                                    {/* Attachment Field */}
                                    <div className="km-attachment-container">
                                        <label className="km-attachment-label d-flex align-items-center">
                                            <i className="fas fa-paperclip me-2"></i>
                                            <span className="km-file-name me-2">{formData?.attachment?.name || "No file selected"}</span>
                                            <input type="file" className="km-file-input" name="attachment" onChange={handleAttachmentChange}/>
                                        </label>
                                    </div>

                                    <textarea
                                        id="message"
                                        name="message"
                                        placeholder="Type message"
                                        rows="5"
                                        required
                                        className="km-mailbox-textarea form-control mb-2"
                                        style={{
                                            fontSize: "0.875rem",
                                            backgroundColor: "#f0f0f0",
                                            resize: "none"
                                        }}
                                        value={formData.message}
                                        onChange={handleChange}
                                    ></textarea>

                                    {/* Submit Button */}
                                    <button type="submit" className="km-mailbox-submit-btn mb-3">
                                        Send
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default EmployeeMailBox;