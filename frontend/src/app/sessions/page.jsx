"use client";
import { FolderOpen, Users, Clock, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function SessionsPage() {
  const sessions = [
    {
      title: "Frontend Sprint",
      participants: 3,
      duration: "2 hrs ago",
      color: "from-purple-600/30 to-purple-400/10",
    },
    {
      title: "API Integration",
      participants: 2,
      duration: "1 hr ago",
      color: "from-blue-600/30 to-blue-400/10",
    },
    {
      title: "Bug Fix Marathon",
      participants: 4,
      duration: "30 mins ago",
      color: "from-pink-600/30 to-purple-400/10",
    },
    {
      title: "Design Sync",
      participants: 5,
      duration: "Ongoing",
      color: "from-indigo-600/30 to-cyan-400/10",
    },
  ];

  return (
    <div className="p-8 bg-gradient-to-b from-[#0B0A1B] via-[#141022] to-[#1A162B] min-h-[calc(100vh-4rem)] rounded-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 border-b border-[#2D2845] pb-4">
        <div className="bg-purple-600/20 p-3 rounded-xl">
          <FolderOpen className="w-7 h-7 text-purple-400" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Active Sessions</h1>
      </div>

      {/* Grid of Sessions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {sessions.map((session, i) => (
          <SessionCard
            key={i}
            title={session.title}
            participants={session.participants}
            duration={session.duration}
            gradient={session.color}
          />
        ))}
      </div>
    </div>
  );
}

function SessionCard({ title, participants, duration, gradient }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -6 }}
      transition={{ type: "spring", stiffness: 220, damping: 15 }}
      className={`relative p-6 rounded-2xl border border-[#2D2845] 
        bg-gradient-to-br ${gradient} 
        hover:border-purple-400/80 shadow-lg group overflow-hidden transition-all duration-300`}
    >
      {/* Glow Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-30 transition-all rounded-2xl"></div>

      <div className="relative z-10 flex flex-col gap-4">
        {/* Title */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <Sparkles className="w-5 h-5 text-purple-400 opacity-80" />
        </div>

        {/* Participants */}
        <div className="flex items-center text-gray-400 gap-2 text-sm">
          <Users className="w-4 h-4 text-purple-400" />
          {participants} participants
        </div>

        {/* Duration */}
        <div className="flex items-center text-gray-500 gap-2 text-xs mt-2">
          <Clock className="w-4 h-4 text-gray-400" />
          {duration}
        </div>
      </div>
    </motion.div>
  );
}
