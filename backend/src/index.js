import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import bodyParser from "body-parser";
import signupRoute from "./routes/signup.js"; // ✅ fixed import
import createAdminAccount from "./scripts/admin.js";
import loginRoute from "./routes/login.js"
import userRoute from "./routes/user.js"


const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


createAdminAccount();

app.use("/user", signupRoute);
app.use("/auth",loginRoute)
app.use("/api",userRoute)


// ✅ Make sure CORS is fully allowed
const io = new Server(server, {
  cors: {
    origin: "*", // temporarily allow all for local dev
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("🟢 New user connected:", socket.id);

  socket.on("join-room", (roomId, username) => {
    socket.join(roomId);
    console.log(`${username} joined room ${roomId}`);
    socket.to(roomId).emit("user-joined", `${username} joined the room`);
  });

  socket.on("code-change", ({ roomId, code }) => {
    socket.to(roomId).emit("code-update", code);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

const PORT = 4000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
