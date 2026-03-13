import {
  useRef,
  useState,
  useCallback,
  useEffect,
  forwardRef,
  useImperativeHandle,
  type VideoHTMLAttributes,
  type CSSProperties,
} from 'react'
import { useVideoSync } from '@/hooks/useVideoSync'
import { useVideoCommentContext } from '@/components/VideoCommentProvider'
import { VideoCommentTimeline } from '@/components/VideoCommentTimeline'
import {
  PlayIcon,
  PauseIcon,
  VolumeIcon,
  FullscreenIcon,
} from '@/components/VideoCommentIcons'
import { formatTime } from '@/utils/helpers'
import { overlayIconButtonStyles } from '../styles'

export interface VideoCommentVideoProps extends Omit<
  VideoHTMLAttributes<HTMLVideoElement>,
  'controls'
> {
  videoTitle?: string
  wrapperClassName?: string
  wrapperStyle?: CSSProperties
}

const AUTO_HIDE_DELAY = 3000

export const VideoCommentVideo = forwardRef<
  HTMLVideoElement,
  VideoCommentVideoProps
>(({ wrapperClassName, wrapperStyle, style, ...videoProps }, externalRef) => {
  const internalRef = useRef<HTMLVideoElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const {
    comments,
    isPlaying,
    currentTime,
    duration,
    isShowingSidebar,
    setIsShowingSidebar,
  } = useVideoCommentContext()
  const [controlsVisible, setControlsVisible] = useState(true)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useImperativeHandle(externalRef, () => internalRef.current!)
  useVideoSync(internalRef)

  const scheduleHide = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    hideTimerRef.current = setTimeout(
      () => setControlsVisible(false),
      AUTO_HIDE_DELAY
    )
  }, [])

  const showControls = useCallback(() => {
    setControlsVisible(true)
    if (isPlaying) scheduleHide()
  }, [isPlaying, scheduleHide])

  useEffect(() => {
    if (!isPlaying) {
      setControlsVisible(true)
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    } else {
      scheduleHide()
    }
  }, [isPlaying, scheduleHide])

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    }
  }, [])

  useEffect(() => {
    const onFullscreenChange = () =>
      setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () =>
      document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [])

  const togglePlay = useCallback(() => {
    const video = internalRef.current
    if (!video) return
    if (video.paused) video.play()
    else video.pause()
  }, [])

  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const video = internalRef.current
      if (!video) return
      const val = parseFloat(e.target.value)
      video.volume = val
      video.muted = val === 0
      setVolume(val)
      setMuted(val === 0)
    },
    []
  )

  const toggleMute = useCallback(() => {
    const video = internalRef.current
    if (!video) return
    video.muted = !video.muted
    setMuted(video.muted)
  }, [])

  const toggleFullscreen = useCallback(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    if (!document.fullscreenElement) wrapper.requestFullscreen()
    else document.exitFullscreen()
  }, [])

  const handleTap = useCallback(() => {
    if (!controlsVisible) showControls()
    else if (isPlaying) togglePlay()
  }, [controlsVisible, isPlaying, showControls, togglePlay])

  const showSidebar = useCallback(() => {
    setIsShowingSidebar(true)
  }, [setIsShowingSidebar])

  return (
    <div
      ref={wrapperRef}
      className={wrapperClassName}
      onMouseMove={showControls}
      onMouseLeave={() => isPlaying && setControlsVisible(false)}
      onTouchStart={handleTap}
      style={{
        position: 'relative',
        width: '100%',
        maxHeight: 'var(--rvc-video-max-height)',
        background: '#000',
        cursor: controlsVisible ? 'default' : 'none',
        userSelect: 'none',
        ...wrapperStyle,
      }}
    >
      <video
        ref={internalRef}
        preload="metadata"
        onClick={togglePlay}
        style={{
          width: '100%',
          maxHeight: 'var(--rvc-video-max-height)',
          display: 'block',
          ...style,
        }}
        {...videoProps}
      />

      {!isShowingSidebar && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            padding: '1rem',
            background: 'var(--rvc-overlay-gradient-top)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.4rem',
            opacity: controlsVisible ? 1 : 0,
            transition: 'opacity 0.25s ease',
            pointerEvents: controlsVisible ? 'auto' : 'none',
          }}
        >
          <button
            style={{
              fontSize: '0.8rem',
              cursor: 'pointer',
              color: 'var(--rvc-overlay-fg)',
            }}
            onClick={showSidebar}
          >
            View comments {comments.length > 0 && `(${comments.length})`}
          </button>
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '0.5rem 0.75rem 0.75rem',
          background: 'var(--rvc-overlay-gradient-bottom)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem',
          opacity: controlsVisible ? 1 : 0,
          transition: 'opacity 0.25s ease',
          pointerEvents: controlsVisible ? 'auto' : 'none',
        }}
      >
        <VideoCommentTimeline />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={togglePlay}
            style={overlayIconButtonStyles}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>

          <span
            style={{
              fontSize: '0.75rem',
              color: 'var(--rvc-overlay-fg)',
              fontVariantNumeric: 'tabular-nums',
              flexShrink: 0,
            }}
          >
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <div style={{ flex: 1 }} />

          <button
            onClick={toggleMute}
            style={overlayIconButtonStyles}
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            <VolumeIcon muted={muted} level={volume} />
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={muted ? 0 : volume}
            onChange={handleVolumeChange}
            aria-label="Volume"
            style={{
              width: 64,
              accentColor: 'var(--rvc-overlay-fg)',
              cursor: 'pointer',
            }}
          />

          <button
            onClick={toggleFullscreen}
            style={overlayIconButtonStyles}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            <FullscreenIcon isFullscreen={isFullscreen} />
          </button>
        </div>
      </div>
    </div>
  )
})

VideoCommentVideo.displayName = 'VideoCommentVideo'
