const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authenticateToken = require('../auth/authenticateToken');

const router = express.Router();

// Get all of the user's cart items
router.get('/', authenticateToken, async (req, res) => {
    const user_id = req.user.user_id;

    try {
        const cartItems = await prisma.cartItem.findMany({
            where: {
                product: {
                    user_id: user_id
                },
                order_id: null // Items that are not associated with an order
            },
            include: {
                product: true // Include related product details for each cart item
            }
        });
        res.json(cartItems);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart items', error: error.message });
    }
});

// Create a new cart item or update quantity if it already exists
router.post('/', authenticateToken, async (req, res) => {
    const { product_id, quantity } = req.body;

    try {
        // Fetch the product to get the price
        const product = await prisma.product.findUnique({
            where: { product_id: product_id },
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const price = product.price;

        const newCartItem = await prisma.cartItem.create({
            data: {
                product_id,
                quantity,
                price,
            },
        });

        res.status(201).json(newCartItem);
    } catch (error) {
        res.status(500).json({ message: 'Error processing cart item', error: error.message });
    }
});


// PUT route to update the quantity of a cart item
router.put('/:id', authenticateToken, async (req, res) => {
    const cart_item_id = parseInt(req.params.id);
    const { quantity } = req.body;

    try {
        const updatedCartItem = await prisma.cartItem.update({
            where: { cart_item_id },
            data: { quantity },
        });

        res.json(updatedCartItem);
    } catch (error) {
        console.error("Error updating cart item:", error);
        res.status(500).json({ message: 'Error updating cart item', error: error.message });
    }
});

// DELETE route to remove an item from the cart
router.delete('/:id', authenticateToken, async (req, res) => {
    const cart_item_id = parseInt(req.params.id);

    try {
        await prisma.cartItem.delete({
            where: { cart_item_id },
        });
        res.json({ message: 'Item removed from cart' });
    } catch (error) {
        console.error("Error removing cart item:", error);
        res.status(500).json({ message: 'Error removing cart item', error: error.message });
    }
});

module.exports = router;
