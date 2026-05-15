import { useState } from "react";
import VoiceInput from "./components/VoiceInput";
import ImageDisplay from "./components/ImageDisplay";
import ShareModal from "./components/ShareModal";
import PhotoInput from "./components/PhotoInput";
import LoadingScreen from "./components/LoadingScreen";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

const BG_DECO = [
  { e:"🌸", top:5,  left:5,  size:2.8, dur:3.8, delay:0   },
  { e:"⭐", top:12, left:80, size:2.2, dur:4.2, delay:0.5 },
  { e:"🦋", top:22, left:15, size:3.0, dur:5.0, delay:1.0 },
  { e:"🌺", top:35, left:88, size:2.5, dur:4.5, delay:0.3 },
  { e:"✨", top:48, left:3,  size:2.0, dur:3.2, delay:1.5 },
  { e:"🌙", top:55, left:75, size:2.8, dur:4.8, delay:0.8 },
  { e:"🎀", top:65, left:20, size:3.2, dur:3.5, delay:0.2 },
  { e:"💫", top:72, left:60, size:2.3, dur:4.0, delay:1.2 },
  { e:"🌷", top:82, left:8,  size:2.6, dur:5.2, delay:0.7 },
  { e:"🦄", top:88, left:85, size:3.0, dur:3.9, delay:1.8 },
  { e:"🍭", top:30, left:50, size:2.0, dur:4.3, delay:0.4 },
  { e:"🌟", top:60, left:40, size:2.4, dur:3.6, delay:2.0 },
];

export default function App() {
  const [status, setStatus] = useState("idle");
  const [transcript, setTranscript] = useState("");
  const [result, setResult] = useState(null);
  const [shareData, setShareData] = useState(null);
  const [mode, setMode] = useState("voice");
  const [photo, setPhoto] = useState(null);

  async function handleTranscript(text) {
    if (!text) { setStatus("idle"); return; }
    setTranscript(text);
    setStatus("loading");
    try {
      const payload = { idea: text, kid_name: "Carmel" };
      if (photo) payload.photo = photo;
      const { data } = await axios.post(`${API}/paint/`, payload);
      setResult(data);
      setStatus("done");
    } catch {
      setStatus("idle");
    }
  }

  async function handleShare() {
    if (!result) return;
    const { data } = await axios.post(`${API}/share/`, {
      kid_name: "Carmel",
      image_url: result.image_url,
      prompt_used: result.prompt_used,
    });
    setShareData(data);
  }

  function reset() {
    setStatus("idle");
    setTranscript("");
    setResult(null);
    setShareData(null);
    setPhoto(null);
  }

  const isIdle = status === "idle";
  const isLoading = status === "loading";
  const isDone = status === "done";

  return (
    <div className="min-h-screen flex flex-col items-center pb-16 relative overflow-hidden" dir="rtl">

      {/* Animated background decorations */}
      {BG_DECO.map((d, i) => (
        <span
          key={i}
          className="fixed select-none pointer-events-none deco"
          style={{
            top: `${d.top}%`,
            left: `${d.left}%`,
            fontSize: `${d.size}rem`,
            opacity: 0.22,
            "--dur": `${d.dur}s`,
            "--delay": `${d.delay}s`,
          }}
        >
          {d.e}
        </span>
      ))}

      {/* Header */}
      <div className="w-full bg-white/80 backdrop-blur-sm shadow-sm px-6 py-4 flex items-center justify-between mb-6 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 shimmer-btn rounded-xl flex items-center justify-center text-xl">🎨</div>
          <span className="text-2xl font-black text-purple-700">Sparkids</span>
        </div>
        <div className="text-right">
          <p className="text-xl font-black text-purple-700">כרמל 👑</p>
        </div>
      </div>

      <div className="w-full max-w-md px-4 flex flex-col gap-5 relative z-10">

        {/* Hero */}
        {isIdle && (
          <div className="text-center animate-pop pt-2">
            <p className="text-4xl font-black text-purple-800 leading-tight">מה תרצי<br/>לצייר היום?</p>
          </div>
        )}

        {/* Mode toggle */}
        {isIdle && (
          <div className="card p-1.5 flex gap-1">
            {[["voice","🎤","רק קול"],["photo","📸","תמונה + קול"]].map(([m, icon, label]) => (
              <button key={m}
                onClick={() => { setMode(m); setPhoto(null); }}
                className={`flex-1 py-2.5 rounded-xl font-bold text-base transition-all duration-200 ${
                  mode === m ? "bg-purple-600 text-white shadow-md" : "text-gray-400 hover:text-purple-500"
                }`}>
                {icon} {label}
              </button>
            ))}
          </div>
        )}

        {/* Photo upload */}
        {mode === "photo" && isIdle && <PhotoInput onPhoto={setPhoto} />}

        {/* Voice button */}
        {!isDone && (
          <VoiceInput
            status={status}
            onTranscript={handleTranscript}
            onListening={() => setStatus("listening")}
            disabled={mode === "photo" && !photo}
          />
        )}

        {/* What Carmel said — only the text, no label */}
        {transcript && !isLoading && !isDone && (
          <div className="card px-6 py-4 text-center animate-pop">
            <p className="text-2xl font-black text-purple-700">"{transcript}"</p>
          </div>
        )}

        {/* Funny loading */}
        {isLoading && <LoadingScreen />}

        {/* Result */}
        {isDone && result && (
          <ImageDisplay
            imageUrl={result.image_url}
            promptUsed={result.prompt_used}
            onShare={handleShare}
            onReset={reset}
            onImproved={(data) => setResult(data)}
          />
        )}

      </div>

      {shareData && <ShareModal shareData={shareData} onClose={() => setShareData(null)} />}
    </div>
  );
}
