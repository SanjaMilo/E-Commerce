import mongoose from 'mongoose';

const userSchema = mongoose.Schema( {
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // no more than one person to have same email 
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    }
}, {
    timestamps: true
})

const User = mongoose.model('User', userSchema);

export default User;