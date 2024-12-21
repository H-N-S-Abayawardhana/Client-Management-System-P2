import React, { useState } from 'react';
import '../css/signin.css';
import Navbar from '../components/templetes/MainNav';
import Footer from '../components/templetes/Footer';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import image from '../assets/Rectangle 1965.png';

function Signin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [selectedValue, setSelectedValue] = useState('');
    const navigate = useNavigate(); // for navigation

    const handleChange = (e) => {
        setSelectedValue(e.target.value);
    };

    // Handle sign-in form submission
    const handleSignIn = async (e) => {
        e.preventDefault();

        if (!selectedValue) {
            toast.error("Please select a user type.");
            return;
        }

        if (!email || !password) {
            toast.error("Email and password are required.");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    userType: selectedValue,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);

                // Save token to local storage
                localStorage.setItem('token', data.token);

                // Redirect based on user type
                if (selectedValue === 'Admin') {
                    navigate('/admin-dashboard');
                } else if (selectedValue === 'Employee') {
                    navigate('/employee-dashboard');
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred. Please try again.");
        }
    };

    return (
        <div className="page-container">
            <Navbar />
            <div className="signin-container">
                <main className="signin-main">
                    <div className="signin-card">
                        <div className="signin-form">
                            <h2>Sign In</h2>
                            <form onSubmit={handleSignIn}>
                                <select
                                    name="dropdown"
                                    value={selectedValue}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled style={{ color: '#aaa' }}>
                                        User Type
                                    </option>
                                    <option value="Admin">Admin</option>
                                    <option value="Employee">Employee</option>
                                </select>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <a href="/forgot-password" className="forgot-link">
                                    Forgot password?
                                </a>
                                <button type="submit" className="signin-button">
                                    SIGN IN
                                </button>
                            </form>
                        </div>
                        <div className="signin-image">
                            <img src={image} alt="Meeting" />
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
            {/* Toast notification container */}
            <ToastContainer />
        </div>
    );
}

export default Signin;
