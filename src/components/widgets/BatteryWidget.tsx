export default function BatteryWidget() {
  const [level, setLevel] = useState<number | null>(null);
  const [charging, setCharging] = useState(false);

  useEffect(() => {
    const nav = navigator as any;
    if (nav.getBattery) {
      nav.getBattery().then((battery: any) => {
        setLevel(Math.round(battery.level * 100));
        setCharging(battery.charging);
        battery.addEventListener("levelchange", () => setLevel(Math.round(battery.level * 100)));
        battery.addEventListener("chargingchange", () => setCharging(battery.charging));
      });
    }
  }, []);

  const pct = level ?? 85;
  const color = pct > 20 ? (charging ? "var(--accent-green)" : "var(--accent-green)") : "var(--accent-red)";

  return (
    <div
      style={{
        background: "var(--lg-bg-tinted)",
        backdropFilter: "var(--lg-blur-light)",
        WebkitBackdropFilter: "var(--lg-blur-light)",
        border: "var(--lg-border)",
        borderRadius: "var(--radius-control)",
        padding: "10px 14px",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div style={{ position: "relative", width: 36, height: 18 }}>
        <div style={{
          width: 32, height: 18,
          border: "1.5px solid rgba(255,255,255,0.5)",
          borderRadius: 4,
          position: "absolute", left: 0, top: 0,
          overflow: "hidden",
        }}>
          <div style={{
            width: `${pct}%`,
            height: "100%",
            background: color,
            transition: "width 0.5s ease",
          }} />
        </div>
        <div style={{
          width: 3, height: 8,
          background: "rgba(255,255,255,0.5)",
          borderRadius: "0 2px 2px 0",
          position: "absolute",
          right: 0,
          top: "50%",
          transform: "translateY(-50%)",
        }} />
      </div>

      <div>
        <div style={{ fontSize: 16, fontWeight: 500, color: "white", lineHeight: 1 }}>
          {pct}%
          {charging && <span style={{ fontSize: 12, marginLeft: 4 }}>⚡</span>}
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>
          {charging ? "Charging" : level === null ? "Estimated" : pct > 20 ? "Normal" : "Low battery"}
        </div>
      </div>
    </div>
  );
}
