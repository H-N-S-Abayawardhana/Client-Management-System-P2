import React, { useState } from 'react';
import Navbar from '../components/templetes/adminNavBar';
import Footer from '../components/templetes/Footer';
import '../css/contactus.css';
import contactBgImage from '../assets/contactusbg.jpeg';
import axios from 'axios';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResponseMessage({ text: '', type: '' });

    try {
      const response = await axios.post('http://localhost:8800/api/sendMail', formData);
      
      if (response.status === 200) {
        setResponseMessage({ 
          text: 'Message sent successfully!', 
          type: 'success' 
        });
        // Clear form after successful submission
        setFormData({
          fullName: '',
          email: '',
          message: ''
        });
      }
    } catch (error) {
      setResponseMessage({ 
        text: error.response?.data?.message || 'Failed to send message. Please try again.', 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="nu-contact-page">
      <Navbar />
      
      <div className="nu-contact-container">
        <div className="nu-contact-content">
          <div className="nu-image-section">
            <img src={contactBgImage} alt="Workspace with laptop" />
          </div>
          
          <div className="nu-form-section">
            <h1>Contact US</h1>
            
            <form onSubmit={handleSubmit}>
              <div className="nu-form-group">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="nu-form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="nu-form-group">
                <textarea
                  name="message"
                  placeholder="Message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              {responseMessage.text && (
                <div className={`message ${responseMessage.type}`}>
                  {responseMessage.text}
                </div>
              )}
              
              <button 
                type="submit" 
                className="nu-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send'}
              </button>
            </form>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ContactUs;