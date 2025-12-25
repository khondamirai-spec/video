"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

const VIDEO_URL =
  "https://pub-7f4e732999f740a39783172c306c439c.r2.dev/666666666666666666666666666.mp4";

export default function VideoPlayer() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTapToPlay, setShowTapToPlay] = useState(false);

  // Attempt autoplay with sound on mount
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const attemptAutoplay = async () => {
      try {
        // Try to play with sound first
        video.muted = false;
        await video.play();
        setIsPlaying(true);
        setShowTapToPlay(false);
      } catch (error) {
        // Autoplay with sound blocked, try muted autoplay
        console.log("Autoplay with sound blocked, trying muted:", error);
        try {
          video.muted = true;
          await video.play();
          setIsPlaying(true);
          setShowTapToPlay(false);
          // Unmute after a tiny delay (works on some browsers)
          setTimeout(() => {
            video.muted = false;
          }, 100);
        } catch (mutedError) {
          // Even muted autoplay blocked, show tap to play
          console.log("Muted autoplay also blocked:", mutedError);
          setShowTapToPlay(true);
        }
      }
    };

    if (video.readyState >= 2) {
      attemptAutoplay();
    } else {
      video.addEventListener("loadeddata", attemptAutoplay, { once: true });
    }

    return () => {
      video.removeEventListener("loadeddata", attemptAutoplay);
    };
  }, []);

  // Play with sound when user taps
  const playWithSound = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      video.muted = false;
      await video.play();
      setIsPlaying(true);
      setShowTapToPlay(false);
    } catch (error) {
      console.log("Play error:", error);
      setShowTapToPlay(true);
    }
  }, []);

  const togglePlayPause = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    // If showing tap to play, play with sound
    if (showTapToPlay) {
      playWithSound();
      return;
    }

    try {
      if (video.paused) {
        await video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    } catch (error) {
      console.log("Play error:", error);
    }
  }, [showTapToPlay, playWithSound]);

  const handleBack = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.stopPropagation();
      e.preventDefault();
      router.back();
    },
    [router]
  );

  return (
    <div
      className="video-player-container"
      onClick={togglePlayPause}
      onTouchEnd={(e) => {
        // Prevent default to avoid double-firing with onClick on iOS
        if (e.target === e.currentTarget) {
          e.preventDefault();
          togglePlayPause();
        }
      }}
    >
      {/* Back Button */}
      <button
        onClick={handleBack}
        onTouchEnd={handleBack}
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
        preload="auto"
        onPlay={() => {
          setIsPlaying(true);
          setShowTapToPlay(false);
        }}
        onPause={() => setIsPlaying(false)}
      />

      {/* Tap to Play Overlay */}
      {showTapToPlay && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <svg
              className="h-10 w-10 text-white ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      {/* Play/Pause Overlay */}
      <div
        className={`play-pause-overlay ${!isPlaying && !showTapToPlay ? "visible" : ""}`}
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


