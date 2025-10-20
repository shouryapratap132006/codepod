"use client";

import Link from "next/link";
import {
  Home,
  Code,
  FolderOpen,
  MessageSquare,
  Bot,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const navItems = [
    { label: "Home", icon: Home, href: "/home" },
    { label: "Editor", icon: Code, href: "/editor" },
    { label: "Sessions", icon: FolderOpen, href: "/sessions" },
    { label: "Chat", icon: MessageSquare, href: "/chat" },
    { label: "AI Assistant", icon: Bot, href: "/AI-assistant" },
    { label: "Team", icon: Users, href: "/team" },
  ];

  const bottomItems = [
    { label: "Settings", icon: Settings, href: "/settings" },
    { label: "Sign Out", icon: LogOut, href: "/signout" },
  ];

  return (
    <aside
      className={`flex flex-col h-screen bg-gradient-to-b from-[#0B0A1B] via-[#141022] to-[#1A162B] border-r border-[#2D2845]/70 shadow-[0_0_25px_-10px_rgba(46,91,255,0.5)] transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-72"
      }`}
    >
      {/* Header */}
      <div className="p-5 flex justify-between items-center border-b border-[#2D2845]/60">
        {!isCollapsed && (
          <h1 className="font-extrabold text-xl text-white flex items-center gap-2 tracking-tight">
            <span className="relative">
              <Code className="w-6 h-6 text-[#6C63FF] drop-shadow-[0_0_10px_rgba(108,99,255,0.8)]" />
            </span>
            <span className="bg-gradient-to-r from-[#2E5BFF] to-[#00C9A7] text-transparent bg-clip-text">
              CodePod <span className="text-[#6C63FF]">2.0</span>
            </span>
          </h1>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-[#2D2845]/60 text-gray-300 hover:text-white transition"
        >
          {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 mt-4 space-y-2 flex-1 overflow-y-auto scrollbar-hide">
        {navItems.map(({ label, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="group flex items-center gap-3 p-3 rounded-xl transition-all hover:translate-x-1 hover:bg-gradient-to-r hover:from-[#2E5BFF]/20 hover:to-[#00C9A7]/10 text-gray-300 hover:text-white"
          >
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-r from-[#2E5BFF] to-[#00C9A7] opacity-0 group-hover:opacity-70 blur-md transition-all rounded-full"></div>
              <Icon className="w-5 h-5 relative z-10 group-hover:text-[#00C9A7] transition-all" />
            </div>
            {!isCollapsed && (
              <span className="font-medium tracking-wide">{label}</span>
            )}
          </Link>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto border-t border-[#2D2845]/60 p-4 space-y-3">
        {bottomItems.map(({ label, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="group flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-gradient-to-r hover:from-[#6C63FF]/20 hover:to-[#2E5BFF]/10 text-gray-400 hover:text-white"
          >
            <Icon className="w-5 h-5 group-hover:text-[#6C63FF] transition-all" />
            {!isCollapsed && <span>{label}</span>}
          </Link>
        ))}

        {/* Upgrade Section
        {!isCollapsed && (
          <div className="bg-gradient-to-r from-[#6C63FF] to-[#2E5BFF] text-white text-center mt-6 p-4 rounded-xl shadow-[0_0_25px_-10px_rgba(108,99,255,0.8)] hover:scale-[1.03] transition-transform cursor-pointer">
            <p className="font-semibold">Upgrade to Pro</p>
            <p className="text-xs text-white/70">Unlock AI & Sessions</p>
          </div>
        )} */}
      </div>
    </aside>
  );
};

export default Sidebar;
