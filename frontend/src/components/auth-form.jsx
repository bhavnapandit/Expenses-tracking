import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/api";

const AuthForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("login");
    const [errorMsg, setErrorMsg] = useState("");
    const [inputs, setInputs] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const sendRequest = async (type) => {
        try {
            const payload = {
                email: inputs.email,
                password: inputs.password,
            };

            if (type === "signup") {
                payload.name = inputs.name;
            }

            const data= await apiRequest({
                endpoint: `/api/user/${type}`,
                method: "POST",
                data: payload,
            });
            console.log(data)
            return data;
        } catch (error) {
            console.error(error);
            setErrorMsg(error?.response?.data?.message || "Something went wrong.");
            return;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        const data = await sendRequest(activeTab);

        if (data?.user && data?.token) {
        // Save JWT and user info to localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Optionally update Redux auth state
        dispatch(authActions.login({ user: data.user }));

        setInputs({ name: "", email: "", password: "" });

            navigate("/expensetracker");
        } else {
            setErrorMsg("Authentication failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md bg-white rounded-lg p-8 shadow-lg">
                {/* Heading */}
                <h2 className="text-3xl font-bold text-center mb-6">
                    {activeTab === "login" ? "Login" : "Signup"}
                </h2>

                {/* Tab Switcher */}
                <div className="flex mb-6 rounded-full bg-gray-100 p-1">
                    <button
                        className={`flex-1 py-3 rounded-full transition font-semibold ${activeTab === "login" ? "bg-black text-white" : "text-gray-700"
                            }`}
                        onClick={() => setActiveTab("login")}
                    >
                        Login
                    </button>
                    <button
                        className={`flex-1 py-3 rounded-full transition font-semibold ${activeTab === "signup" ? "bg-black text-white" : "text-gray-700"
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
                        className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-600 transition duration-200"
                    >
                        {activeTab === "login" ? "Login" : "Signup"}
                    </button>
                </form>

                {/* Error Message */}
                {errorMsg && (
                    <p className="text-red-500 text-center mt-4 text-sm">{errorMsg}</p>
                )}

                {/* Toggle Link */}
                <div className="text-center mt-6">
                    {activeTab === "login" ? (
                        <p>
                            Not a member?{" "}
                            <button
                                className="text-blue-500 hover:underline"
                                onClick={() => setActiveTab("signup")}
                            >
                                Signup now
                            </button>
                        </p>
                    ) : (
                        <p>
                            Already have an account?{" "}
                            <button
                                className="text-blue-500 hover:underline"
                                onClick={() => setActiveTab("login")}
                            >
                                Login here
                            </button>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthForm;
