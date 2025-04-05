import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthForm from "./components/auth-form";
import ExpenseTracker from "./components/expense-tracker";

function App() {
  return (
    <Router>
      <main className="">
        <Routes>
          <Route path="/" element={<AuthForm />} />
          <Route path="/expensetracker" element={<ExpenseTracker />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
