import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    id: [{ type: String, required: true }],
    firstName: [{ type: String, required: true }],
    lastName: [{ type: String, required: true }],
    email: [{ type: String, required: true }],
    verified: [{ type: Boolean, required: true }],
    displayName: [{ type: String, required: true }],
    title: [{ type: String, required: true }],
    organization: [{ type: String, required: true }],
    admin: [{ type: Boolean, required: true }],
    deletedAt: [{ type: Date, required: true, default: null }]
});

const User = mongoose.model("Users", userSchema);
module.exports = User;