const WEATHER_DATA = {
  temp: 79,
  condition: "Mostly Clear",
  high: 84,
  low: 62,
  location: "Memphis",
  humidity: 52,
  wind: 8,
  alert: "Air quality alert",
  hourly: [
    { time: "Now", icon: "partly-cloudy", temp: 79 },
    { time: "1PM", icon: "sunny", temp: 82 },
    { time: "2PM", icon: "sunny", temp: 84 },
    { time: "3PM", icon: "cloudy", temp: 80 },
    { time: "4PM", icon: "cloudy", temp: 76 },
  ],
};

// Inline SVGs keep the weather icons consistent with the system interface.
const WeatherIcon = ({ type, size = 36 }: { type: string; size?: number }) => {
  const s = size;
  if (type === "sunny") return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="4.5" fill="#FFD60A" />
      {[0,45,90,135,180,225,270,315].map((deg, i) => (
        <line key={i} x1="12" y1="2.5" x2="12" y2="5"
          stroke="#FFD60A" strokeWidth="2" strokeLinecap="round"
          transform={`rotate(${deg} 12 12)`} />
      ))}
    </svg>
  );
  if (type === "rainy") return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M6 13a5 5 0 1 1 9.9-1H17a3 3 0 0 1 0 6H7a4 4 0 0 1-1-7.87" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" fill="none"/>
      <line x1="9" y1="19" x2="7" y2="22" stroke="#64D2FF" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="13" y1="19" x2="11" y2="22" stroke="#64D2FF" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
  if (type === "cloudy") return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M5 13a5 5 0 1 1 9.9-1H16a3 3 0 0 1 0 6H7a4 4 0 0 1-2-7.46" stroke="rgba(200,210,230,0.8)" strokeWidth="1.5" fill="rgba(200,210,230,0.12)"/>
    </svg>
  );
  if (type === "moon") return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="rgba(200,220,255,0.9)" strokeWidth="1.6" fill="rgba(160,180,255,0.15)" strokeLinejoin="round"/>
    </svg>
  );
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8.5" r="3.5" fill="#FFD60A" opacity="0.95"/>
      {[0,60,120,180,240,300].map((deg, i) => (
        <line key={i} x1="9" y1="1.5" x2="9" y2="3.2"
          stroke="#FFD60A" strokeWidth="1.6" strokeLinecap="round"
          transform={`rotate(${deg} 9 8.5)`} />
      ))}
      <path d="M8 14a4.5 4.5 0 1 1 8.9-.9H18a2.8 2.8 0 0 1 0 5.6H9a3.4 3.4 0 0 1-1-6.35"
        stroke="rgba(255,255,255,0.82)" strokeWidth="1.4" fill="rgba(255,255,255,0.14)"/>
    </svg>
  );
};

interface WeatherWidgetProps {
  compact?: boolean;
}

export default function WeatherWidget({ compact }: WeatherWidgetProps) {
  const GLASS: React.CSSProperties = {
    background: "linear-gradient(145deg, rgba(22,28,42,0.84) 0%, rgba(16,22,36,0.92) 100%)",
    backdropFilter: "blur(64px) saturate(200%)",
    WebkitBackdropFilter: "blur(64px) saturate(200%)",
    border: "0.5px solid rgba(255,255,255,0.12)",
    boxShadow: "0 4px 32px rgba(0,0,0,0.42), inset 0 0.5px 0 rgba(255,255,255,0.16)",
    fontFamily: "var(--font-system)",
  };

  if (compact) {
    return (
      <div style={{
        ...GLASS,
        borderRadius: 16,
        padding: "14px 16px 12px",
        userSelect: "none",
        width: 162,
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.72)", marginBottom: 4 }}>
          {WEATHER_DATA.location}
        </div>
        <div style={{
          fontSize: 48,
          fontWeight: 200,
          color: "white",
          lineHeight: 1,
          letterSpacing: "-2px",
          fontVariantNumeric: "tabular-nums",
          marginBottom: 6,
        }}>
          {WEATHER_DATA.temp}°
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          paddingTop: 8,
          borderTop: "0.5px solid rgba(255,255,255,0.09)",
        }}>
          <WeatherIcon type="moon" size={14} />
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", letterSpacing: "0.01em" }}>
            {WEATHER_DATA.alert}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...GLASS, borderRadius: 18, padding: "16px 18px", userSelect: "none", width: 200 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", marginBottom: 4, fontWeight: 500 }}>
            {WEATHER_DATA.location}
          </div>
          <div style={{ fontSize: 42, fontWeight: 200, color: "white", lineHeight: 1, letterSpacing: "-1.5px" }}>
            {WEATHER_DATA.temp}°
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 5 }}>
            {WEATHER_DATA.condition}
          </div>
        </div>
        <WeatherIcon type="partly-cloudy" size={48} />
      </div>

      <div style={{ display: "flex", gap: 14, marginTop: 12, paddingTop: 10, borderTop: "0.5px solid rgba(255,255,255,0.09)" }}>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)" }}>H:{WEATHER_DATA.high}° L:{WEATHER_DATA.low}°</span>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)" }}>💧 {WEATHER_DATA.humidity}%</span>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)" }}>💨 {WEATHER_DATA.wind}km/h</span>
      </div>

      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        marginTop: 10,
        paddingTop: 8,
        borderTop: "0.5px solid rgba(255,255,255,0.07)",
      }}>
        <WeatherIcon type="moon" size={16} />
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.50)" }}>{WEATHER_DATA.alert}</span>
      </div>
    </div>
  );
}
