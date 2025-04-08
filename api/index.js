import express from "express";
import cors from "cors";
import serverless from "serverless-http";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import userRouter from "./routes/userRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";

dotenv.config();

const app = express();

// ✅ Custom CORS headers for preflight + cross-origin requests
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") {
        return res.sendStatus(200); // Preflight OK
    }

    next();
});

const cors = require('cors');

const corsOptions = {
    origin: 'https://expenses-tracking-frontend.vercel.app', // allow only your frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
};

app.use(cors(corsOptions));


app.use(express.json());
app.use(cookieParser());

// ✅ Simple test route
app.get("/", (req, res) => {
    res.json({ message: "Backend is working!" });
});

// ✅ MongoDB connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB connection error:", err));

// ✅ API routes
app.use("/api/user", userRouter);
app.use("/api/expense", expenseRoutes);

// ✅ Export as serverless function for Vercel
export const handler = serverless(app);
export default app;
