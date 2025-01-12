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

// Get User by email
app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;

    try {
        const user = await User.findOne({ emailId: userEmail })
        if (!user) {
            res.status(400).send("Error fetching user")
        }
        else {
            res.send(user)
        }
    }
    catch (err) {
        res.status(400).send("Error fetching user")
    }
})

// Feed API to get all users from DB
app.get("/feed", async (req, res) => {

    try {
        const users = await User.find({})
        res.send(users)
    }
    catch (err) {
        res.status(400).send("Error fetching user")
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

