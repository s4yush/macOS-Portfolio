interface BootProps {
  restart: boolean;
  sleep: boolean;
  setBooting: (value: boolean | ((prevVar: boolean) => boolean)) => void;
}

const loadingInterval = 1;
const bootingInterval = 500;

export default function Boot({ restart, sleep, setBooting }: BootProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [percent, setPercent] = useState<number>(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (restart && !sleep) setLoading(true);
  }, [restart, sleep]);

  useInterval(
    () => {
      const newPercent = percent + 0.15;
      if (newPercent >= 100) {
        setTimeout(() => {
          setBooting(false);
          setLoading(false);
        }, bootingInterval);
      } else setPercent(newPercent);
    },
    loading ? loadingInterval : null
  );

  const handleClick = () => {
    if (sleep) setBooting(false);
    else if (restart || loading) return;
    else setLoading(true);
  };

  return (
    <div
      className="size-full bg-black flex-center"
      onClick={handleClick}
      style={{ position: 'relative' }}
    >
      <div
        style={{
          opacity: showContent ? 1 : 0,
          transform: showContent ? 'scale(1)' : 'scale(0.9)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}
      >
        <div className="i-fa6-brands:apple text-white -mt-4 size-20 sm:size-24" />
      </div>
      {loading && (
        <div
          className="absolute inset-x-0 w-48 sm:w-56 mx-auto overflow-hidden"
          style={{
            top: '58%',
            height: '4px',
            borderRadius: '2px',
            backgroundColor: 'rgba(255,255,255,0.15)',
            opacity: showContent ? 1 : 0,
            transition: 'opacity 0.4s ease 0.2s',
          }}
        >
          <span
            className="absolute top-0 left-0 h-full"
            style={{
              width: `${percent}%`,
              borderRadius: '2px',
              background: 'linear-gradient(90deg, rgba(255,255,255,0.9), white)',
              transition: 'width 0.05s linear',
            }}
          />
        </div>
      )}
      {!restart && !loading && (
        <div
          className="absolute inset-x-0 text-center"
          style={{
            top: '58%',
            opacity: showContent ? 0.6 : 0,
            transition: 'opacity 0.8s ease 0.5s',
            animation: showContent ? 'subtlePulse 2s ease-in-out infinite 1.5s' : 'none',
          }}
        >
          <span className="text-sm text-gray-300 tracking-wide">
            Click to {sleep ? "wake up" : "boot"}
          </span>
        </div>
      )}
    </div>
  );
}
