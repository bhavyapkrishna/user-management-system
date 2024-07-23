import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    id: { type: String, required: true },
    firstName: [{ type: String, required: true }],
    lastName: [{ type: String, required: true }],
    email: [{ type: String, required: true }],
    userType: [{ type: String, required: true }]
});

const User = mongoose.model("Users", userSchema);
module.exports = User;