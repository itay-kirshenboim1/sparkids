import { useRef, useState } from "react";

export default function PhotoInput({ onPhoto }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target.result);
      onPhoto(ev.target.result); // base64 data URL
    };
    reader.readAsDataURL(file);
  }

  function clear() {
    setPreview(null);
    onPhoto(null);
    inputRef.current.value = "";
  }

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-lg">
      {!preview ? (
        <label className="w-full cursor-pointer">
          <div className="border-4 border-dashed border-purple-300 rounded-3xl p-8 text-center bg-white/60 hover:bg-white/80 transition-all">
            <p className="text-5xl mb-2">📸</p>
            <p className="text-purple-600 font-bold text-lg">צלמי תמונה או בחרי מהגלריה</p>
            <p className="text-purple-400 text-sm">לחצי כאן</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFile}
            className="hidden"
          />
        </label>
      ) : (
        <div className="w-full relative">
          <img src={preview} alt="uploaded" className="rounded-3xl w-full shadow-lg border-4 border-purple-300" />
          <button
            onClick={clear}
            className="absolute top-3 left-3 bg-red-400 text-white rounded-full w-10 h-10 text-xl font-bold shadow-lg"
          >
            ✕
          </button>
          <p className="text-center text-purple-600 font-bold mt-2">תמונה נבחרה ✓ עכשיו תגידי מה להוסיף!</p>
        </div>
      )}
    </div>
  );
}
