"use client";

import { Users, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function TeamPage() {
  const team = [
    { name: "Alice", role: "Frontend Developer", color: "from-fuchsia-500/20 to-purple-700/10", img: "https://i.pravatar.cc/150?img=5" },
    { name: "Bob", role: "Backend Engineer", color: "from-blue-600/20 to-cyan-500/10", img: "https://i.pravatar.cc/150?img=6" },
    { name: "Charlie", role: "UI/UX Designer", color: "from-pink-500/20 to-violet-400/10", img: "https://i.pravatar.cc/150?img=7" },
    { name: "David", role: "DevOps Specialist", color: "from-emerald-500/20 to-teal-400/10", img: "https://i.pravatar.cc/150?img=8" },
    { name: "Eva", role: "AI Engineer", color: "from-yellow-500/20 to-orange-400/10", img: "https://i.pravatar.cc/150?img=9" },
  ];

  return (
    <div className="p-10 bg-gradient-to-b from-[#0B0A1B] via-[#141022] to-[#1A162B] min-h-screen text-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex items-center gap-4 mb-12 border-b border-[#2D2845] pb-5"
      >
        <div className="bg-purple-600/20 p-4 rounded-xl backdrop-blur-sm">
          <Users className="w-7 h-7 text-purple-400" />
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Our Creative Team</h1>
          <p className="text-gray-400 text-sm mt-1">Meet the innovators behind the experience ✨</p>
        </div>
      </motion.div>

      {/* Team Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
      >
        {team.map((member, i) => (
          <TeamCard key={i} member={member} />
        ))}
      </motion.div>
    </div>
  );
}

function TeamCard({ member }) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 220, damping: 15 }}
      className={`relative rounded-2xl border border-[#2D2845] bg-gradient-to-br ${member.color} 
      hover:border-purple-500/60 shadow-xl hover:shadow-purple-500/10 overflow-hidden backdrop-blur-sm transition-all duration-300`}
    >
      {/* Hover Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-transparent opacity-0 group-hover:opacity-30 transition-all duration-300" />

      {/* Content */}
      <div className="relative z-10 p-6 flex flex-col items-center text-center space-y-4">
        {/* Avatar */}
        <div className="relative">
          <div className="absolute inset-0 blur-lg bg-purple-500/30 rounded-full opacity-0 group-hover:opacity-70 transition-all duration-300"></div>
          <img
            src={member.img}
            alt={member.name}
            className="relative w-24 h-24 object-cover rounded-full border-2 border-[#2D2845] shadow-inner"
          />
        </div>

        {/* Name & Role */}
        <div>
          <h3 className="text-xl font-semibold tracking-tight">{member.name}</h3>
          <p className="text-gray-400 text-sm mt-1">{member.role}</p>
        </div>

        {/* Sparkle Icon */}
        <div className="text-purple-400 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Sparkles className="w-5 h-5" />
        </div>
      </div>

      {/* Glow Border Effect */}
      <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-purple-400/50 transition-all duration-500"></div>
    </motion.div>
  );
}
