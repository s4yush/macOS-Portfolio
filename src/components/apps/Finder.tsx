import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWindowSize } from "~/hooks/useWindowSize";

type ViewMode = "icons" | "list" | "columns";
type SortKey = "name" | "date" | "size" | "kind";

interface FileItem {
  id: string;
  name: string;
  kind: "folder" | "file";
  ext?: string;
  size?: string;
  date: string;
  icon: string;
  color?: string;
  children?: FileItem[];
}

const FILESYSTEM: Record<string, FileItem[]> = {
  home: [
    {
      id: "desktop",
      name: "Desktop",
      kind: "folder",
      date: "Today",
      icon: "/img/icons/sf-icons/desktop.svg",
      color: "#4A90E2",
      children: [
        { id: "readme", name: "README.md", kind: "file", ext: "md", size: "2 KB", date: "Today", icon: "/img/icons/sf-icons/doc.svg" },
        { id: "notes", name: "notes.txt", kind: "file", ext: "txt", size: "1 KB", date: "Yesterday", icon: "/img/icons/sf-icons/doc.svg" },
      ],
    },
    {
      id: "documents",
      name: "Documents",
      kind: "folder",
      date: "Yesterday",
      icon: "/img/icons/sf-icons/folder.svg",
      color: "#F5A623",
      children: [
        { id: "resume", name: "Suyash_Resume.pdf", kind: "file", ext: "pdf", size: "340 KB", date: "Jun 1", icon: "/img/icons/sf-icons/doc.svg" },
        { id: "cover", name: "CoverLetter.docx", kind: "file", ext: "docx", size: "28 KB", date: "Jun 2", icon: "/img/icons/sf-icons/doc.svg" },
        { id: "projects-folder", name: "Projects", kind: "folder", date: "Jun 3", icon: "/img/icons/sf-icons/folder.svg", color: "#F5A623" },
      ],
    },
    {
      id: "downloads",
      name: "Downloads",
      kind: "folder",
      date: "Today",
      icon: "/img/icons/sf-icons/download.svg",
      color: "#7B68EE",
      children: [
        { id: "react-zip", name: "react-18.zip", kind: "file", ext: "zip", size: "2.1 MB", date: "Today", icon: "/img/icons/sf-icons/doc.svg" },
        { id: "wallpaper", name: "macOS_Tahoe.jpg", kind: "file", ext: "jpg", size: "4.8 MB", date: "Today", icon: "/img/icons/sf-icons/image.svg" },
      ],
    },
    {
      id: "pictures",
      name: "Pictures",
      kind: "folder",
      date: "Jun 3",
      icon: "/img/icons/sf-icons/image.svg",
      color: "#FF6B6B",
      children: [
        { id: "avatar", name: "avatar.png", kind: "file", ext: "png", size: "120 KB", date: "May 28", icon: "/img/icons/sf-icons/image.svg" },
      ],
    },
    {
      id: "music",
      name: "Music",
      kind: "folder",
      date: "Jun 2",
      icon: "/img/icons/sf-icons/sound.svg",
      color: "#FF2D55",
      children: [
        { id: "faded", name: "faded.mp3", kind: "file", ext: "mp3", size: "3.5 MB", date: "May 20", icon: "/img/icons/sf-icons/sound.svg" },
        { id: "samantha", name: "Samantha Legacy.wav", kind: "file", ext: "wav", size: "280 KB", date: "Jun 1", icon: "/img/icons/sf-icons/sound.svg" },
      ],
    },
    {
      id: "repos",
      name: "Repositories",
      kind: "folder",
      date: "Today",
      icon: "/img/icons/sf-icons/desktop.svg",
      color: "#34C759",
      children: [
        { id: "macos-portfolio", name: "macOS-Portfolio", kind: "folder", date: "Today", icon: "/img/icons/sf-icons/folder.svg", color: "#34C759" },
        { id: "lib-project", name: "lib", kind: "folder", date: "Jun 3", icon: "/img/icons/sf-icons/folder.svg", color: "#34C759" },
      ],
    },
  ],
};

const SIDEBAR_SECTIONS = [
  {
    title: "",
    items: [
      { id: "recents", label: "Recents", icon: "/img/icons/sf-icons/clock.svg" },
      { id: "shared", label: "Shared", icon: "/img/icons/sf-icons/shared.svg" },
    ],
  },
  {
    title: "Favorites",
    items: [
      { id: "home", label: "Applications", icon: "/img/icons/sf-icons/applications.svg" },
      { id: "desktop", label: "Desktop", icon: "/img/icons/sf-icons/desktop.svg", parent: "home" },
      { id: "documents", label: "Documents", icon: "/img/icons/sf-icons/doc.svg", parent: "home" },
      { id: "downloads", label: "Downloads", icon: "/img/icons/sf-icons/download.svg", parent: "home" },
      { id: "pictures", label: "Screenshots", icon: "/img/icons/sf-icons/image.svg", parent: "home" },
    ],
  },
  {
    title: "iCloud",
    items: [
      { id: "icloud-drive", label: "iCloud Drive", icon: "/img/icons/sf-icons/cloud.svg" },
    ],
  },
  {
    title: "Locations",
    items: [
      { id: "macintosh-hd", label: "Macintosh HD", icon: "/img/icons/sf-icons/hard-drive.svg" },
      { id: "airdrop", label: "AirDrop", icon: "/img/icons/sf-icons/airdrop.svg" },
      { id: "network", label: "Network", icon: "/img/icons/sf-icons/network.svg" },
      { id: "trash", label: "Trash", icon: "/img/icons/sf-icons/trash.svg" },
    ],
  },
  {
    title: "Tags",
    items: [
      { id: "tag-red", label: "Red", tagColor: "#FF3B30" },
      { id: "tag-orange", label: "Orange", tagColor: "#FF9500" },
      { id: "tag-blue", label: "Blue", tagColor: "#007AFF" },
      { id: "tag-green", label: "Green", tagColor: "#34C759" },
    ],
  },
];

const FileIcon = ({ item, size = 56 }: { item: FileItem; size?: number }) => {
  if (item.kind === "folder") {
    let customImg = "/img/icons/folder-generic.png";
    if (item.id === "repos" || item.id === "projects-folder") {
      customImg = "/img/icons/folder-dock.png";
    } else if (item.id === "home") {
      customImg = "/img/icons/folder-home.png";
    }

    return (
      <img
        src={customImg}
        alt={item.name}
        style={{ width: size, height: size, display: "inline-block", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))", objectFit: "contain" }}
      />
    );
  }

  let customImg = "/img/icons/codefile.png";
  if (["mp3", "wav", "m4a", "flac", "audio"].includes(item.ext || "")) {
    customImg = "/img/icons/audio_Tahoe.png";
  } else if (["mp4", "mov", "avi", "mkv", "video"].includes(item.ext || "")) {
    customImg = "/img/icons/icnsFile_f693c769fe5bb58a3d33adfcd9901ecb_m4a_Tahoe.png";
  }

  return (
    <img
      src={customImg}
      alt={item.name}
      style={{ width: size, height: size, display: "inline-block", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))", objectFit: "contain" }}
    />
  );
};

export default function Finder() {
  const [location, setLocation] = useState<string>("home");
  const [pathStack, setPathStack] = useState<string[]>(["home"]);
  const [viewMode, setViewMode] = useState<ViewMode>("icons");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const size = useWindowSize();
  const isMobile = size.winWidth < 768;
  const [mobileView, setMobileView] = useState<"sidebar" | "content">("content");

  const currentItems = (): FileItem[] => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return Object.values(FILESYSTEM)
        .flat()
        .flatMap((f) => [f, ...(f.children ?? [])])
        .filter((f) => f.name.toLowerCase().includes(q));
    }

    const rootItem = FILESYSTEM.home.find((f) => f.id === location);
    if (location === "home") return FILESYSTEM.home;
    if (rootItem?.children) return rootItem.children;
    for (const root of FILESYSTEM.home) {
      const nested = root.children?.find((c) => c.id === location);
      if (nested?.children) return nested.children;
    }
    return [];
  };

  const sorted = [...currentItems()].sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === "folder" ? -1 : 1;
    if (sortKey === "name") return a.name.localeCompare(b.name);
    if (sortKey === "date") return a.date.localeCompare(b.date);
    if (sortKey === "kind") return (a.ext ?? "folder").localeCompare(b.ext ?? "folder");
    return 0;
  });

  const navigate = (item: FileItem) => {
    if (item.kind === "folder") {
      setPathStack((p) => [...p, item.id]);
      setLocation(item.id);
      setSelected(null);
    }
  };

  const goBack = () => {
    if (pathStack.length <= 1) return;
    const newStack = pathStack.slice(0, -1);
    setPathStack(newStack);
    setLocation(newStack[newStack.length - 1]);
    setSelected(null);
  };

  const goForward = () => { };

  const locationLabel = () => {
    if (location === "home") return "Suyash";
    const item = FILESYSTEM.home.find((f) => f.id === location);
    if (item) return item.name;
    for (const root of FILESYSTEM.home) {
      const nested = root.children?.find((c) => c.id === location);
      if (nested) return nested.name;
    }
    return location;
  };

  const sidebarClick = (id: string, parent?: string) => {
    if (id === "google-drive" || id === "icloud-drive" || id === "macintosh-hd") {
      setLocation("home");
      setPathStack(["home"]);
      setMobileView("content");
      return;
    }
    if (parent === "home") {
      setPathStack(["home", id]);
      setLocation(id);
    } else {
      setPathStack(["home"]);
      setLocation("home");
    }
    setSelected(null);
    setMobileView("content");
  };


  const getChildrenOf = (id: string): FileItem[] => {
    if (id === "home") return FILESYSTEM.home;
    const root = FILESYSTEM.home.find((f) => f.id === id);
    if (root?.children) return root.children;
    for (const r of FILESYSTEM.home) {
      const nested = r.children?.find((c) => c.id === id);
      if (nested?.children) return nested.children;
    }
    return [];
  };

  const sortItems = (items: FileItem[]) =>
    [...items].sort((a, b) => {
      if (a.kind !== b.kind) return a.kind === "folder" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });

  const renderColumns = () => (
    <div style={{ display: "flex", height: "100%", minHeight: "100%" }}>
      {pathStack.map((segId, colIdx) => {
        const items = sortItems(getChildrenOf(segId));
        const activeChild = pathStack[colIdx + 1]; // highlighted = the path we descended into
        return (
          <div
            key={segId + colIdx}
            style={{
              width: "200px",
              flexShrink: 0,
              borderRight: "0.5px solid rgba(0,0,0,0.1)",
              overflowY: "auto",
              padding: "6px 6px",
            }}
          >
            {items.length === 0 && (
              <div style={{ fontSize: "11px", color: "rgba(0,0,0,0.35)", padding: "8px" }}>
                Empty
              </div>
            )}
            {items.map((item) => {
              const isActive = item.id === activeChild;
              const isSelected = colIdx === pathStack.length - 1 && item.id === selected;
              const highlight = isActive || isSelected;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (item.kind === "folder") {
                      setPathStack([...pathStack.slice(0, colIdx + 1), item.id]);
                      setLocation(item.id);
                      setSelected(null);
                    } else {
                      setPathStack(pathStack.slice(0, colIdx + 1));
                      setLocation(segId);
                      setSelected(item.id);
                    }
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    cursor: "default",
                    userSelect: "none",
                    background: highlight ? "rgba(0,122,255,0.9)" : "transparent",
                    color: highlight ? "#fff" : "#1c1c1e",
                    transition: "background 0.1s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!highlight)
                      (e.currentTarget as HTMLElement).style.background = "rgba(120,120,128,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    if (!highlight)
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  <FileIcon item={item} size={16} />
                  <span
                    style={{
                      fontSize: "12px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      flex: 1,
                    }}
                  >
                    {item.name}
                  </span>
                  {item.kind === "folder" && (
                    <div
                      style={{
                        width: "11px",
                        height: "11px",
                        backgroundColor: highlight ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.35)",
                        WebkitMask: `url(/img/icons/sf-icons/caret-right.svg) center/contain no-repeat`,
                        mask: `url(/img/icons/sf-icons/caret-right.svg) center/contain no-repeat`,
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );

  const renderIcons = () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))",
        gap: "4px",
        padding: "16px",
      }}
    >
      {sorted.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.025, duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
          onClick={() => setSelected(item.id)}
          onDoubleClick={() => navigate(item)}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "8px 4px",
            borderRadius: "10px",
            cursor: "default",
            background:
              selected === item.id ? "rgba(0,122,255,0.2)" : "transparent",
            border:
              selected === item.id
                ? "1.5px solid rgba(0,122,255,0.4)"
                : "1.5px solid transparent",
            transition: "background 0.15s ease, border 0.15s ease",
            userSelect: "none",
          }}
          onMouseEnter={(e) => {
            if (selected !== item.id)
              (e.currentTarget as HTMLElement).style.background =
                "rgba(120,120,128,0.12)";
          }}
          onMouseLeave={(e) => {
            if (selected !== item.id)
              (e.currentTarget as HTMLElement).style.background = "transparent";
          }}
        >
          <FileIcon item={item} size={52} />
          <span
            style={{
              marginTop: "6px",
              fontSize: "11px",
              color: "var(--c-text, #1c1c1e)",
              textAlign: "center",
              lineHeight: "1.3",
              maxWidth: "82px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {item.name}
          </span>
        </motion.div>
      ))}
    </div>
  );

  const renderList = () => (
    <div style={{ padding: "0" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 80px 80px 80px",
          padding: "4px 16px",
          borderBottom: "0.5px solid rgba(0,0,0,0.1)",
          background: "rgba(0,0,0,0.03)",
        }}
      >
        {["Name", "Date", "Size", "Kind"].map((h) => (
          <button
            key={h}
            onClick={() => setSortKey(h.toLowerCase() as SortKey)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "11px",
              fontWeight: sortKey === h.toLowerCase() ? 600 : 400,
              color:
                sortKey === h.toLowerCase() ? "#007AFF" : "rgba(0,0,0,0.5)",
              textAlign: "left",
              padding: 0,
            }}
          >
            {h} {sortKey === h.toLowerCase() ? "↑" : ""}
          </button>
        ))}
      </div>
      {sorted.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.02, duration: 0.2 }}
          onClick={() => setSelected(item.id)}
          onDoubleClick={() => navigate(item)}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 80px 80px 80px",
            padding: "5px 16px",
            cursor: "default",
            background:
              selected === item.id
                ? "rgba(0,122,255,0.15)"
                : i % 2 === 0
                  ? "transparent"
                  : "rgba(0,0,0,0.015)",
            transition: "background 0.1s ease",
            borderRadius: "4px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FileIcon item={item} size={18} />
            <span
              style={{
                fontSize: "12px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {item.name}
            </span>
          </div>
          <span style={{ fontSize: "11px", color: "rgba(0,0,0,0.5)", alignSelf: "center" }}>
            {item.date}
          </span>
          <span style={{ fontSize: "11px", color: "rgba(0,0,0,0.5)", alignSelf: "center" }}>
            {item.size ?? "—"}
          </span>
          <span style={{ fontSize: "11px", color: "rgba(0,0,0,0.5)", alignSelf: "center" }}>
            {item.kind === "folder" ? "Folder" : item.ext?.toUpperCase() ?? "File"}
          </span>
        </motion.div>
      ))}
    </div>
  );

  const toolbarBtn = (label: string, icon: string, active = false, action = () => { }) => (
    <motion.button
      title={label}
      onClick={action}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      transition={{ duration: 0.1 }}
      style={{
        background: active ? "rgba(0,122,255,0.15)" : "transparent",
        border: active ? "0.5px solid rgba(0,122,255,0.25)" : "0.5px solid transparent",
        borderRadius: "6px",
        cursor: "pointer",
        padding: "4px 7px",
        fontSize: "14px",
        color: active ? "#007AFF" : "rgba(0,0,0,0.55)",
        transition: "background 0.12s ease, border-color 0.12s ease, color 0.12s ease",
        lineHeight: 1,
      }}
    >
      {icon}
    </motion.button>
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",

        background: "rgba(248,248,248,0.98)",
        borderRadius: "0 0 14px 14px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 12px",
          borderBottom: "0.5px solid rgba(0,0,0,0.1)",
          background: "rgba(245,245,247,0.98)",
          backdropFilter: "blur(20px)",
          flexWrap: isMobile ? "wrap" : "nowrap",
        }}
      >
        {isMobile && (
          <button
            onClick={() => setMobileView(mobileView === "sidebar" ? "content" : "sidebar")}
            style={{
               background: "none",
               border: "none",
               cursor: "pointer",
               fontSize: "14px",
               fontWeight: 500,
               color: "#007AFF",
               padding: "4px 8px",
            }}
          >
            {mobileView === "sidebar" ? "Done" : "Browse"}
          </button>
        )}

        <button
          onClick={goBack}
          disabled={pathStack.length <= 1}
          style={{
            background: "none",
            border: "none",
            cursor: pathStack.length > 1 ? "pointer" : "default",
            fontSize: "16px",
            opacity: pathStack.length > 1 ? 1 : 0.3,
            padding: "2px 6px",
          }}
        >
          ‹
        </button>
        <button
          onClick={goForward}
          style={{ background: "none", border: "none", fontSize: "16px", opacity: 0.3, padding: "2px 6px" }}
        >
          ›
        </button>

        <span
          style={{
            flex: 1,
            fontSize: "13px",
            fontWeight: 600,
            color: "#1c1c1e",
            textAlign: "center",
          }}
        >
          {locationLabel()}
        </span>

        <div style={{ display: "flex", gap: "2px" }}>
          {toolbarBtn("Icons", "⊞", viewMode === "icons", () => setViewMode("icons"))}
          {toolbarBtn("List", "≡", viewMode === "list", () => setViewMode("list"))}
          {toolbarBtn("Columns", "⊟", viewMode === "columns", () => setViewMode("columns"))}
        </div>

        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
          style={{
            fontSize: "11px",
            background: "rgba(0,0,0,0.06)",
            border: "none",
            borderRadius: "5px",
            padding: "3px 6px",
            cursor: "pointer",
            outline: "none",
            color: "#1c1c1e",
          }}
        >
          <option value="name">Name</option>
          <option value="date">Date</option>
          <option value="size">Size</option>
          <option value="kind">Kind</option>
        </select>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "rgba(0,0,0,0.06)",
            borderRadius: "6px",
            padding: "2px 8px",
            gap: "4px",
          }}
        >
          <div style={{ width: "11px", height: "11px", opacity: 0.5, backgroundColor: "currentColor", WebkitMask: "url(/img/icons/sf-icons/magnifying-glass.svg) center/contain no-repeat", mask: "url(/img/icons/sf-icons/magnifying-glass.svg) center/contain no-repeat" }} />
          <input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: "none",
              border: "none",
              outline: "none",
              fontSize: "12px",
              width: "100px",
              color: "#1c1c1e",
            }}
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "2px",
          padding: "3px 12px",
          borderBottom: "0.5px solid rgba(0,0,0,0.08)",
          background: "rgba(245,245,247,0.95)",
          overflowX: "auto",
        }}
      >
        {pathStack.map((seg, i) => {
          const label =
            seg === "home"
              ? "Suyash"
              : FILESYSTEM.home.find((f) => f.id === seg)?.name ?? seg;
          const isActive = i === pathStack.length - 1;
          return (
            <button
              key={seg}
              onClick={() => {
                const newStack = pathStack.slice(0, i + 1);
                setPathStack(newStack);
                setLocation(newStack[newStack.length - 1]);
              }}
              style={{
                background: isActive ? "rgba(0,0,0,0.09)" : "transparent",
                border: "none",
                borderRadius: "6px",
                padding: "2px 10px",
                fontSize: "12px",
                fontWeight: isActive ? 600 : 400,
                color: "#1c1c1e",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {(!isMobile || mobileView === "sidebar") && (
          <div
            style={{
              width: isMobile ? "100%" : "160px",
              flexShrink: 0,
              borderRight: isMobile ? "none" : "var(--lg-border)",
              background: "var(--lg-bg-tinted)",
              backdropFilter: "var(--lg-blur-light)",
              WebkitBackdropFilter: "var(--lg-blur-light)",
              overflowY: "auto",
              padding: "8px 0",
            }}
          >
          {SIDEBAR_SECTIONS.map((section) => (
            <div key={section.title} style={{ marginBottom: "4px" }}>
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "rgba(0,0,0,0.35)",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  padding: "8px 12px 2px",
                }}
              >
                {section.title}
              </div>
              {section.items.map((item: any) => {
                const active = location === item.id || (item.id === "home" && location === "home");
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => sidebarClick(item.id, item.parent)}
                    whileHover={{ x: 1 }}
                    transition={{ duration: 0.1 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "5px 12px",
                      background: active ? "rgba(0,122,255,0.13)" : "transparent",
                      border: "none",
                      cursor: "pointer",
                      borderRadius: "6px",
                      margin: "0 4px",
                      width: "calc(100% - 8px)",
                      transition: "background 0.12s ease",
                      position: "relative",
                    }}
                  >
                    {active && (
                      <motion.div
                        layoutId="finder-sidebar-indicator"
                        style={{
                          position: "absolute",
                          left: 0,
                          top: "18%",
                          bottom: "18%",
                          width: "2.5px",
                          borderRadius: "2px",
                          background: "#007AFF",
                        }}
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}
                    {item.tagColor ? (
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: item.tagColor, flexShrink: 0 }} />
                    ) : (
                      <div
                        style={{
                          width: "14px",
                          height: "14px",
                          flexShrink: 0,
                          backgroundColor: active ? "#007AFF" : "rgba(0,0,0,0.5)",
                          WebkitMask: `url(${item.icon}) center/contain no-repeat`,
                          mask: `url(${item.icon}) center/contain no-repeat`,
                        }}
                      />
                    )}
                    <span
                      style={{
                        fontSize: "12px",
                        color: active ? "#007AFF" : "#1c1c1e",
                        fontWeight: active ? 600 : 400,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          ))}
        </div>
        )}

        {(!isMobile || mobileView === "content") && (
        <div style={{ flex: 1, overflowY: "auto", overflowX: viewMode === "columns" && !search.trim() ? "auto" : "hidden" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location + viewMode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={viewMode === "columns" && !search.trim() ? { height: "100%" } : undefined}
            >
              {search.trim()
                ? renderIcons()
                : viewMode === "columns"
                  ? renderColumns()
                  : viewMode === "list"
                    ? renderList()
                    : renderIcons()}
            </motion.div>
          </AnimatePresence>
        </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          padding: "4px 12px",
          borderTop: "0.5px solid rgba(0,0,0,0.08)",
          background: "rgba(245,245,247,0.98)",
          fontSize: "11px",
          color: "rgba(0,0,0,0.5)",
        }}
      >
        {pathStack.map((seg, i) => {
          const label =
            seg === "home"
              ? "Suyash"
              : FILESYSTEM.home.find((f) => f.id === seg)?.name ??
              seg;
          return (
            <React.Fragment key={seg}>
              {i > 0 && <span>›</span>}
              <button
                onClick={() => {
                  const newStack = pathStack.slice(0, i + 1);
                  setPathStack(newStack);
                  setLocation(newStack[newStack.length - 1]);
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "11px",
                  color: i === pathStack.length - 1 ? "#1c1c1e" : "#007AFF",
                  fontWeight: i === pathStack.length - 1 ? 500 : 400,
                  padding: "0 2px",
                }}
              >
                {label}
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
