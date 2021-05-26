import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';

// These request handlers are known as called “controllers”. I prefer calling them request handlers because request handlers are more explicit.


// @desc  Auth user & get token
// @route  POST /api/users/login
// @access Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // res.send({ email, password }); // for testing in Postman
    const user = await User.findOne({ email: email }) // we want to find one document, by email

    // use middleware matchPassword -> if user exists and password matches (use await,since this returns a promise)
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        });
    } else {
        res.status(401) // if the user is not found, or the password do not match, than 401-unauthorized
        throw new Error("Invalid email or password");
    };
});

// @desc  Register a new user
// @route  GET /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email: email }) // we want to find one document, by email

    if (userExists) {
      res.status(400); // Bad request
      throw new Error('User already exists');
    };

    const user = await User.create({ 
        // create also saves (we don't need to implement here the middleware since it's done automatically pre save, and tha password it's going to be the encrypted )
        name,
        email,
        password
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    };

}); 


// @desc  Get user profile
// @route  GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
     // create middleware first and then: 
    const user = await User.findById(req.user._id); // req.user._id -> the current logged in user
    if (user) {
        // for the logged in user we are returning the user data:
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    };
   
    // res.send('Success'); only for testing in Postman
   
});

// @desc  Update user profile
// @route  PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
    // create middleware first and then: 
   const user = await User.findById(req.user._id); // req.user._id -> the current logged in user

   if (user) {
       // if the user is there, we are going to set:
       user.name = req.body.name || user.name;
       user.email = req.body.name || user.name;
       // check if the password is sent, than:
       if(req.body.password) {
            user.password = req.body.password; // will be encrypted automatically
       };

       const updatedUser = await user.save();

       res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser._id)
    });

   } else {
       res.status(404);
       throw new Error('User not found');
   };
  
   // res.send('Success'); only for testing in Postman
  
});


// @desc  Get all users
// @route  GET /api/users
// @access Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    // create middleware first and then: 
   const users = await User.find({}); // all users
   res.json(users);
  
});


export { authUser, registerUser, getUserProfile, updateUserProfile, getUsers };