import { motion, AnimatePresence } from "framer-motion";

interface AboutThisMacModalProps {
  show: boolean;
  onClose: () => void;
}

const MacBookSVG = () => (
  <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Screen */}
    <rect x="18" y="6" width="84" height="54" rx="4" fill="#c8c8cc" />
    <rect x="20" y="8" width="80" height="50" rx="3" fill="#1c1c1e" />
    {/* Apple logo on screen */}
    <text x="60" y="38" textAnchor="middle" fontSize="16" fill="rgba(255,255,255,0.15)"></text>
    {/* Base */}
    <path d="M10 62 L14 60 H106 L110 62 L114 70 H6 L10 62Z" fill="#b0b0b5" />
    <rect x="6" y="70" width="108" height="3" rx="1.5" fill="#a0a0a5" />
    {/* Notch */}
    <rect x="52" y="6" width="16" height="4" rx="2" fill="#b0b0b5" />
  </svg>
);

const SPECS = [
  { label: "Chip", value: "Apple M4" },
  { label: "Memory", value: "8 GB" },
  { label: "Serial number", value: "XXXX000XXXXX" },
  { label: "macOS", value: "Tahoe 26.0" },
];

export default function AboutThisMacModal({ show, onClose }: AboutThisMacModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            key="about-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 200,
              backdropFilter: "blur(2px)",
              WebkitBackdropFilter: "blur(2px)",
              background: "rgba(0,0,0,0.18)",
            }}
          />

          {/* Modal card */}
          <motion.div
            key="about-modal"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.90 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 201,
              width: 340,
              background: "var(--lg-bg-solid)",
              backdropFilter: "var(--lg-blur)",
              WebkitBackdropFilter: "var(--lg-blur)",
              border: "var(--lg-border)",
              borderTop: "var(--lg-border-strong)",
              boxShadow: "var(--shadow-window-focused), var(--lg-inner-highlight-strong)",
              borderRadius: "var(--radius-window)",
              overflow: "hidden",
              fontFamily: "var(--font-system)",
            }}
          >
            {/* Traffic lights */}
            <div style={{ display: "flex", gap: 8, padding: "12px 14px 0", alignItems: "center" }}>
              <button onClick={onClose} style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F57", border: "none", cursor: "pointer" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FDBC40" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28C840" }} />
            </div>

            {/* MacBook image */}
            <div style={{ display: "flex", justifyContent: "center", paddingTop: 16, paddingBottom: 8 }}>
              <MacBookSVG />
            </div>

            {/* Model name */}
            <div style={{ textAlign: "center", paddingBottom: 14 }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: "var(--color-c-black, #1c1c1e)", lineHeight: 1.3 }}>
                MacBook Air
              </div>
              <div style={{ fontSize: 12, color: "rgba(100,100,100,0.75)", marginTop: 2 }}>
                26, 2025
              </div>
            </div>

            {/* Spec rows */}
            <div style={{ margin: "0 16px 12px", borderRadius: 10, overflow: "hidden", border: "0.5px solid rgba(0,0,0,0.1)" }}>
              {SPECS.map((row, i) => (
                <div
                  key={row.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 14px",
                    background: i % 2 === 0 ? "rgba(0,0,0,0.025)" : "rgba(255,255,255,0.6)",
                    borderBottom: i < SPECS.length - 1 ? "0.5px solid rgba(0,0,0,0.07)" : "none",
                    fontSize: 12,
                  }}
                >
                  <span style={{ color: "rgba(0,0,0,0.55)" }}>{row.label}</span>
                  <span style={{ color: "#1c1c1e", fontWeight: 500 }}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* More info button */}
            <div style={{ display: "flex", justifyContent: "center", paddingBottom: 12 }}>
              <button
                style={{
                  background: "rgba(0,0,0,0.06)",
                  border: "0.5px solid rgba(0,0,0,0.12)",
                  borderRadius: 7,
                  padding: "5px 16px",
                  fontSize: 12,
                  color: "#1c1c1e",
                  cursor: "pointer",
                  fontFamily: "var(--font-system)",
                }}
              >
                More info...
              </button>
            </div>

            {/* Copyright */}
            <div style={{ textAlign: "center", padding: "0 16px 14px", fontSize: 10, color: "rgba(0,0,0,0.35)", lineHeight: 1.5 }}>
              <div>Suyash Singh</div>
              <div>© 2026 Suyash Singh. All rights reserved.</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
