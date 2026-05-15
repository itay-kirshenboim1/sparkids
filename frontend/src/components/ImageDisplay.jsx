import { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function ImageDisplay({ imageUrl, promptUsed, onShare, onReset, onImproved }) {
  const [improving, setImproving] = useState(false);
  const [listening, setListening] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");

  function startFeedback() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR();
    r.lang = "he-IL";
    r.interimResults = true;
    r.continuous = true;
    r.onresult = (e) => {
      let text = "";
      for (const res of e.results) text += res[0].transcript;
      setFeedbackText(text);
    };
    r.onend = async () => {
      setListening(false);
      if (feedbackText.trim().length < 1) return;
      setImproving(true);
      try {
        const { data } = await axios.post(`${API}/paint/improve`, {
          feedback: feedbackText,
          previous_prompt: promptUsed,
          kid_name: "Carmel",
        });
        onImproved(data);
      } finally {
        setImproving(false);
        setFeedbackText("");
      }
    };
    setListening(true);
    setFeedbackText("");
    r.start();
    setTimeout(() => r.stop(), 8000); // auto-stop after 8s
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-lg" dir="rtl">
      <p className="text-3xl font-bold text-purple-700">🎉 !הציור שלך מוכן</p>
      <img src={imageUrl} alt="ציור של כרמל" className="rounded-3xl w-full shadow-2xl border-4 border-purple-300" />

      {/* Feedback voice button */}
      {!improving && (
        <button
          onMouseDown={startFeedback}
          onTouchStart={(e) => { e.preventDefault(); startFeedback(); }}
          className={`w-full py-4 rounded-2xl font-bold text-xl transition-all ${
            listening ? "bg-red-400 animate-pulse text-white" : "bg-yellow-400 hover:bg-yellow-500 text-white"
          }`}
        >
          {listening ? `🎧 ${feedbackText || "מקשיבה..."}` : "🗣️ שפרי את הציור בקול"}
        </button>
      )}
      {improving && (
        <div className="w-full py-4 rounded-2xl bg-purple-200 text-purple-700 font-bold text-xl text-center animate-pulse">
          ✨ משפרת את הציור...
        </div>
      )}

      <div className="flex gap-3 w-full">
        <a
          href={imageUrl}
          download="carmel-painting.png"
          className="flex-1 text-center bg-green-400 hover:bg-green-500 text-white font-bold text-lg rounded-2xl py-3 transition-all"
        >
          💾 שמור
        </a>
        <button onClick={onShare} className="flex-1 bg-orange-400 hover:bg-orange-500 text-white font-bold text-lg rounded-2xl py-3 transition-all">
          📤 שתף
        </button>
        <button onClick={onReset} className="flex-1 bg-purple-400 hover:bg-purple-500 text-white font-bold text-lg rounded-2xl py-3 transition-all">
          🎤 ציור חדש
        </button>
      </div>
    </div>
  );
}
