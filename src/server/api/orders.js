const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authenticateToken = require('../auth/authenticateToken');
const router = express.Router();

// GET a single order by ID including its cart items
router.get('/:id', authenticateToken, async (req, res, next) => {
    const id = parseInt(req.params.id);
    try {
        const order = await prisma.order.findUnique({
            where: { order_id: id },
            include: { cartItems: { include: { product: true } } }
        });
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error(error.message);
        next(error);
    }
});


// POST route to create a new order
router.post('/', authenticateToken, async (req, res, next) => {
    // Extract user_id from the authenticated user
    const user_id = req.user.user_id;

    try {
        // Start a transaction
        const result = await prisma.$transaction(async (prisma) => {
            // Create a new order with initial total amount set to 0 and is_open set to true
            const newOrder = await prisma.order.create({
                data: { user_id, total_amount: 0, is_open: true },
            });

            // Retrieve cart items for the user that are not yet associated with an order
            const cartItems = await prisma.cartItem.findMany({
                where: {
                    order_id: null,
                    product: {
                        user_id: user_id
                    }
                },
                include: {
                    product: true // Include related product details for each cart item
                }
            });

            // Calculate the total amount for the order and update each cart item to associate it with the new order
            let totalAmount = 0;
            for (const item of cartItems) {
                totalAmount += item.quantity * item.product.price;
                await prisma.cartItem.update({
                    where: { cart_item_id: item.cart_item_id },
                    data: { order_id: newOrder.order_id } // Associate cart item with the new order
                });
            }

            // Update the total amount of the new order and return the updated order details
            return prisma.order.update({
                where: { order_id: newOrder.order_id },
                data: { total_amount: totalAmount }
            });
        });

        // Send the result as the response
        res.status(201).json(result);
    } catch (error) {
        console.error(error.message);
        next(error); // Pass the error to the next middleware (error handler)
    }
});

module.exports = router;


// Update an order
router.put('/:id', authenticateToken, async (req, res, next) => {
    const id = parseInt(req.params.id);
    const { is_open } = req.body; // Allow updating 'is_open'
    try {
        const updatedOrder = await prisma.order.update({
            where: { order_id: id },
            data: { is_open },
        });
        res.json(updatedOrder);
    } catch (error) {
        console.error(error.message);
        next(error);
    }
});

// Delete an order
router.delete('/:id', authenticateToken, async (req, res, next) => {
    const id = parseInt(req.params.id);
    try {
        await prisma.order.delete({
            where: { order_id: id },
        });
        res.json({ message: 'Order deleted' });
    } catch (error) {
        console.error(error.message);
        next(error);
    }
});

module.exports = router;