import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('Auth Service MongoDB connected');
    } catch (err) {
        console.error('Auth Service MongoDB connection error', err);
        process.exit(1);
    }
};
