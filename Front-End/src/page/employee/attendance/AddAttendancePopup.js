import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import CloseButton from '../../../assets/closeButton.png';
import '../../../css/employee/attendance/AddAttendancePopup.css';
import 'react-toastify/dist/ReactToastify.css';

const AddAttendancePopup = ({ closePopup }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [employeeID, setEmployeeID] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

  useEffect(() => {
    setDate(currentDate); // Set current date as default

    // Fetch employee name and email from the backend
    fetch('http://localhost:5000/api/employee/current/profile')
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401) {
            // Handle unauthorized access
            throw new Error('Unauthorized access. Please login again.');
          }
          throw new Error('Failed to fetch employee data.');
        }
        return response.json();
      })
      .then((data) => {
        setName(data.Name || '');
        setEmail(data.Email || '');
        setEmployeeID(data.EmployeeID || '');
      })
      .catch((err) => {
        console.error('Error fetching employee data:', err);
        setError('Unable to fetch employee details. Please try again later.');
      });
  }, []);

  const handleChange = (e) => {
    setDate(e.target.value);
  };

  const submitData = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/employee/addAttendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, date, employeeID }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        toast.error(`Error: ${errorMessage || 'Failed to record attendance.'}`);
        return;
      }

      toast.success('Attendance recorded successfully!');
      closePopup();
    } catch (err) {
      console.error('Error submitting attendance:', err);
      toast.error('Network error occurred. Please try again later.');
    }
  };

  return (
    <div className='text-white'>
      <ToastContainer className='mt-5 ekr-custom-toast-container' />
      <div className='ekr-close-button-container'>
        <img src={CloseButton} alt='Close' className='ekr-close-button' onClick={closePopup} />
      </div>
      <h5 className='text-center mb-3 text-white'>Attendance</h5>
      {error ? (
        <p className='text-danger text-center'>{error}</p>
      ) : (
        <form className='align-content-center ekr-form' onSubmit={submitData}>
          <div className='d-flex justify-content-between align-items-start mb-3'>
            <label htmlFor='name' className='pt-2 w-25 text-start text-white ekr-form-label'>User Name</label>
            <input
              type='text'
              id='name'
              value={name}
              className='w-75 ekr-form-input'
              readOnly
            />
          </div>
          <div className='d-flex justify-content-between mt-1 align-items-start mb-3'>
            <label htmlFor='date-input' className='pt-2 w-25 text-start text-white ekr-form-label'>Date</label>
            <input
              id='date-input'
              type='date'
              value={date}
              className='w-75 ekr-date-input ekr-form-input'
              onChange={handleChange}
              required
            />
          </div>
          <div className='d-flex justify-content-between mt-1 align-items-start mb-3'>
            <label htmlFor='email' className='pt-2 w-25 text-start text-white ekr-form-label'>Email</label>
            <input
              type='email'
              id='email'
              value={email}
              className='w-75 ekr-form-input'
              readOnly
            />
          </div>
          <button type='submit' className='text-white text-center align-items-center ekr-submit-button'>
            Confirm Visit
          </button>
        </form>
      )}
    </div>
  );
};

export default AddAttendancePopup;
