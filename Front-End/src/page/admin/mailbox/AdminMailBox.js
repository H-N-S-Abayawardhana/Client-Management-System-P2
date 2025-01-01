import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import Sidebar from "../../../components/templetes/SideBar";
import Navbar from "../../../components/templetes/adminNavBar";
import Footer from "../../../components/PagesFooter";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../css/MailBox.css';

const AdminMailBox = () => {
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
        
        // const emailData = {
        //   to: formData.to,
        //   subject: formData.subject,
        //   message: formData.message,
        //   // attachment: formData.attachment? formData.attachment : null,
        // };

        // Prepare FormData for attachment
        const formDataToSend = new FormData();
        formDataToSend.append("to", formData.to);
        formDataToSend.append("subject", formData.subject);
        formDataToSend.append("message", formData.message);
        if (formData.attachment) {
            formDataToSend.append("attachment", formData.attachment);
        }
    
        try {
            const response = await fetch('http://localhost:5000/api/emailService/send-email', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData), 
                credentials: 'include', // Include credentials ...
            });
    
            if (response.ok) {
                toast.success('Email sent successfully!');
                setFormData({ to: '', subject: '', message: '', attachment: null }); // Reset form ...
            } else {
                const errorData = await response.json();
                toast.error(`Failed to send email: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Failed to send email.', error);
        }
    }; 

    //   const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     const formData = new FormData();
    //     formData.append('to', formData.to);
    //     formData.append('subject', formData.subject);
    //     formData.append('message', formData.message);
    //     if (formData.attachment) {
    //         formData.append('attachment', formData.attachment);
    //     }

    //     try {
    //         const response = await fetch('http://localhost:8800/emailService/send-email', {
    //             method: 'POST',
    //             body: formData, // FormData handles content type
    //         });

    //         if (response.ok) {
    //             alert('Email sent successfully!');
    //             setFormData({ to: '', subject: '', message: '', attachment: null }); // Reset form
    //         } else {
    //             const errorData = await response.json();
    //             alert(`Failed to send email: ${errorData.message}`);
    //         }
    //     } catch (error) {
    //         console.error('Error submitting form:', error);
    //         alert('Failed to send email.');
    //     }
    // };

    return (
        <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
            <ToastContainer position="top-right" autoClose={3000} />
            <Navbar />
            <button className="sidebar-toggle" onClick={toggleSidebar}>
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
                                <form onSubmit={handleSubmit}>
                                    <h6 className="text-start fw-bold mb-2">Send Email</h6>

                                    {/* To Field */}
                                    <input
                                        type="email"
                                        id="to"
                                        name="to"
                                        placeholder="To:"
                                        required
                                        className="km-mailbox-input form-control mb-2" // Use Bootstrap's form-control for consistent styling
                                        style={{
                                            fontSize: "0.875rem", backgroundColor: "#f0f0f0"
                                        }}
                                        value={formData.to}
                                        onChange={handleChange}
                                    />

                                    {/* Subject Field */}
                                    <input
                                        type="text"
                                        id="subject"
                                        placeholder="Subject"
                                        name="subject"
                                        required
                                        className="km-mailbox-input form-control mb-2"
                                        style={{
                                            fontSize: "0.875rem", backgroundColor: "#f0f0f0"
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

                                    {/* Message Field */}
                                    <textarea
                                        id="message"
                                        name="message"
                                        placeholder="Type message"
                                        rows="5"
                                        required
                                        className="km-mailbox-textarea form-control mb-2"
                                        style={{
                                            fontSize: "0.875rem",  // Smaller text size
                                            backgroundColor: "#f0f0f0", // Unified background color
                                            resize: "none" // Optional: prevent resizing
                                        }}
                                        value={formData.message}
                                        onChange={handleChange}
                                    ></textarea>

                                    {/* Submit Button */}
                                    <button type="submit" className="km-mailbox-submit-btn">
                                        Send
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Footer */}
            <Footer />
        </div>
    );
}

export default AdminMailBox;
