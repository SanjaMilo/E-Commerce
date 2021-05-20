import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline); // added color cyan
    } catch (error) {
        console.log(`Error: ${error.message}`.red.underline.bold); // added color red
        process.exit(1) // 1 means exit with failure 
    }
};

export default connectDB;