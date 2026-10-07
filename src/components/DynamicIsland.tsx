import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import music from "~/configs/music";
import { useAudioContext } from "~/context/AudioContext";

type IslandState = "idle" | "compact" | "expanded";
type NotifType = "generic" | "music" | "appLaunch" | "timer";

interface IslandNotif {
  message: string;
  type: NotifType;
  timerEnd?: number;
}

interface DynamicIslandProps {
  currentApp?: string;
}

export default function DynamicIsland({ currentApp }: DynamicIslandProps) {
  const [state, setState] = useState<IslandState>("idle");
  const [isHovered, setIsHovered] = useState(false);
  const [notification, setNotification] = useState<IslandNotif | null>(null);
  const [timerDisplay, setTimerDisplay] = useState("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { audioState, controls } = useAudioContext();

  useEffect(() => {
    if (state === "expanded") {
      timeoutRef.current = setTimeout(() => {
        setState("compact");
      }, 5000);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [state]);

  useEffect(() => {
    if (notification?.type === "timer" && notification.timerEnd) {
      const update = () => {
        const remaining = Math.max(0, notification.timerEnd! - Date.now());
        const m = Math.floor(remaining / 60000);
        const s = Math.floor((remaining % 60000) / 1000);
        setTimerDisplay(`${m}:${s.toString().padStart(2, "0")}`);
        if (remaining === 0 && timerRef.current) clearInterval(timerRef.current);
      };
      update();
      timerRef.current = setInterval(update, 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
  }, [notification]);

  useEffect(() => {
    const handleNotification = (e: CustomEvent) => {
      const type: NotifType = e.detail?.type || "generic";
      const timerEnd = type === "timer" ? Date.now() + (e.detail?.duration || 60) * 1000 : undefined;
      setNotification({ message: e.detail?.message || "New notification", type, timerEnd });
      setState("expanded");
      setTimeout(() => {
        setNotification(null);
        setState("idle");
      }, 4000);
    };

    window.addEventListener("island:notify" as string, handleNotification as EventListener);
    return () => {
      window.removeEventListener("island:notify" as string, handleNotification as EventListener);
    };
  }, []);

  const handleClick = () => {
    if (state === "idle" || state === "compact") {
      setState("expanded");
    } else {
      setState("idle");
    }
  };

  const getWidth = () => {
    if (state === "expanded") return 380;
    if (state === "compact" || isHovered) return 180;
    return 126;
  };

  const notifIcon = () => {
    if (!notification) return null;
    const icons: Record<NotifType, string> = {
      generic: "i-ph:bell",
      music: "i-ph:music-notes",
      appLaunch: "i-ph:arrow-square-out",
      timer: "i-ph:timer",
    };
    const colors: Record<NotifType, string> = {
      generic: "linear-gradient(135deg, var(--accent-blue), var(--accent-purple))",
      music: "linear-gradient(135deg, var(--accent-pink), var(--accent-orange))",
      appLaunch: "linear-gradient(135deg, var(--accent-green), var(--accent-blue))",
      timer: "linear-gradient(135deg, var(--accent-orange), var(--accent-red))",
    };
    return { icon: icons[notification.type], color: colors[notification.type] };
  };

  return (
    <div
      className="fixed top-1.5 left-1/2 z-50"
      style={{ transform: "translateX(-50%)" }}
    >
      <motion.div
        layout
        onClick={handleClick}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        animate={{
          width: getWidth(),
          height: state === "expanded" ? "auto" : 32,
        }}
        transition={{
          type: "spring",
          stiffness: 320,
          damping: 28,
          mass: 0.6,
        }}
        style={{
          background: "#1a1a1a",
          borderRadius: state === "expanded" ? 24 : 36,
          cursor: "pointer",
          overflow: "hidden",
          boxShadow: "var(--shadow-dynamic-island)",
          minHeight: 32,
        }}
      >
        <AnimatePresence mode="wait">
          {state === "expanded" ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              style={{ padding: "12px 16px" }}
            >
              {notification ? (
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: notifIcon()?.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span className={`${notifIcon()?.icon} text-white text-lg`} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        color: "rgba(255,255,255,0.6)",
                        fontSize: 11,
                        fontWeight: 500,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {notification.type === "music" ? "Now Playing" :
                       notification.type === "appLaunch" ? "App Launched" :
                       notification.type === "timer" ? "Timer" : "Notification"}
                    </div>
                    {notification.type === "timer" ? (
                      <div style={{ color: "white", fontSize: 22, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                        {timerDisplay}
                      </div>
                    ) : (
                      <div
                        style={{
                          color: "white",
                          fontSize: 13,
                          fontWeight: 500,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {notification.message}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={music.cover}
                      alt="album"
                      style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover" }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: "white", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {music.title}
                      </div>
                      <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>{music.artist}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); controls.toggle(!audioState.playing); }}
                        style={{ background: "none", border: "none", color: "white", cursor: "pointer", padding: 4, display: "flex", alignItems: "center" }}
                      >
                        {audioState.playing ? <span className="i-ph:pause-fill text-xl" /> : <span className="i-ph:play-fill text-xl" />}
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        style={{ background: "none", border: "none", color: "white", cursor: "pointer", padding: 4, display: "flex", alignItems: "center" }}
                      >
                        <span className="i-ph:skip-forward-fill text-base" />
                      </button>
                    </div>
                  </div>
                  <div style={{ width: "100%", height: 3, borderRadius: 2, background: "rgba(255,255,255,0.15)", overflow: "hidden" }}>
                    <motion.div
                      style={{ height: "100%", borderRadius: 2, background: "var(--accent-green)", originX: 0 }}
                      animate={{ scaleX: audioState.playing ? [0.1, 0.9] : 0.1 }}
                      transition={audioState.playing ? { duration: 200, ease: "linear", repeat: 0 } : { duration: 0.3 }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="compact"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-between h-full px-3"
              style={{ height: 32 }}
            >
              <div className="flex items-center gap-1.5">
                {audioState.playing && (
                  <motion.div
                    className="flex items-center gap-0.5"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [3, 10, 5, 8, 3] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
                        style={{ width: 2.5, borderRadius: 2, background: "var(--accent-green)" }}
                      />
                    ))}
                  </motion.div>
                )}
              </div>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, #1f1f1f 30%, #0a0a0a 100%)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "inset 0 1px 2px rgba(0,0,0,0.5)",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
