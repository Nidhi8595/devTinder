import express from "express";
import connectDB from "./config/database.js";
import http from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import cors from "cors";
// import dotenv from "dotenv";
import initializeSocket from "./socket.js";
import authRouter from "./routes/auth.js";
import profileRouter from "./routes/profile.js";
import requestRouter from "./routes/request.js";
import userRouter from "./routes/user.js";
import messageRoutes from "./routes/message.js";

// dotenv.config();

const app = express();
const server = http.createServer(app);

// Allow connections from multiple frontend ports
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"], // Allow both frontend ports
    methods: ["GET", "POST"],
    credentials: true, // Allow cookies to be sent with requests
  },
});

app.use(
  cors({
    origin: ["http://localhost:5173"], // Allow both frontend ports
    credentials: true, // Allow cookies to be sent with requests
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.get("/", (req, res) => res.send("Server is running..."));
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/messages", messageRoutes);

// Initialize socket.io with the existing `io` instance
initializeSocket(io);

// Database connection
connectDB()
  .then(() => {
    console.log("Database connection established...");
    server.listen(7777, () => {
      console.log("Server is successfully listening on port 7777...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!");
  });
