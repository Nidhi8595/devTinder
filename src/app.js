const express = require('express');

const app = express();

app.use((req, res) => {
    res.send('Hey There');
});

app.use("/hello", (req, res) => {
    res.send("Hello world");
});

app.use("/test", (req, res) => {
    console.log("Hello from the server");
});

app.listen(7777, () => {
    console.log("Server is successfully listening on port 7777");
})