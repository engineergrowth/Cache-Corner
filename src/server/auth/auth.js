const express = require('express');
const { PrismaClient } =require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();
const prisma = new PrismaClient();

const saltRounds = 12;

router.post('/register', async (req, res, next) => {
    const { password, email, phone, first_name, last_name, address, addressLine2, city, state, zip } = req.body;

    try {
        // Check if a user with the given email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: email },
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // If no existing user is found, proceed with creating a new user
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = await prisma.user.create({
            data: {
                password: hashedPassword,
                email,
                phone,
                first_name,
                last_name,
                address,
                addressLine2,
                city,
                state,
                zip
            },
        });

        // Create a JWT token for the new user
        const token = jwt.sign({ user_id: newUser.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send the token and the user_id in the response
        res.status(201).json({ token, user_id: newUser.user_id.toString() }); // Include user_id in the response
    } catch (error) {
        console.error(error.message);
        next(error);
    }
});


router.post('/login', async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: { email: email }, // Replace 'email' with 'username' if 'username' is unique
        });

        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token, user });
        } else {
            res.status(401).json({ message: 'Invalid email or password' }); // Adjust the message as per your field used for login
        }
    } catch (error) {
        console.error(error.message);
        next(error);
    }
});


module.exports = router;