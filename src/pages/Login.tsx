import React from "react";
import { user } from "~/configs";
import type { MacActions } from "~/types";
import moment from "moment";
import { motion, AnimatePresence } from "framer-motion";

export default function Login(props: MacActions) {
  const [password, setPassword] = useState("");
  const [sign, setSign] = useState("Press enter to login");
  const dark = useStore((state) => state.dark);
  const getWallpaper = useStore((state) => state.getWallpaper);
  const activeWallpaper = getWallpaper();
  const [isloginOpen, setIsLoginOpen] = useState(false);
  const [time, setTime] = useState(moment().format("h:mm"));
  const [period, setPeriod] = useState(moment().format("A"));
  const [date, setDate] = useState(moment().format("dddd, MMMM D"));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(moment().format("h:mm"));
      setPeriod(moment().format("A"));
      setDate(moment().format("dddd, MMMM D"));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const keyPress = (e: React.KeyboardEvent) => {
    const keyCode = e.key;
    if (keyCode === "Enter" || keyCode === "Space" || keyCode === "Tab")
      props.setLogin(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };

  return (
    <div
      className="size-full login text-center relative overflow-hidden"
      style={{
        background: `url(${
          dark ? activeWallpaper.night : activeWallpaper.day
        }) center/cover no-repeat`,
      }}
      onClick={() => !isloginOpen && setIsLoginOpen(true)}
    >
      <AnimatePresence mode="wait">
        {isloginOpen ? (
          <motion.div
            key="login-panel"
            className="size-full absolute inset-0"
            style={{
              backgroundColor: 'rgba(0,0,0,0.15)',
              backdropFilter: 'blur(60px) saturate(200%)',
              WebkitBackdropFilter: 'blur(60px) saturate(200%)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            onKeyDown={keyPress}
          >
            <motion.div
              className="inline-block w-auto relative top-1/2"
              style={{ marginTop: '-160px' }}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div
                style={{
                  width: '88px',
                  height: '88px',
                  margin: '0 auto',
                  borderRadius: '50%',
                  padding: '3px',
                  background: 'rgba(255,255,255,0.2)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                }}
              >
                <img
                  className="rounded-full size-full"
                  src={user.avatar}
                  alt="avatar"
                  style={{
                    objectFit: 'cover',
                    border: '2px solid rgba(255,255,255,0.15)',
                  }}
                />
              </div>

              <div
                className="font-display"
                style={{
                  marginTop: '12px',
                  fontSize: '17px',
                  fontWeight: 500,
                  color: 'white',
                  letterSpacing: '0.3px',
                  textShadow: '0 1px 4px rgba(0,0,0,0.3)',
                }}
              >
                {user.name}
              </div>

              <motion.div
                className="flex justify-center items-center mt-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '6px 24px',
                    borderRadius: '20px',
                    border: '0.5px solid rgba(255,255,255,0.25)',
                    background: 'rgba(255,255,255,0.12)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    color: 'white',
                    fontSize: '13px',
                    fontWeight: 400,
                    letterSpacing: '0.3px',
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.12)';
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    props.setLogin(true);
                  }}
                  onKeyDown={keyPress}
                >
                  <span className="i-ph:arrow-elbow-down-left" style={{ fontSize: '14px', opacity: 0.8 }} />
                  Sign In
                </button>
              </motion.div>

              <motion.div
                style={{
                  marginTop: '16px',
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.5)',
                  letterSpacing: '0.2px',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                Press Enter to sign in
              </motion.div>
            </motion.div>

            <motion.div
              className="fixed bottom-12 inset-x-0 mx-auto flex flex-row space-x-6 w-max"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {[
                { label: 'Sleep', icon: 'i-ph:moon-stars', action: props.sleepMac },
                { label: 'Restart', icon: 'i-ph:arrow-clockwise', action: props.restartMac },
                { label: 'Shut Down', icon: 'i-ph:power', action: props.shutMac },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center cursor-pointer group"
                  style={{ width: '72px' }}
                  onClick={(e) => item.action(e)}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '0.5px solid rgba(255,255,255,0.15)',
                      transition: 'background 0.2s ease, transform 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.2)';
                      (e.target as HTMLElement).style.transform = 'scale(1.08)';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.1)';
                      (e.target as HTMLElement).style.transform = 'scale(1)';
                    }}
                  >
                    <span className={`${item.icon} text-white text-lg`} />
                  </div>
                  <span
                    style={{
                      marginTop: '6px',
                      fontSize: '11px',
                      color: 'rgba(255,255,255,0.7)',
                      fontWeight: 400,
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="lock-screen"
            className="size-full flex flex-col justify-between items-center relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="flex flex-col items-center"
              style={{ paddingTop: 'clamp(60px, 12vh, 120px)' }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div
                className="font-rounded font-tabular"
                style={{
                  fontSize: 'clamp(72px, 12vw, 110px)',
                  fontWeight: 800,
                  color: 'white',
                  letterSpacing: '-2px',
                  lineHeight: 1,
                  textShadow: '0 2px 20px rgba(0,0,0,0.3)',
                }}
              >
                {time}
              </div>
              <div
                className="font-rounded"
                style={{
                  marginTop: '8px',
                  fontSize: 'clamp(16px, 2.5vw, 22px)',
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.85)',
                  letterSpacing: '0.5px',
                  textShadow: '0 1px 8px rgba(0,0,0,0.2)',
                }}
              >
                {date}
              </div>
            </motion.div>

            <motion.div
              style={{
                paddingBottom: '48px',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 300,
                  color: 'rgba(255,255,255,0.6)',
                  letterSpacing: '0.5px',
                  animation: 'subtlePulse 3s ease-in-out infinite',
                  cursor: 'pointer',
                }}
              >
                Click anywhere to unlock
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
