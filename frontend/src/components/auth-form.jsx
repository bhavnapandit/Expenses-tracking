import { useEffect, useState } from "react";
import { X } from "lucide-react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { authActions } from "../redux/authSlice";

const AuthForms = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState("login");
    const dispatch = useDispatch();
    const [inputs, setInputs] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [user, setUser] = useState(null); // State to track logged-in user

    // ✅ Check if user is already logged in on component mount
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // ✅ Handle Input Change
    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    // ✅ Send API Request (Signup/Login)
    const handleSignIn = async (type) => {
        try {
            const payload =
                type === "signup"
                    ? inputs // Send name, email, and password
                    : { email: inputs.email, password: inputs.password }; // Send only email & password for login

            const res = await axios.post(
                `http://localhost:5000/api/user/${type}`,
                payload
            );
            return res.data;
        } catch (err) {
            console.error(err);
            alert("An error occurred. Please try again.");
            return null;
        }
    };

    // ✅ Handle Form Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        const authType = activeTab === "signup" ? "signup" : "login";

        try {
            const data = await handleSignIn(authType);

            if (!data || !data.user) {
                console.error("Login failed: User data is missing", data);
                alert("Login failed! Please check your credentials.");
                return;
            }

            // ✅ Store full user data in localStorage
            console.log("User data:", data.user);

            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("isLoggedIn", "true");

            setUser(data.user); // Update local state
            dispatch(authActions.login({ user: data.user }));
            onClose(); // Close modal
            // Redirect home
        } catch (err) {
            console.error("Login error:", err);
            alert("An error occurred. Please try again.");
        }
    };

    // ✅ Logout function to clear storage & update state
    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");
        setUser(null);
        window.location.reload(); // Refresh to apply changes
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            {/* Overlay Background (clicking it closes modal) */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50"
                onClick={onClose}
            ></div>

            {/* Form Container */}
            <div className="relative z-10 w-full max-w-md bg-white rounded-lg p-8 shadow-lg">
                {/* Close Button */}
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                    onClick={onClose}
                >
                    <X className="h-6 w-6" />
                </button>

                {user ? (
                    // ✅ Show user info & logout button if logged in
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">Welcome, {user.name}!</h2>
                        <button
                            className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-700 transition duration-200"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    // ✅ Show login/signup form if user is not logged in
                    <>
                        <h2 className="text-3xl font-bold text-center mb-6">
                            {activeTab === "login" ? "Login" : "Signup"}
                        </h2>

                        {/* Tab Switcher */}
                        <div className="flex mb-6 rounded-full bg-gray-100 p-1">
                            <button
                                className={`flex-1 py-3 rounded-full transition ${activeTab === "login"
                                        ? "bg-black text-white"
                                        : "text-gray-700"
                                    }`}
                                onClick={() => setActiveTab("login")}
                            >
                                Login
                            </button>
                            <button
                                className={`flex-1 py-3 rounded-full transition ${activeTab === "signup"
                                        ? "bg-black text-white"
                                        : "text-gray-700"
                                    }`}
                                onClick={() => setActiveTab("signup")}
                            >
                                Signup
                            </button>
                        </div>

                        {/* Form */}
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {activeTab === "signup" && (
                                <input
                                    type="text"
                                    name="name"
                                    value={inputs.name}
                                    onChange={handleChange}
                                    placeholder="Name"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    required
                                />
                            )}

                            <input
                                type="email"
                                name="email"
                                value={inputs.email}
                                onChange={handleChange}
                                placeholder="Email Address"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                value={inputs.password}
                                onChange={handleChange}
                                placeholder="Password"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                required
                            />
                            <button
                                type="submit"
                                className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-red-600 transition duration-200"
                            >
                                {activeTab === "login" ? "Login" : "Signup"}
                            </button>
                        </form>

                        {/* Toggle Link */}
                        <div className="text-center mt-4">
                            {activeTab === "login" ? (
                                <p>
                                    Not a member?{" "}
                                    <a
                                        href="#"
                                        className="text-blue-500 hover:underline"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setActiveTab("signup");
                                        }}
                                    >
                                        Signup now
                                    </a>
                                </p>
                            ) : (
                                <p>
                                    Already have an account?{" "}
                                    <a
                                        href="#"
                                        className="text-blue-500 hover:underline"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setActiveTab("login");
                                        }}
                                    >
                                        Login here
                                    </a>
                                </p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AuthForms;
