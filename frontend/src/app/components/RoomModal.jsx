"use client";

import { useState, useEffect } from "react";
import { X, Copy, RefreshCw } from "lucide-react";

export default function RoomModal({ isOpen, onClose, onCreate }) {
  const [roomName, setRoomName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  // Fetch logged-in user info from backend
  const fetchUserName = async () => {
    try {
      const token = localStorage.getItem("token"); // JWT stored after login
      if (!token) return;

      const res = await fetch("http://localhost:4000/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch user");

      const data = await res.json();
      setUsername(data.name || ""); // Set username from backend
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  // Generate random room ID
  const generateRoomId = () => {
    const id = Math.random().toString(36).substring(2, 10);
    setRoomId(id);
  };

  // Initialize modal
  useEffect(() => {
    if (isOpen) {
      fetchUserName();
      generateRoomId();
    }
  }, [isOpen]);

  const handleCreate = () => {
    if (!roomName) return alert("Please enter a room name!");
    if (!username) return alert("Username not loaded yet!");
    onCreate({ roomName, roomId, username });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-[#141022]/90 border border-[#2E5BFF]/40 rounded-2xl p-8 w-full max-w-md shadow-[0_0_50px_-10px_rgba(46,91,255,0.5)] relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-white text-center">Create a New Room</h2>

        <div className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Room Name</label>
            <input
              type="text"
              placeholder="Enter room name..."
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#1E1A2E] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2E5BFF]/60"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Your Name</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)} // user can edit if needed
              className="w-full p-3 rounded-lg bg-[#1E1A2E] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00C9A7]/60"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Room ID</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={roomId}
                readOnly
                className="flex-1 p-3 rounded-lg bg-[#1E1A2E]/70 text-gray-400 cursor-not-allowed"
              />
              <button
                onClick={generateRoomId}
                className="p-2 rounded-lg bg-[#2E5BFF]/20 hover:bg-[#2E5BFF]/30 transition"
                title="Regenerate ID"
              >
                <RefreshCw className="w-5 h-5 text-[#2E5BFF]" />
              </button>
              <button
                onClick={() => navigator.clipboard.writeText(roomId)}
                className="p-2 rounded-lg bg-[#00C9A7]/20 hover:bg-[#00C9A7]/30 transition"
                title="Copy ID"
              >
                <Copy className="w-5 h-5 text-[#00C9A7]" />
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleCreate}
          className="w-full mt-8 p-3 rounded-lg bg-gradient-to-r from-[#2E5BFF] to-[#00C9A7] text-white font-semibold hover:opacity-90 transition"
        >
          Create Room
        </button>
      </div>
    </div>
  );
}
