import React from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useAnimationFrame,
  type MotionValue
} from "framer-motion";

// Dock hover animation is adapted from https://github.com/PuruVJ/macos-web.

const useDockHoverAnimation = (
  mouseX: MotionValue,
  ref: React.RefObject<HTMLElement>,
  dockSize: number,
  dockMag: number
) => {
  const distanceLimit = dockSize * 6;
  const distanceInput = [
    -distanceLimit,
    -distanceLimit / (dockMag * 0.65),
    -distanceLimit / (dockMag * 0.85),
    0,
    distanceLimit / (dockMag * 0.85),
    distanceLimit / (dockMag * 0.65),
    distanceLimit
  ];
  const widthOutput = [
    dockSize,
    dockSize * (dockMag * 0.55),
    dockSize * (dockMag * 0.75),
    dockSize * dockMag,
    dockSize * (dockMag * 0.75),
    dockSize * (dockMag * 0.55),
    dockSize
  ];
  const beyondTheDistanceLimit = distanceLimit + 1;

  const distance = useMotionValue(beyondTheDistanceLimit);
  const widthPX = useSpring(useTransform(distance, distanceInput, widthOutput), {
    stiffness: 1700,
    damping: 90
  });

  const width = useTransform(widthPX, (width) => `${width / 16}rem`);

  useAnimationFrame(() => {
    const el = ref.current;
    const mouseXVal = mouseX.get();
    if (el && mouseXVal !== null) {
      const rect = el.getBoundingClientRect();
      const imgCenterX = rect.left + rect.width / 2;
      const distanceDelta = mouseXVal - imgCenterX;
      distance.set(distanceDelta);
      return;
    }
    distance.set(beyondTheDistanceLimit);
  });

  return { width, widthPX };
};

interface DockItemProps {
  id: string;
  title: string;
  img: string;
  mouseX: MotionValue;
  desktop: boolean;
  openApp: (id: string) => void;
  isOpen: boolean;
  link?: string;
  dockSize: number;
  dockMag: number;
  isBouncing?: boolean;
}

export default function DockItem({
  id,
  title,
  img,
  mouseX,
  desktop,
  openApp,
  isOpen,
  link,
  dockSize,
  dockMag,
  isBouncing
}: DockItemProps) {
  const imgRef = useRef<HTMLElement>(null);
  const { width } = useDockHoverAnimation(mouseX, imgRef, dockSize, dockMag);
  const { winWidth } = useWindowSize();

  const [isReceiving, setIsReceiving] = React.useState(false);
  const wasOpen = React.useRef(isOpen);

  React.useEffect(() => {
    if (wasOpen.current && !isOpen) {
      setIsReceiving(true);
      const timer = setTimeout(() => setIsReceiving(false), 350);
      return () => clearTimeout(timer);
    }
    wasOpen.current = isOpen;
  }, [isOpen]);

  return (
    <li
      id={`dock-${id}`}
      onClick={(e) => {
        if (desktop || id === "launchpad") {
          const rect = e.currentTarget.getBoundingClientRect();
          const originX = rect.left + rect.width / 2;
          const originY = rect.top + rect.height / 2;
          document.documentElement.style.setProperty('--launch-origin-x', `${originX}px`);
          document.documentElement.style.setProperty('--launch-origin-y', `${originY}px`);
          openApp(id);
        }
      }}
      className={`relative flex flex-col justify-end mb-1 ${isBouncing ? 'dock-bounce' : ''} ${isReceiving ? 'dock-receive' : ''}`}
      style={{
        transition: isBouncing ? 'none' : undefined,
      }}
    >
      <p
        className="tooltip absolute inset-x-0 mx-auto w-max rounded-md"
        p="x-3 y-1"
        text="sm c-black"
        style={{
          top: 'calc(-100% - 10px)',
          fontSize: '12px',
          fontWeight: 500,
          letterSpacing: '0.2px',
        }}
      >
        {title}
      </p>
      {(() => {
        const isPortfolio = img.includes("launchpad/");
        const content = isPortfolio ? (
          <motion.div
            ref={imgRef as any}
            style={
              winWidth < 640
                ? { width: dockSize, height: dockSize, borderRadius: "22.5%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: id === 'skill-exchange' ? '#000' : '#fff', boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.2)", overflow: 'hidden' }
                : { width, height: width, borderRadius: "22.5%", display: "flex", alignItems: "center", justifyContent: "center", willChange: "width, height", backgroundColor: id === 'skill-exchange' ? '#000' : '#fff', boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.2)", overflow: 'hidden' }
            }
          >
            <img
              src={img}
              alt={title}
              title={title}
              className={id === "library" ? "w-[60%] h-[60%] object-contain" : "w-full h-full object-cover"}
              draggable={false}
            />
          </motion.div>
        ) : (
          <motion.img
            ref={imgRef as React.RefObject<HTMLImageElement>}
            src={img}
            alt={title}
            title={title}
            draggable={false}
            style={
              winWidth < 640
                ? { width: dockSize, height: dockSize, borderRadius: '22.5%', objectFit: 'cover' }
                : { width, height: width, borderRadius: '22.5%', objectFit: 'cover', willChange: "width, height" }
            }
          />
        );

        return link ? (
          <a href={link} target="_blank" rel="noreferrer">
            {content}
          </a>
        ) : (
          content
        );
      })()}
      <div
        aria-hidden
        style={{
          width: '60%',
          height: 4,
          margin: '1px auto 0',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.28) 0%, transparent 80%)',
          filter: 'blur(2px)',
          pointerEvents: 'none',
        }}
      />
      <motion.div
        animate={isOpen ? { scale: [1, 1.5, 1], opacity: [0.85, 1, 0.85] } : { scale: 0, opacity: 0 }}
        transition={isOpen ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : { duration: 0.15 }}
        style={{
          width: 4,
          height: 4,
          margin: '1px auto 0',
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.9)',
          boxShadow: '0 0 6px rgba(255,255,255,0.5)',
        }}
      />
    </li>
  );
}
