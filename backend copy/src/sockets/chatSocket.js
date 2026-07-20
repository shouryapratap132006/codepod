import Message from "../models/message.js";

export default function chatSocket(io) {
  io.on("connection", (socket) => {
    console.log("💬 User connected for chat:", socket.id);

    // Join room
    socket.on("join-chat-room", async (roomId, username) => {
      socket.join(roomId);
      socket.username = username;
      socket.roomId = roomId;

      const previousMessages = await Message.find({ roomId })
        .sort({ createdAt: 1 })
        .limit(50);
      socket.emit("load-messages", previousMessages);

      console.log(`✅ ${username} joined chat room ${roomId}`);
    });

    // Send message
    socket.on("send-message", async ({ roomId, sender, message }) => {
      if (!roomId || !sender || !message) return;

      const newMessage = new Message({ roomId, sender, message });
      await newMessage.save();

      io.to(roomId).emit("receive-message", newMessage);
    });

    // Typing indicators
    socket.on("typing", ({ roomId, username }) => {
      socket.to(roomId).emit("user-typing", username);
    });

    socket.on("stop-typing", ({ roomId, username }) => {
      socket.to(roomId).emit("user-stop-typing", username);
    });

    socket.on("disconnect", () => {
      console.log(`🔴 Chat user disconnected: ${socket.username || socket.id}`);
    });
  });
}
