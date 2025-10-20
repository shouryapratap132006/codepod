"use client";
import { Send, MessageSquare } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  const handleSend = () => {
    if (input.trim() === "") return;
    setMessages([...messages, { text: input, sender: "user" }]);
    setInput("");
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gradient-to-b from-[#0B0A1B] via-[#141022] to-[#1A162B] p-6 rounded-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 border-b border-[#2D2845] pb-4">
        <div className="bg-purple-600/20 p-3 rounded-xl">
          <MessageSquare className="w-7 h-7 text-purple-400" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Team Chat</h1>
      </div>

      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto space-y-3 p-4 rounded-2xl bg-[#1C1730]/60 backdrop-blur-md border border-[#2D2845] shadow-inner scrollbar-thin scrollbar-thumb-[#3D3463] scrollbar-track-transparent">
        {messages.length === 0 ? (
          <p className="text-gray-400 text-center mt-20">
            No messages yet. Start the conversation!
          </p>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm font-medium shadow-md ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white"
                    : "bg-[#2D2845]/80 text-gray-200"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input bar (fixed at bottom) */}
      <div className="mt-4 flex items-center gap-3 bg-[#1C1730]/80 backdrop-blur-lg border border-[#2D2845] rounded-xl px-4 py-3 shadow-lg">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none"
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-lg flex items-center gap-2 text-white font-medium transition"
        >
          <Send className="w-4 h-4" /> Send
        </button>
      </div>
    </div>
  );
}
