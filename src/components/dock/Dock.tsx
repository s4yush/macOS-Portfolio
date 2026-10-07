import { useMotionValue } from "framer-motion";
import { motion } from "framer-motion";
import { apps } from "~/configs";
import { useWindowSize } from "~/hooks";
import { useState } from "react";
import { useStore } from "~/stores";
import DockItem from "./DockItem";

interface DockProps {
  open: (id: string) => void;
  showApps: {
    [key: string]: boolean;
  };
  showLaunchpad: boolean;
  toggleLaunchpad: (target: boolean) => void;
  hide: boolean;
}

export default function Dock({
  open,
  showApps,
  showLaunchpad,
  toggleLaunchpad,
  hide
}: DockProps) {
  const { dockSize, dockMag } = useStore((state) => ({
    dockSize: state.dockSize,
    dockMag: state.dockMag
  }));

  const [bouncingApp, setBouncingApp] = useState<string | null>(null);

  const openApp = (id: string) => {
    if (id === "launchpad") toggleLaunchpad(!showLaunchpad);
    else {
      toggleLaunchpad(false);
      // Bounce the dock icon after it is opened.
      if (!showApps[id]) {
        setBouncingApp(id);
        setTimeout(() => setBouncingApp(null), 700);
      }
      open(id);
    }
  };

  const mouseX = useMotionValue<number | null>(null);
  const { winWidth } = useWindowSize();
  const isMobile = winWidth < 768;

  // Separate installed apps from external links.
  const desktopApps = apps.filter(app => {
    if (app.hideFromDock) return false;
    if (!app.desktop && app.id !== 'launchpad') return false;
    if (isMobile) {
      return !!app.dockOnMobile;
    }
    return true;
  });
  const externalApps = apps.filter(app => {
    if (app.hideFromDock) return false;
    if (app.desktop || app.id === 'launchpad') return false;
    if (isMobile) {
      return !!app.dockOnMobile;
    }
    return true;
  });

  return (
    <motion.div
      className={`dock fixed inset-x-0 mx-2 sm:mx-auto bottom-2 w-full sm:w-max overflow-x-scroll sm:overflow-visible flex justify-center ${hide ? "z-0" : "z-50"}`}
      initial={false}
      animate={{
        opacity: hide ? 0 : 1,
        y: hide ? 20 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 35,
        mass: 0.8,
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          bottom: -8,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '70%',
          height: 28,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(180,200,255,0.22) 0%, rgba(120,160,255,0.10) 60%, transparent 100%)',
          filter: 'blur(10px)',
          pointerEvents: 'none',
          zIndex: -1,
        }}
      />
      <ul
        className="flex items-end px-2 rounded-none sm:rounded-2xl"
        onMouseMove={(e) => mouseX.set(e.nativeEvent.x)}
        onMouseLeave={() => mouseX.set(null)}
        style={{
          height: `${(dockSize + 15) / 16}rem`,
          padding: '4px 10px',
        }}
      >
        {desktopApps.map((app) => (
          <DockItem
            key={`dock-${app.id}`}
            id={app.id}
            title={(isMobile && app.mobileTitle) ? app.mobileTitle : app.title}
            img={(isMobile && app.mobileImg) ? app.mobileImg : app.img}
            mouseX={mouseX}
            desktop={app.desktop}
            openApp={openApp}
            isOpen={app.desktop && showApps[app.id]}
            link={app.link}
            dockSize={dockSize}
            dockMag={dockMag}
            isBouncing={bouncingApp === app.id}
          />
        ))}

        {externalApps.length > 0 && (
          <li className="flex items-center mx-1.5" style={{ height: `${dockSize / 16}rem` }}>
            <div
              style={{
                width: '1px',
                height: '55%',
                background: 'rgba(128,128,128,0.35)',
                borderRadius: '1px',
              }}
            />
          </li>
        )}

        {externalApps.map((app) => (
          <DockItem
            key={`dock-${app.id}`}
            id={app.id}
            title={(isMobile && app.mobileTitle) ? app.mobileTitle : app.title}
            img={(isMobile && app.mobileImg) ? app.mobileImg : app.img}
            mouseX={mouseX}
            desktop={app.desktop}
            openApp={openApp}
            isOpen={false}
            link={app.link}
            dockSize={dockSize}
            dockMag={dockMag}
            isBouncing={bouncingApp === app.id}
          />
        ))}
      </ul>
    </motion.div>
  );
}
