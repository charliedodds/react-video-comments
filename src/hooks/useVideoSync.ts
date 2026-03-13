import { useEffect, useRef, type RefObject } from 'react'
import { useVideoCommentContext } from '../components/VideoCommentProvider'

/**
 * Syncs a native HTMLVideoElement with the VideoComment context.
 *
 * - Forwards timeupdate and durationchange events into context state.
 * - Responds to seekTo() calls from the context by seeking the video element.
 *
 * @example
 * const videoRef = useRef<HTMLVideoElement>(null);
 * useVideoSync(videoRef);
 * return <video ref={videoRef} src="..." />;
 */
export function useVideoSync(ref: RefObject<HTMLVideoElement | null>): void {
  const { setCurrentTime, setDuration, setIsPlaying, currentTime } =
    useVideoCommentContext()

  const lastSeekTime = useRef<number>(currentTime)

  useEffect(() => {
    const video = ref.current
    if (!video) return

    const onTimeUpdate = () => setCurrentTime(video.currentTime)
    const onDurationChange = () => {
      if (isFinite(video.duration)) setDuration(video.duration)
    }
    const onLoadedMetadata = () => {
      if (isFinite(video.duration)) setDuration(video.duration)
    }
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onEnded = () => setIsPlaying(false)

    video.addEventListener('timeupdate', onTimeUpdate)
    video.addEventListener('durationchange', onDurationChange)
    video.addEventListener('loadedmetadata', onLoadedMetadata)
    video.addEventListener('play', onPlay)
    video.addEventListener('pause', onPause)
    video.addEventListener('ended', onEnded)

    if (video.readyState >= 1 && isFinite(video.duration)) {
      setDuration(video.duration)
    }

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate)
      video.removeEventListener('durationchange', onDurationChange)
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
      video.removeEventListener('play', onPlay)
      video.removeEventListener('pause', onPause)
      video.removeEventListener('ended', onEnded)
    }
  }, [ref, setCurrentTime, setDuration, setIsPlaying])

  useEffect(() => {
    const video = ref.current
    if (!video) return

    const delta = Math.abs(video.currentTime - currentTime)
    if (delta > 0.5 && currentTime !== lastSeekTime.current) {
      video.currentTime = currentTime
    }
    lastSeekTime.current = currentTime
  }, [ref, currentTime])
}
