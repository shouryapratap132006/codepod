"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Award, Briefcase, X } from "lucide-react";

export default function UserProfileModal({ userId, token, onClose }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId || !token) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 404) {
          setError("This profile does not exist.");
          setLoading(false);
          return;
        }

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || "Failed to fetch profile");
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("❌ Error fetching profile:", err);
        setError("An error occurred while loading this profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, token]);

  if (!userId) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="bg-[#141022]/90 border border-[#2E5BFF]/30 p-8 rounded-3xl max-w-md w-full text-white relative shadow-[0_0_30px_-10px_rgba(46,91,255,0.4)]"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white font-bold transition-all"
        >
          <X size={20} />
        </button>

        {loading ? (
          <p className="text-center text-gray-400">Loading profile...</p>
        ) : error ? (
          <p className="text-center text-red-400 font-semibold mt-6">{error}</p>
        ) : user ? (
          <>
            {/* Profile Header */}
            <div className="flex flex-col items-center mb-6">
              <div className="bg-[#1E1A2E] p-4 rounded-full mb-3">
                <User className="w-12 h-12 text-[#FFD93D]" />
              </div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-gray-400">{user.email}</p>
              {user.designation && (
                <p className="mt-2 flex items-center gap-2 text-[#00C9A7]">
                  <Briefcase size={16} /> {user.designation}
                </p>
              )}
            </div>

            {/* Profile Info */}
            <div className="space-y-3">
              {user.bio && (
                <p className="text-gray-300 text-sm leading-relaxed italic">
                  “{user.bio}”
                </p>
              )}

              <div className="flex justify-around mt-4 mb-3 text-sm">
                <div className="text-center">
                  <p className="text-lg font-bold text-[#FFD93D]">
                    {user.followersCount}
                  </p>
                  <p className="text-gray-400">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-[#00C9A7]">
                    {user.followingCount}
                  </p>
                  <p className="text-gray-400">Following</p>
                </div>
              </div>

              {user.achievements?.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-2 text-[#6C63FF]">
                    <Award size={18} /> Achievements
                  </h3>
                  <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                    {user.achievements.map((ach, index) => (
                      <li key={index}>{ach}</li>
                    ))}
                  </ul>
                </div>
              )}

              {user.socialLink && (
                <div className="mt-5 text-center">
                  <a
                    href={user.socialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00C9A7] hover:underline font-medium"
                  >
                    Visit Social Profile
                  </a>
                </div>
              )}
            </div>
          </>
        ) : (
          <p className="text-center text-red-400">Profile not found.</p>
        )}
      </motion.div>
    </div>
  );
}
