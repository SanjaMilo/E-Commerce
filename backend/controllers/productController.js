import Product from '../models/productModel.js';
import asyncHandler from 'express-async-handler';

// These request handlers are known as called “controllers”. I prefer calling them request handlers because request handlers are more explicit.


// @desc  Fetch all products
// @route  GET /api/products
// @access Public
const getProducts = asyncHandler(async (req, res) => {
    // pagination
    const pageSize = 4; // set the number of products per page
    const page = Number(req.query.pageNumber) || 1;  // set the current page -> what page in the query is. Or 1, if that is not there, it will always be page 1 

    // req.query -> we can get query strings from url (whatever is after the ? question mark) 
    const keyword = req.query.keyword ? {
        // we want to match the keyword to the name of the product
        name: {
            $regex: req.query.keyword, // regex -> regular expression (we don't want to put the exact name of the product in the search box)
            $options: 'i' // 'i' -> case insensitive
        }
    } : {}

    // get the total count of products, before we get the products
    const count = await Product.countDocuments({...keyword});
    // const products = await Product.find({}); // first
    // const products = await Product.find({...keyword}); // second, search by keyword added
    const products = await Product.find({...keyword}).limit(pageSize).skip(pageSize * (page - 1)); // third, pagination added 

    // res.json(products); // first (and we can perform the method map(), and loop through products)
    res.json({ products, page, pages: Math.ceil(count / pageSize) }); // after adding pagination, in addition to products, we want to return the current page and the number of pages. But, now we cannot perform the method map(), through products, since now we are returning an object with multiple properties). Go to frontend and make changes! (productActions, productReducers)
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


// @desc  Create new review
// @route  POST /api/products/:id/reviews
// @access Private
const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
       // check if the user already reviewed the product (find from the array of reviews if the related user -> from the model schema, equals to the logged in user)
       const alreadyReviewed = product.reviews.find(review => review.user.toString() === req.user._id.toString());

       if(alreadyReviewed) {
        res.status(400);
        throw new Error('Product already reviewed');
       };
       // construct a review object:
       const review = {
           name: req.user.name, // logged in user's name
           rating: Number(rating), // from the req.body that we destructured 
           comment, // from the req.body that we destructured
           user: req.user._id
       };
       // push the new created review to the array of reviews
       product.reviews.push(review);
       // and we want to update
       product.numReviews = product.reviews.length;
       product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

       await product.save(); // added to the database
       res.status(201).json({ message: 'Review added' })

    } else {
        res.status(404);
        throw new Error('Product not found');
    };
 
 });


// @desc  Get Top rated products
// @route  GET /api/products/top
// @access Public
const getTopProducts = asyncHandler(async(req, res) => {
    // sort the products in descending order, by rating (Node.js MongoDB sort() method takes one parameter, an object defining the sorting order. For example { name: 1 } -> ascending  and { name: -1 } -> descending)
    const products = await Product.find({}).sort({ rating: -1 }).limit(4);

    res.json(products);
});


export { getProducts, getProductById, deleteProduct, createProduct, updateProduct, createProductReview, getTopProducts };