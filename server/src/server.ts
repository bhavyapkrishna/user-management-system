import dotenv from "dotenv/config";
import express from "express";
import mongoose from "mongoose";
const app = express();

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/create-user", (req, res) => {
    console.log("hello world!");
})

const port = process.env.PORT;

mongoose.connect(process.env.MONGO_CONNECTION!)
    .then(() => {
        console.log("Mongoose connected");
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    });

