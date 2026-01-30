'use client'

import { useState, useRef, useMemo } from 'react'
import Link from 'next/link'

interface Video {
  id: string
  title: string
  video_url: string
  thumbnail_url: string
  description?: string
}

const R2_BASE_URL = 'https://pub-7f4e732999f740a39783172c306c439c.r2.dev'

// Videos from Cloudflare R2
const mockVideos: Video[] = [
  {
    id: '1',
    title: 'Ustoz AI Natija 1',
    video_url: 'https://pub-7f4e732999f740a39783172c306c439c.r2.dev/q1.mp4',
    thumbnail_url: '/1.png',
  },
  {
    id: '2',
    title: 'Ustoz AI Natija 2',
    video_url: 'https://pub-7f4e732999f740a39783172c306c439c.r2.dev/q2.mp4',
    thumbnail_url: '/3.png',
  },
  {
    id: '3',
    title: 'Ustoz AI Natija 3',
    video_url: 'https://pub-7f4e732999f740a39783172c306c439c.r2.dev/q3.mp4',
    thumbnail_url: '/4.png',
  },
  {
    id: '4',
    title: 'Ustoz AI Natija 4',
    video_url: 'https://pub-7f4e732999f740a39783172c306c439c.r2.dev/IMG_1276.MP4',
    thumbnail_url: '/2.png',
  },
]

// Group videos into pages of 4 (2x2 grid)
function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

export default function VideosPage() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Split videos into pages of 4
  const videoPages = useMemo(() => chunkArray(mockVideos, 4), [])

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play()
        setIsPaused(false)
      } else {
        videoRef.current.pause()
        setIsPaused(true)
      }
    }
  }

  const handleCloseVideo = () => {
    setSelectedVideo(null)
    setIsPaused(false)
  }

  return (
    <main className="swipe-container">
      <Link href="/" className="videos-back-button" aria-label="Go back">
        <svg style={{ width: '1.25rem', height: '1.25rem', flexShrink: 0 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </Link>

      <h1 className="videos-title">Ustoz AI orqali daromad topganlar</h1>

      {videoPages.map((pageVideos, pageIndex) => (
        <section key={pageIndex} className="video-page">
          <div className="grid-2x2">
            {pageVideos.map((video) => (
              <div
                key={video.id}
                className="video-card"
                onClick={() => setSelectedVideo(video)}
              >
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
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {selectedVideo && (
        <div
          className="modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseVideo()
            }
          }}
        >
          <div className="modal-content">
            <Link href="/" className="back-button" aria-label="Go back">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </Link>

            <div className="video-wrapper" onClick={togglePlayPause}>
              <video
                ref={videoRef}
                src={selectedVideo.video_url}
                autoPlay
                loop
                playsInline
                className="video-element"
              >
                Your browser does not support the video tag.
              </video>

              {isPaused && (
                <div className="pause-overlay">
                  <div className="play-button-large">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

