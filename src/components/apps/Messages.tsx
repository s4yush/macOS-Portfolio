import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  text: string;
  from: "me" | "them";
  time: string;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  preview: string;
  time: string;
  unread?: number;
  messages: Message[];
  online?: boolean;
}

const CONVERSATIONS: Conversation[] = [
  {
    id: "1",
    name: "Recruiter @ Google",
    avatar: "🏢",
    preview: "We'd love to schedule a call!",
    time: "Now",
    unread: 2,
    online: true,
    messages: [
      { id: "1", text: "Hi! We came across your portfolio and were really impressed.", from: "them", time: "10:30 AM" },
      { id: "2", text: "Thanks! I'm glad you liked it.", from: "me", time: "10:32 AM" },
      { id: "3", text: "We'd love to schedule a call to discuss opportunities at Google.", from: "them", time: "10:33 AM" },
      { id: "4", text: "We'd love to schedule a call!", from: "them", time: "10:35 AM" },
    ],
  },
  {
    id: "2",
    name: "Team SkillExchange",
    avatar: "i-ph:lightbulb",
    preview: "PR #42 merged successfully",
    time: "2m",
    messages: [
      { id: "1", text: "Hey, the new feature looks great!", from: "them", time: "9:00 AM" },
      { id: "2", text: "Thanks! Just pushed the Liquid Glass update.", from: "me", time: "9:05 AM" },
      { id: "3", text: "PR #42 merged successfully", from: "them", time: "9:10 AM" },
    ],
  },
  {
    id: "3",
    name: "Mom",
    avatar: "👩",
    preview: "Beta aa ja khaana thanda ho raha hai",
    time: "1h",
    messages: [
      { id: "1", text: "Beta aa ja khaana thanda ho raha hai", from: "them", time: "8:00 AM" },
      { id: "2", text: "Coming in 5 min maa 😅", from: "me", time: "8:02 AM" },
    ],
  },
  {
    id: "4",
    name: "GitHub Notifications",
    avatar: "🐙",
    preview: "New star on macOS-Portfolio!",
    time: "3h",
    messages: [
      { id: "1", text: "⭐ s4yush/macOS-Portfolio received a new star!", from: "them", time: "7:00 AM" },
      { id: "2", text: "🔔 New issue opened: 'Feature request: Dark mode improvements'", from: "them", time: "7:30 AM" },
    ],
  },
];

export default function MessagesApp() {
  const [activeConv, setActiveConv] = useState(CONVERSATIONS[0]);
  const [input, setInput] = useState("");
  const [conversations, setConversations] = useState(CONVERSATIONS);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [activeConv, conversations]); // scroll to bottom on new message or conversation change

  const send = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      from: "me",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConv.id
          ? { ...c, messages: [...c.messages, newMsg], preview: input.trim(), time: "Now" }
          : c
      )
    );
    setActiveConv((prev) => ({
      ...prev,
      messages: [...prev.messages, newMsg],
    }));
    setInput("");
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        
        background: "rgba(248,248,250,0.99)",
        borderRadius: "0 0 14px 14px",
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "230px",
          flexShrink: 0,
          borderRight: "0.5px solid rgba(0,0,0,0.1)",
          background: "rgba(242,242,247,0.98)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "10px",
            borderBottom: "0.5px solid rgba(0,0,0,0.08)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(0,0,0,0.07)",
              borderRadius: "9px",
              padding: "5px 9px",
            }}
          >
            <span className="i-ph:magnifying-glass" style={{ width: "11px", height: "11px", opacity: 0.5 }} />
            <input
              placeholder="Search"
              style={{
                background: "none",
                border: "none",
                outline: "none",
                fontSize: "16px",
                width: "100%",
                color: "#1c1c1e",
              }}
            />
          </div>
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "18px",
              color: "#007AFF",
              padding: "0 2px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span className="i-ph:pencil-simple" style={{ width: "18px", height: "18px" }} />
          </button>
        </div>

        {/* Conversations */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => {
                setActiveConv(conv);
                setConversations((prev) =>
                  prev.map((c) => (c.id === conv.id ? { ...c, unread: 0 } : c))
                );
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 12px",
                background: activeConv.id === conv.id ? "rgba(0,122,255,0.1)" : "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                borderRadius: "10px",
                margin: "1px 4px",
                width: "calc(100% - 8px)",
                transition: "background 0.15s ease",
              }}
            >
              {/* Avatar */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #007AFF, #AF52DE)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                  }}
                >
                  {conv.avatar.startsWith("i-")
                    ? <span className={conv.avatar} style={{ width: "20px", height: "20px", color: "white" }} />
                    : conv.avatar}
                </div>
                {conv.online && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "#34C759",
                      border: "2px solid rgba(242,242,247,0.98)",
                    }}
                  />
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: conv.unread ? 700 : 500,
                      color: "#1c1c1e",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: "120px",
                    }}
                  >
                    {conv.name}
                  </span>
                  <span style={{ fontSize: "11px", color: "rgba(0,0,0,0.4)", flexShrink: 0 }}>
                    {conv.time}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1px" }}>
                  <span
                    style={{
                      fontSize: "12px",
                      color: conv.unread ? "#1c1c1e" : "rgba(0,0,0,0.4)",
                      fontWeight: conv.unread ? 500 : 400,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: "130px",
                    }}
                  >
                    {conv.preview}
                  </span>
                  {conv.unread ? (
                    <div
                      style={{
                        minWidth: 18,
                        height: 18,
                        borderRadius: 9,
                        background: "#007AFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "11px",
                        color: "white",
                        fontWeight: 700,
                        padding: "0 4px",
                        flexShrink: 0,
                      }}
                    >
                      {conv.unread}
                    </div>
                  ) : null}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <div
          style={{
            padding: "10px 16px",
            borderBottom: "0.5px solid rgba(0,0,0,0.08)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "rgba(248,248,250,0.99)",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #007AFF, #AF52DE)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
            }}
          >
            {activeConv.avatar.startsWith("i-")
              ? <span className={activeConv.avatar} style={{ width: "16px", height: "16px", color: "white" }} />
              : activeConv.avatar}
          </div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "#1c1c1e" }}>
              {activeConv.name}
            </div>
            {activeConv.online && (
              <div style={{ fontSize: "11px", color: "#34C759" }}>Active now</div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div
          ref={scrollContainerRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <AnimatePresence>
            {activeConv.messages.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: i * 0.04, duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
                style={{
                  display: "flex",
                  justifyContent: msg.from === "me" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "70%",
                    padding: "8px 12px",
                    borderRadius:
                      msg.from === "me"
                        ? "18px 18px 4px 18px"
                        : "18px 18px 18px 4px",
                    background:
                      msg.from === "me"
                        ? "linear-gradient(135deg, #007AFF, #0055D4)"
                        : "rgba(229,229,234,0.9)",
                    color: msg.from === "me" ? "white" : "#1c1c1e",
                    fontSize: "14px",
                    lineHeight: "1.4",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                  }}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Input */}
        <div
          style={{
            padding: "10px 12px",
            borderTop: "0.5px solid rgba(0,0,0,0.08)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(248,248,250,0.99)",
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              background: "rgba(0,0,0,0.06)",
              borderRadius: "20px",
              padding: "6px 14px",
              gap: "8px",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="iMessage"
              style={{
                flex: 1,
                background: "none",
                border: "none",
                outline: "none",
                fontSize: "16px",
                color: "#1c1c1e",
              }}
            />
          </div>
          <button
            onClick={send}
            disabled={!input.trim()}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: input.trim() ? "#007AFF" : "rgba(0,0,0,0.15)",
              border: "none",
              cursor: input.trim() ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              color: input.trim() ? "white" : "rgba(0,0,0,0.3)",
              flexShrink: 0,
              transition: "background 0.15s ease",
            }}
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  );
}
