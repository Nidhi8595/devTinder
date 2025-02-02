import Message from "./models/Message.js";
import User from "./models/user.js";

const onlineUsers = new Map();

const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🔵 A user connected:", socket.id);

    socket.on("user-online", (userId) => {
      if (userId) {
        onlineUsers.set(userId, socket.id);
        console.log(`User ${userId} is online with socket ${socket.id}`);
        io.emit("update-user-status", Array.from(onlineUsers.keys()));
      }
    });

    socket.on("sendMessage", async ({ senderId, receiverId, content, timestamp }, callback) => {
      try {
        if (!senderId || !receiverId || !content || !content.trim()) {
          return callback({ success: false, error: "Missing senderId, receiverId, or message content." });
        }

        const sender = await User.findById(senderId);
        const senderName = sender ? `${sender.firstName} ${sender.lastName}` : "Unknown Sender";

        const newMessage = new Message({
          sender: senderId,
          receiver: receiverId,
          content: content.trim(),
          senderName,
          timestamp: new Date(timestamp || new Date()),
          isRead: false,
        });
        await newMessage.save();

        console.log(`Message saved: "${newMessage.content}" from ${senderId} to ${receiverId}`);

        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receiveMessage", { message: newMessage, senderId });
        }

        const senderSocketId = onlineUsers.get(senderId);
        if (senderSocketId) {
          io.to(senderSocketId).emit("receiveMessage", { message: newMessage, senderId });
        }

        callback({ success: true, message: newMessage });
      } catch (error) {
        console.error("Error sending message:", error);
        callback({ success: false, error: "Failed to send message." });
      }
    });

    socket.on("fetchMessages", async ({ senderId, receiverId }) => {
      try {
        console.log("Fetching messages for:", { senderId, receiverId });

        const messages = await Message.find({
          $or: [
            { sender: senderId, receiver: receiverId },
            { sender: receiverId, receiver: senderId },
          ],
        }).sort({ timestamp: 1 });

        if (messages.length === 0) {
          console.log("No messages found.");
        }

        await Message.updateMany(
          { receiver: receiverId, isRead: false },
          { $set: { isRead: true } }
        );

        socket.emit("loadMessages", messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("🔴 A user disconnected:", socket.id);
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          console.log(`User ${userId} went offline.`);
          break;
        }
      }
      io.emit("update-user-status", Array.from(onlineUsers.keys()));
    });
  });
};

export default initializeSocket;
