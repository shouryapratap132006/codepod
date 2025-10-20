'use client';

import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useSearchParams } from "next/navigation";
import Editor from "@monaco-editor/react";


export default function EditorPage() {
  const params = useSearchParams();
  const roomId = params.get("roomId") || "default-room"; // fallback
  const username = params.get("username") || "Anonymous";
  const [code, setCode] = useState("// Start coding together 💻");
  const socketRef = useRef(null);

  useEffect(() => {
    // Connect once to Socket.io
    socketRef.current = io("http://localhost:4000", {
      transports: ["websocket"],
    });

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("✅ Connected to Socket.io:", socket.id);
      socket.emit("join-room", roomId, username);
    });

    socket.on("user-joined", (msg) => console.log("📢", msg));

    socket.on("code-update", (newCode) => {
      setCode(newCode);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Disconnected from server");
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId, username]);

  const handleChange = (value) => {
    setCode(value);
    socketRef.current.emit("code-change", { roomId, code: value });
  };

  return (
      <div className="h-screen w-full bg-[#0f172a] text-white flex flex-col">
        <div className="p-4 bg-gray-800 flex justify-between items-center">
          <h2 className="font-semibold text-lg">Room: {roomId}</h2>
          <h3 className="text-gray-400">👤 {username}</h3>
        </div>

        <Editor
          height="90vh"
          language="javascript"
          theme="vs-dark"
          value={code}
          onChange={handleChange}
          options={{
            fontSize: 16,
            minimap: { enabled: false },
            smoothScrolling: true,
            automaticLayout: true,
          }}
        />
      </div>
  );
}
