"use client";

import { useState, useEffect, useMemo } from "react";
import FollowRequestCard from "../components/FollowRequestCard.jsx";
import UserProfileModal from "../components/UserProfileModal.jsx";
import UserCard from "../components/UserCard.jsx";

export default function TeamPage() {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedProfile, setSelectedProfile] = useState(null);

  const USERS_PER_PAGE = 8;
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch all users
  useEffect(() => {
    if (!token) return;

    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
        setLoadingUsers(false);
      } catch (error) {
        console.error(error);
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, [token]);

  // Fetch follow requests
  useEffect(() => {
    if (!token) return;

    const fetchRequests = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/follow/requests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch requests");
        const data = await res.json();
        setRequests(data);
        setLoadingRequests(false);
      } catch (error) {
        console.error(error);
        setLoadingRequests(false);
      }
    };

    fetchRequests();
  }, [token]);

  // Filter users (memoized)
  const filteredUsers = useMemo(
    () =>
      users.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      ),
    [users, search]
  );

  // Update displayed users when page or filteredUsers change
  useEffect(() => {
    const start = 0;
    const end = page * USERS_PER_PAGE;
    setDisplayedUsers(filteredUsers.slice(start, end));
  }, [page, filteredUsers]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
        displayedUsers.length < filteredUsers.length
      ) {
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [displayedUsers, filteredUsers]);

  // Send follow request
  const handleFollow = async (userId) => {
    try {
      const res = await fetch(`http://localhost:4000/api/follow/${userId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) alert("Follow request sent!");
      else alert(data.message || "Error sending follow request");
    } catch (error) {
      console.error(error);
      alert("Error sending follow request");
    }
  };

  // Accept follow request
  const handleAcceptRequest = async (userId) => {
  try {
    console.log("Accepting request for userId:", userId);

    const res = await fetch(`http://localhost:4000/api/follow/accept/${userId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Response status:", res.status);
    const text = await res.text();
    console.log("Response text:", text);

    const data = JSON.parse(text);
    if (res.ok) {
      setRequests((prev) => prev.filter((req) => req._id !== userId));
      alert(data.message);
    } else {
      alert(data.message || "Error accepting follow request");
    }
  } catch (error) {
    console.error("Accept error:", error);
    alert("Error accepting follow request");
  }
};


  // Reject follow request
  const handleRejectRequest = async (userId) => {
    try {
      const res = await fetch(`http://localhost:4000/api/follow/reject/${userId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setRequests((prev) => prev.filter((req) => req._id !== userId));
      alert(data.message);
    } catch (error) {
      console.error(error);
      alert("Error rejecting request");
    }
  };

  return (
    <section className="relative py-24 px-6 bg-gradient-to-b from-[#0A0A18] via-[#141022] to-[#1A162B] min-h-screen text-white">
      {/* Incoming Follow Requests */}
      <div className="mb-12 max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-6 text-center">Incoming Follow Requests</h1>
        {loadingRequests ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : requests.length === 0 ? (
          <p className="text-center text-gray-500">No incoming requests</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requests.map((req) => (
              <FollowRequestCard
                key={req._id}
                request={req}
                onAccept={handleAcceptRequest}
                onReject={handleRejectRequest}
              />
            ))}
          </div>
        )}
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto mb-8">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 rounded-lg bg-[#1E1A2E] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2E5BFF]/60 transition-all"
        />
      </div>

      {/* Users Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {loadingUsers ? (
          <p className="text-center text-gray-400 col-span-full">Loading users...</p>
        ) : displayedUsers.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">No users found</p>
        ) : (
          displayedUsers.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              onFollow={() => handleFollow(user._id)}
              onViewProfile={() => setSelectedProfile(user._id)}
            />
          ))
        )}
      </div>

      {/* Profile Modal */}
      {selectedProfile && (
        <UserProfileModal userId={selectedProfile} token={localStorage.getItem("token")} onClose={() => setSelectedProfile(null)} />
      )}
    </section>
  );
}
