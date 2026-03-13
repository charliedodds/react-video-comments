import {
  useRef,
  useState,
  useCallback,
  useEffect,
  type FC,
  type MouseEvent,
  type CSSProperties,
} from 'react'
import { useVideoCommentContext } from '@/components/VideoCommentProvider'
import { VideoCommentPopover } from '@/components/VideoCommentPopover'
import { toPercentage, toTimestamp, clusterComments } from '@/utils/helpers'
import type { VideoComment } from '@/types'
import { VideoCommentClusterMarker } from '../VideoCommentClusterMarker'

export interface VideoCommentTimelineProps {
  trackHeight?: number
  markerSize?: number
  markerGap?: number
  progressColor?: string
  trackColor?: string
  clusterThresholdPct?: number
  onMarkerClick?: (comments: VideoComment[]) => void
  className?: string
  style?: CSSProperties
}

export const VideoCommentTimeline: FC<VideoCommentTimelineProps> = ({
  trackHeight = 4,
  markerSize = 26,
  markerGap = 4,
  progressColor,
  trackColor,
  clusterThresholdPct = 5,
  onMarkerClick,
  className,
  style,
}) => {
  const {
    user,
    comments,
    duration,
    currentTime,
    activeComment,
    seekTo,
    setActiveComment,
    addReply,
    removeReply,
  } = useVideoCommentContext()

  const trackRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [openClusterKey, setOpenClusterKey] = useState<string | null>(null)

  const progressPct = toPercentage(currentTime, duration)
  const totalHeight = markerSize + markerGap + trackHeight + 8

  const clusters = clusterComments(comments, duration, clusterThresholdPct)

  const handleTrackClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!trackRef.current || duration <= 0) return
      const rect = trackRef.current.getBoundingClientRect()
      seekTo(
        toTimestamp(((e.clientX - rect.left) / rect.width) * 100, duration)
      )
    },
    [duration, seekTo]
  )

  const handleMarkerClick = useCallback(
    (e: MouseEvent, clusterKey: string, clusterComments: VideoComment[]) => {
      e.stopPropagation()
      const isOpen = openClusterKey === clusterKey
      setOpenClusterKey(isOpen ? null : clusterKey)

      setActiveComment(clusterComments[0])
      seekTo(clusterComments[0].timestamp)
      onMarkerClick?.(clusterComments)
    },
    [openClusterKey, seekTo, setActiveComment, onMarkerClick]
  )

  useEffect(() => {
    if (!openClusterKey) setActiveComment(null)
  }, [openClusterKey, setActiveComment])

  const openCluster = clusters.find((c) => String(c.anchor) === openClusterKey)

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: totalHeight,
        ...style,
      }}
      onClick={() => setOpenClusterKey(null)}
    >
      {openCluster && (
        <VideoCommentPopover
          comments={openCluster.comments}
          anchorPct={toPercentage(openCluster.anchor, duration)}
          onClose={() => setOpenClusterKey(null)}
          onReply={(commentId, body) => addReply(commentId, body, user)}
          onRemoveReply={(commentId, replyId) =>
            removeReply(commentId, replyId)
          }
          containerRef={containerRef}
        />
      )}

      {duration > 0 &&
        clusters.map((cluster) => {
          const key = String(cluster.anchor)

          const pct = toPercentage(cluster.anchor, duration)

          const isActive =
            openClusterKey === key ||
            cluster.comments.some((c) => c.id === activeComment?.id)

          return (
            <VideoCommentClusterMarker
              key={key}
              comments={cluster.comments}
              pct={pct}
              markerSize={markerSize}
              isActive={isActive}
              onClick={(e) => handleMarkerClick(e, key, cluster.comments)}
            />
          )
        })}

      <div
        ref={trackRef}
        onClick={handleTrackClick}
        style={{
          position: 'absolute',
          bottom: 4,
          left: 0,
          right: 0,
          height: trackHeight,
          borderRadius: trackHeight,
          background: trackColor ?? 'var(--rvc-track)',
          overflow: 'visible',
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${progressPct}%`,
            background: progressColor ?? 'var(--rvc-progress)',
            borderRadius: trackHeight,
            pointerEvents: 'none',
          }}
        />

        {clusters.map((cluster) => {
          const key = String(cluster.anchor)
          const pct = toPercentage(cluster.anchor, duration)
          const isActive =
            openClusterKey === key ||
            cluster.comments.some((c) => c.id === activeComment?.id)

          return (
            <div
              key={key}
              style={{
                position: 'absolute',
                left: `${pct}%`,
                bottom: trackHeight,
                transform: 'translateX(-50%)',
                width: 2,
                height: markerGap,
                background: isActive
                  ? 'var(--rvc-text)'
                  : 'var(--rvc-text-faint)',
                pointerEvents: 'none',
                transition: 'background 0.15s ease',
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
