import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Download, Share2, Sparkles, Wand2, Undo2 } from "lucide-react";

const IMPROVE_MSGS = [
  "מוסיפה קסם...",
  "מערבבת צבעים...",
  "מפזרת נצנצים...",
  "הפיה עובדת...",
  "כמעט מוכן...",
  "מגעים אחרונים...",
];

export default function ImageDisplay({ imageUrl, promptUsed, onShare, onReset, onImproved }) {
  const [improving, setImproving]  = useState(false);
  const [listening, setListening]  = useState(false);
  const [liveText, setLiveText]    = useState("");
  const [msgIdx, setMsgIdx]        = useState(0);
  const [history, setHistory]      = useState([]); // [{imageUrl, promptUsed}]
  const recognitionRef = useRef(null);
  const collectedRef   = useRef("");

  useEffect(() => {
    if (!improving) return;
    setMsgIdx(0);
    const t = setInterval(() => setMsgIdx(i => (i + 1) % IMPROVE_MSGS.length), 1600);
    return () => clearInterval(t);
  }, [improving]);

  useEffect(() => {
    if (!listening) return;
    const stop = () => stopFeedback();
    window.addEventListener("mouseup", stop);
    window.addEventListener("touchend", stop);
    return () => { window.removeEventListener("mouseup", stop); window.removeEventListener("touchend", stop); };
  }, [listening]);

  function startFeedback() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR || listening || improving) return;
    collectedRef.current = ""; setLiveText("");
    const r = new SR();
    r.lang = "he-IL"; r.interimResults = true; r.continuous = true;
    r.onresult = (e) => {
      let text = "";
      for (const res of e.results) text += res[0].transcript;
      collectedRef.current = text; setLiveText(text);
    };
    r.onerror = () => {};
    recognitionRef.current = r;
    r.start(); setListening(true);
  }

  function stopFeedback() {
    recognitionRef.current?.stop(); setListening(false);
    setTimeout(async () => {
      const text = collectedRef.current.trim();
      setLiveText(""); collectedRef.current = "";
      if (!text) return;
      setImproving(true);
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/paint/improve`,
          { feedback: text, previous_prompt: promptUsed, kid_name: "Carmel", current_image: imageUrl }
        );
        // push current to history before replacing
        setHistory(h => [...h, { imageUrl, promptUsed }]);
        onImproved(data);
      } finally { setImproving(false); }
    }, 400);
  }

  function undo() {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory(h => h.slice(0, -1));
    onImproved({ image_url: prev.imageUrl, prompt_used: prev.promptUsed });
  }

  return (
    <div className="flex flex-col gap-4 w-full animate-pop">

      {/* Image with overlay */}
      <div className="card overflow-hidden shadow-xl relative">
        <img src={imageUrl} alt="ציור"
          className={`w-full object-cover transition-all duration-700 ${improving ? "brightness-50" : ""}`}/>

        {improving && (
          <div className="absolute inset-0 rounded-3xl overflow-hidden">
            <div className="absolute inset-0"
              style={{
                background:"linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.6) 50%, transparent 60%)",
                backgroundSize:"200% 100%",
                animation:"shimmer-sweep 1.8s ease-in-out infinite",
              }}/>
            {["✨","⭐","💫","🌟","✨","⭐"].map((e, i) => (
              <span key={i} className="absolute text-2xl select-none pointer-events-none"
                style={{
                  left:`${10 + i * 16}%`, bottom:"10%",
                  animation:`float-up ${2 + i * 0.4}s ease-in infinite`,
                  animationDelay:`${i * 0.35}s`, opacity:0,
                }}>
                {e}
              </span>
            ))}
            <div className="absolute bottom-5 left-0 right-0 flex justify-center">
              <div className="bg-white/95 backdrop-blur-sm rounded-full px-6 py-3 shadow-xl flex items-center gap-2">
                <Wand2 size={18} className="text-purple-500 shrink-0" strokeWidth={2}/>
                <p className="text-purple-700 font-black text-lg" key={msgIdx}>{IMPROVE_MSGS[msgIdx]}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Live transcript */}
      {listening && liveText && (
        <div className="card px-5 py-3 text-center border-2 border-red-100 animate-pop">
          <p className="text-purple-700 font-bold text-lg leading-snug">{liveText}</p>
        </div>
      )}

      {/* Improve */}
      <button
        onMouseDown={startFeedback}
        onTouchStart={(e) => { e.preventDefault(); startFeedback(); }}
        disabled={improving}
        className={`w-full py-5 rounded-3xl font-black text-xl transition-all select-none flex items-center gap-3 px-6
          ${improving ? "bg-purple-100 text-purple-400 cursor-not-allowed justify-center" :
            listening  ? "bg-red-500 text-white shadow-lg justify-start" :
            "shimmer-btn text-white shadow-lg hover:opacity-90 active:scale-95 justify-center"}`}
      >
        <Wand2 size={26} strokeWidth={2} className="shrink-0"/>
        <span>{improving ? "משפרת..." : listening ? (liveText || "מקשיבה...") : "שפרי את הציור"}</span>
      </button>

      {/* Action buttons */}
      <div className={`grid gap-3 ${history.length > 0 ? "grid-cols-4" : "grid-cols-3"}`}>

        {/* Undo — only when history exists */}
        {history.length > 0 && (
          <button onClick={undo}
            className="card py-5 flex flex-col items-center gap-2 hover:shadow-lg transition-all active:scale-95 border-2 border-purple-100">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center">
              <Undo2 size={22} className="text-purple-600" strokeWidth={2}/>
            </div>
            <span className="text-xs font-black text-purple-600">בטלי</span>
          </button>
        )}

        <a href={imageUrl} download="sparkids.png"
          className="card py-5 flex flex-col items-center gap-2 hover:shadow-lg transition-all active:scale-95">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center">
            <Download size={22} className="text-emerald-600" strokeWidth={2}/>
          </div>
          <span className="text-xs font-black text-emerald-600">שמור</span>
        </a>

        <button onClick={onShare}
          className="card py-5 flex flex-col items-center gap-2 hover:shadow-lg transition-all active:scale-95">
          <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center">
            <Share2 size={22} className="text-orange-500" strokeWidth={2}/>
          </div>
          <span className="text-xs font-black text-orange-500">שתף</span>
        </button>

        <button onClick={onReset}
          className="card py-5 flex flex-col items-center gap-2 hover:shadow-lg transition-all active:scale-95">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center">
            <Sparkles size={22} className="text-purple-600" strokeWidth={2}/>
          </div>
          <span className="text-xs font-black text-purple-600">חדש</span>
        </button>

      </div>
    </div>
  );
}
