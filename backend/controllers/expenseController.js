import Expense from "../model/expenseModel.js"
import User from "../model/userModel.js";

export const getAllExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find().populate("user");;
        if (!expenses.length) {
            return res.status(404).json({ message: "No expenses found" });
        }
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: "Server Error: " + error.message });
    }
};

export const addExpenses = async (req, res) => {
    const { amount, category, date, description, user } = req.body;

    if (!amount || !category || !date || !description) {
        return res.status(400).json({ message: "All fields are required" });
    }
    let existingUser;
    try {
        existingUser = await User.findById(user)
    } catch (error) {
        return console.log(error);
    }
    if (!existingUser) {
        return res.status(400).json({ message: "User not found" })
    }
    try {
        const newExpense = new Expense({ amount, category, date, description, user });
        const session = await mongoose.startSession();
        session.startTransaction();
        await newExpense.save({ session });
        existingUser.newExpenses.push(newExpense);
        await existingUser.save({ session });
        await session.commitTransaction();
        res.status(201).json({ message: "Expense added successfully", expense: newExpense });
    } catch (error) {
        res.status(500).json({ message: "Server Error: " + error.message });
    }
};

export const deleteExpense = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedExpense = await Expense.findByIdAndDelete(id).populate("user");
        await deletedExpense.user.newExpenses.pull(deletedExpense);
        await deletedExpense.user.save();
        if (!deletedExpense) {
            return res.status(404).json({ message: "Expense not found" });
        }
        res.status(200).json({ message: "Expense deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error: " + error.message });
    }
};
