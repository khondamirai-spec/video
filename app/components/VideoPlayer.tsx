'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { Video, recordVideoView, getVideoViewCount } from '@/lib/supabase'

interface VideoPlayerProps {
  video: Video
  onClose: () => void
  onViewCounted: (newCount: number) => void
}

const MIN_WATCH_SECONDS = 3 // Minimum seconds to count as a view

export default function VideoPlayer({ video, onClose, onViewCounted }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const [watchTime, setWatchTime] = useState(0)
  const [hasCountedView, setHasCountedView] = useState(false)
  const [showViewNotice, setShowViewNotice] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [showLikeAnimation, setShowLikeAnimation] = useState(false)
  const watchTimeRef = useRef(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Load like state from localStorage
  useEffect(() => {
    const likedVideos = JSON.parse(localStorage.getItem('likedVideos') || '[]')
    setIsLiked(likedVideos.includes(video.id))
  }, [video.id])

  // Handle like toggle
  const handleLike = useCallback(() => {
    const likedVideos = JSON.parse(localStorage.getItem('likedVideos') || '[]')
    
    if (isLiked) {
      // Unlike
      const newLiked = likedVideos.filter((id: string) => id !== video.id)
      localStorage.setItem('likedVideos', JSON.stringify(newLiked))
      setIsLiked(false)
    } else {
      // Like
      likedVideos.push(video.id)
      localStorage.setItem('likedVideos', JSON.stringify(likedVideos))
      setIsLiked(true)
      setShowLikeAnimation(true)
      setTimeout(() => setShowLikeAnimation(false), 1000)
    }
  }, [isLiked, video.id])

  // Handle double tap to like
  const lastTapRef = useRef(0)
  const handleVideoTap = useCallback(() => {
    const now = Date.now()
    if (now - lastTapRef.current < 300) {
      // Double tap detected - like the video
      if (!isLiked) {
        handleLike()
      } else {
        // Show animation even if already liked
        setShowLikeAnimation(true)
        setTimeout(() => setShowLikeAnimation(false), 1000)
      }
    }
    lastTapRef.current = now
  }, [isLiked, handleLike])

  // Track watch time while video is playing
  useEffect(() => {
    const videoElement = videoRef.current
    if (!videoElement) return

    function handlePlay() {
      intervalRef.current = setInterval(() => {
        watchTimeRef.current += 1
        setWatchTime(watchTimeRef.current)
      }, 1000)
    }

    function handlePause() {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    function handleEnded() {
      handlePause()
    }

    videoElement.addEventListener('play', handlePlay)
    videoElement.addEventListener('pause', handlePause)
    videoElement.addEventListener('ended', handleEnded)

    return () => {
      videoElement.removeEventListener('play', handlePlay)
      videoElement.removeEventListener('pause', handlePause)
      videoElement.removeEventListener('ended', handleEnded)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // Check if view should be counted
  useEffect(() => {
    async function checkAndCountView() {
      if (watchTime >= MIN_WATCH_SECONDS && !hasCountedView) {
        const counted = await recordVideoView(video.id, watchTime)
        if (counted) {
          setHasCountedView(true)
          setShowViewNotice(true)
          setTimeout(() => setShowViewNotice(false), 2000)
          
          // Fetch updated view count
          const newCount = await getVideoViewCount(video.id)
          onViewCounted(newCount)
        }
      }
    }
    
    checkAndCountView()
  }, [watchTime, hasCountedView, video.id, onViewCounted])

  // Close on escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // Close on backdrop click
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === modalRef.current) {
      onClose()
    }
  }, [onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div className="modal-backdrop" ref={modalRef} onClick={handleBackdropClick}>
      <div className="modal-content">
        <button className="close-button" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>

        <div className="video-wrapper" onClick={handleVideoTap}>
          <video
            ref={videoRef}
            src={video.video_url}
            controls
            autoPlay
            playsInline
            className="video-element"
          >
            Your browser does not support the video tag.
          </video>

          {/* Aesthetic SVG Watermark Overlay */}
          <div className="watermark-overlay">
            <svg viewBox="0 0 200 100" className="watermark-svg">
              <defs>
                <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff6b9d" />
                  <stop offset="50%" stopColor="#c44fff" />
                  <stop offset="100%" stopColor="#6b5bff" />
                </linearGradient>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="1" result="blur"/>
                  <feMerge>
                    <feMergeNode in="blur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Background shape */}
              <rect 
                x="5" 
                y="10" 
                width="190" 
                height="80" 
                rx="12" 
                ry="12" 
                fill="rgba(0,0,0,0.35)" 
                stroke="url(#textGradient)" 
                strokeWidth="1.5"
                opacity="0.9"
              />
              
              {/* Main brand text - AST */}
              <text 
                x="20" 
                y="42" 
                className="watermark-text-main"
                fill="url(#textGradient)"
                filter="url(#glow)"
              >
                ast
              </text>
              
              {/* Stylized H with special treatment */}
              <text 
                x="85" 
                y="42" 
                className="watermark-text-accent"
                fill="#ffffff"
                filter="url(#softGlow)"
              >
                H
              </text>
              
              {/* ETIK text */}
              <text 
                x="20" 
                y="75" 
                className="watermark-text-sub"
                fill="rgba(255,255,255,0.9)"
                filter="url(#softGlow)"
              >
                etik
              </text>
              
              {/* OTK text */}
              <text 
                x="100" 
                y="75" 
                className="watermark-text-highlight"
                fill="url(#textGradient)"
                filter="url(#glow)"
              >
                otk
              </text>

              {/* Decorative elements */}
              <circle cx="175" cy="30" r="8" fill="url(#textGradient)" opacity="0.6"/>
              <circle cx="175" cy="30" r="4" fill="#ffffff" opacity="0.9"/>
              <line x1="110" y1="35" x2="165" y2="35" stroke="url(#textGradient)" strokeWidth="2" opacity="0.5"/>
            </svg>
          </div>
          
          {/* Double-tap like animation */}
          {showLikeAnimation && (
            <div className="double-tap-heart">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          )}
        </div>

        {/* Instagram-style action buttons */}
        <div className="action-buttons">
          <button 
            className={`like-button ${isLiked ? 'liked' : ''}`} 
            onClick={handleLike}
            aria-label={isLiked ? 'Unlike' : 'Like'}
          >
            {isLiked ? (
              <svg className="heart-icon filled" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ) : (
              <svg className="heart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            )}
          </button>
        </div>

        <div className="video-info">
          <h2 className="video-title">{video.title}</h2>
          {video.description && (
            <p className="video-description">{video.description}</p>
          )}
          <div className="video-stats">
            <span className="view-badge">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
              </svg>
              {video.view_count} views
            </span>
            {!hasCountedView && watchTime < MIN_WATCH_SECONDS && (
              <span className="watch-progress">
                Watch {MIN_WATCH_SECONDS - watchTime}s more to count view
              </span>
            )}
          </div>
        </div>

        {showViewNotice && (
          <div className="view-notice">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            View counted!
          </div>
        )}
      </div>
    </div>
  )
}

