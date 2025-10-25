"use client";
import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

const BACKEND_URL = "http://localhost:4000";
const RoomContext = createContext();

export function RoomProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [username, setUsername] = useState(null);
  const [connected, setConnected] = useState(false);

  // initialize socket once
  useEffect(() => {
    const s = io(BACKEND_URL);
    setSocket(s);
    return () => s.disconnect();
  }, []);

  const joinRoom = (room, user) => {
    if (!socket) return;
    socket.emit("join-room", room, user);
    setRoomId(room);
    setUsername(user);
    setConnected(true);
  };

  const leaveRoom = () => {
    if (socket && roomId && username) {
      socket.emit("leave-room", { roomId, username });
    }
    setConnected(false);
    setRoomId(null);
    setUsername(null);
  };

  const endRoom = () => {
    if (socket && roomId) {
      socket.emit("end-room", { roomId });
    }
    setConnected(false);
    setRoomId(null);
    setUsername(null);
  };

  return (
    <RoomContext.Provider
      value={{
        socket,
        roomId,
        username,
        connected,
        joinRoom,
        leaveRoom,
        endRoom,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
}

export const useRoom = () => useContext(RoomContext);
