import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Video {
  id: string
  title: string
  description: string | null
  thumbnail_url: string
  video_url: string
  view_count: number
  duration_seconds: number
  created_at: string
}

// Generate a unique session ID for view tracking
export function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  
  let sessionId = sessionStorage.getItem('video_session_id')
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    sessionStorage.setItem('video_session_id', sessionId)
  }
  return sessionId
}

// Fetch all videos
export async function getVideos(): Promise<Video[]> {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching videos:', error)
    return []
  }
  
  return data || []
}

// Record a video view (only counted after minimum watch time)
export async function recordVideoView(
  videoId: string,
  watchDuration: number
): Promise<boolean> {
  const sessionId = getSessionId()
  
  const { data, error } = await supabase.rpc('record_video_view', {
    p_video_id: videoId,
    p_session_id: sessionId,
    p_watch_duration: Math.floor(watchDuration)
  })
  
  if (error) {
    console.error('Error recording view:', error)
    return false
  }
  
  return data as boolean
}

// Get updated view count for a video
export async function getVideoViewCount(videoId: string): Promise<number> {
  const { data, error } = await supabase
    .from('videos')
    .select('view_count')
    .eq('id', videoId)
    .single()
  
  if (error) {
    console.error('Error fetching view count:', error)
    return 0
  }
  
  return data?.view_count || 0
}

