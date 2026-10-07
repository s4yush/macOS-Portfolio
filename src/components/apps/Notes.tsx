import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWindowSize } from "~/hooks/useWindowSize";

interface Note {
  id: string;
  title: string;
  body: string;
  date: string;
  dateISO?: string;
  pinned?: boolean;
  color?: string;
}

const INITIAL_NOTES: Note[] = [
  {
    id: "1",
    title: "macOS Tahoe",
    body: "The Chevrolet Tahoe is a line of full-size SUVs from Chevrolet marketed since the 1995 model year.",
    date: "Thursday",
    dateISO: "2025-09-11",
    pinned: true,
    color: "#FFCC00",
  },
  {
    id: "2",
    title: "macOS Sequoia",
    body: "The Toyota Sequoia is a full-size SUV manufactured by Toyota.",
    date: "10/24/24",
    dateISO: "2024-10-24",
  },
  {
    id: "3",
    title: "macOS Sonoma",
    body: "Sonoma is a city in Sonoma County, California.",
    date: "9/14/23",
    dateISO: "2023-09-14",
  },
  {
    id: "4",
    title: "macOS Ventura",
    body: "According to Wikipedia, Ventura is officially named San Buenaventura.",
    date: "10/21/22",
    dateISO: "2022-10-21",
  },
  {
    id: "5",
    title: "It's macOS Monterey time!",
    body: "No, seriously. I'm taking a look at the new features.",
    date: "10/21/21",
    dateISO: "2021-10-21",
    pinned: false,
    color: "#007AFF",
  },
  {
    id: "6",
    title: "Project Ideas",
    body: "1. Portfolio macOS 26 upgrade\n2. Terminal redesign\n3. Finder column view",
    date: "Yesterday",
    dateISO: "2025-09-10",
    color: "#34C759",
  },
  {
    id: "7",
    title: "Reading List",
    body: "- Clean Code — Robert Martin\n- The Pragmatic Programmer",
    date: "Yesterday",
    dateISO: "2025-09-10",
  },
];

const DATE_BUCKET_ORDER = ["Previous 7 Days", "2025", "2024", "2023", "2022", "2021", "Older"];

function dateBucket(note: Note): string {
  const iso = note.dateISO;
  if (!iso) {
    const d = note.date.toLowerCase();
    if (d === "today" || d === "now" || d === "thursday" || d === "friday" || d === "saturday" || d === "sunday" || d === "monday" || d === "tuesday" || d === "wednesday" || d === "yesterday")
      return "Previous 7 Days";
    return "Older";
  }
  const year = iso.slice(0, 4);
  const noteDate = new Date(iso);
  const now = new Date();
  const diffDays = (now.getTime() - noteDate.getTime()) / (1000 * 60 * 60 * 24);
  if (diffDays <= 7) return "Previous 7 Days";
  return year;
}

function groupNotes(notes: Note[]): { bucket: string; notes: Note[] }[] {
  const map: Record<string, Note[]> = {};
  for (const n of notes) {
    const b = dateBucket(n);
    if (!map[b]) map[b] = [];
    map[b].push(n);
  }
  return DATE_BUCKET_ORDER.filter((b) => map[b]?.length).map((b) => ({ bucket: b, notes: map[b] }));
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [selected, setSelected] = useState<string>(INITIAL_NOTES[0].id);
  const [search, setSearch] = useState("");
  const [activeSection, setActiveSection] = useState<"notes" | "shared">("notes");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { winWidth } = useWindowSize();
  const isMobile = winWidth < 768;
  const [mobileView, setMobileView] = useState<"sidebar" | "list" | "editor">("list");

  const activeNote = notes.find((n) => n.id === selected);

  const filtered = search.trim()
    ? notes.filter(
        (n) =>
          n.title.toLowerCase().includes(search.toLowerCase()) ||
          n.body.toLowerCase().includes(search.toLowerCase())
      )
    : notes;

  const pinned = filtered.filter((n) => n.pinned);
  const regular = filtered.filter((n) => !n.pinned);
  const groups = groupNotes(regular);

  const updateNote = (field: "title" | "body", val: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === selected ? { ...n, [field]: val } : n))
    );
  };

  const newNote = () => {
    const id = Date.now().toString();
    const note: Note = { id, title: "New Note", body: "", date: "Now", dateISO: new Date().toISOString().slice(0, 10) };
    setNotes((prev) => [note, ...prev]);
    setSelected(id);
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (selected === id) {
      setSelected(notes.find((n) => n.id !== id)?.id ?? "");
      if (isMobile) setMobileView("list");
    }
  };

  const NoteRow = ({ note }: { note: Note }) => (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={() => { setSelected(note.id); if (isMobile) setMobileView("editor"); }}
      style={{
        padding: "9px 14px",
        borderRadius: "8px",
        margin: "1px 6px",
        cursor: "default",
        background: selected === note.id ? "rgba(255,204,0,0.22)" : "transparent",
        transition: "background 0.15s ease",
        display: "flex",
        gap: "8px",
        alignItems: "flex-start",
      }}
      onMouseEnter={(e) => {
        if (selected !== note.id)
          (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.04)";
      }}
      onMouseLeave={(e) => {
        if (selected !== note.id)
          (e.currentTarget as HTMLElement).style.background = "transparent";
      }}
    >
      {note.color && (
        <div style={{ width: 3, borderRadius: 2, background: note.color, alignSelf: "stretch", flexShrink: 0 }} />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#1c1c1e",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {note.title || "Untitled"}
        </div>
        <div style={{ display: "flex", gap: "6px", marginTop: "1px" }}>
          <span style={{ fontSize: "11px", color: "rgba(0,0,0,0.4)", flexShrink: 0 }}>{note.date}</span>
          <span
            style={{
              fontSize: "11px",
              color: "rgba(0,0,0,0.35)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {note.body.slice(0, 28) || "No additional text"}
          </span>
        </div>
      </div>
    </motion.div>
  );

  const GroupHeader = ({ label }: { label: string }) => (
    <div
      style={{
        fontSize: "12px",
        fontWeight: 700,
        color: "rgba(0,0,0,0.4)",
        padding: "8px 14px 3px",
        letterSpacing: "0.01em",
      }}
    >
      {label}
    </div>
  );

  const toolbarIcons = [
    { icon: "i-ph:note-pencil", title: "New Note", action: newNote },
    { icon: "i-ph:text-aa", title: "Format" },
    { icon: "i-ph:table", title: "Table" },
    { icon: "i-ph:check-square", title: "Checklist" },
    { icon: "i-ph:paperclip", title: "Attachment" },
    { icon: "i-ph:tag", title: "Tags" },
    { icon: "i-ph:share-network", title: "Share" },
    { icon: "i-ph:dots-three", title: "More" },
  ];

  return (
    <div
      style={{
        display: "flex",
        height: "100%",

        background: "rgba(250,250,248,0.99)",
        borderRadius: "0 0 14px 14px",
        overflow: "hidden",
      }}
    >
      {(!isMobile || mobileView === "sidebar") && (
      <div
        style={{
          width: isMobile ? "100%" : "180px",
          flexShrink: 0,
          borderRight: "0.5px solid rgba(0,0,0,0.1)",
          background: "rgba(244,242,236,0.99)",
          display: "flex",
          flexDirection: "column",
          paddingTop: "8px",
        }}
      >
        <div
          style={{
            padding: "6px 12px 8px",
            borderBottom: "0.5px solid rgba(0,0,0,0.07)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#1c1c1e" }}>Notes</span>
          <button
            onClick={newNote}
            title="New Note"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "2px 4px",
              borderRadius: "5px",
              color: "#886800",
            }}
          >
            <span className="i-ph:note-pencil" style={{ width: "16px", height: "16px" }} />
          </button>
        </div>

        <div style={{ padding: "10px 0 4px" }}>
          <div style={{ fontSize: "10px", fontWeight: 700, color: "rgba(0,0,0,0.35)", textTransform: "uppercase", letterSpacing: "0.5px", padding: "0 12px 4px" }}>
            iCloud
          </div>
          <button
            onClick={() => setActiveSection("notes")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "5px 12px",
              width: "calc(100% - 8px)",
              background: activeSection === "notes" ? "rgba(0,122,255,0.12)" : "transparent",
              border: "none",
              borderRadius: "6px",
              margin: "0 4px",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <img src="/img/icons/sf-icons/folder.svg" alt="Folder" style={{ width: "13px", height: "13px", opacity: 0.8 }} className="dark:invert" />
              <span style={{ fontSize: "12px", fontWeight: activeSection === "notes" ? 600 : 400, color: activeSection === "notes" ? "#007AFF" : "#1c1c1e" }}>
                Notes
              </span>
            </div>
            <span style={{ fontSize: "11px", color: "rgba(0,0,0,0.35)", background: "rgba(0,0,0,0.07)", borderRadius: "8px", padding: "1px 6px" }}>
              {notes.length}
            </span>
          </button>
          <button
            onClick={() => setActiveSection("shared")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "5px 12px",
              width: "calc(100% - 8px)",
              margin: "0 4px",
              background: activeSection === "shared" ? "rgba(0,122,255,0.12)" : "transparent",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <img src="/img/icons/sf-icons/folder-user.svg" alt="Shared Folder" style={{ width: "13px", height: "13px", opacity: 0.6 }} className="dark:invert" />
              <span style={{ fontSize: "12px", color: "#1c1c1e" }}>Shared</span>
            </div>
            <span style={{ fontSize: "11px", color: "rgba(0,0,0,0.35)", background: "rgba(0,0,0,0.07)", borderRadius: "8px", padding: "1px 6px" }}>1</span>
          </button>
        </div>

        <div style={{ padding: "8px 12px 4px", borderTop: "0.5px solid rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: "10px", fontWeight: 700, color: "rgba(0,0,0,0.35)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>
            Tags
          </div>
          <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
            {["All Tags", "#tags"].map((tag) => (
              <span
                key={tag}
                style={{
                  background: "rgba(0,0,0,0.07)",
                  borderRadius: "12px",
                  padding: "3px 9px",
                  fontSize: "11px",
                  color: "#1c1c1e",
                  cursor: "default",
                  userSelect: "none",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      )}

      {(!isMobile || mobileView === "list") && (
      <div
        style={{
          width: isMobile ? "100%" : "220px",
          flexShrink: 0,
          borderRight: "0.5px solid rgba(0,0,0,0.1)",
          background: "rgba(248,246,240,0.99)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "8px 10px",
            borderBottom: "0.5px solid rgba(0,0,0,0.08)",
            display: "flex",
            gap: "6px",
            alignItems: "center",
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: "5px",
              background: "rgba(0,0,0,0.07)",
              borderRadius: "7px",
              padding: "4px 8px",
            }}
          >
            <img src="/img/icons/sf-icons/search.svg" alt="Search" style={{ width: "11px", height: "11px", opacity: 0.5 }} className="dark:invert" />
            <input
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ background: "none", border: "none", outline: "none", fontSize: "12px", width: "100%", color: "#1c1c1e" }}
            />
          </div>
          <button
            onClick={newNote}
            title="New Note"
            style={{
              background: "rgba(255,204,0,0.3)",
              border: "none",
              borderRadius: "7px",
              width: "28px",
              height: "28px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: "18px", lineHeight: 1, color: "#886800" }}>+</span>
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", paddingTop: "4px" }}>
          {pinned.length > 0 && (
            <>
              <GroupHeader label="Pinned" />
              {pinned.map((n) => <NoteRow key={n.id} note={n} />)}
            </>
          )}
          <AnimatePresence>
            {groups.map(({ bucket, notes: gNotes }) => (
              <div key={bucket}>
                <GroupHeader label={bucket} />
                {gNotes.map((n) => <NoteRow key={n.id} note={n} />)}
              </div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      )}

      {(!isMobile || mobileView === "editor") && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", width: isMobile ? "100%" : "auto" }}>
      {activeNote ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {isMobile && (
            <button onClick={() => setMobileView("list")} style={{ padding: "8px 12px", background: "none", border: "none", color: "#007AFF", fontWeight: 500, display: "flex", alignItems: "center", gap: "4px" }}>
              ‹ Back
            </button>
          )}
          <div
            style={{
              padding: "6px 12px",
              borderBottom: "0.5px solid rgba(0,0,0,0.08)",
              display: "flex",
              alignItems: "center",
              gap: "2px",
              background: "rgba(250,250,248,0.99)",
            }}
          >
            {toolbarIcons.map((t) => (
              <button
                key={t.title}
                title={t.title}
                onClick={t.action}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px 6px",
                  borderRadius: "6px",
                  opacity: 0.55,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "opacity 0.12s, background 0.12s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = "1";
                  (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.06)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = "0.55";
                  (e.currentTarget as HTMLElement).style.background = "none";
                }}
              >
                <span className={t.icon} style={{ width: "16px", height: "16px" }} />
              </button>
            ))}
            <div style={{ flex: 1 }} />
            <button
              title="Search"
              style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 6px", borderRadius: "6px", opacity: 0.55 }}
            >
              <img src="/img/icons/sf-icons/search.svg" alt="Search" style={{ width: "16px", height: "16px", opacity: 0.7 }} className="dark:invert" />
            </button>
            <button
              onClick={() => deleteNote(activeNote.id)}
              title="Delete"
              style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 6px", borderRadius: "6px", opacity: 0.4 }}
            >
              <img src="/img/icons/sf-icons/trash.svg" alt="Trash" style={{ width: "14px", height: "14px", opacity: 0.7 }} className="dark:invert" />
            </button>
          </div>

          <div style={{ fontSize: "11px", color: "rgba(0,0,0,0.4)", padding: "10px 20px 0", textAlign: "center" }}>
            {activeNote.dateISO ?? activeNote.date}
          </div>

          <input
            value={activeNote.title}
            onChange={(e) => updateNote("title", e.target.value)}
            className="font-display"
            style={{
              border: "none",
              outline: "none",
              fontSize: "20px",
              fontWeight: 700,
              color: "#1c1c1e",
              padding: "8px 20px 4px",
              background: "transparent",
            }}
          />

          <textarea
            ref={textareaRef}
            value={activeNote.body}
            onChange={(e) => updateNote("body", e.target.value)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              resize: "none",
              fontSize: "14px",
              lineHeight: "1.6",
              color: "#1c1c1e",
              padding: "0 20px 20px",
              background: "transparent",

            }}
          />
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(0,0,0,0.3)", fontSize: "14px" }}>
          Select or create a note
        </div>
      )}
      </div>
      )}
    </div>
  );
}
