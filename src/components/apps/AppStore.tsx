import React, { useState } from "react";
import { motion } from "framer-motion";

interface AppEntry {
  id: string;
  name: string;
  category: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  preview?: string;
}

const PROJECTS: AppEntry[] = [
  {
    id: "macos-portfolio",
    name: "macOS Portfolio",
    subtitle: "Web OS Experience.",
    category: "Portfolio",
    icon: "img/icons/mac-icon.png",
    description: "A complete macOS Tahoe simulation built with React and Framer Motion.",
    color: "linear-gradient(135deg, #007AFF 0%, #0051A8 100%)",
    preview: "img/previews/macos.png"
  },
  {
    id: "skill-exchange",
    name: "SkillExchange",
    subtitle: "Learn and teach.",
    category: "Education",
    icon: "img/icons/skill-exchange.png",
    description: "Exchange skills with peers. Learn anything, teach what you know.",
    color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    preview: "img/previews/skill.png"
  },
  {
    id: "paytm-clone",
    name: "Paytm Clone",
    subtitle: "Payments made simple.",
    category: "Finance",
    icon: "img/icons/paytm.png",
    description: "A full-stack Paytm-inspired payments app with modern UI.",
    color: "linear-gradient(135deg, #00BAF2 0%, #002970 100%)",
    preview: "img/previews/paytm.png"
  },
  {
    id: "mbm-attendance",
    name: "MBM Attendance",
    subtitle: "Track your classes.",
    category: "Productivity",
    icon: "img/icons/mbm.png",
    description: "Track your college attendance effortlessly.",
    color: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)",
    preview: "img/previews/mbm.png"
  },
  {
    id: "share-code",
    name: "ShareCode",
    subtitle: "Code beautifully.",
    category: "Developer Tools",
    icon: "img/icons/sharecode.png",
    description: "Share beautiful code snippets with syntax highlighting.",
    color: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    preview: "img/previews/sharecode.png"
  },
];

const FEATURED = PROJECTS.slice(0, 3);
const TOP_CHARTS = PROJECTS.slice(3);

function AppIcon({ icon, color, size = 64 }: { icon: string; color: string; size?: number }) {
  const isImage = icon.includes("/");
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.225,
        background: isImage ? "transparent" : color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: isImage ? "none" : "0 4px 12px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.3)",
        border: isImage ? "none" : "0.5px solid rgba(0,0,0,0.1)",
        flexShrink: 0,
        overflow: "hidden"
      }}
    >
      {isImage ? (
        <img src={icon} alt="App Icon" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: size * 0.225 }} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.style.background = color; }} />
      ) : (
        <span className={icon} style={{ width: size * 0.5, height: size * 0.5, color: "white" }} />
      )}
    </div>
  );
}

function FeaturedCard({ app, index }: { app: AppEntry; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 + 0.1, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        borderRadius: "16px",
        overflow: "hidden",
        cursor: "pointer",
        flexShrink: 0,
        width: "360px",
        height: "260px",
        position: "relative",
        boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
        border: "0.5px solid var(--c-border, rgba(0,0,0,0.1))",
        display: "flex",
        flexDirection: "column",
        background: "var(--c-bg-secondary)"
      }}
      whileHover={{ scale: 1.015, boxShadow: "0 8px 24px rgba(0,0,0,0.18)", transition: { duration: 0.2 } }}
    >
      <div
        style={{
          background: app.color,
          height: "180px",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden"
        }}
      >
        {app.preview ? (
          <img 
            src={app.preview} 
            alt={app.name} 
            style={{ width: "100%", height: "100%", objectFit: "cover" }} 
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        ) : null}
        {/* Fallback pattern if image is missing */}
        <div style={{ position: "absolute", opacity: 0.1, backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "16px 16px", inset: 0 }} />
      </div>
      
      <div 
        style={{ 
            flex: 1,
            padding: "16px 20px", 
            background: "var(--c-bg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0, flex: 1 }}>
            <AppIcon icon={app.icon} color={app.color} size={48} />
            <div style={{ minWidth: 0, paddingRight: "16px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--system-blue, #007AFF)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "2px" }}>
                    {app.category}
                </div>
                <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--c-text)", letterSpacing: "-0.2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {app.name}
                </div>
                <div style={{ fontSize: "13px", color: "var(--c-text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {app.subtitle}
                </div>
            </div>
        </div>
        <button
          style={{
            background: "var(--c-bg-tertiary)",
            color: "var(--system-blue, #007AFF)",
            border: "none",
            borderRadius: "14px",
            padding: "4px 16px",
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
            flexShrink: 0,
            height: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.2s ease"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--c-border)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--c-bg-tertiary)")}
        >
          VIEW
        </button>
      </div>
    </motion.div>
  );
}

function AppRow({ app, index, showBorder = true }: { app: AppEntry; index: number; showBorder?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 + 0.2, duration: 0.4, ease: "easeOut" }}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "12px 0",
        borderBottom: showBorder ? "0.5px solid var(--c-border)" : "none",
        cursor: "pointer",
        position: "relative"
      }}
      whileHover={{ backgroundColor: "var(--c-bg-tertiary)", borderRadius: "8px", paddingLeft: "8px", paddingRight: "8px", margin: "0 -8px" }}
    >
      <AppIcon icon={app.icon} color={app.color} size={64} />
      
      <div style={{ flex: 1, minWidth: 0, marginLeft: "16px", paddingRight: "16px" }}>
        <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--c-text)", letterSpacing: "-0.2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{app.name}</div>
        <div style={{ fontSize: "13px", color: "var(--c-text-secondary)", marginTop: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{app.subtitle || app.category}</div>
      </div>
      
      <button
        style={{
          background: "var(--c-bg-tertiary)",
          color: "var(--system-blue, #007AFF)",
          border: "none",
          borderRadius: "14px",
          padding: "4px 20px",
          fontSize: "13px",
          fontWeight: 700,
          cursor: "pointer",
          flexShrink: 0,
          height: "28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.2s ease"
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--c-border)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "var(--c-bg-tertiary)")}
      >
        VIEW
      </button>
    </motion.div>
  );
}

const SIDEBAR_ITEMS = [
  { id: "discover", label: "Discover", icon: "i-ph:compass" },
  { id: "arcade", label: "Arcade", icon: "i-ph:game-controller" },
  { id: "create", label: "Create", icon: "i-ph:paint-brush" },
  { id: "work", label: "Work", icon: "i-ph:briefcase" },
  { id: "play", label: "Play", icon: "i-ph:play-circle" },
  { id: "develop", label: "Develop", icon: "i-ph:code" },
  { id: "categories", label: "Categories", icon: "i-ph:squares-four" },
  { id: "updates", label: "Updates", icon: "i-ph:download-simple" },
];

export default function AppStore() {
  const [activeTab, setActiveTab] = useState("discover");

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        background: "var(--c-bg)",
        borderRadius: "0 0 14px 14px",
        overflow: "hidden",
      }}
    >
      {/* Sidebar - Liquid Glass */}
      <div
        className="mac-sidebar"
        style={{
          width: "220px",
          flexShrink: 0,
          borderRight: "var(--lg-border)",
          background: "var(--lg-bg-tinted)",
          backdropFilter: "var(--lg-blur-light)",
          WebkitBackdropFilter: "var(--lg-blur-light)",
          overflowY: "auto",
          padding: "16px 12px",
          display: "flex",
          flexDirection: "column",
          gap: "4px"
        }}
      >
        {/* Search */}
        <div style={{ marginBottom: "20px", padding: "0 4px" }}>
            <div style={{ 
                display: "flex", 
                alignItems: "center", 
                background: "var(--c-bg-tertiary)", 
                borderRadius: "6px", 
                padding: "6px 8px", 
                gap: "8px",
                border: "0.5px solid var(--c-border)"
            }}>
                <span className="i-ph:magnifying-glass" style={{ width: "14px", height: "14px", color: "var(--c-text-tertiary)" }} />
                <span style={{ fontSize: "13px", color: "var(--c-text-tertiary)" }}>Search</span>
            </div>
        </div>

        {SIDEBAR_ITEMS.map((item) => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px 12px",
                background: active ? "var(--c-bg-tertiary)" : "transparent",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                textAlign: "left",
                transition: "background 0.15s ease",
                color: active ? "var(--c-text)" : "var(--c-text-secondary)",
                fontWeight: active ? 600 : 500,
              }}
            >
              <span className={item.icon} style={{ width: "18px", height: "18px", color: active ? "var(--system-blue, #007AFF)" : "inherit" }} />
              <span style={{ fontSize: "14px" }}>{item.label}</span>
            </button>
          );
        })}
        
        {/* User Account Item at the bottom */}
        <div style={{ flex: 1 }} />
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 12px",
            background: "transparent",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            textAlign: "left",
            transition: "background 0.15s ease",
            color: "var(--c-text-secondary)",
            fontWeight: 500,
            marginTop: "16px"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--c-bg-tertiary)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "var(--system-blue, #007AFF)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold" }}>
            A
          </div>
          <span style={{ fontSize: "14px", flex: 1 }}>Suyash Singh</span>
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflowY: "auto", background: "var(--c-bg)", position: "relative", WebkitFontSmoothing: "antialiased" }}>
        {activeTab === "discover" ? (
          <div style={{ padding: "48px 56px", maxWidth: "1040px", margin: "0 auto" }}>
            
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", borderBottom: "0.5px solid var(--c-border)", paddingBottom: "16px" }}>
              <h1 style={{ fontSize: "34px", fontWeight: 700, color: "var(--c-text)", margin: 0, letterSpacing: "-0.5px" }}>Discover</h1>
              <div style={{ display: "flex", gap: "16px", color: "var(--c-text-secondary)" }}>
                <span className="i-ph:bell" style={{ width: "22px", height: "22px", cursor: "pointer" }} />
              </div>
            </div>
            
            {/* Horizontal Scroll section (Large Featured Cards) */}
            <div style={{ marginBottom: "56px" }}>
              <div style={{ display: "flex", gap: "24px", overflowX: "auto", paddingBottom: "24px", margin: "0 -8px", padding: "0 8px 24px", scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}>
                {FEATURED.map((app, i) => (
                  <div key={app.id} style={{ scrollSnapAlign: "start" }}>
                    <FeaturedCard app={app} index={i} />
                  </div>
                ))}
              </div>
            </div>

            {/* List Section (Top Charts / New Apps) */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
                <h2 style={{ fontSize: "24px", fontWeight: 700, color: "var(--c-text)", margin: 0, letterSpacing: "-0.3px" }}>Top Projects</h2>
                <span style={{ fontSize: "15px", color: "var(--system-blue, #007AFF)", cursor: "pointer", fontWeight: 500 }}>See All</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 64px" }}>
                {/* Column 1 */}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {TOP_CHARTS.map((app, i) => (
                    <AppRow key={app.id} app={app} index={i} showBorder={i !== TOP_CHARTS.length - 1} />
                  ))}
                </div>
                {/* Column 2 */}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {FEATURED.map((app, i) => (
                    <AppRow key={app.id} app={app} index={i + TOP_CHARTS.length} showBorder={i !== FEATURED.length - 1} />
                  ))}
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--c-text-tertiary)" }}>
            <div style={{ textAlign: "center" }}>
                <span className="i-ph:cone" style={{ width: "48px", height: "48px", marginBottom: "16px" }} />
                <h2 style={{ fontSize: "20px", fontWeight: 600 }}>Under Construction</h2>
                <p style={{ fontSize: "14px" }}>This section is currently being updated.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
