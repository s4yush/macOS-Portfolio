import { format } from "date-fns";

export default function ClockWidget() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const seconds = now.getSeconds();
  const minutes = now.getMinutes();
  const hours = now.getHours() % 12;

  const secDeg = seconds * 6;
  const minDeg = minutes * 6 + seconds * 0.1;
  const hrDeg = hours * 30 + minutes * 0.5;

  return (
    <div
      style={{
        background: "var(--lg-bg-tinted)",
        backdropFilter: "var(--lg-blur-light)",
        WebkitBackdropFilter: "var(--lg-blur-light)",
        border: "var(--lg-border)",
        borderRadius: "var(--radius-control)",
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
    >
      <svg width={54} height={54} viewBox="0 0 54 54">
        <circle cx={27} cy={27} r={26} fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} />
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x1 = 27 + 22 * Math.sin(angle);
          const y1 = 27 - 22 * Math.cos(angle);
          const x2 = 27 + 24 * Math.sin(angle);
          const y2 = 27 - 24 * Math.cos(angle);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.4)" strokeWidth={1} />;
        })}
        <line
          x1={27} y1={27}
          x2={27 + 13 * Math.sin((hrDeg * Math.PI) / 180)}
          y2={27 - 13 * Math.cos((hrDeg * Math.PI) / 180)}
          stroke="white" strokeWidth={2.5} strokeLinecap="round"
        />
        <line
          x1={27} y1={27}
          x2={27 + 18 * Math.sin((minDeg * Math.PI) / 180)}
          y2={27 - 18 * Math.cos((minDeg * Math.PI) / 180)}
          stroke="white" strokeWidth={1.8} strokeLinecap="round"
        />
        <line
          x1={27} y1={27}
          x2={27 + 20 * Math.sin((secDeg * Math.PI) / 180)}
          y2={27 - 20 * Math.cos((secDeg * Math.PI) / 180)}
          stroke="var(--accent-red)" strokeWidth={1} strokeLinecap="round"
        />
        <circle cx={27} cy={27} r={2} fill="white" />
      </svg>

      <div>
        <div style={{ fontSize: 22, fontWeight: 300, color: "white", letterSpacing: "-0.5px", lineHeight: 1.1, fontVariantNumeric: "tabular-nums" }}>
          {format(now, "h:mm")}
          <span style={{ fontSize: 14, opacity: 0.6, marginLeft: 3 }}>{format(now, "ss")}</span>
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", marginTop: 2 }}>
          {format(now, "EEEE, MMMM d")}
        </div>
      </div>
    </div>
  );
}
