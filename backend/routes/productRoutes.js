import express from 'express';
import Product from '../models/productModel.js';
import asyncHandler from 'express-async-handler';

const router = express.Router();

// @desc  Fetch all products
// @route  GET /api/products
// @access Public
router.get('/', asyncHandler( async (req, res) => {
    const products = await Product.find({}); 
    // passing an empty object into find() method gives us everything. Every time we use Mongoose method, it returns a Promise, so use async and await

    // to test error messages
    // res.status(401);
    //  throw new Error('Not Authorized');

    res.json(products);
}));

// @desc  Fetch single product
// @route  GET /api/products/:id
// @access Public
router.get('/:id', asyncHandler( async (req, res) => {
    const product = await Product.findById(req.params.id)

    // custom error handler 
    if (product) {
        res.json(product);
    } else {
        // 404 -> OVA ELSE NE RABOTI, PO DEFAULT DAVA ERROR 500
        // res.status(404).json({ message: 'Product not found'});
        
        res.status(404); // if we delete this, by default will be 500
        throw new Error('Product not found');
    }; 
}));

export default router;