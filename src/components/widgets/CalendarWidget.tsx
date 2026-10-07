import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isSameMonth } from "date-fns";

interface CalendarWidgetProps {
  compact?: boolean;
}

const GLASS: React.CSSProperties = {
  background: "rgba(18, 18, 20, 0.72)",
  backdropFilter: "blur(64px) saturate(210%)",
  WebkitBackdropFilter: "blur(64px) saturate(210%)",
  border: "0.5px solid rgba(255,255,255,0.11)",
  boxShadow: "0 4px 32px rgba(0,0,0,0.40), inset 0 0.5px 0 rgba(255,255,255,0.14)",
};

export default function CalendarWidget({ compact }: CalendarWidgetProps) {
  const today = new Date();
  const start = startOfWeek(startOfMonth(today));
  const end = endOfWeek(endOfMonth(today));
  const days = eachDayOfInterval({ start, end });
  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div
      style={{
        ...GLASS,
        borderRadius: 16,
        padding: "12px 14px 14px",
        userSelect: "none",
        width: compact ? 162 : 200,
        fontFamily: "var(--font-system)",
      }}
    >
      <div style={{ marginBottom: 8 }}>
        <span style={{
          fontSize: compact ? 10 : 11,
          fontWeight: 700,
          color: "#FF3B30",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          display: "block",
        }}>
          {format(today, "MMMM")}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 3 }}>
        {dayLabels.map((d, i) => (
          <div key={i} style={{
            textAlign: "center",
            fontSize: compact ? 8 : 9,
            fontWeight: 600,
            color: "rgba(255,255,255,0.32)",
            paddingBottom: 3,
          }}>
            {d}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: compact ? 1 : 2 }}>
        {days.map((day) => {
          const isToday = isSameDay(day, today);
          const inMonth = isSameMonth(day, today);
          const size = compact ? 18 : 22;
          return (
            <div key={day.toISOString()} style={{
              textAlign: "center",
              fontSize: compact ? 9 : 10,
              fontWeight: isToday ? 700 : inMonth ? 400 : 300,
              color: isToday ? "white" : inMonth ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.20)",
              background: isToday ? "#FF3B30" : "transparent",
              borderRadius: "50%",
              width: size,
              height: size,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              transition: "background 0.15s ease",
            }}>
              {format(day, "d")}
            </div>
          );
        })}
      </div>
    </div>
  );
}
