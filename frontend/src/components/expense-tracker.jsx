import { useState } from "react";
import { ExpenseForm } from "./expense-form";
import { ExpenseList } from "./expense-list";
import { ExpenseSummary } from "./expense-summary";

// Sample categories with colors
const defaultCategories = [
  { id: "1", name: "Food", color: "bg-red-500" },
  { id: "2", name: "Transportation", color: "bg-blue-500" },
  { id: "3", name: "Entertainment", color: "bg-yellow-500" },
  { id: "4", name: "Shopping", color: "bg-green-500" },
  { id: "5", name: "Bills", color: "bg-purple-500" },
  { id: "6", name: "Other", color: "bg-gray-500" },
];

// Sample expenses
const defaultExpenses = [
  {
    id: "1",
    amount: 25.5,
    category: "Food",
    date: new Date(2023, 6, 15),
    description: "Lunch with colleagues",
  },
  {
    id: "2",
    amount: 35.0,
    category: "Transportation",
    date: new Date(2023, 6, 14),
    description: "Uber ride",
  },
  {
    id: "3",
    amount: 120.75,
    category: "Shopping",
    date: new Date(2023, 6, 13),
    description: "New shoes",
  },
  {
    id: "4",
    amount: 9.99,
    category: "Entertainment",
    date: new Date(2023, 6, 12),
    description: "Movie ticket",
  },
  {
    id: "5",
    amount: 75.0,
    category: "Bills",
    date: new Date(2023, 6, 10),
    description: "Electricity bill",
  },
];

export function ExpenseTracker() {
  const [expenses, setExpenses] = useState(defaultExpenses);
  const [categories] = useState(defaultCategories);
  const [activeTab, setActiveTab] = useState("expenses");

  const addExpense = (expense) => {
    const newExpense = {
      ...expense,
      id: Math.random().toString(36).substring(2, 9),
    };
    setExpenses([newExpense, ...expenses]);
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  return (
    <div className="space-y-12 p-8 bg-white rounded-lg shadow-2xl">
      <div className="border border-gray-300 p-4 rounded-lg">
        <h1 className="text-4xl font-extrabold text-left text-gray-800 drop-shadow-lg">
          Expense Tracker
        </h1>
        <p className="text-left text-xl text-gray-600">
          Track your spending, save money, and stay on top of your finances.
        </p>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
        {/* Left section: Tab navigation and content */}
        <div className="md:col-span-2 space-y-8">
          {/* Tab Navigation */}
          <div className="tabs flex justify-between bg-white rounded-lg shadow-lg p-4">
            <button
              onClick={() => setActiveTab("expenses")}
              className={`tab px-6 py-3 text-white rounded-lg transition-all duration-300 transform hover:scale-105 ${
                activeTab === "expenses"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            >
              Expenses
            </button>
            <button
              onClick={() => setActiveTab("addExpense")}
              className={`tab px-6 py-3 text-white rounded-lg transition-all duration-300 transform hover:scale-105 ${
                activeTab === "addExpense"
                  ? "bg-gradient-to-r from-green-500 to-green-600"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            >
              Add Expense
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            {activeTab === "expenses" && (
              <ExpenseList
                expenses={expenses}
                categories={categories}
                onDelete={deleteExpense}
              />
            )}
            {activeTab === "addExpense" && (
              <ExpenseForm onAddExpense={addExpense} categories={categories} />
            )}
          </div>
        </div>

        {/* Right section: Expense Summary */}
        <div className="bg-white p-6 rounded-lg shadow-lg md:col-span-1">
          <ExpenseSummary expenses={expenses} categories={categories} />
        </div>
      </div>
    </div>
  );
}

export default ExpenseTracker;