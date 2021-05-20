import mongoose from 'mongoose';

const orderSchema = mongoose.Schema( {
    user: {
        type: mongoose.Schema.Types.ObjectId, // the user connected to the order, the user that buys the product
        required: true,
        ref: 'User' // we want to reference the User Model
    },
    orderItems: [{
        name: { type: String, required: true }, // the name of the product
        qty: { type: Number, required: true }, // quantity 
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: { 
            type: mongoose.Schema.Types.ObjectId,  // product id linked to the Product Model
            required: true,
            ref: 'Product' // linked to the Product Model
        } 
    }],
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    paymentResult: {
        id: { type: String },
        status: { type: String },
        update_time: { type: String },
        email_address: { type: String },
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false,
    },
    paidAt: {
        type: Date,
    },
    isDelivered: {
        type: Boolean,
        required: true,
        default: false,
    },
    deliveredAt: {
        type: Date,
    },
}, {
    timestamps: true
})

const Order = mongoose.model('Order', orderSchema);

export default Order;