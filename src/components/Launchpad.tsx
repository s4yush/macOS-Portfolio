import { launchpadApps } from "~/configs";
import { useStore } from "~/stores";
import { motion, AnimatePresence } from "framer-motion";
import { useWindowSize } from "~/hooks";
import { useState } from "react";

interface LaunchpadProps {
  show: boolean;
  toggleLaunchpad: (target: boolean) => void;
}

const ITEMS_PER_FOLDER = 9;

const placeholderText = "Search";

export default function Launchpad({ show, toggleLaunchpad }: LaunchpadProps) {
  const dark = useStore((state) => state.dark);
  const setSafariUrl = useStore((state) => state.setSafariUrl);
  const getWallpaper = useStore((state) => state.getWallpaper);
  const activeWallpaper = getWallpaper();
  const { winWidth } = useWindowSize();
  const isMobile = winWidth < 768;

  const [searchText, setSearchText] = useState("");
  const [focus, setFocus] = useState(false);
  const [openFolder, setOpenFolder] = useState<string | null>(null);

  const AppIcon = ({ src, alt, className = "" }: { src: string; alt: string; className?: string }) => {
    const isLibrary = src.includes("library-icon");
    const isSkillExchange = src.includes("skill-exchange");

    return (
      <div 
        className={`${className} overflow-hidden flex items-center justify-center border border-black/10 dark:border-white/10 ${isSkillExchange ? 'bg-black' : 'bg-white'}`}
        style={{
          width: '100%',
          aspectRatio: '1 / 1',
          borderRadius: '22.5%',
          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1), 0 4px 10px rgba(0,0,0,0.25)'
        }}
      >
        <img
          src={src}
          alt={alt}
          title={alt}
          style={{
            width: isLibrary ? '60%' : '100%',
            height: isLibrary ? '60%' : '100%',
            objectFit: isLibrary ? 'contain' : 'cover'
          }}
        />
      </div>
    );
  };

  const search = () => {
    let appsToRender = launchpadApps;
    if (isMobile) {
      appsToRender = launchpadApps.filter(app => !app.hideOnMobile).map(app => ({
        ...app,
        title: app.mobileTitle || app.title,
        img: app.mobileImg || app.img,
      }));
    }

    if (searchText === "") return appsToRender;
    const text = searchText.toLowerCase();
    return appsToRender.filter((item) =>
      item.title.toLowerCase().includes(text) || item.id.toLowerCase().includes(text)
    );
  };

  const handleAppClick = (e: React.MouseEvent, link: string) => {
    e.stopPropagation();
    e.preventDefault();
    setSafariUrl(link);
    window.dispatchEvent(new CustomEvent("launchpad:openSafari"));
  };

  // Split apps into fixed-size groups and collect any remainder in More.
  const filteredApps = search();
  const mainApps = filteredApps.slice(0, ITEMS_PER_FOLDER * 2);
  const folderApps = filteredApps.slice(ITEMS_PER_FOLDER * 2);
  const hasFolder = folderApps.length > 0 && searchText === "";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="z-30 size-full fixed overflow-hidden bg-center bg-cover"
          id="launchpad"
          style={{
            backgroundImage: `url(${dark ? activeWallpaper.night : activeWallpaper.day})`
          }}
          onClick={() => { setOpenFolder(null); toggleLaunchpad(false); }}
          initial={{ opacity: 0, scale: 1.15 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.15 }}
          transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
        >
          <div
            className="size-full absolute"
            style={{
              backgroundColor: 'rgba(0,0,0,0.25)',
              backdropFilter: 'blur(50px) saturate(200%)',
              WebkitBackdropFilter: 'blur(50px) saturate(200%)',
            }}
          >
            <motion.div
              className="mx-auto flex items-center mt-6"
              style={{
                height: '36px',
                width: '260px',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.15)',
                border: '0.5px solid rgba(255,255,255,0.28)',
                backdropFilter: 'blur(20px) saturate(180%)',
                boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.25), 0 2px 12px rgba(0,0,0,0.12)',
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
            >
              <div className={`${focus ? "w-6 duration-200" : "w-26 delay-250"} hstack justify-end`}>
                <img src="/img/icons/sf-icons/search.svg" alt="Search" className="ml-2" style={{ width: "16px", height: "16px", filter: "invert(1)", opacity: 0.6 }} />
              </div>
              <input
                className="flex-1 min-w-0 no-outline bg-transparent px-1.5 text-sm text-white"
                placeholder={placeholderText}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ fontSize: '13px', fontWeight: 300 }}
              />
            </motion.div>

            <div
              className="max-w-[1100px] mx-auto mt-10 w-full px-4 sm:px-10"
              grid="~ flow-row cols-4 sm:cols-7"
            >
              {mainApps.map((app, index) => (
                <motion.div
                  key={`launchpad-${app.id}`}
                  h="32 sm:36"
                  flex="~ col"
                  initial={{ opacity: 0, y: 24, scale: 0.75 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: 0.04 + index * 0.025,
                    duration: 0.45,
                    type: "spring",
                    stiffness: 280,
                    damping: 22,
                  }}
                >
                  <a
                    className="w-14 sm:w-20 mx-auto cursor-pointer"
                    onClick={(e) => handleAppClick(e, app.link)}
                    style={{ transition: 'transform 0.15s ease' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
                  >
                    <AppIcon src={app.img} alt={app.title} />
                  </a>
                  <span
                    m="t-2 x-auto"
                    text="white xs sm:sm"
                    style={{ fontWeight: 300, letterSpacing: '0.2px', textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
                  >
                    {app.title}
                  </span>
                </motion.div>
              ))}

              {hasFolder && (
                <motion.div
                  h="32 sm:36"
                  flex="~ col"
                  initial={{ opacity: 0, y: 24, scale: 0.75 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.04 + mainApps.length * 0.025, duration: 0.45, type: "spring", stiffness: 280, damping: 22 }}
                  onClick={(e) => { e.stopPropagation(); setOpenFolder(openFolder ? null : "more"); }}
                >
                  <div
                    className="w-14 sm:w-20 mx-auto cursor-pointer relative"
                    style={{ transition: 'transform 0.15s ease' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
                  >
                    <div
                      style={{
                        width: '100%',
                        paddingBottom: '100%',
                        borderRadius: '22%',
                        background: 'rgba(255,255,255,0.18)',
                        backdropFilter: 'blur(20px)',
                        border: '0.5px solid rgba(255,255,255,0.25)',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          inset: '10%',
                          display: 'grid',
                          gridTemplateColumns: 'repeat(3, 1fr)',
                          gap: '4%',
                        }}
                      >
                        {folderApps.slice(0, 9).map((a) => (
                          <div key={a.id} style={{ width: '100%', aspectRatio: '1 / 1' }}>
                            <AppIcon src={a.img} alt={a.title} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <span
                    m="t-2 x-auto"
                    text="white xs sm:sm"
                    style={{ fontWeight: 300, letterSpacing: '0.2px', textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
                  >
                    More
                  </span>
                </motion.div>
              )}
            </div>

            <AnimatePresence>
              {openFolder && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  className="absolute left-1/2 top-1/2"
                  style={{
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(255,255,255,0.12)',
                    backdropFilter: 'blur(40px) saturate(200%)',
                    border: '0.5px solid rgba(255,255,255,0.22)',
                    borderRadius: 20,
                    padding: '20px 24px',
                    minWidth: 280,
                    boxShadow: '0 16px 60px rgba(0,0,0,0.35)',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                    {folderApps.map((app, i) => (
                      <motion.div
                        key={app.id}
                        flex="~ col"
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.04, type: "spring", stiffness: 350, damping: 22 }}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
                      >
                        <a
                          onClick={(e) => handleAppClick(e, app.link)}
                          style={{ cursor: 'pointer', transition: 'transform 0.15s ease', width: 56 }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)'; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
                        >
                          <AppIcon src={app.img} alt={app.title} />
                        </a>
                        <span style={{ color: 'white', fontSize: 11, fontWeight: 300, textAlign: 'center', textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
                          {app.title}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              className="flex justify-center mt-8 space-x-1.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.8)' }} />
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.3)' }} />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
