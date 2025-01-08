// Utility function to format a Date object to "DD/MM/YYYY"
const formatDateToDMY = (date) => {
    if (!(date instanceof Date)) return null; // Validate input
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

// Utility function to format a Date object to "YYYY-MM-DD"
const formatDateToYMD = (date) => {
    if (!(date instanceof Date)) return null; // Validate input
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
};

// Function to validate date in "DD/MM/YYYY" format
const isDDMMYYYY = (date) => {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    return regex.test(date);
};

// Function to validate date in "DD-MM-YYYY" format
const isDDMMYYYYWithDash = (date) => {
    const regex = /^(\d{2})-(\d{2})-(\d{4})$/;
    return regex.test(date);
};

// Function to validate date in "YYYY/MM/DD" format
const isYYYYMMDDWithSlash = (date) => {
    const regex = /^(\d{4})\/(\d{2})\/(\d{2})$/;
    return regex.test(date);
};

// Function to validate date in "YYYY-MM-DD" format
const isYYYYMMDD = (date) => {
    const regex = /^(\d{4})-(\d{2})-(\d{2})$/;
    return regex.test(date);
};

// General utility to check if a date is valid based on day, month, and year
const isValidDateObject = (day, month, year) => {
    const date = new Date(`${year}-${month}-${day}`);
    return date.getDate() == day && date.getMonth() + 1 == month && date.getFullYear() == year;
};

// General utility to check if a string is a valid date
const isValidDate = (date, format = 'DD/MM/YYYY') => {
    let day, month, year;
    if (format === 'DD/MM/YYYY' && isDDMMYYYY(date)) {
        [day, month, year] = date.split('/');
    } else if (format === 'DD-MM-YYYY' && isDDMMYYYYWithDash(date)) {
        [day, month, year] = date.split('-');
    } else if (format === 'YYYY/MM/DD' && isYYYYMMDDWithSlash(date)) {
        [year, month, day] = date.split('/');
    } else if (format === 'YYYY-MM-DD' && isYYYYMMDD(date)) {
        [year, month, day] = date.split('-');
    } else {
        return false;
    }
    return isValidDateObject(day, month, year);
};

export {
    formatDateToDMY,
    formatDateToYMD,
    isDDMMYYYY,
    isDDMMYYYYWithDash,
    isYYYYMMDDWithSlash,
    isYYYYMMDD,
    isValidDateObject,
    isValidDate
};
