import { useState, useRef, useEffect } from "react";

export default function MusicPlayer() {
  const [videoUrl, setVideoUrl] = useState("");
  const [audioSrc, setAudioSrc] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef(null);

  const fetchAudio = async () => {
    if (!videoUrl.includes("youtube.com") && !videoUrl.includes("youtu.be")) {
      alert("Invalid YouTube URL!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://y2b-dl-server-production.up.railway.app/get-audio?url=${videoUrl}`
      );
      const data = await response.json();
      setAudioSrc(data.audioUrl);
    } catch (error) {
      alert("Error fetching audio");
    }
    setLoading(false);
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleProgress = () => {
    if (audioRef.current) {
      const percent =
        (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(percent);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("timeupdate", handleProgress);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", handleProgress);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-4">🎵 YouTube Music Player</h1>
      <input
        type="text"
        placeholder="Paste YouTube URL here..."
        className="p-2 text-black rounded w-80 mb-2"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
      />
      <button
        onClick={fetchAudio}
        className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? "Fetching..." : "Get Audio"}
      </button>

      {audioSrc && (
        <div className="mt-4 w-80 bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col items-center">
          <audio ref={audioRef} src={audioSrc} onEnded={() => setIsPlaying(false)} />
          <button
            onClick={togglePlay}
            className="bg-green-500 px-6 py-2 rounded-full text-lg hover:bg-green-600 my-2"
          >
            {isPlaying ? "Pause ⏸" : "Play ▶"}
          </button>

          {/* Progress Bar */}
          <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden mt-2">
            <div
              className="h-2 bg-blue-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center mt-2">
            <span className="text-sm mr-2">🔉</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-40"
            />
          </div>
        </div>
      )}
    </div>
  );
}
