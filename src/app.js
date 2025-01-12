const express = require('express');
const connectDB = require('./config/database')
const app = express();
const User = require('./models/user');

app.use(express.json());

app.post("/signup", async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        res.send("User Added");
    } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).send("Error saving user");
        return;
    }
})

connectDB()
    .then(() => {
        console.log('Database connected');
        app.listen(7777, () => {
            console.log("Server is successfully listening on port 7777");
        })
    })
    .catch((err) => {
        console.log('Database cannoted be connected');
    })

