import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dbConfig = async () => {
    try {
      const conn =  await mongoose.connect(process.env.MONGODB_URI)
        console.log(`MongoDB connected: ${conn.connection.host}`);
        console.log("Database connected successfully"); 

    } catch (error) {
        console.log("Error connecting to database: ", error);
        process.exit(1)
    }
}


export default dbConfig;