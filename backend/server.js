// CommonJS modules
// const express = require('express') 
// const dotenv = require('dotenv');
// const products = require('./data/products'); 

// ES6 modules (js files must end with .js !)
import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors'; 
import connectDB from './config/db.js';
// import products from './data/products.js'; 
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import path from 'path'; // path is a node.js module to work with file paths
import morgan from 'morgan';

dotenv.config();

connectDB();

const app = express();

// morgan (run it only in development mode)
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
};

app.use(express.json()); // (body parser) this will allow us to accept json data in body, req.body to parse

app.get('/', (req, res) => {
    res.send('API is running...')
});

// mount it here: (end point)
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

//  PAYPAL LINK: https://developer.paypal.com/developer/applications
// <script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID"></script>
app.get('/api/config/paypal', (req, res) => res.send(process.env.PAYPAL_CLIENT_ID))

// these 2 routes are placed into the file productRoutes.js in folder routes
// app.get('/api/products', (req, res) => {
//     res.json(products);
// });

// app.get('/api/products/:id', (req, res) => {
//     const product = products.find(p => p._id == req.params.id)
//     res.json(product)
// });


//error middleware (to override the default error handler) -> moved to middleware / errorMiddleware.js 
// app.use( (req, res, next) => {
//     const error = new Error(`Not Found - ${req.originalUrl}`);
//     res.status(404);
//     next(error);
// });

// app.use( (err, req, res, next) => {
//     const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
//     res.status(statusCode);
//     res.json({
//         message: err.message,
//         stack: process.env.NODE_ENV === 'production' ? null : err.stack
//     })
// });


// IMPORTANT! This app.use('/uploads' ....) must be defined before app.use(notFound) and app.use(errorHandler) ! 
// to make the folder uploads (from frontend) accessible by default, so we need to make it a static folder so that it can be loaded in the browser
// path.join -> join different segments of files
// __dirname will point to the current directory, and this will not be available if we use ES6 modules, but only if we use commonJS modules ('require' syntax), but we can mimic that with path.resolve()
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads'))); 

// imported from file errorMiddleware.js
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000

// app.listen(5000, console.log('Server running on port 5000'));

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)); // added color yellow from colors 


