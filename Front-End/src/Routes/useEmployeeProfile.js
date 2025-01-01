//this is used to get the perticuler loged in Employee is EmployeeID
import { useEffect, useState } from 'react';
import axios from 'axios';

const useEmployeeProfile = () => {
  const [employeeID, setEmployeeID] = useState(null);

  useEffect(() => {
    const fetchEmployeeID = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/employee/current/profile');
        setEmployeeID(response.data.EmployeeID);
        //console.error('thi is the current logedin EmployeeID = ', response.data.EmployeeID); //display the employeeID in browser console
      } catch (error) {
        console.error('Error fetching EmployeeID:', error);
      }
    };
    fetchEmployeeID();
  }, []);

  return employeeID; //return the EmployeeID
};

export default useEmployeeProfile;
