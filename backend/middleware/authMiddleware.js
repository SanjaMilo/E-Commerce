import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';

// This is going to validate the token
const protect = asyncHandler(async (req, res, next) => {
    let token;
    // console.log(req.headers.authorization);
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        // console.log('token found');

        // here we are going to try to decode that token
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            //console.log(decoded);
            req.user = await User.findById(decoded.id).select('-password') // decoded.id is now the user's id. We don't want to return the password 

            next();

        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, no token')
        }
    };

    if(!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    };

});


const admin = (req, res, next) => {
    // check if there is a user logged in and if that user is the admin
    if (req.user && req.user.isAdmin) {
        next(); // then call next and move on
    } else {
        // we gonna set
        res.status(401) // not authorized
        throw new Error('Not authorized as an Admin');
    }
};

export { protect, admin };