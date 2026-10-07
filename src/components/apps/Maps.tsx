import { motion } from "framer-motion";

const PLACES = [
  { id: "1", name: "MBM University", type: "University", lat: 26.285, lng: 73.006, color: "#007AFF" },
  { id: "2", name: "Jodhpur", type: "City", lat: 26.292, lng: 73.014, color: "#FF9500" },
  { id: "3", name: "Mehrangarh Fort", type: "Landmark", lat: 26.298, lng: 72.978, color: "#FF3B30" },
  { id: "4", name: "Umaid Bhawan", type: "Palace", lat: 26.280, lng: 73.022, color: "#AF52DE" },
];

export default function Maps() {
  const [search, setSearch] = useState("");
  const [activePlace, setActivePlace] = useState(PLACES[0]);
  const [mapStyle, setMapStyle] = useState<"standard" | "satellite" | "transit">("standard");

  const filtered = search.trim()
    ? PLACES.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    : PLACES;

  const MapView = () => (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          background:
            mapStyle === "satellite"
              ? "linear-gradient(145deg, #1a2a1a, #0a1f0a, #152515)"
              : mapStyle === "transit"
              ? "linear-gradient(145deg, #e8f0fe, #d2e3fc, #c2d7f8)"
              : "linear-gradient(145deg, #e8e8e0, #d4d4c8, #c8c8b8)",
          position: "relative",
        }}
      >
        <svg
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          viewBox="0 0 400 300"
          preserveAspectRatio="xMidYMid slice"
        >
          <line x1="0" y1="150" x2="400" y2="150" stroke={mapStyle === "satellite" ? "rgba(255,255,255,0.3)" : "white"} strokeWidth="6" />
          <line x1="200" y1="0" x2="200" y2="300" stroke={mapStyle === "satellite" ? "rgba(255,255,255,0.3)" : "white"} strokeWidth="6" />
          <line x1="0" y1="80" x2="400" y2="220" stroke={mapStyle === "satellite" ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.8)"} strokeWidth="3" />
          <line x1="0" y1="220" x2="400" y2="80" stroke={mapStyle === "satellite" ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.8)"} strokeWidth="3" />
          {[60, 130, 270, 340].map((x) =>
            [50, 110, 190, 250].map((y) => (
              <rect
                key={`${x}-${y}`}
                x={x}
                y={y}
                width={50}
                height={40}
                rx={4}
                fill={
                  mapStyle === "satellite"
                    ? "rgba(60,80,60,0.6)"
                    : mapStyle === "transit"
                    ? "rgba(200,215,240,0.8)"
                    : "rgba(210,205,185,0.9)"
                }
              />
            ))
          )}
          <ellipse cx="320" cy="230" rx="60" ry="40" fill={mapStyle === "satellite" ? "rgba(20,60,100,0.7)" : "rgba(140,190,230,0.7)"} />

          {PLACES.map((place, i) => {
            const x = 80 + i * 80;
            const y = 60 + (i % 2) * 80;
            const isActive = activePlace.id === place.id;
            return (
              <g key={place.id} onClick={() => setActivePlace(place)} style={{ cursor: "pointer" }}>
                <circle
                  cx={x}
                  cy={y}
                  r={isActive ? 14 : 10}
                  fill={place.color}
                  opacity={isActive ? 1 : 0.8}
                />
                <circle cx={x} cy={y} r={isActive ? 7 : 5} fill="white" />
                {isActive && (
                  <circle cx={x} cy={y} r={22} fill="none" stroke={place.color} strokeWidth="2" opacity="0.4" />
                )}
              </g>
            );
          })}
        </svg>

        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            display: "flex",
            gap: "4px",
            background: "rgba(255,255,255,0.9)",
            borderRadius: "10px",
            padding: "3px",
            backdropFilter: "blur(10px)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
          }}
        >
          {(["standard", "satellite", "transit"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setMapStyle(s)}
              style={{
                background: mapStyle === s ? "#007AFF" : "transparent",
                border: "none",
                borderRadius: "7px",
                padding: "4px 8px",
                fontSize: "10px",
                cursor: "pointer",
                color: mapStyle === s ? "white" : "#1c1c1e",
                fontWeight: mapStyle === s ? 600 : 400,
                textTransform: "capitalize",
                transition: "all 0.15s ease",
              }}
            >
              {s}
            </button>
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 80,
            right: 12,
            display: "flex",
            flexDirection: "column",
            background: "rgba(255,255,255,0.9)",
            borderRadius: "10px",
            overflow: "hidden",
            backdropFilter: "blur(10px)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
          }}
        >
          {["+", "−"].map((btn) => (
            <button
              key={btn}
              style={{
                background: "transparent",
                border: "none",
                width: 32,
                height: 32,
                cursor: "pointer",
                fontSize: "18px",
                color: "#1c1c1e",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderBottom: btn === "+" ? "0.5px solid rgba(0,0,0,0.1)" : "none",
              }}
            >
              {btn}
            </button>
          ))}
        </div>

        <motion.div
          key={activePlace.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: "absolute",
            bottom: 12,
            left: 12,
            right: 52,
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(20px)",
            borderRadius: "14px",
            padding: "12px 14px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: activePlace.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span className="i-ph:map-pin" style={{ width: "18px", height: "18px", color: "white" }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "#1c1c1e" }}>
              {activePlace.name}
            </div>
            <div style={{ fontSize: "11px", color: "rgba(0,0,0,0.5)" }}>
              {activePlace.type} · Jodhpur, Rajasthan
            </div>
          </div>
          <button
            style={{
              background: "#007AFF",
              border: "none",
              borderRadius: "8px",
              padding: "6px 12px",
              fontSize: "12px",
              color: "white",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            Directions
          </button>
        </motion.div>
      </div>
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        height: "100%",

        background: "#e8e8e0",
        borderRadius: "0 0 14px 14px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "220px",
          flexShrink: 0,
          background: "rgba(248,248,250,0.98)",
          borderRight: "0.5px solid rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ padding: "10px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(0,0,0,0.07)",
              borderRadius: "10px",
              padding: "7px 10px",
            }}
          >
            <span className="i-ph:magnifying-glass" style={{ width: "12px", height: "12px", opacity: 0.5 }} />
            <input
              placeholder="Search Maps"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                background: "none",
                border: "none",
                outline: "none",
                fontSize: "13px",
                width: "100%",
                color: "#1c1c1e",
              }}
            />
          </div>
        </div>

        <div
          style={{
            fontSize: "10px",
            fontWeight: 700,
            color: "rgba(0,0,0,0.35)",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            padding: "4px 14px 4px",
          }}
        >
          Favourites
        </div>
        {filtered.map((place) => (
          <button
            key={place.id}
            onClick={() => setActivePlace(place)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 12px",
              background: activePlace.id === place.id ? "rgba(0,122,255,0.1)" : "transparent",
              border: "none",
              cursor: "pointer",
              borderRadius: "8px",
              margin: "1px 6px",
              width: "calc(100% - 12px)",
              transition: "background 0.15s ease",
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: place.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span className="i-ph:map-pin" style={{ width: "14px", height: "14px", color: "white" }} />
            </div>
            <div style={{ textAlign: "left", minWidth: 0 }}>
              <div
                style={{
                  fontSize: "13px",
                  color: activePlace.id === place.id ? "#007AFF" : "#1c1c1e",
                  fontWeight: activePlace.id === place.id ? 600 : 400,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {place.name}
              </div>
              <div style={{ fontSize: "11px", color: "rgba(0,0,0,0.4)" }}>{place.type}</div>
            </div>
          </button>
        ))}
      </div>

      <div style={{ flex: 1, position: "relative" }}>
        <MapView />
      </div>
    </div>
  );
}
