import React, { useRef } from "react";
import Slider from "react-rangeslider";
import "react-rangeslider/lib/index.css";
import { motion } from "framer-motion";
import music from "~/configs/music";
import { useWindowSize } from "~/hooks/useWindowSize";
import { useStore } from "~/stores";
import { useClickOutside } from "~/hooks";

interface SliderProps {
  icon: string;
  value: number;
  setValue: (value: number) => void;
  dark?: boolean;
}

const SliderComponent = ({ icon, value, setValue, dark }: SliderProps) => (
  <div className="slider flex">
    <div className="size-7 flex-center bg-c-100" border="t l b c-300 rounded-l-full">
      {icon.startsWith("i-ph:") ? (
        <span className={icon} text="xs c-500" />
      ) : (
        <img src={icon} alt="" style={{ width: "14px", height: "14px", filter: dark ? "invert(1)" : "none", opacity: 0.7 }} />
      )}
    </div>
    <Slider
      min={1}
      max={100}
      value={value}
      tooltip={false}
      orientation="horizontal"
      onChange={(v: number) => setValue(v)}
    />
  </div>
);

const VerticalSlider = ({ icon, value, setValue }: { icon: React.ReactNode, value: number, setValue: (value: number) => void }) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const updateValue = (e: React.PointerEvent) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    let y = e.clientY - rect.top;
    y = Math.max(0, Math.min(y, rect.height));
    const percentage = 100 - (y / rect.height) * 100;
    setValue(percentage);
  };

  return (
    <div
      ref={sliderRef}
      onPointerDown={(e) => {
        sliderRef.current?.setPointerCapture(e.pointerId);
        updateValue(e);
      }}
      onPointerMove={(e) => {
        if (e.buttons > 0) updateValue(e);
      }}
      style={{
        width: "56px",
        height: "195px",
        borderRadius: "28px",
        background: "rgba(50,50,52,0.9)",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        touchAction: "none"
      }}
    >
      <div 
        style={{ 
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          height: `${value}%`, 
          background: "rgba(255,255,255,0.92)", 
          borderRadius: "28px", 
          transition: "height 50ms ease" 
        }}
      />
      <div 
        style={{ 
          position: "absolute",
          bottom: "12px", 
          left: "50%", 
          transform: "translateX(-50%)", 
          color: value > 55 ? "rgba(0,0,0,0.85)" : "rgba(255,255,255,0.9)",
          width: "20px", 
          height: "20px",
          zIndex: 2,
          pointerEvents: "none"
        }}
      >
        {icon}
      </div>
    </div>
  );
};

interface CCMProps {
  toggleControlCenter: () => void;
  toggleAudio: (target: boolean) => void;
  setBrightness: (value: number) => void;
  setVolume: (value: number) => void;
  playing: boolean;
  btnRef: React.RefObject<HTMLDivElement>;
}

export default function ControlCenterMenu({
  toggleControlCenter,
  toggleAudio,
  setBrightness,
  setVolume,
  playing,
  btnRef
}: CCMProps) {
  const controlCenterRef = useRef<HTMLDivElement>(null);
  const { dark, wifi, brightness, bluetooth, airdrop, fullscreen, volume, focusMode } = useStore(
    (state) => ({
      dark: state.dark,
      wifi: state.wifi,
      brightness: state.brightness,
      bluetooth: state.bluetooth,
      airdrop: state.airdrop,
      fullscreen: state.fullscreen,
      volume: state.volume,
      focusMode: state.focusMode
    })
  );

  const { toggleWIFI, toggleBluetooth, toggleAirdrop, toggleDark, toggleFullScreen, toggleFocus } =
    useStore((state) => ({
      toggleWIFI: state.toggleWIFI,
      toggleBluetooth: state.toggleBluetooth,
      toggleAirdrop: state.toggleAirdrop,
      toggleDark: state.toggleDark,
      toggleFullScreen: state.toggleFullScreen,
      toggleFocus: state.toggleFocus
    }));
  const { winWidth } = useWindowSize();
  const isMobile = winWidth < 768;

  const [rotationLock, setRotationLock] = React.useState(false);
  const [silentMode, setSilentMode] = React.useState(false);
  const [flashlight, setFlashlight] = React.useState(false);

  useClickOutside(controlCenterRef, toggleControlCenter, [btnRef]);

  return (
    <>
      {isMobile && (
        <style>{`
          .mobile-cc::-webkit-scrollbar {
            display: none;
          }
          .mobile-cc {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      )}

      {isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            zIndex: 9989
          }}
          onClick={toggleControlCenter}
        />
      )}

      <motion.div
        className={`text-c-black ${isMobile ? "mobile-cc" : ""}`}
        ref={controlCenterRef}
        initial={isMobile ? { y: "-110%" } : { opacity: 0, y: -8, scale: 0.97 }}
        animate={isMobile ? { y: 0 } : { opacity: 1, y: 0, scale: 1 }}
        exit={isMobile ? { y: "-110%" } : { opacity: 0, y: -6, scale: 0.97 }}
        transition={isMobile ? { duration: 0.42, ease: [0.32, 0.72, 0, 1] } : { type: "spring", stiffness: 350, damping: 30, mass: 0.8 }}
        style={isMobile ? {
          position: "fixed",
          top: 0, left: 0, right: 0,
          width: "100vw",
          padding: "56px 14px 20px",
          borderRadius: "0 0 36px 36px",
          background: "rgba(25,25,28,0.92)",
          backdropFilter: "blur(50px) saturate(180%)",
          WebkitBackdropFilter: "blur(50px) saturate(180%)",
          borderBottom: "0.5px solid rgba(255,255,255,0.1)",
          zIndex: 9990
        } : {
          position: "fixed",
          top: "32px",
          right: "6px",
          left: "auto",
          width: "320px",
          padding: "10px",
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gridAutoRows: "auto",
          gap: "12px",
          borderRadius: "var(--radius-menu)",
          background: 'var(--lg-bg-menu)',
          backdropFilter: 'blur(40px) saturate(250%)',
          WebkitBackdropFilter: 'blur(40px) saturate(250%)',
          border: 'var(--lg-border)',
          boxShadow: 'var(--shadow-menu), var(--lg-inner-highlight)',
          zIndex: 9999,
          maxHeight: "auto",
          overflowY: "visible"
        }}
      >
        {isMobile ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", height: "160px" }}>

              <div style={{ width: "100%", height: "160px", background: "rgba(44,44,48,0.95)", borderRadius: "20px", padding: "14px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", height: "100%" }}>
                  <motion.div whileTap={{ scale: 0.88 }} onClick={toggleAirdrop} style={{ width: "100%", height: "60px", borderRadius: "14px", background: airdrop ? "#0A84FF" : "rgba(28,28,30,0.9)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", cursor: "pointer" }}>
                    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "22px", height: "22px", color: "white" }}>
                      <path d="M6.5 20C4.01 20 2 17.99 2 15.5c0-2.03 1.37-3.74 3.24-4.27C5.08 10.82 5 10.42 5 10c0-2.76 2.24-5 5-5 1.8 0 3.37.96 4.24 2.4.26-.03.51-.04.76-.04 2.76 0 5 2.24 5 5 0 .11 0 .22-.01.33C21.67 13.24 23 14.73 23 16.5c0 1.93-1.57 3.5-3.5 3.5H6.5zM13 11V8h-2v3H9l3 4 3-4h-2z"/>
                    </svg>
                    <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.7)" }}>AirDrop</span>
                  </motion.div>

                  <motion.div whileTap={{ scale: 0.88 }} style={{ width: "100%", height: "60px", borderRadius: "14px", background: "#0A84FF", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", cursor: "pointer" }}>
                    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "22px", height: "22px", color: "white" }}>
                      <path d="M15.5 5H13l2.5-3 2.5 3h-2.5zM13 19h2.5l-2.5 3-2.5-3H13zM3 6h2v12H3V6zm4-2h2v16H7V4zm4 2h2v12h-2V6zm4-4h2v16h-2V2z"/>
                    </svg>
                    <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.7)" }}>Mobile Data</span>
                  </motion.div>

                  <motion.div whileTap={{ scale: 0.88 }} onClick={toggleWIFI} style={{ width: "100%", height: "60px", borderRadius: "14px", background: wifi ? "#0A84FF" : "rgba(28,28,30,0.9)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", cursor: "pointer" }}>
                    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "22px", height: "22px", color: "white" }}>
                      <path d="M1 9l2 2c5.523-5.523 14.477-5.523 20 0l2-2C19.261 3.261 4.739 3.261 1 9zm8 8l3 3 3-3c-1.657-1.657-4.343-1.657-6 0zm-4-4l2 2c2.761-2.761 7.239-2.761 10 0l2-2C15.522 9.478 8.478 9.478 5 13z"/>
                    </svg>
                    <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.7)" }}>Wi-Fi</span>
                  </motion.div>

                  <motion.div whileTap={{ scale: 0.88 }} onClick={toggleBluetooth} style={{ width: "100%", height: "60px", borderRadius: "14px", background: bluetooth ? "#0A84FF" : "rgba(28,28,30,0.9)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", cursor: "pointer" }}>
                    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "22px", height: "22px", color: "white" }}>
                      <path d="M17.71 7.71L12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 5.83l1.88 1.88L13 9.59V5.83zm1.88 10.46L13 18.17v-3.76l1.88 1.88z"/>
                    </svg>
                    <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.7)" }}>Bluetooth</span>
                  </motion.div>
                </div>
              </div>

              <div style={{ width: "100%", height: "160px", background: "rgba(50,40,70,0.9)", borderRadius: "20px", padding: "16px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {playing ? (
                    <img style={{ width: "40px", height: "40px", borderRadius: "6px", boxShadow: "0 1px 3px rgba(0,0,0,0.3)", objectFit: "cover" }} src={music.cover} alt="cover" />
                  ) : (
                    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "20px", height: "20px", color: "white" }}>
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                    </svg>
                  )}
                  <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
                    {playing ? (
                      <>
                        <span style={{ fontSize: "14px", fontWeight: 600, color: "white", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{music.title}</span>
                        <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{music.artist}</span>
                      </>
                    ) : (
                      <span style={{ fontSize: "15px", color: "rgba(255,255,255,0.8)" }}>Not Playing</span>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                  <motion.div whileTap={{ opacity: 0.5 }} style={{ cursor: "pointer" }}>
                    <svg viewBox="0 0 24 24" fill="white" style={{ width: "30px", height: "30px" }}><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
                  </motion.div>
                  <motion.div whileTap={{ opacity: 0.5 }} style={{ cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); toggleAudio(!playing); }}>
                    {playing ? (
                      <svg viewBox="0 0 24 24" fill="white" style={{ width: "38px", height: "38px" }}><path d="M8 5v14l11-7z"/></svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="white" style={{ width: "38px", height: "38px" }}><path d="M8 5v14l11-7z"/></svg>
                    )}
                  </motion.div>
                  <motion.div whileTap={{ opacity: 0.5 }} style={{ cursor: "pointer" }}>
                    <svg viewBox="0 0 24 24" fill="white" style={{ width: "30px", height: "30px" }}><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
                  </motion.div>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
                  <motion.div whileTap={{ scale: 0.88 }} onClick={() => setRotationLock(!rotationLock)} style={{ width: "58px", height: "58px", borderRadius: "50%", background: rotationLock ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "none" }}>
                    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "24px", height: "24px", color: "#FF9500" }}>
                      <path d="M7.11 8.53L5.7 7.11C4.8 8.27 4.24 9.61 4.07 11h2.02c.14-.87.49-1.72 1.02-2.47zM6.09 13H4.07c.17 1.39.72 2.73 1.62 3.89l1.41-1.42c-.52-.75-.87-1.59-1.01-2.47zm1.01 5.32c1.16.9 2.51 1.44 3.9 1.61V17.9c-.87-.15-1.71-.49-2.46-1.03L7.1 18.32zM13 4.07V1L8.45 5.55 13 10V6.09c2.84.48 5 2.94 5 5.91s-2.16 5.43-5 5.91v2.02c3.95-.49 7-3.85 7-7.93s-3.05-7.44-7-7.93z"/>
                    </svg>
                  </motion.div>
                  <motion.div whileTap={{ scale: 0.88 }} onClick={() => setSilentMode(!silentMode)} style={{ width: "58px", height: "58px", borderRadius: "50%", background: silentMode ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "none" }}>
                    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "24px", height: "24px", color: "#FF3B30" }}>
                      <path d="M4.34 2.93L2.93 4.34 7.29 8.7 7 9H3v6h4l5 5v-6.59l4.18 4.18A6.992 6.992 0 0115.95 19.05L17.37 20.47A8.97 8.97 0 0019.73 17l1.61 1.61 1.41-1.41L4.34 2.93zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zm-7-8l-1.88 1.88L12 7.76V4z"/>
                    </svg>
                  </motion.div>
                </div>

                <motion.div whileTap={{ scale: 0.95 }} onClick={toggleFocus} style={{ marginTop: "10px", display: "flex", alignItems: "center", width: "100%", height: "46px", borderRadius: "14px", background: focusMode ? "rgba(90,60,140,0.7)" : "rgba(44,44,48,0.95)", padding: "0 14px", gap: "10px", cursor: "pointer" }}>
                  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "18px", height: "18px", color: focusMode ? "#BF5AF2" : "#FFFFFF" }}>
                    <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
                  </svg>
                  <span style={{ fontSize: "15px", fontWeight: 500, color: "#FFFFFF", flex: 1 }}>Focus</span>
                  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "12px", height: "12px", color: "rgba(255,255,255,0.4)" }}>
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                  </svg>
                </motion.div>
              </div>

              <div style={{ display: "flex", flexDirection: "row", gap: "10px", height: "195px" }}>
                <VerticalSlider
                  icon={<svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "100%", height: "100%" }}><path d="M12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm6.59-4.41l-1.41-1.41-2.12 2.12 1.41 1.41 2.12-2.12zM12 4V1h-2v3h2zm-5.66 1.76L4.22 3.64 2.81 5.05l2.12 2.12 1.41-1.41zM4 11H1v2h3v-2zm1.76 5.66l-2.12 2.12 1.41 1.41 2.12-2.12-1.41-1.41zM11 20v3h2v-3h-2zm5.66-1.76l2.12 2.12 1.41-1.41-2.12-2.12-1.41 1.41zM20 11v2h3v-2h-3z"/></svg>}
                  value={brightness}
                  setValue={setBrightness}
                />

                <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: "12px" }}>
                  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "18px", height: "18px", color: "rgba(255,255,255,0.6)" }}>
                    <path d="M3.63 3.63c-.39.39-.39 1.02 0 1.41L7.29 8.7 7 9H3v6h4l5 5v-6.59l4.18 4.18c-.65.49-1.38.88-2.18 1.11v2.06c1.34-.3 2.57-.92 3.61-1.75l1.49 1.49c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zm-7-8l-1.88 1.88L12 7.76V4z"/>
                  </svg>
                </div>

                <VerticalSlider
                  icon={<svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "100%", height: "100%" }}><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>}
                  value={volume}
                  setValue={setVolume}
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", padding: "0 6px", marginTop: "12px" }}>
              <motion.div whileTap={{ scale: 0.88 }} onClick={() => setFlashlight(!flashlight)} style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(44,44,48,0.95)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <svg viewBox="0 0 24 24" fill={flashlight ? "rgba(255, 214, 0, 0.9)" : "white"} style={{ width: "28px", height: "28px", color: flashlight ? "black" : "white" }}><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>
              </motion.div>
              <motion.div whileTap={{ scale: 0.88 }} style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(44,44,48,0.95)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <svg viewBox="0 0 24 24" fill="white" style={{ width: "28px", height: "28px" }}><path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>
              </motion.div>
              <motion.div whileTap={{ scale: 0.88 }} style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(44,44,48,0.95)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <svg viewBox="0 0 24 24" fill="white" style={{ width: "28px", height: "28px" }}><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3h5v2h-5V6zM7 6h3v3H7V6zm0 5h3v3H7v-3zm0 5h3v3H7v-3zm5 3v-3h5v3h-5zm5-5h-5v-3h5v3z"/></svg>
              </motion.div>
              <motion.div whileTap={{ scale: 0.88 }} style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(44,44,48,0.95)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <svg viewBox="0 0 24 24" fill="white" style={{ width: "28px", height: "28px" }}><path d="M12 15.2c1.767 0 3.2-1.433 3.2-3.2S13.767 8.8 12 8.8 8.8 10.233 8.8 12s1.433 3.2 3.2 3.2zM9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/></svg>
              </motion.div>
            </div>
          </div>
        ) : (
          <>
            <div className="cc-grid row-span-2 col-span-2 p-2.5 flex flex-col justify-around space-y-1">
              <div className="hstack space-x-2">
                <div className={`${wifi ? "cc-btn" : "cc-btn-active"}`} onClick={toggleWIFI}>
                  <span className="i-ph:wifi-high text-base" />
                </div>
                <div p="t-0.5">
                  <div className="font-medium leading-4" style={{ fontSize: '12px' }}>Wi-Fi</div>
                  <div className="cc-text">{wifi ? "Home" : "Off"}</div>
                </div>
              </div>
              <div className="hstack space-x-2">
                <div className={`${bluetooth ? "cc-btn" : "cc-btn-active"}`} onClick={toggleBluetooth}>
                  <span className="i-ph:bluetooth text-base" />
                </div>
                <div p="t-0.5">
                  <div className="font-medium leading-4" style={{ fontSize: '12px' }}>Bluetooth</div>
                  <div className="cc-text">{bluetooth ? "On" : "Off"}</div>
                </div>
              </div>
              <div className="hstack space-x-2">
                <div className={`${airdrop ? "cc-btn" : "cc-btn-active"}`} onClick={toggleAirdrop}>
                  <span className="i-ph:rss text-base" />
                </div>
                <div p="t-0.5">
                  <div className="font-medium leading-4" style={{ fontSize: '12px' }}>AirDrop</div>
                  <div className="cc-text">{airdrop ? "Everyone" : "Off"}</div>
                </div>
              </div>
            </div>

            <div className="cc-grid col-span-2 p-2.5 flex flex-col justify-around space-y-2">
              <div className="hstack space-x-2.5 cursor-pointer" onClick={toggleFocus}>
                <div className={`${focusMode ? "cc-btn" : "cc-btn-active"}`}>
                  <span className="i-ph:moon text-base" />
                </div>
                <div p="t-0.5">
                  <div className="font-medium leading-4" style={{ fontSize: '12px' }}>Focus</div>
                  <div className="cc-text">{focusMode ? "Do Not Disturb" : "Off"}</div>
                </div>
              </div>
              <div className="hstack space-x-2.5 cursor-pointer" onClick={toggleDark}>
                <div className={`${dark ? "cc-btn" : "cc-btn-active"}`}>
                  {dark ? (
                    <span className="i-ph:moon text-base" />
                  ) : (
                    <span className="i-ph:sun text-base" />
                  )}
                </div>
                <div className="font-medium" style={{ fontSize: '12px' }}>{dark ? "Dark Mode" : "Light Mode"}</div>
              </div>
            </div>

            <div className="cc-grid flex-center flex-col cursor-pointer py-2">
              <span className="i-ph:sun text-xl" />
              <span className="text-center mt-1" style={{ fontSize: '10px', lineHeight: '12px' }}>Keyboard Brightness</span>
            </div>
            <div className="cc-grid flex-center flex-col cursor-pointer py-2" onClick={() => toggleFullScreen(!fullscreen)}>
              {fullscreen ? (
                <span className="i-ph:arrows-in text-base" />
              ) : (
                <span className="i-ph:arrows-out text-base" />
              )}
              <span className="text-center mt-1.5" style={{ fontSize: '10px', lineHeight: '12px' }}>{fullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}</span>
            </div>

            <div className="cc-grid flex-center flex-col cursor-pointer py-2">
              <span className="i-ph:squares-four text-base" />
              <span className="text-center mt-1.5" style={{ fontSize: '10px', lineHeight: '12px' }}>Stage Manager</span>
            </div>
            <div className="cc-grid flex-center flex-col cursor-pointer py-2">
              <span className="i-ph:screencast text-base" />
              <span className="text-center mt-1.5" style={{ fontSize: '10px', lineHeight: '12px' }}>Screen Mirroring</span>
            </div>

            <div className="cc-grid col-span-4 px-2.5 py-2 space-y-1 flex flex-col justify-around">
              <span className="font-medium ml-0.5" style={{ fontSize: '12px' }}>Display</span>
              <SliderComponent icon="i-ph:sun" value={brightness} setValue={setBrightness} />
            </div>

            <div className="cc-grid col-span-4 px-2.5 py-2 space-y-1 flex flex-col justify-around">
              <span className="font-medium ml-0.5" style={{ fontSize: '12px' }}>Sound</span>
              <SliderComponent icon="i-ph:speaker-high" value={volume} setValue={setVolume} />
            </div>

            <div className="player cc-grid col-span-4 hstack space-x-2.5" p="y-2 l-2 r-4">
              <img
                className="w-12 rounded-lg"
                src={music.cover}
                alt="cover art"
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
              />
              <div className="flex-1">
                <div className="font-medium" style={{ fontSize: '12px' }}>{music.title}</div>
                <div className="cc-text">{music.artist}</div>
              </div>
              {playing ? (
                <span className="i-ph:pause-fill text-2xl play cursor-pointer" onClick={() => toggleAudio(false)} />
              ) : (
                <span className="i-ph:play-fill text-2xl pause cursor-pointer" onClick={() => toggleAudio(true)} />
              )}
            </div>

            <div className="col-span-4 flex-center pt-0.5 pb-0.5">
              <button
                className="hstack space-x-1 cursor-pointer"
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--color-c-500, rgba(0,0,0,0.45))",
                  fontSize: "11px",
                  padding: "2px 8px",
                }}
              >
                <span className="i-ph:sliders text-sm" />
                <span>Edit Controls</span>
              </button>
            </div>
          </>
        )}
      </motion.div>
    </>
  );
}
