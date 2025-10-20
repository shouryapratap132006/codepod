"use client";

import "@/app/globals.css"; 
import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";

export default function RootLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname(); // get current route

  // Sidebar width based on collapsed state
  const sidebarWidth = isCollapsed ? 80 : 288; // 20rem = 320px; Tailwind w-72 = 288px

  return (
    <html lang="en">
      <body className="bg-[#0D0B1C] text-white min-h-screen">
        <div className="flex min-h-screen">
          {/* Sidebar fixed */}
          <div className="fixed left-0 top-0 h-screen z-50">
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
          </div>

          {/* Main content */}
          <main
            className={`flex-1 flex flex-col transition-all duration-300`}
            style={{ marginLeft: sidebarWidth }}
          >
            {/* Scrollable content */}
            <div className="flex-1 w-full bg-[#141022] shadow-2xl border border-[#2D2845] overflow-y-auto">
              {children}
            </div>

            {/* Footer aligned with main content */}
            {pathname !== "/editor" && (
              <div className="w-full">
                <Footer />
              </div>
            )}
          </main>
        </div>
      </body>
    </html>
  );
}
