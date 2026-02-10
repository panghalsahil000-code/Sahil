const express = require('express');
const router = express.Router();

// Mock data for products
let products = [
    { id: 1, name: 'Product 1', description: 'Description of Product 1', price: 100, reviews: [] },
    { id: 2, name: 'Product 2', description: 'Description of Product 2', price: 150, reviews: [] },
];

// Get all products with filtering
router.get('/', (req, res) => {
    const { name, minPrice, maxPrice } = req.query;
    let filteredProducts = products;
    if (name) {
        filteredProducts = filteredProducts.filter(product => product.name.includes(name));
    }
    if (minPrice) {
        filteredProducts = filteredProducts.filter(product => product.price >= minPrice);
    }
    if (maxPrice) {
        filteredProducts = filteredProducts.filter(product => product.price <= maxPrice);
    }
    res.json(filteredProducts);
});

// Get single product by ID
router.get('/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);
    if (product) {
        res.json(product);
    } else {
        res.status(404).send('Product not found');
    }
});

// Create a new product
router.post('/', (req, res) => {
    const newProduct = { id: products.length + 1, ...req.body, reviews: [] };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

// Update a product
router.put('/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex >= 0) {
        products[productIndex] = { id: productId, ...req.body };
        res.json(products[productIndex]);
    } else {
        res.status(404).send('Product not found');
    }
});

// Delete a product
router.delete('/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    products = products.filter(p => p.id !== productId);
    res.status(204).send();
});

// Add a review to a product
router.post('/:id/reviews', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);
    if (product) {
        product.reviews.push(req.body);
        res.status(201).json(product);
    } else {
        res.status(404).send('Product not found');
    }
});

module.exports = router;