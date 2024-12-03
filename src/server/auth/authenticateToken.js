const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    // Extract the token from the Authorization header
    const token = authHeader && authHeader.split(' ')[1]; // Correctly extracts the token

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifies the token

        const user = await prisma.user.findFirst({
            where: {
                user_id: decoded.user_id
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {

        return res.status(403).json({ message: 'Invalid token', error: error.message });
    }
}

module.exports = authenticateToken;