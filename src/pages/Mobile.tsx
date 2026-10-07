import React, { useState, useRef } from "react";
import { apps } from "~/configs";
import { useStore } from "~/stores";
import type { MacActions } from "~/types";
import { AnimatePresence, motion } from "framer-motion";
import StatusBar from "~/components/mobile/StatusBar";
import MobileDock from "~/components/mobile/MobileDock";
import ControlCenterMenu from "~/components/menus/ControlCenterMenu";
import NotificationCenter from "~/components/NotificationCenter";
import { useAudioContext } from "~/context/AudioContext";

export default function Mobile(props: MacActions) {
  const [activeApp, setActiveApp] = useState<string | null>(null);
  const [showControlCenter, setShowControlCenter] = useState(false);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);

  const statusBarLeftRef = useRef<HTMLDivElement>(null);
  const statusBarRightRef = useRef<HTMLDivElement>(null);

  const { audioState, controls } = useAudioContext();

  const { dark, brightness, getWallpaper, volume } = useStore((s) => ({
    dark: s.dark,
    brightness: s.brightness,
    getWallpaper: s.getWallpaper,
    volume: s.volume,
  }));

  const { setVolume, setBrightness } = useStore((s) => ({
    setVolume: s.setVolume,
    setBrightness: s.setBrightness,
  }));

  const setAudioVolume = (value: number): void => {
    setVolume(value);
    controls.volume(value / 100);
  };

  const setSiteBrightness = (value: number): void => {
    setBrightness(value);
  };

  const activeWallpaper = getWallpaper();

  const openApp = (id: string) => {
    setActiveApp(id);
  };

  const closeApp = () => {
    setActiveApp(null);
  };

  const bgStyle: React.CSSProperties = {
    backgroundImage: `url(${dark ? activeWallpaper.night : activeWallpaper.day})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    filter: `brightness(${(brightness as number) * 0.7 + 50}%)`,
    transition: "filter 0.3s ease",
  };

  const dockApps = ["facetime", "messages", "safari", "music"];

  return (
    <div className="size-full overflow-hidden relative" style={bgStyle}>
      <StatusBar 
        isAppOpen={activeApp !== null} 
        appTitle={activeApp ? (activeApp === 'finder' ? 'Files' : apps.find(a => a.id === activeApp)?.title) : ""} 
        onLeftTap={() => setShowNotificationCenter(!showNotificationCenter)}
        onRightTap={() => setShowControlCenter(!showControlCenter)}
      />

      <div
        ref={statusBarLeftRef}
        className="fixed top-0 left-0 w-1/2 h-12 z-[9990] pointer-events-auto"
        onTouchStart={(e) => {
          const touch = e.touches[0];
          (e.target as any).startY = touch.clientY;
        }}
        onTouchMove={(e) => {
          const touch = e.touches[0];
          const startY = (e.target as any).startY;
          if (startY !== undefined && touch.clientY - startY > 30) {
            setShowNotificationCenter(true);
            (e.target as any).startY = undefined;
          }
        }}
      />
      <div
        ref={statusBarRightRef}
        className="fixed top-0 right-0 w-1/2 h-12 z-[9990] pointer-events-auto"
        onTouchStart={(e) => {
          const touch = e.touches[0];
          (e.target as any).startY = touch.clientY;
        }}
        onTouchMove={(e) => {
          const touch = e.touches[0];
          const startY = (e.target as any).startY;
          if (startY !== undefined && touch.clientY - startY > 30) {
            setShowControlCenter(true);
            (e.target as any).startY = undefined;
          }
        }}
      />

      <AnimatePresence>
        {showControlCenter && (
          <ControlCenterMenu
            playing={audioState.playing}
            toggleAudio={controls.toggle}
            setVolume={setAudioVolume}
            setBrightness={setSiteBrightness}
            toggleControlCenter={() => setShowControlCenter(false)}
            btnRef={statusBarRightRef}
          />
        )}
      </AnimatePresence>

      <NotificationCenter
        show={showNotificationCenter}
        onClose={() => setShowNotificationCenter(false)}
      />

      <AnimatePresence>
        {!activeApp && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex flex-col pt-14"
          >
             <div className="flex-1 px-5 pt-6">
                <div className="grid grid-cols-4 gap-x-3 gap-y-7">
                  {apps
                    .filter((app) => app.desktop && !dockApps.includes(app.id) && !["terminal", "vscode", "typora", "siri", "github", "bear", "youtube", "spotify"].includes(app.id))
                    .map((app) => (
                    <div 
                      key={app.id} 
                      className="flex flex-col items-center gap-1.5 cursor-pointer active:opacity-70 transition-opacity" 
                      onClick={() => openApp(app.id)}
                    >
                       <img 
                         src={`/${app.id === 'finder' ? 'img/icons/folder-generic.png' : app.img}`} 
                         alt={app.id === 'finder' ? 'Files' : app.id === 'system-settings' ? 'Settings' : app.title} 
                         className="w-[60px] h-[60px] object-cover rounded-[14px]" 
                       />
                       <span className="text-white text-[11px] font-medium tracking-wide drop-shadow-md text-center whitespace-nowrap overflow-hidden text-ellipsis w-full px-0.5">
                         {app.id === 'finder' ? 'Files' : app.id === 'system-settings' ? 'Settings' : app.title}
                       </span>
                    </div>
                  ))}
                </div>
             </div>

             <MobileDock openApp={openApp} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeApp && (
          <motion.div
            key="activeApp"
            initial={{ y: "100%", opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0.5 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-0 z-40 bg-white/85 dark:bg-[#1c1c1e]/85 backdrop-blur-2xl"
          >
             <div className="w-full h-full pt-12 relative overflow-hidden flex flex-col">
               <div className="flex-1 overflow-y-auto no-scrollbar relative">
                 {(() => {
                    const app = apps.find(a => a.id === activeApp);
                    if (!app) return null;
                    return app.content;
                 })()}
               </div>

               <div className="absolute bottom-1 left-0 right-0 h-6 flex items-end justify-center pb-2 cursor-pointer z-50 bg-gradient-to-t from-white/80 dark:from-black/80 to-transparent" onClick={closeApp}>
                 <div className="w-1/3 h-1.5 bg-black dark:bg-white rounded-full opacity-80 hover:opacity-100 transition-opacity" />
               </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
