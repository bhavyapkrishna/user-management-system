import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.use(cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))

import { User } from "./models/Users";

app.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        console.log(err);
    }
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

app.put("/edit-user/:id", async (req, res) => {
    console.log("database connected - edited for", req.params.id);

    try {
        const userId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const user = req.body;

        const result = await User.updateOne({ id: userId },
            {
                $set: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    verified: user.verified,
                    displayName: user.displayName,
                    title: user.title,
                    organization: user.organization,
                    admin: user.admin

                }
            }
        )

        if (!result) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
            id: userId,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            verified: req.body.verified,
            displayName: req.body.displayName,
            title: req.body.title,
            organization: req.body.organization,
            admin: req.body.admin
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to edit user" });
    }
});

app.put("/remove-user/:id", async (req, res) => {
    console.log("database connected - deleted for", req.params.id);

    try {
        const userId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        const val = Date.now()
        console.log("date: ", val)
        const result = await User.updateOne({ id: userId },
            {
                $set: {
                    deletedAt: Date.now()

                }
            }
        )

        if (!result) {
            return res.status(404).json({ error: "User not deleted" });
        }

        res.status(200).json({
            id: userId
        });

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