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


// @desc  Delete a product
// @route  DELETE /api/products/:id
// @access Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    
    if (product) {
        await product.remove(); // remove from the database
        res.json({ message: 'Product removed'})
    } else {
        res.status(404); 
        throw new Error('Product not found');
    }; 
});

// @desc  Create a product
// @route  POST /api/products
// @access Private/Admin
const createProduct = asyncHandler(async (req, res) => {
   const product = new Product({
       name: 'Sample name',
       price: 0,
       user: req.user._id,
       image: '/images/sample.jpg',
       brand: 'Sample brand',
       category: 'Sample category',
       countInStock: 0,
       numReviews: 0,
       description: 'Sample description'
   });

   const createdProduct = await product.save(); // take that product instance and save it to the database
   res.status(201).json(createdProduct); // respond with a status 201 and send back json with the product

});

// @desc  Update a product
// @route  PUT /api/products/:id
// @access Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const { name, price, description, image, brand, category, countInStock } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name; // name -> destructuring from the req.body.name
        product.price = price;
        product.description = description;
        product.image = image;
        product.brand = brand;
        product.category = category;
        product.countInStock = countInStock;

        const updatedProduct = await product.save(); // take that product instance and save it to the database
        res.json(updatedProduct); // respond with a status 201 and send back json with the product

    } else {
        res.status(404);
        throw new Error('Product not found');
    };
 
 });

export { getProducts, getProductById, deleteProduct, createProduct, updateProduct };