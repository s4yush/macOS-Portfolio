import React from "react";
import { createRoot } from "react-dom/client";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "~/stores";

import Desktop from "~/pages/Desktop";
import Login from "~/pages/Login";
import Boot from "~/pages/Boot";

import "@unocss/reset/tailwind.css";
import "uno.css";
import "katex/dist/katex.min.css";
import "~/styles/index.css";
import { AudioProvider } from "~/context/AudioContext";

// Match the bright transition shown when unlocking macOS.
const loginExitVariants = {
  initial: { opacity: 1, scale: 1, filter: "brightness(1)" },
  exit: {
    opacity: 0,
    scale: 1.05,
    filter: "brightness(4) saturate(0)",
    transition: {
      duration: 0.35,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

import Mobile from "~/pages/Mobile";
import { useWindowSize } from "~/hooks/useWindowSize";

const desktopEnterVariants = {
  initial: { opacity: 0, scale: 0.97, filter: "brightness(2)" },
  animate: {
    opacity: 1,
    scale: 1,
    filter: "brightness(1)",
    transition: {
      duration: 0.55,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const bootVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.6 } },
  exit: {
    opacity: 0,
    scale: 1.04,
    filter: "brightness(3)",
    transition: { duration: 0.5, ease: [0.4, 0, 0.6, 1] },
  },
};

export default function App() {
  const [login, setLogin] = useState<boolean>(false);
  const [booting, setBooting] = useState<boolean>(false);
  const [restart, setRestart] = useState<boolean>(false);
  const [sleep, setSleep] = useState<boolean>(false);

  const { winWidth } = useWindowSize();
  const isMobile = winWidth < 768;

  const { dark, getWallpaper, iconStyle, tintWindows } = useStore((s) => ({
    dark: s.dark,
    getWallpaper: s.getWallpaper,
    iconStyle: s.iconStyle,
    tintWindows: s.tintWindows,
  }));
  const activeWallpaper = getWallpaper();

  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  useEffect(() => {
    document.documentElement.dataset.iconStyle = iconStyle;
  }, [iconStyle]);

  useEffect(() => {
    document.documentElement.dataset.tintWindows = tintWindows ? "on" : "off";
  }, [tintWindows]);

  const shutMac = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setRestart(false);
    setSleep(false);
    setLogin(false);
    setBooting(true);
  };

  const restartMac = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setRestart(true);
    setSleep(false);
    setLogin(false);
    setBooting(true);
  };

  const sleepMac = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setRestart(false);
    setSleep(true);
    setLogin(false);
    setBooting(true);
  };

  const getPage = () => {
    if (booting) return "boot";
    if (login) return "desktop";
    return "login";
  };

  const page = getPage();

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", background: "transparent" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${dark ? activeWallpaper.night : activeWallpaper.day})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 0,
        }}
      />

      <AnimatePresence mode="popLayout">
        {page === "boot" && (
          <motion.div
            key="boot"
            className="size-full"
            variants={bootVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ position: "absolute", inset: 0, zIndex: 1 }}
          >
            <Boot restart={restart} sleep={sleep} setBooting={setBooting} />
          </motion.div>
        )}

        {page === "desktop" && (
          <motion.div
            key="desktop"
            className="size-full"
            variants={desktopEnterVariants}
            initial="initial"
            animate="animate"
            style={{ position: "absolute", inset: 0, zIndex: 1 }}
          >
            {isMobile ? (
              <Mobile
                setLogin={setLogin}
                shutMac={shutMac}
                sleepMac={sleepMac}
                restartMac={restartMac}
              />
            ) : (
              <Desktop
                setLogin={setLogin}
                shutMac={shutMac}
                sleepMac={sleepMac}
                restartMac={restartMac}
              />
            )}
          </motion.div>
        )}

        {page === "login" && (
          <motion.div
            key="login"
            className="size-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.4 } }}
            exit={loginExitVariants.exit}
            style={{ position: "absolute", inset: 0, zIndex: 1 }}
          >
            <Login
              setLogin={setLogin}
              shutMac={shutMac}
              sleepMac={sleepMac}
              restartMac={restartMac}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {login && (
          <motion.div
            key="flash"
            style={{
              position: "absolute",
              inset: 0,
              background: "white",
              pointerEvents: "none",
              zIndex: 9999,
            }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0, transition: { duration: 0.8, delay: 0 } }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

const rootElement = document.getElementById("root") as HTMLElement;
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <AudioProvider>
      <App />
    </AudioProvider>
  </React.StrictMode>
);
