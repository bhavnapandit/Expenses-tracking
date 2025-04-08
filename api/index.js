import express from "express";
import cors from "cors";
import serverless from "serverless-http";
import userRouter from "../routes/userRoutes.js";
import expenseRoutes from "../routes/expenseRoutes.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

// ✅ CORS HEADERS FIX
//app.use((req, res, next) => {
//     res.setHeader(
//         "Access-Control-Allow-Origin",
//         "https://expenses-tracking-frontend.vercel.app"
//     );
//     res.setHeader(
//         "Access-Control-Allow-Methods",
//         "GET, POST, PUT, DELETE, OPTIONS"
//     );
//     res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//     res.setHeader("Access-Control-Allow-Credentials", "true");

//     if (req.method === "OPTIONS") {
//         return res.sendStatus(200); // ← VERY IMPORTANT for preflight!
//     }

//     next();
// });

// Optional: Also use cors()
cors({
    origin: [
        "http://localhost:3000",
        "https://expenses-tracking-frontend.vercel.app",
    ],
    credentials: true,
});


app.use(express.json());
app.use(cookieParser());
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is working!' });
});

// Mongo
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB connection error:", err));

// Routes
app.use("/user", userRouter); // So the final route is /api/user/signup
app.use("/expense", expenseRoutes);

module.exports = serverless(app);

