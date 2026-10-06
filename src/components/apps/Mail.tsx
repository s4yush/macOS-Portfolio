import { motion, AnimatePresence } from "framer-motion";

interface MailMessage {
  id: string;
  from: string;
  fromEmail: string;
  subject: string;
  preview: string;
  body: string;
  time: string;
  unread?: boolean;
  starred?: boolean;
  avatar: string;
}

const MESSAGES: MailMessage[] = [
  {
    id: "1",
    from: "GitHub",
    fromEmail: "noreply@github.com",
    subject: "Your pull request was merged",
    preview: "Congratulations! Your PR #42 'feat: macOS 26 Tahoe UI' has been merged into main.",
    body: "Congratulations! Your PR #42 'feat: macOS 26 Tahoe UI' has been merged into main.\n\nChanges included:\n• Liquid Glass design system\n• Dynamic Island component\n• New app icons\n• Redesigned dock\n\nView the merged PR on GitHub.",
    time: "10:42 AM",
    unread: true,
    avatar: "🐙",
  },
  {
    id: "2",
    from: "Vercel",
    fromEmail: "noreply@vercel.com",
    subject: "Deployment successful — portfolio",
    preview: "Your project portfolio has been deployed to production.",
    body: "Your project portfolio has been deployed to production.\n\nDeployment URL: https://portfolio.vercel.app\nBranch: main\nCommit: e160e02\n\nThis deployment is now live.",
    time: "10:38 AM",
    unread: true,
    avatar: "▲",
  },
  {
    id: "3",
    from: "Recruiter @ Google",
    fromEmail: "recruiter@google.com",
    subject: "Exciting opportunity — Software Engineer",
    preview: "Hi Suyash, I came across your portfolio and was impressed by your work.",
    body: "Hi Suyash,\n\nI came across your portfolio and was really impressed by your macOS-style portfolio project — the attention to detail with the Liquid Glass UI is exceptional.\n\nWe have an exciting Software Engineer opening at Google that I think would be a great fit. Would you be open to a quick call this week?\n\nBest,\nThe Google Recruiting Team",
    time: "9:15 AM",
    unread: true,
    starred: true,
    avatar: "G",
  },
  {
    id: "4",
    from: "Suyash Singh",
    fromEmail: "suyash@example.com",
    subject: "Portfolio notes",
    preview: "Things to finish: Liquid Glass polish, macOS 26 branding update, new apps...",
    body: "Things to finish:\n• Liquid Glass polish\n• macOS 26 branding update\n• Add Mail + App Store to dock\n• Improve launchpad grid\n• Dynamic Island interactions",
    time: "Yesterday",
    avatar: "A",
  },
  {
    id: "5",
    from: "npm",
    fromEmail: "npm@npmjs.com",
    subject: "Security alert: 0 vulnerabilities found",
    preview: "Your project audit found no issues. Everything looks good.",
    body: "Your weekly npm audit found:\n\n✓ 0 vulnerabilities\n✓ All packages up to date\n✓ No deprecated packages\n\nKeep up the great work!",
    time: "Jun 4",
    avatar: "i-ph:envelope-simple",
  },
];

const FOLDERS = ["Inbox", "Sent", "Drafts", "Starred", "Trash"];

export default function Mail() {
  const [selected, setSelected] = useState<string>(MESSAGES[0].id);
  const [activeFolder, setActiveFolder] = useState("Inbox");
  const [search, setSearch] = useState("");
  const [composing, setComposing] = useState(false);

  const filtered = search.trim()
    ? MESSAGES.filter(
        (m) =>
          m.subject.toLowerCase().includes(search.toLowerCase()) ||
          m.from.toLowerCase().includes(search.toLowerCase()) ||
          m.preview.toLowerCase().includes(search.toLowerCase())
      )
    : MESSAGES;

  const activeMsg = MESSAGES.find((m) => m.id === selected);

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        
        background: "#f5f5f7",
        borderRadius: "0 0 14px 14px",
        overflow: "hidden",
      }}
    >
      {/* Sidebar — folders */}
      <div
        style={{
          width: "160px",
          flexShrink: 0,
          background: "rgba(235,235,240,0.98)",
          borderRight: "0.5px solid rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          padding: "8px 0",
        }}
      >
        <div
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "rgba(0,0,0,0.35)",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            padding: "6px 14px 4px",
          }}
        >
          Mailboxes
        </div>
        {FOLDERS.map((folder) => (
          <div
            key={folder}
            onClick={() => setActiveFolder(folder)}
            style={{
              padding: "6px 14px",
              borderRadius: "7px",
              margin: "1px 6px",
              cursor: "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: activeFolder === folder ? "rgba(0,122,255,0.12)" : "transparent",
              color: activeFolder === folder ? "#007AFF" : "#1c1c1e",
              fontSize: "13px",
              transition: "background 0.15s ease",
            }}
          >
            <span>{folder}</span>
            {folder === "Inbox" && (
              <span
                style={{
                  background: "#007AFF",
                  color: "#fff",
                  borderRadius: "10px",
                  fontSize: "10px",
                  fontWeight: 600,
                  padding: "1px 6px",
                  minWidth: "18px",
                  textAlign: "center",
                }}
              >
                {MESSAGES.filter((m) => m.unread).length}
              </span>
            )}
          </div>
        ))}
        <div style={{ flex: 1 }} />
        <button
          onClick={() => setComposing(true)}
          style={{
            margin: "8px 12px",
            background: "#007AFF",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "7px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
          }}
        >
          <span style={{ fontSize: "16px", lineHeight: 1 }}>+</span> Compose
        </button>
      </div>

      {/* Message list */}
      <div
        style={{
          width: "260px",
          flexShrink: 0,
          borderRight: "0.5px solid rgba(0,0,0,0.1)",
          background: "rgba(248,248,252,0.99)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Search */}
        <div style={{ padding: "8px 10px", borderBottom: "0.5px solid rgba(0,0,0,0.08)" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              background: "rgba(0,0,0,0.07)",
              borderRadius: "7px",
              padding: "5px 8px",
            }}
          >
            <span className="i-ph:magnifying-glass" style={{ width: "11px", height: "11px", opacity: 0.5 }} />
            <input
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                background: "none",
                border: "none",
                outline: "none",
                fontSize: "12px",
                width: "100%",
                color: "#1c1c1e",
              }}
            />
          </div>
        </div>

        <div style={{ overflowY: "auto", flex: 1 }}>
          {filtered.map((msg) => (
            <motion.div
              key={msg.id}
              onClick={() => setSelected(msg.id)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                padding: "10px 14px",
                borderBottom: "0.5px solid rgba(0,0,0,0.06)",
                cursor: "default",
                background:
                  selected === msg.id
                    ? "rgba(0,122,255,0.1)"
                    : "transparent",
                transition: "background 0.12s ease",
                position: "relative",
              }}
            >
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                {/* Avatar */}
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: msg.unread ? "rgba(0,122,255,0.15)" : "rgba(0,0,0,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    flexShrink: 0,
                    fontWeight: 600,
                    color: msg.unread ? "#007AFF" : "#666",
                  }}
                >
                  {msg.avatar.startsWith("i-")
                    ? <span className={msg.avatar} style={{ width: "18px", height: "18px" }} />
                    : msg.avatar}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: msg.unread ? 700 : 500,
                        color: "#1c1c1e",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        flex: 1,
                      }}
                    >
                      {msg.from}
                    </span>
                    <span style={{ fontSize: "10px", color: "rgba(0,0,0,0.4)", flexShrink: 0, marginLeft: "6px" }}>
                      {msg.time}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#1c1c1e",
                      fontWeight: msg.unread ? 600 : 400,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      marginTop: "1px",
                    }}
                  >
                    {msg.subject}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "rgba(0,0,0,0.4)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      marginTop: "1px",
                    }}
                  >
                    {msg.preview}
                  </div>
                </div>
              </div>
              {msg.unread && (
                <div
                  style={{
                    position: "absolute",
                    left: "6px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#007AFF",
                  }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Message view */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {activeMsg ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMsg.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                padding: "24px 28px",
                overflowY: "auto",
                background: "#fff",
              }}
            >
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#1c1c1e",
                  margin: "0 0 12px",
                }}
              >
                {activeMsg.subject}
              </h2>
              <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "20px" }}>
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    background: "rgba(0,122,255,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "#007AFF",
                  }}
                >
                  {activeMsg.avatar.startsWith("i-")
                    ? <span className={activeMsg.avatar} style={{ width: "20px", height: "20px" }} />
                    : activeMsg.avatar}
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "#1c1c1e" }}>{activeMsg.from}</div>
                  <div style={{ fontSize: "11px", color: "rgba(0,0,0,0.4)" }}>
                    {activeMsg.fromEmail} · {activeMsg.time}
                  </div>
                </div>
                {activeMsg.starred && (
                  <span style={{ marginLeft: "auto" }}>
                    <span className="i-ph:star-fill" style={{ width: "18px", height: "18px", color: "#FF9500" }} />
                  </span>
                )}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  lineHeight: "1.65",
                  color: "#1c1c1e",
                  whiteSpace: "pre-wrap",
                }}
              >
                {activeMsg.body}
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(0,0,0,0.3)",
              fontSize: "14px",
            }}
          >
            Select a message
          </div>
        )}
      </div>

      {/* Compose overlay */}
      <AnimatePresence>
        {composing && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            style={{
              position: "absolute",
              bottom: "20px",
              right: "20px",
              width: "420px",
              background: "rgba(248,248,252,0.98)",
              borderRadius: "12px",
              boxShadow: "0 16px 60px rgba(0,0,0,0.2), 0 4px 16px rgba(0,0,0,0.1)",
              border: "0.5px solid rgba(0,0,0,0.12)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              zIndex: 10,
            }}
          >
            <div
              style={{
                padding: "10px 14px",
                background: "rgba(235,235,240,0.99)",
                borderBottom: "0.5px solid rgba(0,0,0,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#1c1c1e" }}>New Message</span>
              <button
                onClick={() => setComposing(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "16px",
                  color: "rgba(0,0,0,0.4)",
                  lineHeight: 1,
                  padding: "2px",
                }}
              >
                ×
              </button>
            </div>
            {["To", "Subject"].map((label) => (
              <div
                key={label}
                style={{
                  padding: "8px 14px",
                  borderBottom: "0.5px solid rgba(0,0,0,0.06)",
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "12px", color: "rgba(0,0,0,0.4)", width: "46px" }}>{label}:</span>
                <input
                  style={{
                    flex: 1,
                    border: "none",
                    outline: "none",
                    fontSize: "13px",
                    background: "transparent",
                    color: "#1c1c1e",
                  }}
                />
              </div>
            ))}
            <textarea
              placeholder="Write your message..."
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                resize: "none",
                fontSize: "13px",
                lineHeight: "1.6",
                color: "#1c1c1e",
                padding: "12px 14px",
                background: "transparent",
                height: "180px",
              }}
            />
            <div
              style={{
                padding: "8px 14px",
                borderTop: "0.5px solid rgba(0,0,0,0.06)",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                style={{
                  background: "#007AFF",
                  color: "#fff",
                  border: "none",
                  borderRadius: "7px",
                  padding: "6px 16px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
