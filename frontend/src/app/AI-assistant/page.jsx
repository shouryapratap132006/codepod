"use client";
import { Bot, UserCheck, Zap, Code2, Brain, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function AIAssistantPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gradient-to-b from-[#0B0A1B] via-[#141022] to-[#1A162B] p-8 rounded-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 border-b border-[#2D2845] pb-4">
        <div className="bg-purple-600/20 p-3 rounded-xl">
          <Bot className="w-7 h-7 text-purple-400" />
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          AI Assistant
        </h1>
      </div>

      {/* Intro Section */}
      <div className="bg-[#1A162B]/70 backdrop-blur-md border border-[#2D2845] rounded-2xl p-8 shadow-lg mb-10">
        <p className="text-gray-300 text-base leading-relaxed max-w-2xl">
          Meet your <span className="text-purple-400 font-medium">AI coding companion</span> —
          always ready to assist you with <span className="text-purple-400">code reviews</span>,
          debugging, and <span className="text-purple-400">intelligent recommendations</span> to
          speed up your workflow.
        </p>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AICard
          icon={<UserCheck className="w-6 h-6" />}
          title="Code Review"
          desc="Upload your code snippet and get instant AI feedback with suggestions for optimization and clarity."
          gradient="from-purple-600/30 to-purple-400/10"
        />
        <AICard
          icon={<Zap className="w-6 h-6" />}
          title="Code Suggestions"
          desc="Get intelligent autocompletion and pattern-based improvements tailored to your coding style."
          gradient="from-blue-600/30 to-blue-400/10"
        />
        <AICard
          icon={<Brain className="w-6 h-6" />}
          title="AI Debugging"
          desc="Identify and fix bugs faster using context-aware diagnostics powered by AI reasoning."
          gradient="from-pink-600/30 to-purple-400/10"
        />

      </div>
    </div>
  );
}

/* --- AICard Component --- */
function AICard({ icon, title, desc, gradient }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ type: "spring", stiffness: 250, damping: 15 }}
      className={`relative p-6 rounded-2xl border border-[#2D2845] 
        bg-gradient-to-br ${gradient} 
        hover:border-purple-400/80 shadow-lg group overflow-hidden transition-all duration-300`}
    >
      {/* Glow Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-40 transition-all rounded-2xl"></div>

      <div className="relative z-10 flex flex-col gap-3">
        <div className="text-purple-400 bg-purple-500/10 w-fit p-3 rounded-xl">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}
