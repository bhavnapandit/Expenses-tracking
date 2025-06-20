import { useEffect, useState } from "react";
import { ExpenseForm } from "./expense-form";
import { ExpenseList } from "./expense-list";
import { ExpenseSummary } from "./expense-summary";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import axios from "axios";
import PersonIcon from "@mui/icons-material/Person";
import AuthForm from "./auth-form";
import Modal from "@mui/material/Modal";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../redux/authSlice";
import { apiRequest } from "../utils/api";

const defaultCategories = [
  { id: "1", name: "Food", color: "bg-red-500" },
  { id: "2", name: "Transportation", color: "bg-blue-500" },
  { id: "3", name: "Entertainment", color: "bg-yellow-500" },
  { id: "4", name: "Shopping", color: "bg-green-500" },
  { id: "5", name: "Bills", color: "bg-purple-500" },
  { id: "6", name: "Other", color: "bg-gray-500" },
];
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
export function ExpenseTracker() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [expenses, setExpenses] = useState([]);
  const [categories] = useState(defaultCategories);
  const [activeTab, setActiveTab] = useState("expenses");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // State for Alerts
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // ✅ Fetch only that user's expenses
  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await apiRequest({
        endpoint: `/api/expense/${user._id}`,
        method: "GET",
        token, // ⬅️ add token here
      });
      console.log(data);
      return data;
    } catch (error) {
      console.error("Fetch error:", error);
      return [];
    }
  };

  useEffect(() => {
    if (!user?._id) return; // Skip if user not available yet

    const fetchData = async () => {
      const data = await fetchExpenses();
      setExpenses(data);
    };

    fetchData();
  }, [user]);

  // ✅ Refresh Expenses
  const refreshExpenses = async () => {
    const data = await fetchExpenses();
    setExpenses(data);
  };

  // ✅ Add New Expense
  const addExpense = async (expense) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (!user?._id || !token) {
        return setAlert({
          open: true,
          message: "User not authenticated.",
          severity: "error",
        });
      }

      const payload = {
        ...expense,
        user: user._id,
      };

      const res = await apiRequest({
        endpoint: "/api/expense",
        method: "POST",
        data: payload,
        token, // ⬅️ add token
      });

      const newExpense = res.expense;

      setExpenses((prevExpenses) => [...prevExpenses, newExpense]);

      await refreshExpenses();
      
      setAlert({
        open: true,
        message: "Expense added successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error occurred while adding expense:", error);
      setAlert({
        open: true,
        message: "Failed to add expense!",
        severity: "error",
      });
    }
  };

  // ✅ Delete Expense by ID
  const deleteExpense = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await apiRequest({
        endpoint: `/api/expense/delete/${id}`,
        method: "DELETE",
        token, // ⬅️ add token
      });

      setExpenses((prevExpenses) =>
        prevExpenses.filter((expense) => expense._id !== id)
      );

      await refreshExpenses();

      setAlert({
        open: true,
        message: "Expense deleted successfully!",
        severity: "warning",
      });
    } catch (error) {
      console.error("Error occurred while deleting expense:", error);
      setAlert({
        open: true,
        message: "Failed to delete expense!",
        severity: "error",
      });
    }
  };

  const handleLogout = () => {
    // Clean up localStorage
    localStorage.removeItem("jwtToken"); // optional, since you said no JWT
    localStorage.removeItem("user"); // remove stored user info

    // Dispatch logout action to Redux
    dispatch(authActions.logout());

    // Show a logout success alert
    setAlert({
      open: true,
      message: "Logout successful!",
      severity: "success", // maybe change from "error" to "success"
    });
  };

  return (
    <div className="space-y-12 p-8 bg-white border border-gray-200 shadow-sm shadow-gray-300 rounded-lg">
      <div className="border border-gray-200 shadow-sm shadow-gray-300 p-4 rounded-lg relative flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Expense Tracker
          </h1>
          <p className="text-sm sm:text-md text-gray-500">
            Keep track of your expenses and manage your budget effectively.
          </p>
        </div>

        {/* Auth Button */}
        <div className="mt-4 sm:mt-0 sm:ml-4">
          {!isAuthenticated ? (
            <>
              <button
                onClick={handleOpen}
                className="cursor-pointer group relative flex gap-1.5 px-6 py-3 bg-black bg-opacity-80 text-[#f1f1f1] rounded-3xl hover:bg-opacity-70 transition font-semibold shadow-md text-sm sm:text-base"
              >
                <PersonIcon className="group-hover:translate-x-1 transition-all duration-300" />
                Login
              </button>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <AuthForm onClose={handleClose} />
              </Modal>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="cursor-pointer group relative flex items-center gap-1.5 px-6 py-3 bg-black bg-opacity-80 text-[#f1f1f1] rounded-3xl hover:bg-opacity-70 transition font-semibold shadow-md text-sm sm:text-base"
            >
              <span className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-sm font-bold group-hover:-translate-x-1 transition-all duration-300">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </span>
              Logout
            </button>
          )}
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
