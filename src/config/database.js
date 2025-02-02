import mongoose from 'mongoose';

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://NodeJS:ET6C5ADOz4STTis5@learning-nodejs.2vps4.mongodb.net/devTinder');
}

export default connectDB;
