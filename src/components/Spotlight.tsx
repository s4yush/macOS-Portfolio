import React from "react";
import { format } from "date-fns";
import { apps, launchpadApps } from "~/configs";
import type { LaunchpadData, AppsData } from "~/types";

const APPS: { [key: string]: (LaunchpadData | AppsData)[] } = {
  app: apps,
  portfolio: launchpadApps
};

const appLibraryCategories = [
  {
    name: "Social",
    apps: ["messages", "facetime", "mail"]
  },
  {
    name: "Productivity",
    apps: ["notes", "calculator", "clock", "terminal", "vscode", "typora", "bear"]
  },
  {
    name: "Entertainment",
    apps: ["music", "photos", "spotify", "youtube"]
  },
  {
    name: "Utilities",
    apps: ["system-settings", "app-store", "safari", "maps", "finder", "siri"]
  }
];

const getRandom = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomDate = () => {
  const timeStamp = new Date().getTime();
  const randomStamp = getRandom(0, timeStamp);
  return format(randomStamp, "MM/dd/yyyy");
};

const evalMath = (expr: string): string | null => {
  try {
    const sanitized = expr.replace(/[^0-9+\-*/().%\s]/g, "");
    if (!/[+\-*/]/.test(sanitized)) return null;
    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict"; return (${sanitized})`)();
    if (typeof result === "number" && isFinite(result)) {
      return Number.isInteger(result) ? String(result) : result.toFixed(6).replace(/\.?0+$/, "");
    }
  } catch {}
  return null;
};

interface SpotlightProps {
  toggleSpotlight: () => void;
  openApp: (id: string) => void;
  toggleLaunchpad: (target: boolean) => void;
  btnRef: React.RefObject<HTMLDivElement>;
}

const AppIcon = ({ app, sizeClass }: { app: any; sizeClass: string }) => {
  const isPortfolio = !!app.link || launchpadApps.some(p => p.id === app.id);

  if (isPortfolio) {
    return (
      <div className={`${sizeClass} rounded-[22.5%] shadow-sm overflow-hidden flex items-center justify-center border border-black/10 dark:border-white/10 relative ${app.id === 'skill-exchange' ? 'bg-black' : 'bg-white'}`}>
        <img src={app.img} alt={app.title} title={app.title} className={`${app.id === "library" ? "w-[60%] h-[60%] object-contain" : "w-full h-full object-cover"}`} />
      </div>
    );
  }
  return <img src={app.img} alt={app.title} title={app.title} className={`${sizeClass} object-contain drop-shadow-sm`} />;
};

export default function Spotlight({
  toggleSpotlight,
  openApp,
  toggleLaunchpad,
  btnRef
}: SpotlightProps) {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [clickedID, setClickedID] = useState("");
  const [doubleClicked, setDoubleClicked] = useState<boolean>(false);

  const [searchText, setSearchText] = useState("");
  const [curDetails, setCurDetails] = useState<any>(null);

  const [appIdList, setAppIdList] = useState<string[]>([]);
  const [appList, setAppList] = useState<JSX.Element | null>(null);

  const [activeTab, setActiveTab] = useState("All");

  const textWhite = "text-white";
  const textBlack = "text-c-black";
  const textSelected = "bg-blue-500";

  useClickOutside(spotlightRef, toggleSpotlight, [btnRef]);

  useEffect(() => {
    updateAppList();
  }, [searchText]);

  useEffect(() => {
    updateCurrentDetails();
  }, [selectedIndex]);

  useEffect(() => {
    if (appIdList.length === 0) return;
    const newSelectedIndex = appIdList.findIndex((item) => {
      return item === clickedID;
    });
    updateHighlight(selectedIndex, newSelectedIndex);
    setSelectedIndex(newSelectedIndex);
  }, [clickedID]);

  useEffect(() => {
    if (doubleClicked) {
      launchSelectedApp();
      setDoubleClicked(false);
    }
  }, [doubleClicked]);

  const search = (type: string) => {
    if (searchText === "") return [];

    const text = searchText.toLowerCase();
    return APPS[type].filter(
      (item: LaunchpadData | AppsData) =>
        item.title.toLowerCase().includes(text) || item.id.toLowerCase().includes(text)
    );
  };

  const handleClick = (id: string) => {
    setClickedID(id);
  };

  const handleDoubleClick = (id: string) => {
    setClickedID(id);
    setDoubleClicked(true);
  };

  const launchSelectedApp = () => {
    if (curDetails.type === "app" && !curDetails.link) {
      const id = curDetails.id;
      if (id === "launchpad") toggleLaunchpad(true);
      else openApp(id);
      toggleSpotlight();
    } else {
      window.open(curDetails.link);
      toggleSpotlight();
    }
  };

  const getTypeAppList = (type: string, startIndex: number) => {
    const result = search(type);
    const typeAppList = [];
    const typeAppIdList = [];

    for (const app of result) {
      const curIndex = startIndex + typeAppList.length;
      const bg = curIndex === 0 ? textSelected : "bg-transparent";
      const text = curIndex === 0 ? textWhite : textBlack;

      if (curIndex === 0) setCurrentDetailsWithType(app, type);

      typeAppList.push(
        <li
          id={`spotlight-${app.id}`}
          key={`spotlight-${app.id}`}
          className={`pr-1 h-7 w-full flex rounded ${bg} ${text} cursor-default`}
          data-app-type={type}
          onClick={() => handleClick(app.id)}
          onDoubleClick={() => handleDoubleClick(app.id)}
        >
          <div className="w-8 flex items-center justify-center">
            <AppIcon app={app} sizeClass="w-5 h-5" />
          </div>
          <div className="flex-1 hstack overflow-hidden whitespace-nowrap pl-1">
            {app.title}
          </div>
        </li>
      );
      typeAppIdList.push(app.id);
    }

    return {
      appList: typeAppList,
      appIdList: typeAppIdList
    };
  };

  const updateAppList = () => {
    const app = getTypeAppList("app", 0);
    const portfolio = getTypeAppList("portfolio", app.appIdList.length);

    const newAppIdList = [...app.appIdList, ...portfolio.appIdList];
    if (newAppIdList.length === 0) setCurDetails(null);

    const newAppList = (
      <div>
        {app.appList.length !== 0 && (
          <div>
            <div className="spotlight-type">Applications</div>
            <ul className="w-full text-xs">{app.appList}</ul>
          </div>
        )}
        {portfolio.appList.length !== 0 && (
          <div>
            <div className="spotlight-type mt-1.5 before:(content-empty absolute left-0 top-0 ml-2 w-63.5 border-t border-menu)">
              Portfolio
            </div>
            <ul className="w-full text-xs">{portfolio.appList}</ul>
          </div>
        )}
      </div>
    );

    setAppIdList(newAppIdList);
    setAppList(newAppList);
  };

  const setCurrentDetailsWithType = (app: any, type: string) =>
    setCurDetails({
      ...app,
      type
    });

  const updateCurrentDetails = () => {
    if (appIdList.length === 0 || searchText === "") {
      setCurDetails(null);
      return;
    }

    const appId = appIdList[selectedIndex];
    const element = document.querySelector(`#spotlight-${appId}`) as HTMLElement;
    const type = element.dataset.appType as string;
    const app = APPS[type].find((item: LaunchpadData | AppsData) => item.id === appId);

    setCurrentDetailsWithType(app, type);
  };

  const updateHighlight = (prevIndex: number, curIndex: number) => {
    if (appIdList.length === 0) return;

    const prevAppId = appIdList[prevIndex];
    const prev = document.querySelector(`#spotlight-${prevAppId}`) as HTMLElement;
    prev.className = prev.className
      .replace(textWhite, textBlack)
      .replace(textSelected, "bg-transparent");

    const curAppId = appIdList[curIndex];
    const cur = document.querySelector(`#spotlight-${curAppId}`) as HTMLElement;
    cur.className = cur.className
      .replace(textBlack, textWhite)
      .replace("bg-transparent", textSelected);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const keyCode = e.key;
    const numApps = appIdList.length;

    if (keyCode === "ArrowDown" && selectedIndex < numApps - 1) {
      updateHighlight(selectedIndex, selectedIndex + 1);
      setSelectedIndex(selectedIndex + 1);
    }
    else if (keyCode === "ArrowUp" && selectedIndex > 0) {
      updateHighlight(selectedIndex, selectedIndex - 1);
      setSelectedIndex(selectedIndex - 1);
    }
    else if (keyCode === "Enter") {
      if (!curDetails) return;
      launchSelectedApp();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateHighlight(selectedIndex, 0);
    setSelectedIndex(0);
    setSearchText(e.target.value);
    setActiveTab("All");
  };

  const mathResult = evalMath(searchText);

  const renderAppLibrary = () => {
    return (
      <div className="w-full h-full bg-transparent overflow-y-scroll p-4 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-6 content-start">
        {appLibraryCategories.map((cat) => (
          <div key={cat.name} className="flex flex-col">
            <span className="text-[13px] text-c-600 font-medium ml-3 mb-1.5">{cat.name}</span>
            <div className="bg-gray-200/50 dark:bg-gray-800/50 rounded-[24px] p-3.5 grid grid-cols-2 gap-3 backdrop-blur-md shadow-sm">
              {Array.from({ length: 4 }).map((_, index) => {
                const appId = cat.apps[index];
                const app = appId ? apps.find((a) => a.id === appId) : null;
                if (!app) return <div key={index} className="w-11 h-11" />;
                return (
                  <div
                    key={app.id}
                    className="flex flex-col items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                    onClick={() => {
                      openApp(app.id);
                      toggleSpotlight();
                    }}
                  >
                    <AppIcon app={app} sizeClass="w-11 h-11" />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderPortfolio = () => {
    const chunks = [];
    for (let i = 0; i < launchpadApps.length; i += 4) {
      chunks.push(launchpadApps.slice(i, i + 4));
    }
    const categoryNames = ["Web Apps", "Projects", "More"];

    return (
      <div className="w-full h-full bg-transparent overflow-y-scroll p-4 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-6 content-start">
        {chunks.map((chunk, chunkIndex) => (
          <div key={chunkIndex} className="flex flex-col">
            <span className="text-[13px] text-c-600 font-medium ml-3 mb-1.5">{categoryNames[chunkIndex] || `Category ${chunkIndex + 1}`}</span>
            <div className="bg-gray-200/50 dark:bg-gray-800/50 rounded-[24px] p-3.5 grid grid-cols-2 gap-3 backdrop-blur-md shadow-sm">
              {Array.from({ length: 4 }).map((_, index) => {
                const app = chunk[index];
                if (!app) return <div key={index} className="w-11 h-11" />;
                return (
                  <div
                    key={app.id}
                    className="flex flex-col items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                    onClick={() => {
                      window.open(app.link);
                      toggleSpotlight();
                    }}
                  >
                    <AppIcon app={app} sizeClass="w-11 h-11" />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      className="spotlight"
      onKeyDown={handleKeyPress}
      onClick={() => inputRef.current?.focus()}
      ref={spotlightRef}
    >
      <div
        className="w-full h-14 sm:h-16 rounded-lg bg-transparent"
        grid="~ cols-8 sm:cols-11"
      >
        <div className="col-start-1 col-span-1 flex-center">
          <img src="/img/icons/sf-icons/search.svg" alt="Search" className="ml-1 opacity-60 dark:invert" style={{ width: "24px", height: "24px" }} />
        </div>
        <input
          ref={inputRef}
          className={`col-start-2 col-span-7 ${
            curDetails ? "sm:col-span-9" : "sm:col-span-10"
          } bg-transparent no-outline px-1`}
          text="c-black xl sm:2xl"
          placeholder="Spotlight Search"
          value={searchText}
          onChange={handleInputChange}
          autoFocus={true}
        />
        {curDetails && (
          <div className="hidden sm:flex col-start-11 col-span-1 flex-center">
            <AppIcon app={curDetails} sizeClass="w-8 h-8" />
          </div>
        )}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 7,
          padding: "4px 14px 10px",
          borderBottom: searchText !== "" || activeTab !== "All" ? "1px solid rgba(0,0,0,0.08)" : "none",
        }}
      >
        {["All", "Applications", "Portfolio"].map((label) => (
          <span
            key={label}
            onClick={() => {
              setActiveTab(label);
              if (label !== "All") setSearchText("");
            }}
            style={{
              background: activeTab === label ? "rgba(0,122,255,0.1)" : "rgba(120,120,128,0.12)",
              color: activeTab === label ? "#007aff" : "var(--color-c-600, #555)",
              borderRadius: 8,
              padding: "4px 11px",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            {label}
          </span>
        ))}
      </div>
      {mathResult !== null && activeTab === "All" && (
        <div
          className="px-4 pb-2 flex items-baseline gap-2"
          style={{ borderBottom: '1px solid var(--lg-border-subtle)' }}
        >
          <img src="/img/icons/sf-icons/calculator.svg" alt="Calculator" className="dark:invert opacity-60" style={{ width: "18px", height: "18px" }} />
          <span className="text-c-500 text-sm">{searchText} =</span>
          <span className="text-c-black font-semibold text-2xl">{mathResult}</span>
        </div>
      )}
      {(searchText !== "" || activeTab !== "All") && (
        <div flex h-85 bg-transparent border="t menu">
          {activeTab === "Applications" ? (
            renderAppLibrary()
          ) : activeTab === "Portfolio" ? (
            renderPortfolio()
          ) : (
            <>
              <div w="32 sm:72" border="r menu" p="x-2.5" overflow-y-scroll>
                {appList}
              </div>
              {curDetails && (
                <div className="flex-1 vstack">
                  <div className="w-4/5 h-56" flex="center col" border="b menu">
                    <AppIcon app={curDetails} sizeClass="w-32 h-32" />
                    <div m="t-4" text="xl c-black">
                      {curDetails.title}
                    </div>
                    <div text="xs c-500">
                      {`Version: ${getRandom(0, 99)}.${getRandom(0, 999)}`}
                    </div>
                  </div>
                  <div className="flex-1 hstack text-xs">
                    <div w="1/2" text="right c-500">
                      <div>Kind</div>
                      <div>Size</div>
                      <div>Created</div>
                      <div>Modified</div>
                      <div>Last opened</div>
                    </div>
                    <div className="flex-1 pl-2 text-c-black">
                      <div>{curDetails.type === "app" ? "Application" : "Portfolio"}</div>
                      <div>{`${getRandom(0, 999)} MB`}</div>
                      <div>{getRandomDate()}</div>
                      <div>{getRandomDate()}</div>
                      <div>{getRandomDate()}</div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
