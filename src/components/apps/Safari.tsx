import React, { useState, useEffect } from "react";
import websites from "~/configs/websites";
import wallpapers from "~/configs/wallpapers";
import { checkURL } from "~/utils";
import { useStore } from "~/stores";
import type { SiteSectionData, SiteData } from "~/types";

interface SafariState {
  goURL: string;
  currentURL: string;
}

interface SafariProps {
  width?: number;
}

interface NavProps {
  width: number;
  setGoURL: (url: string) => void;
}

interface NavSectionProps extends NavProps {
  section: SiteSectionData;
}

const NavSection = ({ width, section, setGoURL }: NavSectionProps) => {
  const grid = width < 640 ? "grid-template-columns: repeat(4, minmax(0, 1fr))" : "grid-template-columns: repeat(9, minmax(0, 1fr))";

  return (
    <div style={{ margin: "0 auto", width: "100%", maxWidth: "800px", padding: "32px 16px 0" }}>
      <div style={{ fontWeight: 600, marginLeft: "8px", fontSize: width < 640 ? "20px" : "24px", color: "var(--lg-text-primary, #1c1c1e)" }}>
        {section.title}
      </div>
      <div style={{ marginTop: "16px", display: "grid", gridTemplateColumns: width < 640 ? "repeat(4, 1fr)" : "repeat(8, 1fr)", gap: "16px" }}>
        {section.sites.map((site: SiteData) => (
          <div key={`safari-nav-${site.id}`} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div 
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "14px",
                overflow: "hidden",
                background: "var(--lg-bg)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(0,0,0,0.05)"
              }}
              onClick={site.inner ? () => setGoURL(site.link) : () => window.open(site.link)}
            >
              {site.img ? (
                <img src={site.img} alt={site.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ fontSize: "18px", color: "#1c1c1e" }}>{site.title.substring(0,2)}</span>
              )}
            </div>
            <span style={{ marginTop: "8px", fontSize: "12px", color: "var(--lg-text-secondary, rgba(0,0,0,0.6))", textAlign: "center" }}>
              {site.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const numTracker = Math.floor(Math.random() * 99 + 1);

const NavPage = ({ width, setGoURL }: NavProps) => {
  const dark = useStore((state) => state.dark);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflowY: "auto",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundImage: `url(${dark ? wallpapers.night : wallpapers.day})`,
      }}
    >
      <div style={{ 
          width: "100%", 
          minHeight: "100%", 
          paddingTop: "32px", 
          background: "var(--lg-bg-tinted)", 
          backdropFilter: "var(--lg-blur-heavy)", 
          WebkitBackdropFilter: "var(--lg-blur-heavy)" 
      }}>
        <NavSection section={websites.favorites} setGoURL={setGoURL} width={width} />
        <NavSection section={websites.freq} setGoURL={setGoURL} width={width} />

        <div style={{ margin: "0 auto", width: "100%", maxWidth: "800px", padding: "48px 16px 64px" }}>
          <div style={{ fontWeight: 600, fontSize: width < 640 ? "20px" : "24px", color: "var(--lg-text-primary, #1c1c1e)", marginBottom: "16px" }}>
            Privacy Report
          </div>
          <div
            style={{
                height: "64px",
                width: "100%",
                display: "flex",
                alignItems: "center",
                background: "rgba(255,255,255,0.4)",
                border: "1px solid rgba(255,255,255,0.2)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
                borderRadius: "16px",
                padding: "0 20px"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", borderRight: "1px solid rgba(0,0,0,0.1)", paddingRight: "20px" }}>
              <span className="i-ph:shield-check-fill" style={{ fontSize: "24px", color: "#34C759" }} />
              <span style={{ fontSize: "24px", fontWeight: 700, color: "var(--lg-text-primary, #1c1c1e)" }}>{numTracker}</span>
            </div>
            <div style={{ paddingLeft: "20px", fontSize: "14px", color: "var(--lg-text-secondary, rgba(0,0,0,0.6))" }}>
              In the last seven days, Safari has prevented {numTracker} trackers from profiling you.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NoInternetPage = () => {
  const dark = useStore((state) => state.dark);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflowY: "auto",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundImage: `url(${dark ? wallpapers.night : wallpapers.day})`,
      }}
    >
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--lg-bg-tinted)", backdropFilter: "var(--lg-blur-heavy)" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "24px", fontWeight: 700, color: "var(--lg-text-primary, #1c1c1e)" }}>You Are Not Connected to the Internet</div>
          <div style={{ paddingTop: "16px", fontSize: "14px", color: "var(--lg-text-secondary, rgba(0,0,0,0.6))" }}>
            This page can't be displayed because your computer is currently offline.
          </div>
        </div>
      </div>
    </div>
  );
};

const Safari = ({ width = 800 }: SafariProps) => {
  const wifi = useStore((state) => state.wifi);
  const safariUrl = useStore((state) => state.safariUrl);
  const setSafariUrl = useStore((state) => state.setSafariUrl);
  const [state, setState] = useState<SafariState>({
    goURL: "",
    currentURL: ""
  });

  useEffect(() => {
    if (safariUrl) {
      setState({
        goURL: safariUrl,
        currentURL: safariUrl
      });
      setSafariUrl("");
    }
  }, [safariUrl, setSafariUrl]);

  const setGoURL = (url: string) => {
    const isValid = checkURL(url);

    if (isValid) {
      if (url.substring(0, 7) !== "http://" && url.substring(0, 8) !== "https://")
        url = `https://${url}`;
    } else if (url !== "") {
      url = `https://www.google.com/search?q=${url}`;
    }

    setState({
      goURL: url,
      currentURL: url
    });
  };

  const pressURL = (e: React.KeyboardEvent) => {
    const keyCode = e.key;
    if (keyCode === "Enter") setGoURL((e.target as HTMLInputElement).value);
  };

  const tabTitle = state.goURL
    ? (() => { try { return new URL(state.goURL).hostname.replace(/^www\./, ""); } catch { return state.goURL; } })()
    : "New Tab";

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--lg-bg)", }}>
      <div 
        style={{ 
            display: "flex", 
            alignItems: "center", 
            height: "52px", 
            background: "var(--lg-bg-tinted)", 
            backdropFilter: "var(--lg-blur-light)",
            borderBottom: "var(--lg-border)",
            padding: "0 12px",
            gap: "12px"
        }}
      >
        <div style={{ display: "flex", gap: "8px" }}>
            <button
                onClick={() => setGoURL("")}
                style={{
                    background: "transparent",
                    border: "none",
                    color: state.goURL === "" ? "var(--c-text-tertiary, rgba(0,0,0,0.3))" : "var(--c-text-secondary, rgba(0,0,0,0.6))",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "28px",
                    height: "28px",
                    borderRadius: "6px"
                }}
            >
                <span className="i-ph:caret-left-bold" style={{ fontSize: "16px" }} />
            </button>
            <button
                style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--c-text-tertiary, rgba(0,0,0,0.3))",
                    cursor: "default",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "28px",
                    height: "28px",
                    borderRadius: "6px"
                }}
            >
                <span className="i-ph:caret-right-bold" style={{ fontSize: "16px" }} />
            </button>
        </div>

        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <div 
                style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    width: "100%", 
                    maxWidth: "500px",
                    background: "var(--c-bg-tertiary, rgba(0,0,0,0.06))",
                    border: "0.5px solid var(--c-border, rgba(0,0,0,0.04))",
                    borderRadius: "8px",
                    padding: "4px 12px",
                    gap: "8px"
                }}
            >
                <span className="i-ph:shield-check" style={{ color: "var(--c-text-tertiary, rgba(0,0,0,0.4))" }} />
                <input
                    type="text"
                    value={state.currentURL}
                    onChange={(e) => setState({ ...state, currentURL: e.target.value })}
                    onKeyPress={pressURL}
                    placeholder="Search or enter website name"
                    style={{
                        flex: 1,
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        fontSize: "13px",
                        textAlign: "center",
                        color: "var(--c-text, rgba(0,0,0,0.8))"
                    }}
                />
                <span className="i-ph:arrow-clockwise" style={{ color: "var(--c-text-tertiary, rgba(0,0,0,0.4))" }} />
            </div>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
            <button
                style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--c-text-secondary, rgba(0,0,0,0.6))",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "28px",
                    height: "28px",
                    borderRadius: "6px"
                }}
            >
                <span className="i-ph:share-network" style={{ fontSize: "16px" }} />
            </button>
            <button
                style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--c-text-secondary, rgba(0,0,0,0.6))",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "28px",
                    height: "28px",
                    borderRadius: "6px"
                }}
            >
                <span className="i-ph:tabs" style={{ fontSize: "16px" }} />
            </button>
        </div>
      </div>

      <div style={{ flex: 1, position: "relative", zIndex: 0 }}>
        {wifi ? (
            state.goURL === "" ? (
            <NavPage setGoURL={setGoURL} width={width} />
            ) : (
            <iframe
                title={"Safari clone browser"}
                src={state.goURL}
                style={{ width: "100%", height: "100%", border: "none", background: "#fff" }}
            />
            )
        ) : (
            <NoInternetPage />
        )}
      </div>
    </div>
  );
};

export default Safari;
