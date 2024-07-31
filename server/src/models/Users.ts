import mongoose, { Schema } from "mongoose";

const userSchema: Schema = new Schema({
    id: mongoose.Types.ObjectId,
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    verified: { type: Boolean, required: true },
    displayName: { type: String, required: true },
    title: { type: String, required: true },
    organization: { type: String, required: true },
    admin: { type: Boolean, required: true },
    deletedAt: { type: Date, default: null }
});


const User = mongoose.model("Users", userSchema);
export { User };