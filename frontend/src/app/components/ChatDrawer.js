"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import io from "socket.io-client";
import { MessageSquare, X } from "lucide-react";

const chatSocket = io("http://localhost:4000/chat");

export default function ChatDrawer({ roomId, username }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const chatEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // 🔄 Socket listeners
  useEffect(() => {
    if (!roomId || !username) return;

    chatSocket.emit("join-chat-room", roomId, username);

    chatSocket.on("load-messages", (msgs) => {
      setMessages(msgs);
      scrollToBottom();
    });

    chatSocket.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
    });

    // 👀 Typing indicators
    chatSocket.on("user-typing", (user) => {
      if (user !== username && !typingUsers.includes(user)) {
        setTypingUsers((prev) => [...prev, user]);
      }
    });

    chatSocket.on("user-stop-typing", (user) => {
      setTypingUsers((prev) => prev.filter((u) => u !== user));
    });

    return () => {
      chatSocket.off("load-messages");
      chatSocket.off("receive-message");
      chatSocket.off("user-typing");
      chatSocket.off("user-stop-typing");
    };
  }, [roomId, username, typingUsers]);

  const scrollToBottom = () => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // ✍️ Typing
  const handleTyping = (e) => {
    setMessage(e.target.value);
    chatSocket.emit("typing", { roomId, username });

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      chatSocket.emit("stop-typing", { roomId, username });
    }, 1500);
  };

  // 📤 Send message
  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    chatSocket.emit("send-message", { roomId, sender: username, message });
    setMessage("");
    chatSocket.emit("stop-typing", { roomId, username });
  };

  // 🧩 Avatar Generator (consistent color)
  const getAvatar = (name) => {
    const initial = name?.[0]?.toUpperCase() || "?";
    const colors = [
      "#E74C3C", // red
      "#3498DB", // blue
      "#9B59B6", // purple
      "#1ABC9C", // teal
      "#F39C12", // orange
      "#2ECC71", // green
      "#E67E22", // amber
      "#16A085", // emerald
    ];
    const color = colors[name.charCodeAt(0) % colors.length];
    return { initial, color };
  };

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <>
      {/* 💬 Floating Chat Button (top-right) */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed top-5 right-5 z-50 bg-[#3f5bc4] hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all"
        >
          <MessageSquare size={20} />
        </button>
      )}

      {/* 🪟 Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 80 }}
            className="fixed right-0 top-0 h-full w-96 bg-[#232634] border-l border-gray-800 shadow-2xl flex flex-col text-white z-40"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-2 border-b border-gray-800 bg-[#11121A]">
              <h2 className="text-lg font-semibold tracking-wide"> Chat</h2>
              <button
                onClick={toggleChat}
                className="text-gray-400 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
              {messages.map((msg, i) => {
                const isOwn = msg.sender === username;
                const { initial, color } = getAvatar(msg.sender);
                return (
                  <div
                    key={i}
                    className={`flex items-end gap-2 ${
                      isOwn ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isOwn && (
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white"
                        style={{ backgroundColor: color }}
                      >
                        {initial}
                      </div>
                    )}
                    <div
                      className={`p-2.5 rounded-xl max-w-[70%] ${
                        isOwn
                          ? "bg-blue-600 text-white"
                          : "bg-gray-800 text-gray-100"
                      }`}
                    >
                      {!isOwn && (
                        <div className="text-xs text-gray-400 font-semibold mb-0.5">
                          {msg.sender}
                        </div>
                      )}
                      <div className="text-sm break-words">{msg.message}</div>
                      <div className="text-[10px] text-gray-400 mt-1 text-right whitespace-nowrap">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    {isOwn && (
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white"
                        style={{ backgroundColor: color }}
                      >
                        {initial}
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* 👀 Typing Indicator */}
            {typingUsers.length > 0 && (
              <div className="px-4 pb-2 text-gray-400 text-sm italic">
                {typingUsers.join(", ")}{" "}
                {typingUsers.length === 1 ? "is typing..." : "are typing..."}
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={sendMessage}
              className="flex p-3 border-t border-gray-800 bg-[#11121A]"
            >
              <input
                className="flex-1 bg-gray-900 text-white p-2 rounded-lg outline-none placeholder-gray-500"
                placeholder="Type a message..."
                value={message}
                onChange={handleTyping}
              />
              <button
                type="submit"
                className="ml-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
              >
                Send
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
