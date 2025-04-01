import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import expenseRoutes from "./routes/expenseRoutes.js";
import cookieParser from 'cookie-parser';
import userRouter from './routes/userRoutes.js'
dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI; // Ensure you have this in .env
mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to MongoDB");

        // Start the server **only after MongoDB is connected**
        app.listen(process.env.PORT || 5001, () => {
            console.log(`Server is running on http://localhost:${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB Connection Error:", error);
        process.exit(1); // Exit process if MongoDB connection fails
    });

// Routes
app.use('/api/expense', expenseRoutes);
app.use('/api/user', userRouter);
