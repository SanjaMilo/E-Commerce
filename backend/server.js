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
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

connectDB();

const app = express();

app.get('/', (req, res) => {
    res.send('API is running...')
});

app.use('/api/products', productRoutes);


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

// imported from file errorMiddleware.js
app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT || 5000

// app.listen(5000, console.log('Server running on port 5000'));

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)); // added color yellow from colors 


