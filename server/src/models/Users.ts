import mongoose, { Schema, Document, Model } from "mongoose";

interface IUser extends Document {
    id: mongoose.Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    verified: boolean;
    displayName: string;
    title: string;
    organization: string;
    admin: boolean;
    deletedAt: Date | null;
}

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

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export { User, IUser };