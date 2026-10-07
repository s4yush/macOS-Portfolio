import { motion } from "framer-motion";

type CalcOp = "+" | "-" | "×" | "÷" | null;

interface CalcState {
  display: string;
  prev: string;
  op: CalcOp;
  justCalc: boolean;
}

const BTN_ROWS = [
  ["AC", "+/-", "%", "÷"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "-"],
  ["1", "2", "3", "+"],
  ["0", ".", "="],
];

const btnStyle = (label: string) => {
  if (label === "AC" || label === "+/-" || label === "%") {
    return {
      background: "rgba(160,160,160,0.35)",
      color: "#1c1c1e",
    };
  }
  if (["÷", "×", "-", "+", "="].includes(label)) {
    return {
      background: "rgba(255,153,0,0.9)",
      color: "#fff",
    };
  }
  return {
    background: "rgba(80,80,80,0.35)",
    color: "#fff",
  };
};

export default function Calculator() {
  const [state, setState] = useState<CalcState>({
    display: "0",
    prev: "",
    op: null,
    justCalc: false,
  });

  const formatDisplay = (n: string) => {
    const num = parseFloat(n);
    if (isNaN(num)) return "Error";
    if (n.endsWith(".")) return n;
    if (Math.abs(num) > 1e15) return num.toExponential(6);
    return parseFloat(num.toPrecision(12)).toString();
  };

  const handleButton = (label: string) => {
    setState((s) => {
      const { display, prev, op, justCalc } = s;

      if (label === "AC") return { display: "0", prev: "", op: null, justCalc: false };

      if (label === "+/-") {
        const n = parseFloat(display) * -1;
        return { ...s, display: String(n) };
      }

      if (label === "%") {
        const n = parseFloat(display) / 100;
        return { ...s, display: String(n) };
      }

      if (["+", "-", "×", "÷"].includes(label)) {
        return {
          display: display,
          prev: display,
          op: label as CalcOp,
          justCalc: false,
        };
      }

      if (label === "=") {
        if (!op || prev === "") return s;
        const a = parseFloat(prev);
        const b = parseFloat(display);
        let result: number;
        if (op === "+") result = a + b;
        else if (op === "-") result = a - b;
        else if (op === "×") result = a * b;
        else result = b !== 0 ? a / b : NaN;
        return {
          display: formatDisplay(isNaN(result) ? "Error" : String(result)),
          prev: "",
          op: null,
          justCalc: true,
        };
      }

      if (label === ".") {
        if (display.includes(".") && !justCalc) return s;
        const base = justCalc ? "0" : display;
        return { ...s, display: base + ".", justCalc: false };
      }

      if (justCalc) return { ...s, display: label, justCalc: false };
      if (op && prev !== "" && !justCalc && s.display === display && display === prev) {
        return { ...s, display: label, justCalc: false };
      }
      const newDisplay =
        display === "0" ? label : display.length < 12 ? display + label : display;
      return { ...s, display: newDisplay };
    });
  };

  useEffect(() => {
    const map: Record<string, string> = {
      "0": "0", "1": "1", "2": "2", "3": "3", "4": "4",
      "5": "5", "6": "6", "7": "7", "8": "8", "9": "9",
      ".": ".", "+": "+", "-": "-", "*": "×", "/": "÷",
      "Enter": "=", "=": "=", "Backspace": "AC", "Escape": "AC",
    };
    const onKey = (e: KeyboardEvent) => {
      if (map[e.key]) handleButton(map[e.key]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      className="flex flex-col size-full select-none"
      style={{
        background: "rgba(28,28,30,0.96)",
        borderRadius: "0 0 14px 14px",
        overflow: "hidden",
      }}
    >
      <div
        className="flex-1 flex items-end justify-end px-5 pb-3"
        style={{ minHeight: 80, background: "rgba(0,0,0,0.3)" }}
      >
        <motion.span
          key={state.display}
          className="font-display"
          initial={{ opacity: 0.6, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.1 }}
          style={{
            color: "#fff",
            fontSize: state.display.length > 9 ? "28px" : "48px",
            fontWeight: 200,
            letterSpacing: "-1px",
            textAlign: "right",
            lineHeight: 1,
          }}
        >
          {state.display}
        </motion.span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1px",
          background: "rgba(255,255,255,0.06)",
          padding: "1px",
        }}
      >
        {BTN_ROWS.map((row, ri) =>
          row.map((label, ci) => {
            const isZero = label === "0";
            return (
              <motion.button
                key={`${ri}-${ci}`}
                whileTap={{ scale: 0.92, opacity: 0.8 }}
                onClick={() => handleButton(label)}
                style={{
                  ...btnStyle(label),
                  gridColumn: isZero ? "span 2" : "span 1",
                  padding: isZero ? "0 0 0 24px" : "0",
                  height: "64px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "22px",
                  fontWeight: 300,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: isZero ? "flex-start" : "center",
                  backdropFilter: "blur(10px)",
                  transition: "background 0.15s ease",
                  outline: "none",
                }}
              >
                {label}
              </motion.button>
            );
          })
        )}
      </div>
    </div>
  );
}
