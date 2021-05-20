import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import users from './data/users.js';
import products from './data/products.js';
import User from './models/userModel.js';
import Product from './models/ProductModel.js';
import Order from './models/orderModel.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await Order.deleteMany(); // delete everything
        await Product.deleteMany();
        await User.deleteMany();
        // this is going to clear all of those
        const createdUsers = await User.insertMany(users); // array

        const adminUser = createdUsers[0]._id;
        // na sekoj product da go dodademe adminUser
        const sampleProducts = products.map(product => {
            return { ...product, user: adminUser}
        });

        await Product.insertMany(sampleProducts);

        console.log('Data Imported!'.green.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Order.deleteMany(); // delete everything
        await Product.deleteMany();
        await User.deleteMany();
        // this is going to clear all of those
        console.log('Data Destroyed!'.red.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
};