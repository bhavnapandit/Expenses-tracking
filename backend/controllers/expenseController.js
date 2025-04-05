import Expense from "../model/expenseModel.js";
import User from "../model/userModel.js";
import mongoose from "mongoose";

// GET all expenses
export const getAllExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find().populate("user");
        if (!expenses.length) {
            return res.status(404).json({ message: "No expenses found" });
        }
        res.status(200).json(expenses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error: " + error.message });
    }
};

// ADD an expense
export const addExpenses = async (req, res) => {
    const { amount, category, date, description, user } = req.body;

    if (!amount || !category || !date || !description || !user) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const existingUser = await User.findById(user);
        if (!existingUser) {
            return res.status(400).json({ message: "User not found" });
        }

        const newExpense = new Expense({ amount, category, date, description, user });

        const session = await mongoose.startSession();
        session.startTransaction();

        await newExpense.save({ session });

        // Assuming user schema has `expenses` field, not `newExpenses`
        existingUser.expenses.push(newExpense);
        await existingUser.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ message: "Expense added successfully", expense: newExpense });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error: " + error.message });
    }
};

// DELETE an expense
export const deleteExpense = async (req, res) => {
    const { id } = req.params;

    try {
        const expenseToDelete = await Expense.findById(id).populate("user");

        if (!expenseToDelete) {
            return res.status(404).json({ message: "Expense not found" });
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        await Expense.findByIdAndDelete(id, { session });

        if (expenseToDelete.user) {
            expenseToDelete.user.expenses.pull(expenseToDelete._id);
            await expenseToDelete.user.save({ session });
        }

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: "Expense deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error: " + error.message });
    }
};


// ✅ GET expenses by user ID
export const getUserExpenses = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId).populate("expenses");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user.expenses);
    } catch (error) {
        console.error("Error fetching user expenses:", error);
        res.status(500).json({ message: "Server error" });
    }
};
