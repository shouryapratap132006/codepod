import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// Global shared states
const roomUsers = {}; // { roomId: [{ username, socketId }] }
const roomCodes = {}; // { roomId: codeString }
const roomLocks = {}; // { roomId: { lockedBy, positionRange } }

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("join-room", (roomId, username) => {
    socket.join(roomId);
    socket.username = username;
    socket.roomId = roomId;

    if (!roomUsers[roomId]) roomUsers[roomId] = [];
    if (!roomCodes[roomId]) roomCodes[roomId] = "// Start coding together...";

    roomUsers[roomId].push({ username, socketId: socket.id });

    socket.emit("load-code", roomCodes[roomId]);

    io.to(roomId).emit("users-update", {
      users: roomUsers[roomId].map((u) => u.username),
      count: roomUsers[roomId].length,
    });

    console.log(`✅ ${username} joined room ${roomId}`);
  });

  socket.on("code-change", ({ roomId, code }) => {
    roomCodes[roomId] = code;
    socket.to(roomId).emit("code-update", code);
  });

  socket.on("cursor-move", ({ roomId, username, position }) => {
    socket.to(roomId).emit("cursor-update", { username, position });
  });

  socket.on("lock-area", ({ roomId, username, positionRange }) => {
    roomLocks[roomId] = { lockedBy: username, positionRange };
    io.to(roomId).emit("lock-update", roomLocks[roomId]);
  });

  socket.on("unlock-area", ({ roomId }) => {
    delete roomLocks[roomId];
    io.to(roomId).emit("lock-update", null);
  });

  socket.on("admin-restrict-toggle", (restricted) => {
    socket.to(socket.roomId).emit("global-restrict-toggle", restricted);
    console.log(`🔒 Restriction toggled in ${socket.roomId}: ${restricted}`);
  });
  


  socket.on("execute-code", async ({ code, language }) => {
    try {
      const tmpDir = path.join(process.cwd(), "temp");
      if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

      let filename, command;

      switch (language) {
        case "javascript":
          filename = path.join(tmpDir, "code.js");
          fs.writeFileSync(filename, code);
          command = `node "${filename}"`;
          break;
        case "python":
          filename = path.join(tmpDir, "code.py");
          fs.writeFileSync(filename, code);
          command = `python3 "${filename}"`;
          break;
        case "java":
          filename = path.join(tmpDir, "Main.java");
          fs.writeFileSync(filename, code);
          command = `javac "${filename}" && java -cp "${tmpDir}" Main`;
          break;
        case "cpp":
        case "c++":
          filename = path.join(tmpDir, "code.cpp");
          fs.writeFileSync(filename, code);
          command = `g++ "${filename}" -o "${tmpDir}/code.out" && "${tmpDir}/code.out"`;
          break;
        default:
          socket.emit("execution-result", `❌ Language "${language}" not supported`);
          return;
      }

      exec(command, { timeout: 5000 }, (err, stdout, stderr) => {
        if (err) {
          socket.emit("execution-result", stderr || err.message);
        } else {
          socket.emit("execution-result", stdout || "✅ Execution successful");
        }
      });
    } catch (error) {
      socket.emit("execution-result", `❌ ${error.message}`);
    }
  });

  socket.on("disconnect", () => {
    const { roomId, username } = socket;
    if (!roomId || !roomUsers[roomId]) return;

    roomUsers[roomId] = roomUsers[roomId].filter((u) => u.socketId !== socket.id);

    io.to(roomId).emit("users-update", {
      users: roomUsers[roomId].map((u) => u.username),
      count: roomUsers[roomId].length,
    });

    if (roomLocks[roomId]?.lockedBy === username) {
      delete roomLocks[roomId];
      io.to(roomId).emit("lock-update", null);
    }

    console.log(`🔴 ${username || "User"} disconnected from ${roomId}`);
  });
});

const PORT = 4000;
server.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
