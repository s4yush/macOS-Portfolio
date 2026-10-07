import { useRef, useState, useEffect, useCallback } from "react";
import { useAudioContext } from "~/context/AudioContext";
import { useStore } from "~/stores";
import { transcribeAudio, getGroqChatCompletion } from "~/utils/groq";
import type { ChatMessage } from "~/utils/groq";

type SiriPhase = "idle" | "recording" | "processing" | "speaking" | "error";

// Limit personal answers to details available in the portfolio.
const SUYASH_INFO = `This portfolio belongs to Suyash Singh. His resume is available for download.`;

const SIRI_FALLBACK = "Hey, I appreciate the curiosity! Suyash set me up to help navigate this portfolio — try asking me to open an app, play music, toggle dark mode, or check the time!";

const SYSTEM_PROMPT = `You are Siri, a friendly and chill virtual assistant running inside Suyash Singh's macOS-style web portfolio.
You control the interface through tool calls. Keep replies short, warm, and conversational (1-2 sentences max).
Use a casual, friendly tone — like talking to a buddy. Say things like "Sure thing!", "You got it!", "No worries!", "Here you go!".

Here is info about Suyash (use this when someone asks about him or his resume):
${SUYASH_INFO}

IMPORTANT RULES:
1. If you don't understand the request, or it is unrelated to the portfolio, reply EXACTLY: "${SIRI_FALLBACK}"
2. If asked about Suyash or his resume, call the download_resume tool. Only share personal details present in the provided portfolio or resume context; do not invent qualifications or contact details.
3. For time/date questions, use the get_current_time tool.
4. Always prefer calling a tool over giving instructions.
5. Never hallucinate capabilities you don't have. If unsure, use the fallback message from rule 1.
6. You can open the launchpad to show the portfolio's projects, open Spotify to play music, toggle fullscreen, and more.
7. Never say "I am Suyash" — you are Siri, built by Suyash.`;

const TOOLS = [
  { type: "function", function: { name: "toggle_dark_mode", description: "Toggles the dark/light theme." } },
  { type: "function", function: { name: "play_music", description: "Plays the background music / song." } },
  { type: "function", function: { name: "pause_music", description: "Pauses the currently playing music / song." } },
  { type: "function", function: { name: "set_volume", description: "Sets the system volume.", parameters: { type: "object", properties: { level: { type: "number", description: "Volume level 0-100." } }, required: ["level"] } } },
  { type: "function", function: { name: "set_brightness", description: "Sets the display brightness.", parameters: { type: "object", properties: { level: { type: "number", description: "Brightness level 1-100." } }, required: ["level"] } } },
  { type: "function", function: { name: "toggle_wifi", description: "Toggles Wi-Fi on or off." } },
  { type: "function", function: { name: "toggle_bluetooth", description: "Toggles Bluetooth on or off." } },
  { type: "function", function: { name: "open_app", description: "Opens an app window.", parameters: { type: "object", properties: { app_id: { type: "string", description: "One of: safari, spotify, bear, terminal, vscode, facetime, typora" } }, required: ["app_id"] } } },
  { type: "function", function: { name: "close_app", description: "Closes an app window.", parameters: { type: "object", properties: { app_id: { type: "string", description: "One of: safari, spotify, bear, terminal, vscode, facetime, typora" } }, required: ["app_id"] } } },
  { type: "function", function: { name: "get_current_time", description: "Returns the current date and time." } },
  { type: "function", function: { name: "toggle_fullscreen", description: "Toggles full screen mode." } },
  { type: "function", function: { name: "download_resume", description: "Downloads Suyash's resume PDF when asked about Suyash or his resume." } },
  { type: "function", function: { name: "open_launchpad", description: "Opens the Launchpad overlay to show the portfolio's projects." } },
  { type: "function", function: { name: "play_spotify", description: "Opens Spotify app to play music." } }
];

const SpeechRecognitionAPI =
  typeof window !== "undefined"
    ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    : null;

export default function Siri({ closeSiri }: { closeSiri?: () => void }) {
  const [phase, setPhase] = useState<SiriPhase>("idle");
  const [responseText, setResponseText] = useState("");
  const [inputText, setInputText] = useState("");

  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordStartTimeRef = useRef<number>(0);
  const vadLoopRef = useRef<number | null>(null);

  const apiKey = (import.meta.env.VITE_GROQ_API_KEY as string) || "";
  const useBrowserSTT = false;

  const { controls } = useAudioContext();
  const store = useStore();

  useEffect(() => {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener("voiceschanged", () => window.speechSynthesis.getVoices());
  }, []);

  const playSiriSound = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      const siriAudio = document.getElementById("siri-audio") as HTMLAudioElement | null;
      if (siriAudio) {
        siriAudio.volume = 0.8;
        siriAudio.currentTime = 0;
        siriAudio.play().then(() => {
          const timeout = setTimeout(resolve, 1500);
          siriAudio.onended = () => {
            clearTimeout(timeout);
            siriAudio.onended = null;
            resolve();
          };
        }).catch((err) => {
          resolve();
        });
      } else {
        resolve();
      }
    });
  }, []);

  const openAppById = useCallback((id: string) => {
    const el = document.querySelector(`#dock-${id}`) as HTMLElement | null;
    el?.click();
  }, []);

  const closeAppById = useCallback((id: string) => {
    const win = document.querySelector(`#window-${id}`) as HTMLElement | null;
    const btn = win?.querySelector("button.bg-red-500") as HTMLElement | null;
    btn?.click();
  }, []);

  const downloadResume = useCallback(() => {
    const link = document.createElement("a");
    link.href = "/resume.pdf";
    link.download = "Suyash_Singh_Resume.pdf";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const executeTool = useCallback(async (name: string, args: any): Promise<string> => {

    switch (name) {
      case "toggle_dark_mode": {
        store.toggleDark();
        const nowDark = !store.dark;
        return nowDark ? "Switched to dark mode." : "Switched to light mode.";
      }

      case "play_music": {
        await controls.play();
        return "Playing music now.";
      }

      case "pause_music": {
        controls.pause();
        return "Music paused.";
      }

      case "set_volume": {
        const v = Math.max(0, Math.min(100, Number(args?.level) || 50));
        store.setVolume(v);
        controls.volume(v / 100);
        return `Volume set to ${v}%.`;
      }

      case "set_brightness": {
        const b = Math.max(1, Math.min(100, Number(args?.level) || 50));
        store.setBrightness(b);
        return `Brightness set to ${b}%.`;
      }

      case "toggle_wifi":
        store.toggleWIFI();
        return "Wi-Fi toggled.";

      case "toggle_bluetooth":
        store.toggleBluetooth();
        return "Bluetooth toggled.";

      case "open_app":
        openAppById((args?.app_id || "").toLowerCase());
        return `Opening ${args?.app_id}.`;

      case "close_app":
        closeAppById((args?.app_id || "").toLowerCase());
        return `Closing ${args?.app_id}.`;

      case "get_current_time": {
        const now = new Date();
        const time = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
        const date = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
        return `It is ${time} on ${date}.`;
      }

      case "download_resume":
        downloadResume();
        return "Here's Suyash's resume. The download should start right up!";

      case "toggle_fullscreen": {
        try {
          if (!document.fullscreenElement) {
            await document.documentElement.requestFullscreen();
            return "Going full screen! Enjoy the immersive view.";
          } else {
            if (document.exitFullscreen) {
              await document.exitFullscreen();
              return "Exited full screen mode. Back to normal!";
            }
          }
        } catch (err) {
          return "Hmm, couldn't toggle full screen mode right now.";
        }
        return "Full screen mode toggled!";
      }

      case "open_launchpad": {
        window.dispatchEvent(new CustomEvent("siri:openLaunchpad"));
        return "Opening up the Launchpad! Check out the projects.";
      }

      case "play_spotify": {
        openAppById("spotify");
        return "Firing up Spotify for you! Enjoy the vibes.";
      }

      default:
        return "Done.";
    }
  }, [store, controls, openAppById, closeAppById, downloadResume]);

  const speakText = useCallback((text: string) => {
    if (!text) { setPhase("idle"); return; }
    window.speechSynthesis.cancel();
    setPhase("speaking");

    const utt = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find((v) => v.lang.startsWith("en") && v.name.toLowerCase().includes("female"))
      || voices.find((v) => v.lang.startsWith("en-US"))
      || voices.find((v) => v.lang.startsWith("en"))
      || voices[0];
    if (voice) utt.voice = voice;
    utt.rate = 1.0;
    utt.pitch = 1.1;
    utt.onend = () => {
      setPhase("idle");

      setTimeout(() => {
        if (closeSiri) closeSiri(); else closeAppById('siri');
      }, 2000);
    };
    utt.onerror = (e) => {
      setPhase("idle");

      setTimeout(() => {
        if (closeSiri) closeSiri(); else closeAppById('siri');
      }, 2000);
    };

    setTimeout(() => window.speechSynthesis.speak(utt), 100);
  }, []);

  const executeAgent = useCallback(async (userText: string) => {
    try {
      const messages: ChatMessage[] = [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userText }
      ];
      const data = await getGroqChatCompletion(messages, apiKey, TOOLS);
      const msg = data.choices[0].message;

      let reply = msg.content || "";
      let toolCalls = msg.tool_calls || [];

      // Some models return tool calls as <function=name>...</function> text.
      const gemmaToolRegex = /<function=([^>]+)>(.*?)<\/function>/g;
      let match;
      while ((match = gemmaToolRegex.exec(reply)) !== null) {
        const toolName = match[1];
        const toolArgsStr = match[2];
        let args = {};
        try {
          if (toolArgsStr) args = JSON.parse(toolArgsStr);
        } catch {}

        toolCalls.push({
          id: `gemma-${Date.now()}`,
          type: "function",
          function: { name: toolName, arguments: JSON.stringify(args) }
        });
      }

      reply = reply.replace(/<function=[^>]+>.*?<\/function>/g, "").trim();

      if (toolCalls && toolCalls.length > 0) {
        const results: string[] = [];
        for (const tc of toolCalls) {
          let args: any = {};
          try {
            args = tc.function.arguments ? JSON.parse(tc.function.arguments) : {};
          } catch {}
          const result = await executeTool(tc.function.name, args);
          results.push(result);
        }
        if (!reply) reply = results.join(" ");
      }

      if (!reply || !reply.trim()) {
        reply = SIRI_FALLBACK;
      }
      setResponseText(reply);
      speakText(reply);
    } catch (err: any) {
      setResponseText(SIRI_FALLBACK);
      speakText(SIRI_FALLBACK);
    }
  }, [apiKey, executeTool, speakText]);

  const handleTextInput = useCallback(async (text: string) => {
    const cleaned = (text || "").trim();
    if (!cleaned) return;
    setResponseText(`You typed: "${cleaned}"`);
    setPhase("processing");
    await executeAgent(cleaned);
    setInputText("");
  }, [executeAgent]);

  const handleTranscription = useCallback(async (text: string) => {
    const cleaned = (text || "").trim();
    if (!cleaned) {
      setResponseText("I didn't catch that. Please try again.");
      setPhase("idle");
      return;
    }
    setResponseText(`You said: "${cleaned}"`);
    setPhase("processing");
    await executeAgent(cleaned);
  }, [executeAgent]);

  const startBrowserSTT = useCallback(() => {
    if (!SpeechRecognitionAPI) return;

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      const confidence = event.results[0][0].confidence;
      setPhase("processing");
      handleTranscription(transcript);
    };

    recognition.onspeechend = () => {
      recognition.stop();
    };

    recognition.onerror = (event: any) => {
      if (event.error === "no-speech") {
        setResponseText("I didn't hear anything. Please try again.");
      } else if (event.error === "not-allowed") {
        setResponseText("Microphone access denied. Please allow permissions.");
      } else {
        setResponseText("Speech recognition error. Please try again.");
      }
      setPhase("idle");
    };

    recognition.onend = () => {
      setPhase((prev) => prev === "recording" ? "idle" : prev);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setPhase("recording");
    setResponseText("");
  }, [handleTranscription]);

  const stopBrowserSTT = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const startWhisperSTT = useCallback(async () => {
    try {
      setResponseText("");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true }
      });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "";

      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      audioChunksRef.current = [];
      recorder.ondataavailable = (e: BlobEvent) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType || "audio/webm" });
        setPhase("processing");
        if (blob.size < 1000) {
          setResponseText("I didn't catch that.");
          setPhase("idle");
          return;
        }
        try {
          const text = await transcribeAudio(blob, apiKey);
          await handleTranscription(text);
        } catch (err: any) {
          setResponseText("Transcription failed.");
          setPhase("error");
        }
      };

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      let silenceStart = Date.now();
      const SILENCE_THRESHOLD = 5; // Low-volume threshold on a 0–255 scale.
      const SILENCE_DURATION = 2000; // Stop recording after 2 seconds of silence.

      const checkAudioLevel = () => {
        if (!mediaRecorderRef.current || mediaRecorderRef.current.state === "inactive") return;

        analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;

        if (average > SILENCE_THRESHOLD) {
          silenceStart = Date.now();
        } else {
          if (Date.now() - silenceStart > SILENCE_DURATION) {
            stopWhisperSTT();
            return;
          }
        }

        vadLoopRef.current = requestAnimationFrame(checkAudioLevel);
      };

      vadLoopRef.current = requestAnimationFrame(checkAudioLevel);

      recorder.start(250);
      recordStartTimeRef.current = Date.now();
      mediaRecorderRef.current = recorder;
      setPhase("recording");
    } catch (err: any) {
      setResponseText("Microphone access denied.");
      setPhase("error");
    }
  }, [apiKey, handleTranscription]);

  const stopWhisperSTT = useCallback(() => {
    if (vadLoopRef.current) {
      cancelAnimationFrame(vadLoopRef.current);
      vadLoopRef.current = null;
    }

    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === "inactive") return;
    const elapsed = Date.now() - recordStartTimeRef.current;
    if (elapsed < 1500) {
      setTimeout(() => { if (recorder.state !== "inactive") recorder.stop(); }, 1500 - elapsed);
    } else {
      recorder.stop();
    }
  }, []);

  const mountedRef = useRef(false);
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      if (phase === "idle") {
        handleClick();
      }
    }

    return () => {
      if (useBrowserSTT && recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) { }
      } else if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        try {
          mediaRecorderRef.current.stop();
        } catch (e) { }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = useCallback(async () => {
    if (phase === "recording") {
      if (useBrowserSTT) stopBrowserSTT();
      else stopWhisperSTT();
    } else if (phase === "idle" || phase === "error" || phase === "speaking") {
      window.speechSynthesis.cancel();

      setResponseText("");
      setPhase("recording");
      await playSiriSound();

      if (useBrowserSTT) startBrowserSTT();
      else await startWhisperSTT();
    }
  }, [phase, useBrowserSTT, startBrowserSTT, stopBrowserSTT, startWhisperSTT, stopWhisperSTT, playSiriSound]);

  let statusText = "";
  if (phase === "recording") statusText = "Listening...";
  else if (phase === "processing") statusText = "Thinking...";
  else if (phase === "speaking") statusText = "Speaking...";

  let boxText = responseText;
  if (!boxText && phase === "idle") {
    boxText = 'Say "Hey Siri" or type your question below.';
  }

  const isTypingMode = inputText.length > 0;
  const isAuraActive = phase === "speaking" || phase === "processing" || phase === "recording";

  return (
    <div className="flex items-start justify-end gap-4 relative pointer-events-auto group mt-4 mr-4">
      <audio id="siri-audio" src="/music/siri.mp3" preload="auto" className="hidden" />
      <style>{`
        @keyframes siri-aura-pulse {
          0%, 100% { opacity: 0; transform: scale(0.8); }
          50% { opacity: 0.8; transform: scale(1.15); }
        }
        .siri-aura {
          animation: siri-aura-pulse 2s ease-in-out infinite;
        }
        .siri-glass-panel {
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(50px) saturate(180%);
          -webkit-backdrop-filter: blur(50px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.4);
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), inset 0 0 0 0.5px rgba(255, 255, 255, 0.5);
        }
        .dark .siri-glass-panel {
          background: rgba(35, 35, 35, 0.45);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), inset 0 0 0 0.5px rgba(255, 255, 255, 0.1);
        }
      `}</style>

      <div
        className={`siri-glass-panel relative z-20 flex flex-col justify-center px-6 py-5 w-[320px] min-h-[120px] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${boxText || statusText ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
          }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 rounded-md overflow-hidden bg-black/5 dark:bg-white/5 flex items-center justify-center">
            <img src="/img/icons/siri.png" className="w-full h-full object-cover" alt="Siri" />
          </div>
          <span className="text-[13px] font-semibold text-black/60 dark:text-white/60 tracking-wide uppercase">
            Siri
          </span>
        </div>

        <div
          className="text-black/90 dark:text-white text-[16px] leading-relaxed font-medium tracking-tight font-sans drop-shadow-sm"
        >
          {statusText ? (
             <span className="opacity-60 text-[16px] font-normal">{statusText}</span>
          ) : (
            boxText
          )}
        </div>

        <button
          className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            setResponseText("");
            setPhase("idle");
          }}
          title="Dismiss"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
        </button>
      </div>

      <div className="relative w-[180px] h-[180px] flex items-center justify-center flex-shrink-0">

        <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-0">
          <div
            className={`w-[140px] h-[140px] rounded-full mix-blend-screen transition-all duration-700 blur-[20px] ${isAuraActive ? 'siri-aura' : 'opacity-0 scale-90'}`}
            style={{
              background: "radial-gradient(circle at 40% 40%, rgba(60,220,255,0.8) 0%, rgba(200,50,255,0.7) 35%, rgba(255,0,150,0.4) 70%, rgba(0,0,0,0) 100%)",
              boxShadow: "0 0 50px 20px rgba(255, 0, 150, 0.4), inset 0 0 20px 10px rgba(60,220,255,0.5)"
            }}
          />
        </div>

        <div
          className="relative z-10 flex justify-center items-center w-[130px] h-[130px] rounded-full cursor-pointer transform hover:scale-105 active:scale-95 transition-transform duration-300"
          onClick={handleClick}
          title="Tap to listen / Stop"
        >

          <video
            src="/img/ui/siri2.webm"
            autoPlay
            loop
            muted
            playsInline
            className={`relative z-10 h-[130px] w-[130px] object-contain transition-opacity duration-300 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] ${phase === 'idle' ? 'opacity-80' : 'opacity-100'}`}
          />
        </div>

        <button
          className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full bg-black/40 text-white/70 hover:text-white hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100 z-30 shadow-md backdrop-blur-sm"
          onClick={(e) => { e.stopPropagation(); if (closeSiri) closeSiri(); else closeAppById('siri'); }}
          title="Close Siri App completely"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
        </button>
      </div>
    </div>
  );
}
