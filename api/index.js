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
    // origin:"http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// ✅ MongoDB connection
async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB connected");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1); // Exit if DB fails to connect
    }
}

// ✅ Routes
app.get("/", (req, res) => res.json({ message: "Backend is working!" }));
app.use("/api/user", userRouter);
app.use("/api/expense", expenseRoutes);

// ✅ Connect to DB and start server
(async () => {
    await connectToDB();
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
    });
})();
