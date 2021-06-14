import Order from '../models/orderModel.js';
import asyncHandler from 'express-async-handler';

// These request handlers are known as called “controllers”. I prefer calling them request handlers because request handlers are more explicit.


// @desc  Create new order
// @route  POST /api/orders
// @access Private
const addOrderItems = asyncHandler(async (req, res) => {
    // destructuring req.body: 
    //orderItems is an array of order items that get send
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

    // make sure that the orderItems array that comes in, is not empty:
    if (orderItems && orderItems.length === 0) {
        req.statusCode(400) // bad request
        throw new Error('No order items');
        return
    } else {
        // we want to create new order in the database:
        const order = new Order({
            orderItems, 
            user: req.user._id,
            // we want to attach the logged in user to this (this is going to be a protected route, and we will be able to get the token and the user id from the token)
            shippingAddress, 
            paymentMethod, 
            itemsPrice, 
            taxPrice, 
            shippingPrice, 
            totalPrice
        });

        // to save the created order in the database
        const createdOrder =  await order.save();
        res.status(201).json(createdOrder);
    };
   
});


// @desc  Get Order by ID
// @route  GET /api/orders/:id
// @access Private
const getOrderById = asyncHandler(async (req, res) => {
    // get the id from the URL (req.params.id). In addition to the order information, we want the user's name and email that is associated with this order -> .populate('user', 'name email')
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
        res.json(order);
    } else {
        res.status(404);
        throw new Error("Order not found");
    }
   
});


// @desc  Update order to Paid
// @route  GET /api/orders/:id/pay
// @access Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
    // get the id from the URL (req.params.id). In addition to the order information, we want the user's name and email that is associated with this order -> .populate('user', 'name email')
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true; // set it to true, by default is false
        order.paidAt = Date.now(); // set time of the payment 
        order.paymentResult = {
            //this is coming from PayPal response 
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address
        } 
        // now save those properties of the order, in a variable in the database:
        const updatedOrder = await order.save();
        // send back the updatedOrder
        res.json(updatedOrder);

    } else {
        res.status(404);
        throw new Error("Order not found");
    }
   
});


// @desc  Update order to Delivered (Up for Delivery)
// @route  GET /api/orders/:id/deliver
// @access Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    // get the id from the URL (req.params.id). In addition to the order information, we want the user's name and email that is associated with this order -> .populate('user', 'name email')
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isDelivered = true; // set it to true, by default is false
        order.deliveredAt = Date.now(); // set time of the delivery  
        // now save those properties of the order, in a variable in the database:
        const updatedOrder = await order.save();
        // send back the updatedOrder
        res.json(updatedOrder);

    } else {
        res.status(404);
        throw new Error("Order not found");
    }
   
});


// @desc  Get logged in user orders (my orders, on profile screen)
// @route  GET /api/orders/myorders
// @access Private
const getMyOrders = asyncHandler(async (req, res) => {
    // find orders where the user is the logged in user 
    const orders = await Order.find({ user: req.user._id});
    res.json(orders);
});


// @desc  Get all orders
// @route  GET /api/orders
// @access Private/Admin
const getOrders = asyncHandler(async (req, res) => {
    // find orders where the user is the logged in user 
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
});


export { addOrderItems, getOrderById, updateOrderToPaid, updateOrderToDelivered, getMyOrders, getOrders };

