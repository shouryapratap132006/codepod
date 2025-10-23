"use client";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Editor from "@monaco-editor/react";
import {
  Users,
  UserCheck,
  Play,
  Moon,
  Sun,
  Lock,
  Key,
  Terminal as TerminalIcon,
  Edit3,
} from "lucide-react";

const BACKEND_URL = "http://localhost:4000";
const DEFAULT_LANGUAGE = "python";
const SUPPORTED_LANGUAGES = ["javascript", "python", "java", "cpp"];

export default function EditorPage() {
  const [socket, setSocket] = useState(null);
  const [code, setCode] = useState("# Start coding together!");
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("room1");
  const [theme, setTheme] = useState("vs-dark");
  const [lockedRanges, setLockedRanges] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState(DEFAULT_LANGUAGE);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isRestricted, setIsRestricted] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState("");
  const [terminalHeight, setTerminalHeight] = useState(200);
  const [sessionName, setSessionName] = useState("Untitled Session");

  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const remoteDecorations = useRef({});
  const remoteWidgets = useRef({});
  const isResizing = useRef(false);

  const getUserColor = (name) => {
    const colors = ["#00C9A7", "#FF6B6B", "#FFD93D", "#4ECDC4", "#845EC2"];
    let hash = 0;
    for (let i = 0; i < name.length; i++)
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setRoomId(params.get("roomId") || "room1");
    setUsername(
      params.get("username") || "User-" + Math.floor(Math.random() * 1000)
    );
  }, []);

  useEffect(() => {
    if (!username || !roomId) return;
    const s = io(BACKEND_URL);
    setSocket(s);

    s.emit("join-room", roomId, username);

    s.on("load-code", (serverCode) => setCode(serverCode));
    s.on("users-update", ({ users }) => {
      setUsers(users);
      setIsAdmin(users[0] === username);
    });
    s.on("code-update", (newCode) => {
      if (editorRef.current && editorRef.current.getValue() !== newCode)
        editorRef.current.setValue(newCode);
    });

    // 🧠 Cursor update with username label
    s.on("cursor-update", ({ username: uName, position }) => {
      if (!editorRef.current || !monacoRef.current || uName === username) return;
      const editor = editorRef.current;
      const monaco = monacoRef.current;
      const color = getUserColor(uName);

      if (remoteWidgets.current[uName])
        editor.removeContentWidget(remoteWidgets.current[uName]);

      const widgetId = "cursor-widget-" + uName;
      const widget = {
        getId: () => widgetId,
        getDomNode: () => {
          const wrapper = document.createElement("div");
          wrapper.style.display = "flex";
          wrapper.style.flexDirection = "column";
          wrapper.style.alignItems = "center";

          const nameTag = document.createElement("div");
          nameTag.textContent = uName;
          nameTag.style.background = color;
          nameTag.style.color = "white";
          nameTag.style.padding = "1px 6px";
          nameTag.style.borderRadius = "6px";
          nameTag.style.fontSize = "10px";
          nameTag.style.marginBottom = "2px";

          const cursor = document.createElement("div");
          cursor.style.backgroundColor = color;
          cursor.style.width = "2px";
          cursor.style.height = "18px";

          wrapper.appendChild(nameTag);
          wrapper.appendChild(cursor);
          return wrapper;
        },
        getPosition: () => ({
          position,
          preference: [monaco.editor.ContentWidgetPositionPreference.ABOVE],
        }),
      };
      editor.addContentWidget(widget);
      remoteWidgets.current[uName] = widget;

      const range = new monaco.Range(
        position.lineNumber,
        position.column,
        position.lineNumber,
        position.column
      );
      remoteDecorations.current[uName] = editor.deltaDecorations(
        remoteDecorations.current[uName] || [],
        [
          {
            range,
            options: {
              inlineClassName: `remote-line-${uName}`,
            },
          },
        ]
      );

      if (!document.getElementById(`style-${uName}`)) {
        const style = document.createElement("style");
        style.id = `style-${uName}`;
        style.innerHTML = `.remote-line-${uName} { background-color: ${color}33 !important; }`;
        document.head.appendChild(style);
      }
    });

    // 🔒 Restriction system
    s.on("global-restrict-toggle", (restricted) => setIsRestricted(restricted));

    s.on("execution-result", (res) => setTerminalOutput(res));

    // 🎯 Session Name Sync
    s.on("session-name-update", (newName) => setSessionName(newName));

    return () => s.disconnect();
  }, [username, roomId]);

  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    editor.onDidChangeModelContent(() => {
      if (isRestricted && !isAdmin) return;
      const val = editor.getValue();
      setCode(val);
      if (socket) socket.emit("code-change", { roomId, code: val });
    });

    editor.onDidChangeCursorPosition((e) => {
      if (socket)
        socket.emit("cursor-move", { roomId, username, position: e.position });
    });
  };

  const handleEditorChange = (newVal) => {
    if (isRestricted && !isAdmin) return;
    setCode(newVal);
    if (socket) socket.emit("code-change", { roomId, code: newVal });
  };

  const toggleTheme = () =>
    setTheme(theme === "vs-dark" ? "vs-light" : "vs-dark");

  const handleLanguageChange = (e) => setCurrentLanguage(e.target.value);

  const handleRestrictionToggle = () => {
    if (isAdmin && socket) {
      const newState = !isRestricted;
      setIsRestricted(newState);
      socket.emit("admin-restrict-toggle", newState);
    }
  };

  const runCode = () => {
    if (socket) socket.emit("execute-code", { code, language: currentLanguage });
  };

  // 🧩 Session Name Change (Admin Only)
  const handleSessionNameChange = (e) => {
    if (!isAdmin) return;
    const newName = e.target.value;
    setSessionName(newName);
    if (socket) socket.emit("session-name-change", newName);
  };

  const startResizing = (e) => {
    e.preventDefault();
    isResizing.current = true;
  };
  const stopResizing = () => (isResizing.current = false);
  const handleResizing = (e) => {
    if (isResizing.current) {
      const newHeight = window.innerHeight - e.clientY;
      if (newHeight > 100 && newHeight < 500) setTerminalHeight(newHeight);
    }
  };
  useEffect(() => {
    window.addEventListener("mousemove", handleResizing);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", handleResizing);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, []);

  return (
    <div className="flex h-screen bg-[#1A1B26] text-[#C0CADC] font-inter">
      {/* Sidebar */}
      <aside className="w-64 bg-[#232634] border-r border-[#2E5BFF]/30 p-5 flex flex-col">
        <h2 className="text-lg font-semibold mb-3 text-[#7AA2F7] flex items-center gap-2">
          <Users size={18} /> Room: <span className="text-white">{roomId}</span>
        </h2>

        <p className="text-[#5F7290] text-sm mb-2 flex items-center gap-2">
          <Users size={14} /> Active Users: {users.length}
        </p>

        <ul className="space-y-2 overflow-y-auto mb-4">
          {users.map((u, i) => (
            <li
              key={i}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition ${
                u === username
                  ? "bg-[#2E5BFF]/20"
                  : "hover:bg-[#2E5BFF]/10 bg-[#1E1A2E]/40"
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: getUserColor(u) }}
              ></span>
              {u === username && <UserCheck size={14} />}
              <span className="text-sm">
                {u === username ? `${u} (You)` : u}
              </span>
            </li>
          ))}
        </ul>

        <select
          value={currentLanguage}
          onChange={handleLanguageChange}
          className="p-2 rounded bg-[#1E1A2E] text-white outline-none border border-[#2E5BFF]/30 mb-3"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {lang.toUpperCase()}
            </option>
          ))}
        </select>

        <div className="mt-auto flex flex-col gap-2">
          <button
            onClick={toggleTheme}
            className="py-2 px-3 bg-[#2E5BFF]/40 rounded flex items-center justify-center gap-2 hover:bg-[#2E5BFF]/60 transition"
          >
            {theme === "vs-dark" ? <Sun size={16} /> : <Moon size={16} />} Theme
          </button>

          {isAdmin && (
            <button
              onClick={handleRestrictionToggle}
              className={`py-2 px-3 rounded flex items-center justify-center gap-2 transition ${
                isRestricted
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {isRestricted ? <Key size={16} /> : <Lock size={16} />}{" "}
              {isRestricted ? "Allow Editing" : "Restrict Editing"}
            </button>
          )}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* 🧠 Session Name */}
        <div className="flex items-center justify-between bg-[#11121A] border-b border-[#2E5BFF]/20 px-5 py-3">
          <div className="flex items-center gap-2 text-[#7AA2F7]">
            <Edit3 size={16} />
            {isAdmin ? (
              <input
                type="text"
                value={sessionName}
                onChange={handleSessionNameChange}
                className="bg-transparent border-b border-[#7AA2F7]/40 outline-none text-white px-2 text-sm"
              />
            ) : (
              <span className="font-medium text-white text-sm">
                {sessionName}
              </span>
            )}
          </div>
        </div>

        <Editor
          height={`calc(100% - ${terminalHeight}px)`}
          theme={theme}
          language={currentLanguage}
          value={code}
          onChange={handleEditorChange}
          onMount={handleEditorMount}
          options={{
            padding: { top: 10 },
            fontSize: 15,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            readOnly: isRestricted && !isAdmin,
          }}
        />

        <div
          className="h-2 bg-[#2E2E3E] cursor-row-resize"
          onMouseDown={startResizing}
        ></div>

        <div
          className="bg-[#11121A] text-[#9ECE6A] border-t border-[#2E5BFF]/20 overflow-auto"
          style={{ height: `${terminalHeight}px` }}
        >
          <div className="flex items-center justify-between px-4 py-2 border-b border-[#2E5BFF]/10">
            <div className="flex items-center gap-2 text-[#7AA2F7]">
              <TerminalIcon size={16} />
              <span className="font-semibold text-sm">Terminal</span>
            </div>
            <button
              onClick={runCode}
              className="bg-[#7AA2F7]/40 px-3 py-1 rounded flex items-center gap-1 hover:bg-[#7AA2F7]/60 transition"
            >
              <Play size={14} /> Run
            </button>
          </div>
          <pre className="p-3 text-sm whitespace-pre-wrap leading-relaxed">
            {terminalOutput}
          </pre>
        </div>
      </main>
    </div>
  );
}
