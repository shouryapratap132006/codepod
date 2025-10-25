"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  Code,
  FolderOpen,
  MessageSquare,
  Bot,
  User,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  LogIn,
} from "lucide-react";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ✅ start as false

  useEffect(() => {
    // ✅ safely check localStorage only on client side
    if (typeof window !== "undefined") {
      setIsLoggedIn(!!localStorage.getItem("token"));
    }

    // ✅ listen for login and logout events
    const handleLoginEvent = () => setIsLoggedIn(true);
    const handleLogoutEvent = () => setIsLoggedIn(false);

    window.addEventListener("login", handleLoginEvent);
    window.addEventListener("logout", handleLogoutEvent);

    return () => {
      window.removeEventListener("login", handleLoginEvent);
      window.removeEventListener("logout", handleLogoutEvent);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);

    // 🔹 Let other tabs/components know user logged out
    window.dispatchEvent(new Event("logout"));

    router.push("/auth/signup");
  };

  const navItems = [
    { label: "Home", icon: Home, href: "/home" },
    { label: "Editor", icon: Code, href: "/editor" },
    { label: "Sessions", icon: FolderOpen, href: "/sessions" },
    { label: "Chat", icon: MessageSquare, href: "/chat" },
    { label: "AI Assistant", icon: Bot, href: "/AI-assistant" },
    { label: "Team", icon: Users, href: "/team" },
  ];

  const bottomItems = [
    { label: "Profile", icon: User, href: "/Profile" },
    isLoggedIn
      ? { label: "Logout", icon: LogOut, onClick: handleLogout }
      : { label: "Signup", icon: LogIn, href: "/auth/signup" },
  ];

  return (
    <aside
      className={`flex flex-col h-screen bg-gradient-to-b from-[#0B0A1B] via-[#141022] to-[#1A162B]
      border-r border-[#2D2845]/70 shadow-[0_0_25px_-10px_rgba(46,91,255,0.5)]
      transition-all duration-300 ${isCollapsed ? "w-20" : "w-72"}`}
    >
      {/* Header */}
      <div className="p-5 flex justify-between items-center border-b border-[#2D2845]/60">
        {!isCollapsed && <h1 className="font-extrabold text-xl text-white">CodePod 2.0</h1>}
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
            className="group flex items-center gap-3 p-3 rounded-xl transition-all
              hover:translate-x-1 hover:bg-gradient-to-r hover:from-[#2E5BFF]/20 hover:to-[#00C9A7]/10
              text-gray-300 hover:text-white"
          >
            <Icon className="w-5 h-5" />
            {!isCollapsed && <span>{label}</span>}
          </Link>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto border-t border-[#2D2845]/60 p-4 space-y-3">
        {bottomItems.map(({ label, icon: Icon, href, onClick }) =>
          href ? (
            <Link
              key={label}
              href={href}
              className="group flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:text-white"
            >
              <Icon className="w-5 h-5" />
              {!isCollapsed && <span>{label}</span>}
            </Link>
          ) : (
            <button
              key={label}
              onClick={onClick}
              className="group flex items-center gap-3 w-full p-3 rounded-xl text-gray-400 hover:text-white"
            >
              <Icon className="w-5 h-5" />
              {!isCollapsed && <span>{label}</span>}
            </button>
          )
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
