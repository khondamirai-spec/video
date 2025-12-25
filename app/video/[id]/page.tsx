"use client";

import { useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

const VIDEO_URL =
  "https://pub-7f4e732999f740a39783172c306c439c.r2.dev/666666666666666666666666666.mp4";

export default function VideoPlayer() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(false);

  const togglePlayPause = useCallback(() => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    
    // Show controls briefly when toggling
    setShowControls(true);
    setTimeout(() => setShowControls(false), 1500);
  }, []);

  const handleBack = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      router.back();
    },
    [router]
  );

  return (
    <div
      className="video-player-container"
      onClick={togglePlayPause}
    >
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="absolute left-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition-transform hover:scale-110 active:scale-95"
        aria-label="Go back"
      >
        <svg
          className="h-6 w-6 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </button>

      {/* Video Element */}
      <video
        ref={videoRef}
        className="h-full w-full object-contain"
        src={VIDEO_URL}
        autoPlay
        playsInline
        loop
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Play/Pause Overlay */}
      <div
        className={`play-pause-overlay ${
          !isPlaying || showControls ? "visible" : ""
        }`}
      >
        <div className="play-pause-button">
          {isPlaying ? (
            <svg
              className="h-12 w-12 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg
              className="h-12 w-12 text-white ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}

