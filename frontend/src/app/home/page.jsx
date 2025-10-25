"use client";
import RoomModal from "../components/RoomModal.jsx";
import { useState, useEffect } from "react";
import { Code, MessageSquare, Bot, FolderOpen, Lock, Sparkles } from "lucide-react";

export default function HomePage() {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch logged-in user name from backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return; // not logged in

    fetch("http://localhost:4000/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.name) {
          setUser(data);
          setUsername(data.name);
        }
      })
      .catch((err) => console.error("Error fetching user:", err));
  }, []);

  // Join Room Handler
  const handleJoin = () => {
    if (!localStorage.getItem("token")) return alert("Please login first!");
    if (!username) return alert("Please enter your name!");
    if (!roomId) return alert("Room ID is required to join a room!");
    window.location.href = `/editor?roomId=${roomId}&username=${username}`;
  };

  // Create Room Handler
  const handleCreateRoom = ({ roomName, roomId, username }) => {
    if (!localStorage.getItem("token")) return alert("Please login first!");
    if (!roomName) return alert("Please enter a room name!");
    console.log("Room created:", { roomName, roomId, username });
    window.location.href = `/editor?roomId=${roomId}&username=${username}`;
  };

  const features = [
    { icon: Code, title: "Real-Time Collaboration", description: "Edit code live with your team using synced updates.", color: "from-[#FF6B6B] to-[#FFD93D]" },
    { icon: MessageSquare, title: "Live Chat", description: "Talk instantly with smart message indicators.", color: "from-[#4ECDC4] to-[#5561FF]" },
    { icon: Bot, title: "AI Coding Assistant", description: "Get intelligent help for debugging & explanations.", color: "from-[#845EC2] to-[#FF9671]" },
    { icon: FolderOpen, title: "Session Management", description: "Create, share, and organize collaborative sessions.", color: "from-[#00C9A7] to-[#92FE9D]" },
    { icon: Lock, title: "Secure Authentication", description: "Stay protected with end-to-end encrypted sessions.", color: "from-[#F72585] to-[#7209B7]" },
    { icon: Sparkles, title: "Beautiful UI", description: "Smooth gradients, neon effects, and elegant design.", color: "from-[#00BBF9] to-[#FEE440]" },
  ];

  return (
    <section className="relative text-center py-24 px-6 bg-gradient-to-b from-[#0A0A18] via-[#141022] to-[#1A162B] min-h-screen overflow-hidden">
      <h1 className="text-6xl md:text-7xl font-extrabold mb-6 text-white leading-tight drop-shadow-[0_0_20px_rgba(46,155,255,0.4)]">
        Code Together,{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C9A7] to-[#2E5BFF] animate-text-glow">
          Build Smarter
        </span>
      </h1>
      <p className="text-gray-400 mb-14 max-w-2xl mx-auto text-lg leading-relaxed">
        Collaborate, code, and innovate — all in one real-time, AI-powered workspace.
      </p>

      {/* Room Join/Create Box */}
      <div className="max-w-md mx-auto bg-[#141022]/70 p-8 rounded-3xl backdrop-blur-xl border border-[#2E5BFF]/30 shadow-[0_0_50px_-10px_rgba(46,91,255,0.5)] mb-20 transition-transform hover:scale-[1.02]">
        <input
          type="text"
          placeholder="Your Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-[#1E1A2E] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2E5BFF]/60 transition-all"
        />
        <input
          type="text"
          placeholder="Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className={`w-full p-3 mb-6 rounded-lg bg-[#1E1A2E] text-white placeholder-gray-500 focus:outline-none ${
            !roomId ? "focus:ring-red-500" : "focus:ring-[#00C9A7]/60"
          } transition-all`}
        />
        <div className="flex gap-4">
          <button
            onClick={handleJoin}
            className="flex-1 bg-gradient-to-r from-[#2E5BFF] to-[#00C9A7] hover:from-[#1D3BFF] hover:to-[#009F87] p-3 rounded-lg text-white font-semibold shadow-[0_0_25px_rgba(46,91,255,0.6)] transition-all"
          >
            Join Room
          </button>
          <button
            onClick={() => {
              if (!localStorage.getItem("token")) return alert("Please login first!");
              setIsModalOpen(true);
            }}
            className="flex-1 border border-[#6C63FF] text-[#B59FFF] hover:bg-[#6C63FF]/20 p-3 rounded-lg font-semibold transition-all"
          >
            Create New
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto pb-16">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div
              key={i}
              className="bg-[#141022]/70 p-8 rounded-2xl border border-[#2D2845] hover:border-[#2E5BFF]/50 hover:shadow-[0_0_40px_-10px_rgba(46,91,255,0.5)] transition-all group"
            >
              <div
                className={`w-16 h-16 mb-6 rounded-xl mx-auto flex items-center justify-center bg-gradient-to-br ${f.color} text-white shadow-[0_0_25px_rgba(255,255,255,0.4)] group-hover:scale-110 transition-transform`}
              >
                <Icon className="w-8 h-8 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.description}</p>
            </div>
          );
        })}
      </div>

      {/* Create Room Modal */}
      <RoomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateRoom}
        user={user}
      />
    </section>
  );
}
