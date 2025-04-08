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

// ✅ CORS config
const corsOptions = {
    origin: "https://expenses-tracking-frontend.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// ✅ MongoDB cached connection
let isConnected = false;
async function connectToDB() {
    if (isConnected) return;

    try {
        await mongoose.connect(process.env.MONGO_URI);
        isConnected = true;
        console.log("✅ MongoDB connected");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
    }
}
await connectToDB(); // 👈 Add this

// ✅ Routes
app.get("/", (req, res) => res.json({ message: "Backend is working!" }));
app.use("/api/user", userRouter);
app.use("/api/expense", expenseRoutes);

// ✅ Default export for Vercel
export default serverless(app);
