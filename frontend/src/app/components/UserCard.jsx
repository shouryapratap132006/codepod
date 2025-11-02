"use client";
import { useState } from "react";

export default function UserCard({ user, onFollow, onViewProfile }) {
  return (
    <div className="bg-[#141022]/70 p-6 rounded-3xl border border-[#2E5BFF]/30 shadow-md hover:scale-[1.02] transition-transform flex flex-col items-center">
      <div className="w-12 h-12 mb-3 bg-[#2E5BFF]/50 rounded-full flex items-center justify-center text-white font-bold text-lg">
        {user.name[0]}
      </div>
      <h2 className="text-lg font-semibold mb-1">{user.name}</h2>
      <p className="text-gray-400 text-sm mb-4">{user.email}</p>
      <div className="flex gap-2">
        <button
          onClick={() => onFollow(user._id)}
          className="bg-gradient-to-r from-[#2E5BFF] to-[#00C9A7] px-3 py-1 rounded-lg font-semibold hover:from-[#1D3BFF] hover:to-[#009F87] transition-all"
        >
          Follow
        </button>
        <button
          onClick={() => onViewProfile(user._id)}
          className="border border-[#6C63FF] px-3 py-1 rounded-lg hover:bg-[#6C63FF]/20 transition-all"
        >
          View Profile
        </button>
      </div>
    </div>
  );
}
