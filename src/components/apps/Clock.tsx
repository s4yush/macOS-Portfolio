import { motion, AnimatePresence } from "framer-motion";

const WORLD_CLOCKS = [
  { city: "Jodhpur", timezone: "Asia/Kolkata", flag: "🇮🇳", offset: "+5:30" },
  { city: "San Francisco", timezone: "America/Los_Angeles", flag: "🇺🇸", offset: "-7:00" },
  { city: "New York", timezone: "America/New_York", flag: "🇺🇸", offset: "-4:00" },
  { city: "London", timezone: "Europe/London", flag: "🇬🇧", offset: "+1:00" },
  { city: "Tokyo", timezone: "Asia/Tokyo", flag: "🇯🇵", offset: "+9:00" },
  { city: "Berlin", timezone: "Europe/Berlin", flag: "🇩🇪", offset: "+2:00" },
];

interface AlarmItem {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
  days: string;
}

const ALARMS: AlarmItem[] = [
  { id: "1", time: "6:30", label: "Wake up", enabled: true, days: "Weekdays" },
  { id: "2", time: "8:00", label: "Stand Up Call", enabled: true, days: "Mon, Wed, Fri" },
  { id: "3", time: "22:00", label: "Wind down", enabled: false, days: "Every day" },
];

type Tab = "world" | "alarm" | "stopwatch" | "timer";

export default function Clock() {
  const [tab, setTab] = useState<Tab>("world");
  const [time, setTime] = useState(new Date());
  const [alarms, setAlarms] = useState(ALARMS);
  const [stopwatch, setStopwatch] = useState({ running: false, elapsed: 0, laps: [] as number[] });
  const swRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Keep the configured duration separate from the live countdown.
  const [timer, setTimer] = useState({ running: false, total: 5 * 60 * 1000, remaining: 5 * 60 * 1000 });
  const tmRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Stopwatch state and controls.
  useEffect(() => {
    if (stopwatch.running) {
      swRef.current = setInterval(() => {
        setStopwatch((s) => ({ ...s, elapsed: s.elapsed + 10 }));
      }, 10);
    } else {
      if (swRef.current) clearInterval(swRef.current);
    }
    return () => { if (swRef.current) clearInterval(swRef.current); };
  }, [stopwatch.running]);

  // Timer state and countdown.
  useEffect(() => {
    if (timer.running) {
      tmRef.current = setInterval(() => {
        setTimer((t) => {
          const next = t.remaining - 1000;
          if (next <= 0) return { ...t, running: false, remaining: 0 };
          return { ...t, remaining: next };
        });
      }, 1000);
    } else if (tmRef.current) {
      clearInterval(tmRef.current);
    }
    return () => { if (tmRef.current) clearInterval(tmRef.current); };
  }, [timer.running]);

  const fmtTimer = (ms: number) => {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const adjustTimer = (deltaMs: number) =>
    setTimer((t) => {
      if (t.running) return t;
      const total = Math.max(0, Math.min(99 * 3600000, t.total + deltaMs));
      return { ...t, total, remaining: total };
    });

  const fmtMs = (ms: number) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    const cs = Math.floor((ms % 1000) / 10);
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
  };

  const getTimeInZone = (tz: string) => {
    return new Date().toLocaleTimeString("en-US", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const isDayInZone = (tz: string) => {
    const h = parseInt(new Date().toLocaleString("en-US", { timeZone: tz, hour: "numeric", hour12: false }));
    return h >= 6 && h < 20;
  };

  const sec = time.getSeconds();
  const min = time.getMinutes();
  const hr = time.getHours() % 12;
  const secDeg = sec * 6;
  const minDeg = min * 6 + sec * 0.1;
  const hrDeg = hr * 30 + min * 0.5;

  const AnalogClock = ({ size = 120 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 120 120">
      <circle cx="60" cy="60" r="58" fill="var(--c-bg-secondary, rgba(30,30,35,0.95))" stroke="var(--c-border, rgba(255,255,255,0.1))" strokeWidth="1" />
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const x1 = 60 + 50 * Math.sin(angle);
        const y1 = 60 - 50 * Math.cos(angle);
        const x2 = 60 + 54 * Math.sin(angle);
        const y2 = 60 - 54 * Math.cos(angle);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--c-text-tertiary, rgba(255,255,255,0.4))" strokeWidth="2" strokeLinecap="round" />;
      })}
      <line
        x1="60" y1="60"
        x2={60 + 28 * Math.sin((hrDeg * Math.PI) / 180)}
        y2={60 - 28 * Math.cos((hrDeg * Math.PI) / 180)}
        stroke="var(--c-text, white)" strokeWidth="3" strokeLinecap="round"
        style={{ transition: "all 0.5s ease" }}
      />
      <line
        x1="60" y1="60"
        x2={60 + 38 * Math.sin((minDeg * Math.PI) / 180)}
        y2={60 - 38 * Math.cos((minDeg * Math.PI) / 180)}
        stroke="var(--c-text, white)" strokeWidth="2" strokeLinecap="round"
        style={{ transition: "all 0.5s ease" }}
      />
      <line
        x1="60" y1="60"
        x2={60 + 44 * Math.sin((secDeg * Math.PI) / 180)}
        y2={60 - 44 * Math.cos((secDeg * Math.PI) / 180)}
        stroke="#FF3B30" strokeWidth="1.5" strokeLinecap="round"
      />
      <circle cx="60" cy="60" r="3" fill="#FF3B30" />
    </svg>
  );

  const TABS: { id: Tab; label: string }[] = [
    { id: "world", label: "World Clock" },
    { id: "alarm", label: "Alarm" },
    { id: "stopwatch", label: "Stopwatch" },
    { id: "timer", label: "Timer" },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "var(--c-bg)",
        borderRadius: "0 0 14px 14px",
        overflow: "hidden",
        color: "var(--c-text)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "10px 12px",
          borderBottom: "1px solid var(--c-border)",
          background: "var(--c-bg-secondary)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div style={{
          display: "flex",
          background: "var(--c-bg-tertiary)",
          padding: "2px",
          borderRadius: "8px",
          gap: "2px"
        }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: "4px 16px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 500,
                background: tab === t.id ? "var(--c-bg)" : "transparent",
                color: tab === t.id ? "var(--c-text)" : "var(--c-text-secondary)",
                boxShadow: tab === t.id ? "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)" : "none",
                transition: "all 0.15s ease",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            style={{ height: "100%" }}
          >
            {tab === "world" && (
              <div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 0 16px" }}>
                  <AnalogClock size={140} />
                  <div style={{ marginTop: "12px", fontSize: "13px", color: "var(--c-text-secondary)" }}>
                    {time.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                  </div>
                </div>

                <div style={{ padding: "0 16px" }}>
                  {WORLD_CLOCKS.map((clock, i) => (
                    <motion.div
                      key={clock.city}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "12px 0",
                        borderBottom: i < WORLD_CLOCKS.length - 1 ? "0.5px solid var(--c-border)" : "none",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ fontSize: "16px" }}>{clock.flag}</span>
                          <span style={{ fontSize: "14px", fontWeight: 500 }}>{clock.city}</span>
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--c-text-secondary)", marginTop: "2px" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
                            <span className={isDayInZone(clock.timezone) ? "i-ph:sun" : "i-ph:moon"} style={{ width: "11px", height: "11px" }} />
                            {isDayInZone(clock.timezone) ? "Day" : "Night"}
                          </span> · UTC{clock.offset}
                        </div>
                      </div>
                      <div
                        className="font-display font-tabular"
                        style={{
                          fontSize: "28px",
                          fontWeight: 300,
                          color: "var(--c-text)",
                          letterSpacing: "-0.5px"
                        }}
                      >
                        {getTimeInZone(clock.timezone)}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {tab === "alarm" && (
              <div style={{ padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <span style={{ fontSize: "16px", fontWeight: 700 }}>Alarms</span>
                  <button
                    style={{
                      background: "var(--c-bg-tertiary)",
                      border: "none",
                      borderRadius: "8px",
                      padding: "5px 12px",
                      fontSize: "12px",
                      color: "var(--c-text)",
                      cursor: "pointer",
                    }}
                  >
                    + Add
                  </button>
                </div>
                {alarms.map((alarm) => (
                  <motion.div
                    key={alarm.id}
                    layout
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "14px 0",
                      borderBottom: "0.5px solid var(--c-border)",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        className="font-display font-tabular"
                        style={{
                          fontSize: "42px",
                          fontWeight: 200,
                          letterSpacing: "-1px",
                          color: alarm.enabled ? "var(--c-text)" : "var(--c-text-tertiary)"
                        }}
                      >
                        {alarm.time}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--c-text-secondary)", marginTop: "2px" }}>
                        {alarm.label} · {alarm.days}
                      </div>
                    </div>
                    <div
                      onClick={() =>
                        setAlarms((prev) =>
                          prev.map((a) => (a.id === alarm.id ? { ...a, enabled: !a.enabled } : a))
                        )
                      }
                      style={{
                        width: 44,
                        height: 26,
                        borderRadius: 13,
                        background: alarm.enabled ? "#34C759" : "var(--c-bg-tertiary)",
                        cursor: "pointer",
                        position: "relative",
                        transition: "background 0.25s ease",
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: 3,
                          left: alarm.enabled ? 21 : 3,
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          background: "white",
                          transition: "left 0.25s ease",
                          boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {tab === "stopwatch" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "32px 16px",
                  gap: "24px",
                }}
              >
                <div
                  className="font-display font-tabular"
                  style={{
                    fontSize: "72px",
                    fontWeight: 200,
                    letterSpacing: "-2px",
                    color: "var(--c-text)"
                  }}
                >
                  {fmtMs(stopwatch.elapsed)}
                </div>
                <div style={{ display: "flex", gap: "16px" }}>
                  <button
                    onClick={() =>
                      setStopwatch((s) => ({
                        ...s,
                        elapsed: s.running ? s.elapsed : 0,
                        laps: s.running ? [...s.laps, s.elapsed] : [],
                        running: s.running ? false : s.running,
                      }))
                    }
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      background: "var(--c-bg-tertiary)",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--c-text)",
                      fontSize: "14px",
                      fontWeight: 500,
                    }}
                  >
                    {stopwatch.running ? "Lap" : "Reset"}
                  </button>
                  <button
                    onClick={() => setStopwatch((s) => ({ ...s, running: !s.running }))}
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      background: stopwatch.running ? "rgba(255,59,48,0.15)" : "rgba(52,199,89,0.15)",
                      border: `2px solid ${stopwatch.running ? "#FF3B30" : "#34C759"}`,
                      cursor: "pointer",
                      color: stopwatch.running ? "#FF3B30" : "#34C759",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
                    {stopwatch.running ? "Stop" : "Start"}
                  </button>
                </div>
                {stopwatch.laps.length > 0 && (
                  <div style={{ width: "100%", maxWidth: 280 }}>
                    {stopwatch.laps.map((lap, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "8px 0",
                          borderBottom: "0.5px solid var(--c-border)",
                          fontSize: "14px",
                          color: "var(--c-text-secondary)",
                        }}
                      >
                        <span>Lap {i + 1}</span>
                        <span style={{ fontVariantNumeric: "tabular-nums" }}>{fmtMs(lap)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === "timer" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  padding: "28px 16px",
                  gap: "22px",
                }}
              >
                {!timer.running && (
                  <div style={{ display: "flex", gap: "10px" }}>
                    {[
                      { label: "−5m", d: -5 * 60000 },
                      { label: "−1m", d: -60000 },
                      { label: "+1m", d: 60000 },
                      { label: "+5m", d: 5 * 60000 },
                    ].map((b) => (
                      <button
                        key={b.label}
                        onClick={() => adjustTimer(b.d)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "10px",
                          background: "var(--c-bg-tertiary)",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--c-text)",
                          fontSize: "13px",
                          fontWeight: 500,
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                )}

                <div
                  className="font-display font-tabular"
                  style={{
                    fontSize: "72px",
                    fontWeight: 200,
                    letterSpacing: "-2px",
                    color: timer.remaining === 0 ? "#FF3B30" : "var(--c-text)",
                    transition: "color 0.3s ease"
                  }}
                >
                  {fmtTimer(timer.remaining)}
                </div>

                <div style={{ display: "flex", gap: "16px" }}>
                  <button
                    onClick={() => setTimer((t) => ({ ...t, running: false, remaining: t.total }))}
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      background: "var(--c-bg-tertiary)",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--c-text)",
                      fontSize: "14px",
                      fontWeight: 500,
                    }}
                  >
                    Reset
                  </button>
                  <button
                    onClick={() =>
                      setTimer((t) => {
                        if (t.remaining === 0) return t;
                        return { ...t, running: !t.running };
                      })
                    }
                    disabled={timer.remaining === 0}
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      background: timer.running ? "rgba(255,59,48,0.15)" : "rgba(52,199,89,0.15)",
                      border: `2px solid ${timer.running ? "#FF3B30" : "#34C759"}`,
                      cursor: timer.remaining === 0 ? "default" : "pointer",
                      opacity: timer.remaining === 0 ? 0.4 : 1,
                      color: timer.running ? "#FF3B30" : "#34C759",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
                    {timer.running ? "Pause" : "Start"}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
