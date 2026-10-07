import React, { useState, useEffect } from "react";
import { useStore } from "~/stores";

interface StatusBarProps {
  isAppOpen: boolean;
  appTitle?: string;
  onLeftTap?: () => void;
  onRightTap?: () => void;
}

export default function StatusBar({ isAppOpen, appTitle, onLeftTap, onRightTap }: StatusBarProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const h = time.getHours().toString().padStart(2, '0');
  const m = time.getMinutes().toString().padStart(2, '0');

  const dark = useStore((s) => s.dark);

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0,
      height: "50px",
      zIndex: 10000,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 20px",
      background: "transparent",
      pointerEvents: "none"
    }}>
      <div 
        onClick={onLeftTap}
        style={{
          pointerEvents: "auto",
          cursor: "pointer",
          width: "33%"
        }}
      >
        <span style={{
          fontSize: "16px",
          fontWeight: 700,
          color: "white",
          fontFamily: "-apple-system, sans-serif",
          letterSpacing: "-0.3px",
          textShadow: "0px 1px 3px rgba(0,0,0,0.4)"
        }}>{h}:{m}</span>
      </div>

      <div style={{
        position: "absolute",
        left: "50%", top: "8px",
        transform: "translateX(-50%)",
        width: "110px", height: "32px",
        background: "#000",
        borderRadius: "20px",
        pointerEvents: "auto"
      }} />

      <div 
        onClick={onRightTap}
        style={{
          display: "flex", alignItems: "center", gap: "6px",
          pointerEvents: "auto", cursor: "pointer",
          width: "33%", justifyContent: "flex-end",
          filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.4))"
        }}
      >
        <svg width="16" height="12" viewBox="0 0 16 12" fill="white">
          <rect x="0" y="8" width="3" height="4" rx="0.5"/>
          <rect x="4" y="5.5" width="3" height="6.5" rx="0.5"/>
          <rect x="8" y="3" width="3" height="9" rx="0.5"/>
          <rect x="12" y="0" width="3" height="12" rx="0.5"/>
        </svg>

        <svg width="16" height="12" viewBox="0 0 24 18" fill="white">
          <path d="M12 4C8.13 4 4.63 5.57 2.09 8.09L0 6C3.08 2.95 7.32 1 12 1s8.92 1.95 12 5l-2.09 2.09C19.37 5.57 15.87 4 12 4zm0 6c-2.21 0-4.21.9-5.66 2.34L4 10c1.98-1.98 4.72-3.2 7.76-3.2s5.78 1.22 7.76 3.2l-2.34 2.34C15.74 10.9 13.79 10 12 10zm0 6l-3-3c.78-.78 1.86-1.26 3-1.26s2.22.48 3 1.26L12 16z"/>
        </svg>

        <svg width="25" height="12" viewBox="0 0 25 12" fill="white">
          <rect x="0" y="0" width="22" height="12" rx="3" fill="none" stroke="white" strokeWidth="1.2"/>
          <rect x="22.5" y="3.5" width="2" height="5" rx="1" fill="white"/>
          <rect x="1.5" y="1.5" width="16" height="9" rx="2" fill="white"/>
        </svg>
      </div>
    </div>
  );
}
