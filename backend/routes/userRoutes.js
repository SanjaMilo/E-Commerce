import express from 'express';
import { authUser, registerUser, getUserProfile, updateUserProfile, getUsers } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// hook on: /api/users 
router.route('/').post(registerUser).get(protect, admin, getUsers);
router.post('/login', authUser); // '/login' is going to be hooks on: '/api/users/' like so: '/api/users/login'
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile); // we want to protect getUserProfile. To implement middleware, we put it as a first argument (protect, ) , and it's going to run every time we hit this route

export default router;