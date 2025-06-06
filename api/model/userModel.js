import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    expenses: [{ type: mongoose.Types.ObjectId, ref: "Expense", required: true }]
}, { timestamps: true })

export default mongoose.model("User", userSchema)