// import express from 'express';
// import Product from '../models/productModel.js';
// import asyncHandler from 'express-async-handler'; // Simple middleware for handling exceptions inside of async express routes and passing them to your express error handlers.

// const router = express.Router();

// // @desc  Fetch all products
// // @route  GET /api/products
// // @access Public
// router.get('/', asyncHandler( async (req, res) => {
//     const products = await Product.find({}); 
//     // passing an empty object into find() method gives us everything. Every time we use Mongoose method, it returns a Promise, so use async and await (and we wrap it in asyncHandler for the purpose of not using try - catch)

//     // to test error messages
//     // res.status(401);
//     //  throw new Error('Not Authorized');

//     res.json(products);
// }));

// // @desc  Fetch single product
// // @route  GET /api/products/:id
// // @access Public
// router.get('/:id', asyncHandler( async (req, res) => {
//     const product = await Product.findById(req.params.id)

//     // custom error handler 
//     if (product) {
//         res.json(product);
//     } else {
//         // 404 -> OVA ELSE NE RABOTI, PO DEFAULT DAVA ERROR 500
//         // res.status(404).json({ message: 'Product not found'});
        
//         res.status(404); // if we delete this, by default will be 500
//         throw new Error('Product not found');
//     }; 
// }));

// export default router;



// The above is changed by creating the controllers/productController, and now it is like these below: 

import express from 'express';
import { getProducts, getProductById, deleteProduct, createProduct, updateProduct, createProductReview, getTopProducts } from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// hook on: /api/products
router.route('/').get(getProducts).post(protect, admin, createProduct);
router.route('/:id/reviews').post(protect, createProductReview);
router.get('/top', getTopProducts); 
router.route('/:id').get(getProductById).delete(protect, admin, deleteProduct).put(protect, admin, updateProduct);

export default router;