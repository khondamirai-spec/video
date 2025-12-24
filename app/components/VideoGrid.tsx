'use client'

import { useState, useEffect } from 'react'
import { Video, getVideos } from '@/lib/supabase'
import VideoCard from './VideoCard'
import VideoPlayer from './VideoPlayer'

export default function VideoGrid() {
  const [videos, setVideos] = useState<Video[]>([])
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadVideos()
  }, [])

  async function loadVideos() {
    setLoading(true)
    const data = await getVideos()
    setVideos(data)
    setLoading(false)
  }

  function handleVideoClick(video: Video) {
    setSelectedVideo(video)
  }

  function handleClosePlayer() {
    setSelectedVideo(null)
    // Refresh videos to get updated view counts
    loadVideos()
  }

  function updateVideoViewCount(videoId: string, newCount: number) {
    setVideos(prev => 
      prev.map(v => v.id === videoId ? { ...v, view_count: newCount } : v)
    )
  }

  if (loading) {
    return (
      <div className="grid-container">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="skeleton" />
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="grid-container">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onClick={() => handleVideoClick(video)}
          />
        ))}
      </div>

      {selectedVideo && (
        <VideoPlayer
          video={selectedVideo}
          onClose={handleClosePlayer}
          onViewCounted={(newCount) => updateVideoViewCount(selectedVideo.id, newCount)}
        />
      )}
    </>
  )
}

