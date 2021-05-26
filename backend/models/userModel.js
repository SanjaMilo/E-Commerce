import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema({
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
});

// Since here we are bringing bcrypt, we can here create the method matchPassword, called on the specific User. enteredPassword is a plain text. bcrypt method compare() compares plain text password to the encrypted password. With this.password we are accessing User's password, since the method matchPassword is called on the specific User.

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Before we save we want to encrypt the password:
userSchema.pre('save', async function(next) {
    // Only if the password field is set or modified, we want to run the hush. If the name or email are modified (updated), we don't want this to run, because it is going to create a new hash and the User will not going to be able to login. So, we have to check:
    if (!this.isModified('password')) {
        next(); // (isModified is from Mongoose) if it's not been modified, then move on to the next code  and execute it. If it's been modified, then execute the hash bellow.
    };

    const salt = await bcrypt.genSalt(10);
    // resetting the plain text to be encrypted (hashed) text (this. refers to the User that we are creating)
    this.password = await bcrypt.hash(this.password, salt)

});

const User = mongoose.model('User', userSchema);

export default User;