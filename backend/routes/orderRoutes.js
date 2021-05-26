import express from 'express';
import { addOrderItems, getOrderById, updateOrderToPaid, getMyOrders } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// hook on: /api/orders
router.route('/').post(protect,  addOrderItems);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById); // make sure that this is at the bottom, after ('/')
router.route('/:id/pay').put(protect, updateOrderToPaid);

export default router;