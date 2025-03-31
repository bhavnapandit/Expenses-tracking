import Expense from "../model/expenseModel.js"


export const getAllExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find();
        if (!expenses.length) {
            return res.status(404).json({ message: "No expenses found" });
        }
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: "Server Error: " + error.message });
    }
};

export const addExpenses = async (req, res) => {
    const { amount, category, date, description } = req.body;

    if (!amount || !category || !date || !description) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const newExpense = new Expense({ amount, category, date, description });
        await newExpense.save();
        res.status(201).json({ message: "Expense added successfully", expense: newExpense });
    } catch (error) {
        res.status(500).json({ message: "Server Error: " + error.message });
    }
};

export const deleteExpense = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedExpense = await Expense.findByIdAndDelete(id);
        if (!deletedExpense) {
            return res.status(404).json({ message: "Expense not found" });
        }
        res.status(200).json({ message: "Expense deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error: " + error.message });
    }
};
