import mongoose from 'mongoose';

const reviewsSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    rating: {
        type: Number, // this is the individual rating 
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
});

const productSchema = mongoose.Schema( {
    user: {
        type: mongoose.Schema.Types.ObjectId, // only admin can create product (which admin created which product)
        required: true,
        ref: 'User', // to reference specific model for this object id
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    reviews: [reviewsSchema],
    rating: {
        type: Number, // this is the average rating of all the individual ratings
        required: true,
        default: 0,
    },
    numReviews: {
        type: Number,
        required: true,
        default: 0,
    },
    price: {
        type: Number,
        required: true,
        default: 0,
    },
    countInStock: {
        type: Number,
        required: true,
        default: 0,
    },
}, {
    timestamps: true
});


const Product = mongoose.model('Product', productSchema);

export default Product;