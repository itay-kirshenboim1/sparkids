import { useEffect, useRef, useState } from "react";
import { X, Camera } from "lucide-react";

export default function CameraCapture({ onCapture, onClose }) {
  const videoRef   = useRef(null);
  const canvasRef  = useRef(null);
  const streamRef  = useRef(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false })
      .then((stream) => {
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setReady(true);
      })
      .catch(() => setError("לא הצלחתי לגשת למצלמה — אפשרי גישה בדפדפן"));
    return () => streamRef.current?.getTracks().forEach(t => t.stop());
  }, []);

  function capture() {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    streamRef.current?.getTracks().forEach(t => t.stop());
    onCapture(dataUrl);
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Close */}
      <button onClick={onClose}
        className="absolute top-4 left-4 z-10 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all">
        <X size={18}/>
      </button>

      {/* Video */}
      <div className="flex-1 relative overflow-hidden">
        <video ref={videoRef} playsInline autoPlay muted
          className="w-full h-full object-cover"/>
        {!ready && !error && (
          <div className="absolute inset-0 flex items-center justify-center text-white text-xl font-bold">
            מפעילה מצלמה...
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center p-8 text-center text-white text-lg font-bold">
            {error}
          </div>
        )}
      </div>

      {/* Capture button */}
      {ready && (
        <div className="pb-10 pt-6 flex justify-center bg-black">
          <button onClick={capture}
            className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-2xl active:scale-95 transition-all">
            <Camera size={36} className="text-purple-600" strokeWidth={1.5}/>
          </button>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden"/>
    </div>
  );
}
