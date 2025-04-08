import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import userRouter from "./routes/userRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS config
const corsOptions = {
    origin: "https://expenses-tracking-frontend.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// ✅ MongoDB connection with caching
let isConnected = false;
async function connectToDB() {
    if (isConnected || mongoose.connection.readyState === 1) return;

    try {
        await mongoose.connect(process.env.MONGO_URI);
        isConnected = true;
        console.log("✅ MongoDB connected");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
    }
}

// ✅ Middleware to connect to DB before handling routes
app.use(async (req, res, next) => {
    await connectToDB();
    next();
});

// ✅ Routes
app.get("/", (req, res) => res.json({ message: "Backend is working!" }));
app.use("/api/user", userRouter);
app.use("/api/expense", expenseRoutes);

// ✅ Start server (REQUIRED for Render)
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
