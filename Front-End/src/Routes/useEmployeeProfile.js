import { useEffect, useState } from 'react';

const useEmployeeProfile = () => {
  const [employeeID, setEmployeeID] = useState(null);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email");

        // Check if email or token is missing
        if (!email || !token) {
          console.error("Missing email or token in localStorage.");
          return;
        }

        const response = await fetch(`http://localhost:5000/api/employee/employee/profile/${email}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        // Check if the response is OK
        if (!response.ok) {
          console.error("Failed to fetch employee data:", response.status, response.statusText);
          return;
        }

        const data = await response.json(); // Parse the response JSON
        setEmployeeID(data.EmployeeID);
      } catch (error) {
        console.error("Error fetching EmployeeID:", error);
      }
    };

    fetchEmployeeData();
  }, []); // No dependencies as we are fetching on mount only

  return employeeID; // Return the EmployeeID
};

export default useEmployeeProfile;
