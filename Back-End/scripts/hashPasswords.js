import bcrypt from 'bcryptjs';

const generateHash = async (password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(`Plain Password: ${password}`);
    console.log(`Hashed Password: ${hashedPassword}`);
};

// Example passwords
await generateHash('admin123');    // Admin password
await generateHash('employee123'); // Employee password

