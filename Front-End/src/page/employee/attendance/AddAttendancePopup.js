import React, { useState, useEffect } from 'react';
import {toast, ToastContainer} from 'react-toastify';
import CloseButton from '../../../assets/closeButton.png';
import '../../../css/employee/attendance/AddAttendancePopup.css';
import 'react-toastify/dist/ReactToastify.css';

const AddAttendancePopup = ({ closePopup, data }) => {
    const [date, setDate] = useState('');

    const current_date = new Date();
    const currentHour = current_date.getHours();
    const currentMinute = current_date.getMinutes();

    useEffect(() => {
        // Get the current date in the Sri Lankan timezone
        const formatter = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Asia/Colombo',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });

        // Format the date
        const sriLankanDate = formatter.format(current_date);
        const [formattedDate, time] = sriLankanDate.split(", "); // Split date and time

        // Convert the formatted date into YYYY-MM-DD
        const [day, month, year] = formattedDate.split("/");
        const today = `${year}-${month}-${day}`;

        // Set the formatted date
        setDate(today);

        // Extract the hour and minute for debugging
        const [currentHour, currentMinute] = time.split(":").map(Number);

        console.log("Sri Lankan Date:", today);
        console.log("Sri Lankan Time:", currentHour, currentMinute);
    }, []); 

    const handleChange = (e) => {
        setDate(e.target.value); // Update state with selected date
    };

    const submitData = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        const name = data.Name;
        const email = data.Email;
        const employeeId = data.EmployeeID;
        console.log(name, date, email, employeeId);
        try {
            const response =  await fetch('http://localhost:5000/api/employee/addAttendance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, date, email, employeeId })
            })
            if(!response.ok) {
                const errorMessage = await response.text();
                toast.error(`Error Occurred: ${errorMessage || 'Unknown error'}`);
                return;
            } else {
                const responseData = await response.json();
                console.log(responseData);
                console.log(currentHour, currentMinute);
                if((currentHour >= 8) || (currentHour < 17)) {
                    console.log('Time Error');
                    toast.error('Cannot add attendance');
                    closePopup();
                } else {
                    console.log('No Error');
                    console.log(response);
                    console.log(responseData);
                    toast.success('Visit Confirmation Successfull!')
                    closePopup(); // Close the popup after successful submission ...
                    window.location.reload();
                }
            }
        } catch (error) {
            console.log(error);
            toast.error('A network error occurred. Please try again later.');
        }
    }

    return (
        <div className='text-white'>
            <ToastContainer className='mt-5 ekr-custom-toast-container'/>
            <div className='ekr-close-button-container'>
                    <img src={CloseButton} alt='Close' className='ekr-close-button' onClick={closePopup}/>
            </div>
            <h5 className='text-center mb-3 text-white'>Attendance</h5>
            <form className='align-content-center ekr-form'  style={{ position: 'relative' }}>
                <div className='d-flex justify-content-between align-items-start mb-3'>
                    <label htmlFor='name' className='pt-2 w-25 text-start text-white ekr-form-label'>User Name</label>
                    {/* <input type="text" placeholder='User Name' className='w-75' required onChange={(e) => setName(e.target.value)}/> */}
                    <input type="text" placeholder='User Name' className='w-75 ekr-form-input' value={data.Name}/>
                </div>
                <div className='d-flex justify-content-between mt-1 align-items-start mb-3'>
                    <label htmlFor='date-input' className='pt-2 w-25 text-start text-white ekr-form-label'>Date</label>
                    <input id="date-input" type="date" value={date} required className='w-75 ekr-date-input ekr-form-input' onChange={handleChange}/>
                </div>
                <div className='d-flex justify-content-between mt-1 align-items-start mb-3'>
                    <label htmlFor='email' className='pt-2 w-25 text-start text-white ekr-form-label'>Email</label>
                    {/* <input type="text" placeholder='Email' className='w-75' required onChange={(e) => setEmail(e.target.value)}/> */}
                    <input type="text" placeholder='Email' className='w-75 ekr-form-input' value={data.Email} required/>
                </div>
                <p className='text-center ekr-p'>
                    Attendance recorded! Thank you for visiting our employees today.
                    Your daily visits help us maintain excellent service!
                </p>
                <button type='submit' className='text-white text-center align-items-center ekr-submit-button' onClick={submitData}>
                    Confirm Visit
                </button>
            </form>
        </div>
    )
}

export default AddAttendancePopup
