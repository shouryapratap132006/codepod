"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  const handleJoin = () => {
    if (!username || !roomId) {
      alert("Please enter both username and room ID");
      return;
    }
    router.push(`/editor?roomId=${roomId}&username=${username}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <h1 className="text-4xl font-bold mb-6">🚀 CodePod 2.0</h1>
      <div className="bg-gray-800 p-6 rounded-2xl shadow-xl w-80">
        <input
          type="text"
          placeholder="Your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-3 rounded bg-gray-700 text-white outline-none"
        />
        <input
          type="text"
          placeholder="Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="w-full p-2 mb-3 rounded bg-gray-700 text-white outline-none"
        />
        <button
          onClick={handleJoin}
          className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded-lg font-semibold transition-all"
        >
          Join Room
        </button>
      </div>
    </div>
  );
}
