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
            expenses: []
        });

        await user.save();
        res.status(201).json({ user });
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

        // Generate JWT Token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

        // Optionally, set the token as a cookie
        res.cookie("token", token, { httpOnly: true, secure: true }); // Set secure flag in production
        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error logging in" });
    }
};

// Logout
export const logout = (req, res) => {
    try {
        // Clear the JWT token from cookies
        res.clearCookie("token");
        res.status(200).json({ message: "Logout successful" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error logging out" });
    }
};
