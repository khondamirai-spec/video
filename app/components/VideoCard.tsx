'use client'

import { useState, useEffect } from 'react'
import { Video } from '@/lib/supabase'

interface VideoCardProps {
  video: Video
  onClick: () => void
}

function formatViewCount(count: number): string {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  }
  return count.toString()
}

function formatLikeCount(count: number): string {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  }
  return count.toString()
}

// Generate random like count based on video id for consistency
function getInitialLikes(videoId: string): number {
  let hash = 0
  for (let i = 0; i < videoId.length; i++) {
    const char = videoId.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash % 50000) + 1000
}

export default function VideoCard({ video, onClick }: VideoCardProps) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    // Check localStorage for like state
    const storedLikes = localStorage.getItem(`video_like_${video.id}`)
    if (storedLikes) {
      setLiked(true)
    }
    // Set initial like count
    setLikeCount(getInitialLikes(video.id))
  }, [video.id])

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!liked) {
      setLiked(true)
      setLikeCount(prev => prev + 1)
      setAnimating(true)
      localStorage.setItem(`video_like_${video.id}`, 'true')
      setTimeout(() => setAnimating(false), 600)
    } else {
      setLiked(false)
      setLikeCount(prev => prev - 1)
      localStorage.removeItem(`video_like_${video.id}`)
    }
  }

  return (
    <div className="video-card" onClick={onClick}>
      <div className="thumbnail-container">
        <img
          src={video.thumbnail_url}
          alt={video.title}
          className="thumbnail"
          loading="lazy"
        />
        <div className="overlay">
          <svg className="play-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        
        {/* Like Button */}
        <button 
          className={`card-like-btn ${liked ? 'liked' : ''} ${animating ? 'animating' : ''}`}
          onClick={handleLike}
          aria-label={liked ? 'Unlike' : 'Like'}
        >
          <svg 
            className="card-heart-icon" 
            viewBox="0 0 24 24" 
            fill={liked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={liked ? "0" : "2"}
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <span className="like-count-text">{formatLikeCount(likeCount)}</span>
        </button>

        {/* View Count */}
        <div className="view-count">
          <svg className="view-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
          </svg>
          <span>{formatViewCount(video.view_count)}</span>
        </div>
      </div>
    </div>
  )
}

