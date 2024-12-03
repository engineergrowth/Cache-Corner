const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authenticateToken = require('../auth/authenticateToken');
const cloudinary = require('cloudinary').v2;
const productsRouter = express.Router();
const prisma = new PrismaClient();

// GET all products
productsRouter.get('/', async (req, res) => {
    try {
        const products = await prisma.product.findMany();
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

// GET a single product by ID
productsRouter.get('/:id', async (req, res) => {
    const productId = parseInt(req.params.id);
    try {
        const product = await prisma.product.findUnique({
            where: { product_id: productId }
        });
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

// POST a new product
productsRouter.post('/', authenticateToken, async (req, res) => {
    const { title, description, price, category } = req.body;
    const imageFile = req.files?.image;

    try {
        let imageUrl = '';
        if (imageFile) {
            const result = await cloudinary.uploader.upload(imageFile.tempFilePath, {
                resource_type: 'auto'
            });
            imageUrl = result.url;
        }

        const newProduct = await prisma.product.create({
            data: {
                title,
                description,
                price: parseFloat(price),
                image_url: imageUrl,
                is_available: true,
                user_id: req.user.user_id,
                category
            }
        });

        res.status(201).json(newProduct);
    } catch (err) {
        console.error("Error creating product:", err);
        res.status(500).send(err.message);
    }
});

// PUT to update a product
productsRouter.put('/:id', authenticateToken, async (req, res) => {
    const productId = parseInt(req.params.id);
    const updateData = req.body;

    try {
        const updatedProduct = await prisma.product.update({
            where: { product_id: productId },
            data: updateData
        });

        res.json(updatedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

// DELETE a product
productsRouter.delete('/:id', authenticateToken, async (req, res) => {
    const productId = parseInt(req.params.id);

    try {
        await prisma.product.delete({
            where: { product_id: productId }
        });

        res.status(204).send('Product deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

module.exports = productsRouter;
