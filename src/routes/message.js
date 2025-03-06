import express from "express";
import Message from "../models/Message.js";

const router = express.Router();

// Send a message via HTTP POST
router.post("/send", async (req, res) => {
  const { senderId, receiverId, content } = req.body;

  if (!senderId || !receiverId || !content.trim()) {
    return res.status(400).json({ error: "Sender, receiver, and message content are required." });
  }

  try {
    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      content: content.trim(),
    });

    await newMessage.save();  // Save to DB

    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message." });
  }
});

router.get("/fetchMessages", async (req, res) => {
    const { senderId, receiverId } = req.query;
  
    if (!senderId || !receiverId) {
      return res.status(400).json({ error: "Sender ID and Receiver ID are required" });
    }
  
    try {
      const messages = await Message.find({
        $or: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      }).sort({ timestamp: 1 }); // Sorting messages by timestamp
  
      res.status(200).json({ success: true, messages });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching messages" });
    }
  });

export default router;


