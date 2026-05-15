import { useRef, useState } from "react";
import { Camera, Images, X } from "lucide-react";
import CameraCapture from "./CameraCapture";

export default function PhotoInput({ onPhoto }) {
  const galleryRef = useRef(null);
  const [preview, setPreview]   = useState(null);
  const [showCam, setShowCam]   = useState(false);

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setPreview(ev.target.result); onPhoto(ev.target.result); };
    reader.readAsDataURL(file);
  }

  function handleCapture(dataUrl) {
    setShowCam(false);
    setPreview(dataUrl);
    onPhoto(dataUrl);
  }

  function clear() {
    setPreview(null); onPhoto(null);
    if (galleryRef.current) galleryRef.current.value = "";
  }

  if (preview) return (
    <div className="card overflow-hidden relative animate-pop">
      <img src={preview} alt="תמונה" className="w-full"/>
      <button onClick={clear}
        className="absolute top-3 left-3 w-9 h-9 bg-white/90 shadow rounded-full flex items-center justify-center text-gray-400 hover:text-red-400 transition-all">
        <X size={14}/>
      </button>
      <p className="text-center text-purple-600 font-bold py-3 text-lg">✓ עכשיו דברי!</p>
    </div>
  );

  return (
    <>
      {showCam && <CameraCapture onCapture={handleCapture} onClose={() => setShowCam(false)}/>}

      <div className="grid grid-cols-2 gap-4 animate-pop">
        {/* Real camera */}
        <button onClick={() => setShowCam(true)}
          className="card p-8 flex flex-col items-center gap-3 hover:shadow-xl transition-all active:scale-95 select-none w-full">
          <Camera size={52} className="text-purple-500" strokeWidth={1.5}/>
          <span className="text-purple-700 font-black">צלמי</span>
        </button>

        {/* Gallery */}
        <label className="cursor-pointer">
          <div className="card p-8 flex flex-col items-center gap-3 hover:shadow-xl transition-all active:scale-95 select-none">
            <Images size={52} className="text-pink-500" strokeWidth={1.5}/>
            <span className="text-purple-700 font-black">גלריה</span>
          </div>
          <input ref={galleryRef} type="file" accept="image/*" onChange={handleFile} className="hidden"/>
        </label>
      </div>
    </>
  );
}
