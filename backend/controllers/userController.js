import User from "../model/userModel.js";  // Assuming you have a User model
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET; // Your JWT secret key

// Signup
export const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashPassword = bcrypt.hashSync(password, 10);

        const user = new User({
            name,
            email,
            password: hashPassword,
            expenses: [],
        });

        await user.save();

        res.status(201).json({
            message: "Signup successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                expenses: user.expenses,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating user" });
    }
};
// Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Password is incorrect" });
        }

        // ✅ No JWT — just send user info
        res.status(200).json({
            message: "Login successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                expenses: user.expenses,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};