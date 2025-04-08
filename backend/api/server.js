import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import expenseRoutes from "../routes/expenseRoutes.js";
import cookieParser from 'cookie-parser';
import userRouter from '../routes/userRoutes.js';
import serverless from 'serverless-http';

dotenv.config();

const app = express();

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "https://expenses-tracking-frontend.vercel.app");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});
// Middleware
app.use(cors({
    origin: 'https://expenses-tracking-frontend.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/expense', expenseRoutes);
app.use('/api/user', userRouter);

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;
mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("MongoDB Connection Error:", error);
    });

// Export handler for Vercel
export const handler = serverless(app);
