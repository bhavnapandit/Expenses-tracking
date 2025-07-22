import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: [3, "Name must be at least 3 characters"],
        maxlength: [50, "Name must be at most 50 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        unique: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please enter a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"],
        maxlength: [128, "Password must be at most 128 characters"]
    },
    expenses: [{ type: mongoose.Types.ObjectId, ref: "Expense", required: true }]
}, { timestamps: true })

export default mongoose.model("User", userSchema)