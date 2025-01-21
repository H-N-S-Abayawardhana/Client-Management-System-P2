import React, { useState, useEffect } from 'react';
import '../css/signin.css';
import Navbar from '../components/templetes/MainNav';
import Footer from '../components/templetes/Footer';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import image from '../assets/Rectangle 1965.png';

function Signin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedValue, setSelectedValue] = useState('');
    const navigate = useNavigate();

    // Backend URL
    const backendURL = 'https://client-management-system-p2-gzspdw.fly.dev/api/auth/login';

    useEffect(() => {
        // Redirect if the user is already logged in
        const token = localStorage.getItem('token');
        const userType = localStorage.getItem('type');

        if (token) {
            if (userType === 'Admin') {
                navigate('/admin-dashboard');
            } else if (userType === 'Employee') {
                navigate('/employee-dashboard');
            }
        }
    }, [navigate]);

    const handleChange = (e) => {
        setSelectedValue(e.target.value);
    };

    const handleSignIn = async (e) => {
        e.preventDefault();

        if (!selectedValue) {
            toast.error('Please select a user type.');
            return;
        }

        if (!email || !password) {
            toast.error('Email and password are required.');
            return;
        }

        try {
            const response = await fetch(backendURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, userType: selectedValue }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);

                // Save token and user data in local storage
                localStorage.setItem('token', data.token);
                localStorage.setItem('email', email);
                localStorage.setItem('type', selectedValue);

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
            toast.error('An error occurred. Please try again.');
        }
    };

    return (
        <div className="nu-signin-page-container">
            <Navbar />
            <div className="nu-signin-container">
                <main className="nu-signin-main">
                    <div className="nu-signin-card">
                        <div className="nu-signin-form">
                            <h2>Sign In</h2>
                            <form onSubmit={handleSignIn}>
                                <select
                                    name="dropdown"
                                    value={selectedValue}
                                    onChange={handleChange}
                                    required
                                >
                                    <option className="nu-signin-usertype-select" value="" disabled>
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
                                <a href="/forgot-password" className="nu-signin-forgot-link">
                                    Forgot password?
                                </a>
                                <button type="submit" className="nu-signin-button">
                                    SIGN IN
                                </button>
                            </form>
                        </div>
                        <div className="nu-signin-image">
                            <img src={image} alt="Meeting" />
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
            <ToastContainer />
        </div>
    );
}

export default Signin;
