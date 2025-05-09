import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from "../../../components/templetes/SideBar";
import Navbar from "../../../components/templetes/adminNavBar";
import Footer from '../../../components/templetes/Footer';
import '../../../css/MailBox.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminMailBox = () => {
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [formData, setFormData] = useState({
        to: "",
        subject: "",
        message: "",
        attachment: null,
    });

    const [isLoading, setIsLoading] = useState(false);
    const API_URL = process.env.REACT_APP_API_URL ;
    
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

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if(formData.to === "") {
            toast.error('Please enter the recipient email address');
            setIsLoading(false);
            return;
        }

        if(formData.subject === "") {
            toast.error('Please enter a subject for the email');
            setIsLoading(false);
            return;
        }

        if(formData.message === "") {
            toast.error('Please enter the message to send');
            setIsLoading(false);
            return;
        }

        if(!validateEmail(formData.to)) {
            toast.error('Please enter a valid email address');
            setIsLoading(false);
            return;
        }
        
        const formDataToSend = new FormData();
        formDataToSend.append("to", formData.to);
        formDataToSend.append("subject", formData.subject);
        formDataToSend.append("message", formData.message);
        if (formData.attachment) {
            formDataToSend.append("attachment", formData.attachment);
        }
    
        try {
            const response = await fetch(`${API_URL}/api/email/send-email`, {
                method: 'POST',
                body: formDataToSend,
                credentials: 'include',
            });
            console.log(response);
            console.log(response.status);
    
            if (!response.ok) {
                const errorData = await response.json();
                console.log(`Failed: ${errorData.message || 'Unknown error'}`);
                toast.error('❌ Failed to send email', `${errorData.message}`);
                return;
            }
        
            const data = await response.json(); // Parse response JSON
            console.log('Server Response:', data);
            toast.success('🚀 Email sent successfully!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        
            setFormData({ to: '', subject: '', message: '', attachment: null }); // Reset form
            return;
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('❌ Network error: Failed to send email', {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } finally {
            setIsLoading(false);
        }
    }; 

    return (
        <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                limit={3}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <Navbar />

            <div className={`flex-grow-1 d-flex`}>
                <div className={`km-sidebar-container ${sidebarVisible ? 'show-sidebar' : ''}`} style={{ flexShrink: 0 }}>
                    <Sidebar sidebarVisible={sidebarVisible} />
                </div>

                {/* Content Container */}
                <div className="km-content-container flex-grow-1 p-4" style={{
                    overflowY: "auto",         // Enable scrolling for the entire DOM
                    display: "flex",           // Flex layout for content flow
                    flexDirection: "column"    // Stack children vertically
                }}>
                    <h5 className="mt-5 km-breadcrumb-text">
                        Home / <span style={{ color: "#24757E" }}>Mail-Box</span>
                    </h5>

                    <div className="card km-card-container-height border-0">
                        <div className="card-body">
                            <h4 className="km-employee-attendance-page-title text-center" style={{ color: "#24757E" }}>Mail-Box</h4>

                            <div className="km-mailbox-container">
                                <form className='km-form'>
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
                                        className="km-mailbox-input form-control mb-2 me-2"
                                        style={{
                                            fontSize: "0.875rem",
                                            backgroundColor: "#f0f0f0"
                                        }}
                                        value={formData.subject}
                                        onChange={handleChange}
                                    />

                                    {/* Attachment Field */}
                                    <div className="km-attachment-container">
                                        <label className="km-attachment-label d-flex align-items-center me-2">
                                            <i className="fas fa-paperclip me-4"></i>
                                            <span className="km-file-name me-2">{formData?.attachment?.name || "No file selected"}</span>
                                            <input type="file" className="km-file-input rounded-sm" name="attachment" onChange={handleAttachmentChange}/>
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
                                    <button type="submit" className="km-mailbox-submit-btn mb-3" disabled={isLoading} onClick={handleSubmit}>
                                        {isLoading ? (
                                            <span className="km-spinner"></span> // Spinner
                                            ) : (
                                            'Send'
                                        )}
                                    </button>
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

export default AdminMailBox;