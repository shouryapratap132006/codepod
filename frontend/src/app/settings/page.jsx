"use client";

import { Settings, Lock, Sparkles, Bell, User } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const settings = [
    {
      icon: <User className="w-6 h-6" />,
      title: "Account",
      desc: "Update your personal information and login details.",
      color: "from-blue-500/20 to-cyan-400/10",
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Privacy",
      desc: "Manage access permissions and visibility options.",
      color: "from-purple-600/20 to-indigo-500/10",
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Notifications",
      desc: "Control alerts, reminders, and communication preferences.",
      color: "from-yellow-500/20 to-orange-400/10",
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Theme",
      desc: "Customize your workspace’s colors and visual style.",
      color: "from-pink-500/20 to-violet-400/10",
    },
  ];

  return (
    <div className="p-10 bg-gradient-to-b from-[#0B0A1B] via-[#141022] to-[#1A162B] min-h-screen text-white rounded-2xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex items-center gap-4 mb-12 border-b border-[#2D2845] pb-5"
      >
        <div className="bg-purple-600/20 p-4 rounded-xl backdrop-blur-sm">
          <Settings className="w-7 h-7 text-purple-400" />
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
          <p className="text-gray-400 text-sm mt-1">
            Control and personalize your experience ⚙️
          </p>
        </div>
      </motion.div>

      {/* Settings Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
      >
        {settings.map((item, i) => (
          <SettingCard key={i} item={item} />
        ))}
      </motion.div>
    </div>
  );
}

function SettingCard({ item }) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 200, damping: 16 }}
      className={`relative p-6 rounded-2xl border border-[#2D2845] bg-gradient-to-br ${item.color} 
      hover:border-purple-400/60 shadow-lg hover:shadow-purple-500/10 group transition-all duration-300 backdrop-blur-sm`}
    >
      {/* Glow Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-30 transition-all rounded-2xl" />

      <div className="relative z-10 flex flex-col items-start gap-3">
        {/* Icon */}
        <motion.div
          whileHover={{ rotate: 10 }}
          transition={{ duration: 0.3 }}
          className="bg-purple-600/10 p-3 rounded-xl text-purple-400 group-hover:text-purple-300 transition"
        >
          {item.icon}
        </motion.div>

        {/* Text */}
        <div>
          <h3 className="font-semibold text-lg">{item.title}</h3>
          <p className="text-gray-400 text-sm mt-1">{item.desc}</p>
        </div>

        {/* Glow Sparkle */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition">
          <Sparkles className="w-4 h-4 text-purple-400" />
        </div>
      </div>
    </motion.div>
  );
}
