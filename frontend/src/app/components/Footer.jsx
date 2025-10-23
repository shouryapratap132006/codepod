"use client";

import { Github, Twitter, Linkedin, Mail, Heart, Code2 } from "lucide-react";
import Link from "next/link";

const Footer = ({ isCollapsed }) => {
  return (
    <footer
      className={`relative bg-gradient-to-b from-[#1A162B] via-[#231D3C] to-[#2D1F4C] text-gray-300 py-8 px-6 border-t border-[#2D2845] overflow-hidden transition-all duration-300`}
    >
      {/* Glowing Background */}
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_left,_rgba(124,58,237,0.25),_transparent_60%)] blur-3xl"></div>
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.25),_transparent_60%)] blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 z-10">
        {/* Brand Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
            <Code2 className="w-6 h-6 text-purple-400" />
            CodePod <span className="text-purple-400">2.0</span>
          </h2>
          <p className="text-xs text-gray-400 mb-4 leading-relaxed">
            A collaborative hub for developers to code, share ideas, and grow together. 🚀
          </p>

          <div className="flex gap-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Github className="w-5 h-5 hover:text-purple-400 transition-transform transform hover:scale-110" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <Twitter className="w-5 h-5 hover:text-sky-400 transition-transform transform hover:scale-110" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <Linkedin className="w-5 h-5 hover:text-blue-500 transition-transform transform hover:scale-110" />
            </a>
            <a href="mailto:support@codepod.com">
              <Mail className="w-5 h-5 hover:text-rose-400 transition-transform transform hover:scale-110" />
            </a>
          </div>
        </div>

        {/* Explore Links */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-8 after:h-[1.5px] after:bg-purple-500">
            Explore
          </h3>
          <ul className="space-y-2 text-xs">
            <li><Link href="/home" className="hover:text-purple-400 transition">Home</Link></li>
            <li><Link href="/sessions" className="hover:text-purple-400 transition">Sessions</Link></li>
            <li><Link href="/chat" className="hover:text-purple-400 transition">AI Chat</Link></li>
            <li><Link href="/team" className="hover:text-purple-400 transition">Team</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-8 after:h-[1.5px] after:bg-indigo-500">
            Resources
          </h3>
          <ul className="space-y-2 text-xs">
            <li><Link href="/docs" className="hover:text-indigo-400 transition">Documentation</Link></li>
            <li><Link href="/tutorials" className="hover:text-indigo-400 transition">Tutorials</Link></li>
            <li><Link href="/api" className="hover:text-indigo-400 transition">API Reference</Link></li>
            <li><Link href="/community" className="hover:text-indigo-400 transition">Community Forum</Link></li>
          </ul>
        </div>

        {/* Support & Legal */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-8 after:h-[1.5px] after:bg-pink-500">
            Support
          </h3>
          <ul className="space-y-2 text-xs">
            <li><Link href="/about" className="hover:text-pink-400 transition">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-pink-400 transition">Contact</Link></li>
            <li><Link href="/privacy" className="hover:text-pink-400 transition">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-pink-400 transition">Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-[#2D2845] mt-8 pt-4 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 z-10">
        <p>© {new Date().getFullYear()} <span className="text-purple-400 font-semibold">CodePod 2.0</span> — All rights reserved.</p>
        <p className="flex items-center gap-1 mt-2 md:mt-0">
          Made with <Heart className="w-3 h-3 text-purple-400" /> by the{" "}
          <span className="text-purple-300 font-medium">CodePod Team</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
