// ES6 modules (js files must end with .js !) instead of CommonJS modules
import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors'; 
import connectDB from './config/db.js';
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

// mount it here: (end point)
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

//  PAYPAL LINK: https://developer.paypal.com/developer/applications
// <script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID"></script>
app.get('/api/config/paypal', (req, res) => res.send(process.env.PAYPAL_CLIENT_ID))

// to make the folder uploads (from frontend) accessible by default, so we need to make it a static folder so that it can be loaded in the browser
// path.join -> join different segments of files
// __dirname will point to the current directory, and this will not be available if we use ES6 modules, but only if we use commonJS modules ('require' syntax), but we can mimic that with path.resolve()
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads'))); 

// after build: if we are in production, we are setting /frontend/build folder as static
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/build')));
    // create a route ('*' -> anything that isn't any of the above /api routes) and point to the index.html file in the build folder
    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html')))

} else {
    app.get('/', (req, res) => {
        res.send('API is running...')
    });
}

// imported from file errorMiddleware.js
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000

// app.listen(5000, console.log('Server running on port 5000'));

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)); // added color yellow from colors 


