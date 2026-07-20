"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function ChatWindow({ chat, setChatMessages }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typingMessage, setTypingMessage] = useState("");

  // Simulate typing letter by letter
  const simulateTyping = (text, onFinish) => {
    let index = 0;
    setTypingMessage("");
    const interval = setInterval(() => {
      setTypingMessage((prev) => prev + text[index]);
      index++;
      if (index === text.length) {
        clearInterval(interval);
        onFinish?.();
      }
    }, 15);
  };

  // Display AI response line by line
  const displayLineByLine = (text = "", onFinish) => {
    if (typeof text !== "string") text = "";
    const lines = text.split("\n");
    let current = 0;

    const typeNextLine = () => {
      if (current >= lines.length) {
        onFinish?.();
        return;
      }
      simulateTyping(lines[current] + "\n", () => {
        current++;
        typeNextLine();
      });
    };

    typeNextLine();
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...chat.messages, { role: "user", content: input }];
    setChatMessages(newMessages);
    setInput("");
    setLoading(true);
    setTypingMessage("AI typing...");

    try {
      const res = await fetch("http://localhost:4000/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();

      const reply = data?.reply || "❌ AI did not return a valid response";

      displayLineByLine(reply, () => {
        setChatMessages([...newMessages, { role: "assistant", content: reply }]);
        setTypingMessage("");
        setLoading(false);
      });
    } catch (err) {
      console.error(err);
      setChatMessages([...newMessages, { role: "assistant", content: "❌ Error: Could not get response" }]);
      setTypingMessage("");
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-[#141022] to-[#1A162B] p-6 min-h-screen">
      {/* Chat messages */}
      <div className="flex-1 space-y-3 mb-4">
        {chat.messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`p-3 rounded-2xl max-w-[70%] ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-[#2E5BFF] to-[#00C9A7] text-white shadow-md"
                  : "bg-[#1E1A2E]/70 text-white"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && typingMessage && (
          <div className="flex justify-start">
            <div className="p-3 rounded-2xl max-w-[70%] bg-[#1E1A2E]/50 text-white italic">
              {typingMessage}▌
            </div>
          </div>
        )}
      </div>

      {/* Footer input */}
      <div className="flex gap-4 pt-4 border-t border-[#2E5BFF]/30">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your message..."
          className="flex-1 p-3 rounded-xl bg-[#1E1A2E]/70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2E5BFF]/50 transition-all"
        />
        <button
          onClick={handleSend}
          className="p-3 rounded-xl bg-gradient-to-r from-[#2E5BFF] to-[#00C9A7] hover:scale-[1.05] transition-transform flex items-center justify-center"
        >
          <Send className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}
