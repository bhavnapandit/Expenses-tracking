import { useEffect, useState } from "react";
import { ExpenseForm } from "./expense-form";
import { ExpenseList } from "./expense-list";
import { ExpenseSummary } from "./expense-summary";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import axios from "axios";
import PersonIcon from "@mui/icons-material/Person";

const defaultCategories = [
  { id: "1", name: "Food", color: "bg-red-500" },
  { id: "2", name: "Transportation", color: "bg-blue-500" },
  { id: "3", name: "Entertainment", color: "bg-yellow-500" },
  { id: "4", name: "Shopping", color: "bg-green-500" },
  { id: "5", name: "Bills", color: "bg-purple-500" },
  { id: "6", name: "Other", color: "bg-gray-500" },
];

export function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [categories] = useState(defaultCategories);
  const [activeTab, setActiveTab] = useState("expenses");

  // State for Alerts
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchExpenses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/expense");
      return res.data;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchExpenses();
      setExpenses(data);
    };

    fetchData();
  }, []);

  const refreshExpenses = async () => {
    const data = await fetchExpenses();
    setExpenses(data);
  };

  const addExpense = async (expense) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/expense",
        expense
      );
      const newExpense = res.data;

      // Update the state immediately with the new expense
      setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
      refreshExpenses();
      // Show success alert
      setAlert({
        open: true,
        message: "Expense added successfully!",
        severity: "success",
      });
    } catch (error) {
      console.log("Error occurred while adding expense:", error);

      // Show error alert
      setAlert({
        open: true,
        message: "Failed to add expense!",
        severity: "error",
      });
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/expense/delete/${id}`);
      setExpenses((prevExpenses) =>
        prevExpenses.filter((expense) => expense.id !== id)
      );
      refreshExpenses();
      // Show success alert
      setAlert({
        open: true,
        message: "Expense deleted successfully!",
        severity: "warning",
      });
    } catch (error) {
      console.log("Error occurred while deleting expense:", error);

      // Show error alert
      setAlert({
        open: true,
        message: "Failed to delete expense!",
        severity: "error",
      });
    }
  };

  return (
    <div className="space-y-12 p-8 bg-white border border-gray-200 shadow-sm shadow-gray-300 rounded-lg">
      <div className="border border-gray-200 shadow-sm shadow-gray-300 p-4 rounded-lg relative">
        <h1 className="text-2xl font-bold text-left text-gray-800">
          Expense Tracker
        </h1>
        <p className="text-left text-md text-gray-400">
          Keep track of your expenses and manage your budget effectively.
        </p>

        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          {/* From Uiverse.io by sahilxkhadka */}
          <button className="cursor-pointer group relative flex gap-1.5 px-8 py-4 bg-black bg-opacity-80 text-[#f1f1f1] rounded-3xl hover:bg-opacity-70 transition font-semibold shadow-md">
            <PersonIcon className="group-hover:translate-x-1 transition-all duration-300" />
            Login
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
        <div className="md:col-span-2 space-y-8">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <nav className="flex gap-x-1" aria-label="Tabs">
              <button
                type="button"
                className={`py-3 px-6 bg-white text-gray-700 text-sm font-medium rounded-lg transition ${
                  activeTab === "expenses" ? "shadow-md" : "hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab("expenses")}
              >
                Expenses
              </button>
              <button
                type="button"
                className={`py-3 px-6 bg-white text-gray-700 text-sm font-medium rounded-lg transition ${
                  activeTab === "addExpense" ? "shadow-md" : "hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab("addExpense")}
              >
                Add Expense
              </button>
            </nav>
          </div>

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

      {/* Material UI Snackbar for Alerts */}
      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.severity}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default ExpenseTracker;
