import { useState } from "react";
import { ExpenseForm } from "./expense-form";
import { ExpenseList } from "./expense-list";
import { ExpenseSummary } from "./expense-summary";

const defaultCategories = [
  { id: "1", name: "Food", color: "bg-red-500" },
  { id: "2", name: "Transportation", color: "bg-blue-500" },
  { id: "3", name: "Entertainment", color: "bg-yellow-500" },
  { id: "4", name: "Shopping", color: "bg-green-500" },
  { id: "5", name: "Bills", color: "bg-purple-500" },
  { id: "6", name: "Other", color: "bg-gray-500" },
];

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
    <div className="space-y-12 p-8 bg-white border border-gray-200 shadow-sm shadow-gray-300 rounded-lg">
      <div className="border border-gray-200 shadow-sm shadow-gray-300 p-4 rounded-lg">
        <h1 className="text-2xl font-bold text-left text-gray-800">
          Expense Tracker
        </h1>
        <p className="text-left text-md text-gray-400">
          Keep track of your expenses and manage your budget effectively.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
        <div className="md:col-span-2 space-y-8">
          {/* Tab Navigation */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <nav
              className="flex gap-x-1"
              aria-label="Tabs"
              role="tablist"
              aria-orientation="horizontal"
            >
              <button
                type="button"
                className={`py-3 px-6 inline-flex items-center gap-x-2 bg-white text-gray-700 text-sm font-medium rounded-lg transition $ {
              activeTab === "expenses" ? "shadow-md" : "hover:bg-gray-200"
            }`}
                onClick={() => setActiveTab("expenses")}
              >
                Expenses
              </button>
              <button
                type="button"
                className={`py-3 px-6 inline-flex items-center gap-x-2 bg-white text-gray-700 text-sm font-medium rounded-lg transition $ {
              activeTab === "addExpense" ? "shadow-md" : "hover:bg-gray-200"
            }`}
                onClick={() => setActiveTab("addExpense")}
              >
                Add Expense
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="bg-white p-6 border border-gray-200 shadow-sm shadow-gray-300 rounded-lg">
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

        <div className="bg-white p-6 border border-gray-200 shadow-sm shadow-gray-300 rounded-lg md:col-span-1 ">
          <ExpenseSummary expenses={expenses} categories={categories} />
        </div>
      </div>
    </div>
  );
}

export default ExpenseTracker;
