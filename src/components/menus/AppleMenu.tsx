import React, { useRef, useState } from "react";
import { useClickOutside } from "~/hooks";

interface AppleMenuProps {
  logout: () => void;
  shut: (e: React.MouseEvent<HTMLLIElement>) => void;
  restart: (e: React.MouseEvent<HTMLLIElement>) => void;
  sleep: (e: React.MouseEvent<HTMLLIElement>) => void;
  toggleAppleMenu: () => void;
  openApp?: (id: string) => void;
  openAboutMac?: () => void;
  btnRef: React.RefObject<HTMLDivElement>;
}

export default function AppleMenu({
  logout,
  shut,
  restart,
  sleep,
  toggleAppleMenu,
  openApp,
  openAboutMac,
  btnRef
}: AppleMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, toggleAppleMenu, [btnRef]);

  const handleSleep = () => {
    sleep({ stopPropagation: () => {} } as React.MouseEvent<HTMLLIElement>);
    toggleAppleMenu();
  };
  const handleRestart = () => {
    restart({ stopPropagation: () => {} } as React.MouseEvent<HTMLLIElement>);
    toggleAppleMenu();
  };
  const handleShut = () => {
    shut({ stopPropagation: () => {} } as React.MouseEvent<HTMLLIElement>);
    toggleAppleMenu();
  };

  const open = (id: string) => {
    toggleAppleMenu();
    openApp?.(id);
  };

  const handleAbout = () => {
    toggleAppleMenu();
    openAboutMac?.();
  };

  const itemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "3px 10px",
    fontSize: "13.5px",
    lineHeight: "18px",
    cursor: "default",
    borderRadius: "4px",
    transition: "background 0.05s ease, color 0.05s ease",
    userSelect: "none",
    margin: "1px 5px",
  };

  const MenuItem = ({ children, onClick, hint }: { children: React.ReactNode; onClick?: () => void; hint?: string }) => {
    const [hovered, setHovered] = useState(false);
    return (
      <div
        className="text-black dark:text-white"
        style={{
          ...itemStyle,
          background: hovered ? "var(--accent-blue)" : "transparent",
          color: hovered ? "#fff" : "inherit",
        }}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <span>{children}</span>
        {hint && (
          <span style={{ fontSize: "12px", opacity: hovered ? 0.9 : 0.5, marginLeft: "auto", fontFamily: "var(--font-system)", letterSpacing: "1px" }}>
            {hint}
          </span>
        )}
      </div>
    );
  };

  return (
    <div
      ref={ref}
      className="menu-box"
      style={{
        position: "fixed",
        top: "28px",
        left: "8px",
        width: "240px",
        padding: "5px 0",
        zIndex: 9999,
        fontFamily: "var(--font-system)",
        fontWeight: 400,
      }}
    >
      <MenuItem onClick={handleAbout}>About This Mac</MenuItem>
      <div className="h-px bg-gray-300 dark:bg-white/10 my-1 mx-2" />
      <MenuItem onClick={() => open("system-settings")}>System Settings...</MenuItem>
      <MenuItem onClick={() => open("app-store")}>App Store...</MenuItem>
      <div className="h-px bg-gray-300 dark:bg-white/10 my-1 mx-2" />
      <MenuItem>Recent Items ›</MenuItem>
      <div className="h-px bg-gray-300 dark:bg-white/10 my-1 mx-2" />
      <MenuItem hint="⌥⌘⎋">Force Quit...</MenuItem>
      <div className="h-px bg-gray-300 dark:bg-white/10 my-1 mx-2" />
      <MenuItem onClick={handleSleep}>Sleep</MenuItem>
      <MenuItem onClick={handleRestart}>Restart...</MenuItem>
      <MenuItem onClick={handleShut}>Shut Down...</MenuItem>
      <div className="h-px bg-gray-300 dark:bg-white/10 my-1 mx-2" />
      <MenuItem onClick={logout} hint="⌃⌘Q">Lock Screen</MenuItem>
      <MenuItem onClick={logout} hint="⇧⌘Q">Log Out Suyash...</MenuItem>
    </div>
  );
}
