import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from "../../../components/templetes/SideBar";
import Navbar from "../../../components/templetes/adminNavBar";
import Footer from "../../../components/PagesFooter";
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
        setIsLoading(true);
        
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
            } else {
                const errorData = await response.json();
                toast.error(`❌ Failed to send email: ${errorData.message}`, {
                    position: "top-right",
                    autoClose: 4000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
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
            <button className="sidebar-toggle" onClick={toggleSidebar}>
                ☰
            </button>
            <div className={`flex-grow-1 d-flex`}>
                <div className={`ekr-sidebar-container ${sidebarVisible ? 'show-sidebar' : ''}`} style={{ flexShrink: 0 }}>
                    <Sidebar sidebarVisible={sidebarVisible} />
                </div>

                <div className="ekr-content-container flex-grow-1 p-4" style={{
                    height: "100vh",
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column"
                }}>
                    <h5 className="mt-5">
                        Home / <span style={{ color: "#24757E" }}>Mail-Box</span>
                    </h5>

                    <div className="card ekr-card-container-height border-0">
                        <div className="card-body">
                            <h4 className="ekr-employee-attendance-page-title text-center" style={{ color: "#24757E" }}>Admin Mail Box</h4>

                            <div className="mailbox-container">
                                <form onSubmit={handleSubmit}>
                                    <h6 className="text-start fw-bold mb-2">Send Email</h6>

                                    <input
                                        type="email"
                                        id="to"
                                        name="to"
                                        placeholder="To:"
                                        required
                                        className="mailbox-input form-control mb-2"
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
                                        className="mailbox-input form-control mb-2"
                                        style={{
                                            fontSize: "0.875rem",
                                            backgroundColor: "#f0f0f0"
                                        }}
                                        value={formData.subject}
                                        onChange={handleChange}
                                    />

                                    <div className="attachment-container">
                                        <label className="attachment-label d-flex align-items-center">
                                            <i className="fas fa-paperclip me-2"></i>
                                            <span className="file-name me-2">
                                                {formData?.attachment?.name || "No file selected"}
                                            </span>
                                            <input 
                                                type="file"
                                                className="file-input"
                                                name="attachment"
                                                onChange={handleAttachmentChange}
                                            />
                                        </label>
                                    </div>

                                    <textarea
                                        id="message"
                                        name="message"
                                        placeholder="Type message"
                                        rows="5"
                                        required
                                        className="mailbox-textarea form-control mb-2"
                                        style={{
                                            fontSize: "0.875rem",
                                            backgroundColor: "#f0f0f0",
                                            resize: "none"
                                        }}
                                        value={formData.message}
                                        onChange={handleChange}
                                    ></textarea>

                                    <button 
                                        type="submit" 
                                        className="mailbox-submit-btn"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Sending...' : 'Send'}
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

export default AdminMailBox;