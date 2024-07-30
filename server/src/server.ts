import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(express.json());

app.use(cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))

import { User } from "./models/Users";

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/create-user", async (req, res) => {
    console.log("database connected - added");

    const userId = new mongoose.Types.ObjectId();

    const newUser = req.body;
    const userDoc = new User({
        ...newUser,
        id: userId,
        deletedAt: null
    });

    try {
        await userDoc.save();
        res.status(200).json({
            id: userId,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            verified: newUser.verified,
            displayName: newUser.displayName,
            title: newUser.title,
            organization: newUser.organization,
            admin: newUser.admin
        });

        //return userId;
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Failed to create user" });
    }
});

/*app.put("/edit-user/:id", async (req, res) => {
    console.log("database connected - edited");

    try {
        const userId = req.params.id;
        const user = req.body;

        const updatedUser = {
            id: userId,
            ...req.body,
            deletedAt: null
        }

        await User.updateOne({ id: new mongoose.Types.ObjectId(userId) },
            { $set: updatedUser }
        );

        res.status(200).json({
            id: userId,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            verified: updatedUser.verified,
            displayName: updatedUser.displayName,
            title: updatedUser.title,
            organization: updatedUser.organization,
            admin: updatedUser.admin
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to edit user" });
    }
});*/

app.put("/edit-user/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const updatedUser = req.body;

        const result = await User.updateOne(
            { _id: new mongoose.Types.ObjectId(userId) },
            { $set: updatedUser }
        );

        if (result.matchedCount > 0) {
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update user" });
    }
});

app.put("/delete-user/:id", async (req, res) => {
    console.log("database connected - deleted");

    try {
        const userId = req.params.id;

        await User.updateOne({ id: userId },
            {
                $set:
                    { deletedAt: Date.now() }
            }
        );

        res.status(200);

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to edit user" });
    }
});

const port = process.env.PORT;

mongoose.connect(process.env.MONGO_CONNECTION!)
    .then(() => {
        console.log("Mongoose connected");
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    });