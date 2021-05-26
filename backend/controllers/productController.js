import Product from '../models/productModel.js';
import asyncHandler from 'express-async-handler';

// These request handlers are known as called “controllers”. I prefer calling them request handlers because request handlers are more explicit.


// @desc  Fetch all products
// @route  GET /api/products
// @access Public
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}); 
    res.json(products);
});

// @desc  Fetch single product
// @route  GET /api/products/:id
// @access Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    // custom error handler 
    if (product) {
        res.json(product);
    } else {
        res.status(404); //  by default is 500
        throw new Error('Product not found');
    }; 
});

export { getProducts, getProductById };