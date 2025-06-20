import User from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


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

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
        );

        res.status(200).json({
            message: "SignUp successful",
            token,
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

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
        );

        res.status(200).json({
            message: "Login successful",
            token,
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