"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Edit3, Save } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    bio: "",
    designation: "",
    achievements: [""],
    followersCount: 0,
    followingCount: 0,
  });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch profile on mount
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    async function fetchProfile() {
      try {
        const res = await fetch("http://localhost:4000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        console.log("✅ Profile fetched:", data);

        setUser({
              name: data.name || "",
              email: data.email || "",
            });
        setProfile({
          bio: data.bio || data.profile?.bio || "",
          designation: data.designation || data.profile?.designation || "",
          achievements:
            data.achievements ||
            (data.profile?.achievements?.length
              ? data.profile.achievements
              : [""]),
          followersCount: data.followersCount ?? 0,
          followingCount: data.followingCount ?? 0,
        });
      } catch (err) {
        console.error("❌ Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [token]);

  const handleChange = (e) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleAchievementChange = (i, val) => {
    const updated = [...profile.achievements];
    updated[i] = val;
    setProfile({ ...profile, achievements: updated });
  };

  const addAchievement = () =>
    setProfile({ ...profile, achievements: [...profile.achievements, ""] });

  const saveProfile = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });

      if (!res.ok) throw new Error("Save failed");
      setEditMode(false);
      alert("Profile updated!");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-300">Loading...</p>;

  if (!token)
    return (
      <div className="max-w-xl mx-auto p-8 mt-20 mb-20 text-center bg-[#150f22] bg-gradient-to-b from-[#0A0A18] via-[#141022] to-[#1A162B] text-white rounded-2xl shadow-md border border-gray-800">
        <h2 className="text-2xl font-semibold mb-3">Please Sign In</h2>
        <p className="text-gray-400 mb-6">
          You need to sign in to view your profile.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="px-6 py-3 text-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
        >
          Go to Sign In
        </button>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto mt-16 mb-20 bg-[#150f22] bg-gradient-to-b from-[#0A0A18] via-[#141022] to-[#1A162B] text-white rounded-2xl shadow-md border border-gray-800 p-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-10 border-b border-gray-800 pb-10">
        {/* Profile Image Placeholder */}
        <div className="w-40 h-40 flex items-center justify-center rounded-full bg-gray-800 text-4xl font-semibold text-gray-300">
          {user?.name
            ? user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
            : "U"}
        </div>

        {/* Basic Info */}
        <div className="flex-1">
          <h1 className="text-3xl font-semibold">{user?.name || "User"}</h1>
          <p className="text-gray-400 text-lg mt-1">{user?.email}</p>

          {/* Follower Info */}
          <div className="flex items-center gap-6 mt-4 text-gray-300">
            <p>
              <span className="font-semibold text-white">
                {profile.followersCount}
              </span>{" "}
              Followers
            </p>
            <p>
              <span className="font-semibold text-white">
                {profile.followingCount}
              </span>{" "}
              Following
            </p>
          </div>

          <button
            onClick={() => {
              if (editMode) saveProfile();
              else setEditMode(true);
            }}
            className="mt-6 flex items-center gap-2 px-6 py-3 text-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
          >
            {editMode ? (
              <>
                <Save size={20} /> Save Profile
              </>
            ) : (
              <>
                <Edit3 size={20} /> Edit Profile
              </>
            )}
          </button>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-10 grid gap-8">
        {/* Designation */}
        <div>
          <h2 className="text-xl font-semibold text-gray-200 mb-2">
            Designation
          </h2>
          {editMode ? (
            <input
              name="designation"
              value={profile.designation}
              onChange={handleChange}
              placeholder="e.g. Software Developer"
              className="w-full bg-[#13131a] border border-gray-700 rounded-lg p-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-400 text-lg">{profile.designation || "—"}</p>
          )}
        </div>

        {/* Achievements */}
        <div>
          <h2 className="text-xl font-semibold text-gray-200 mb-2">
            Achievements
          </h2>
          {editMode ? (
            <>
              {profile.achievements.map((ach, i) => (
                <input
                  key={i}
                  value={ach}
                  onChange={(e) => handleAchievementChange(i, e.target.value)}
                  placeholder={`Achievement ${i + 1}`}
                  className="w-full bg-[#13131a] border border-gray-700 rounded-lg p-3 text-gray-200 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ))}
              <button
                onClick={addAchievement}
                className="mt-1 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 text-sm transition"
              >
                + Add Achievement
              </button>
            </>
          ) : (
            <ul className="space-y-1">
              {profile.achievements
                .filter((a) => a.trim() !== "")
                .map((ach, i) => (
                  <li key={i} className="text-gray-400 text-lg">
                    • {ach}
                  </li>
                ))}
            </ul>
          )}
        </div>

        {/* Bio */}
        <div>
          <h2 className="text-xl font-semibold text-gray-200 mb-2">Bio</h2>
          {editMode ? (
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              rows={3}
              placeholder="Write a short bio..."
              className="w-full bg-[#13131a] border border-gray-700 rounded-lg p-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-400 text-lg">{profile.bio || "—"}</p>
          )}
        </div>
      </div>
    </div>
  );
}
