import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('MongoDB connected successfully');
    } catch (error: unknown) {
        console.error(`MongoDB connection error: ${(error as Error).message}`);
        process.exit(1);
    }
};
