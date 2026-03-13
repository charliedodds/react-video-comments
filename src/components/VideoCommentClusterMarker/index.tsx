import { VideoComment } from '@/types'
import { VideoCommentAvatar } from '../VideoCommentAvatar'
import { FC, MouseEventHandler } from 'react'

export interface VideoCommentClusterMarkerProps {
  comments: VideoComment[]
  pct: number
  markerSize: number
  isActive: boolean
  onClick: MouseEventHandler<HTMLButtonElement>
}

export const VideoCommentClusterMarker: FC<VideoCommentClusterMarkerProps> = ({
  comments,
  pct,
  markerSize,
  isActive,
  onClick,
}) => {
  const isSingle = comments.length === 1

  return (
    <button
      onClick={onClick}
      title={
        isSingle
          ? `${comments[0].author.name} at ${comments[0].formattedTime}: ${comments[0].body}`
          : `${comments.length} comments near ${comments[0].formattedTime}`
      }
      aria-label={
        isSingle
          ? `Comment by ${comments[0].author.name} at ${comments[0].formattedTime}`
          : `${comments.length} comments near ${comments[0].formattedTime}`
      }
      style={{
        position: 'absolute',
        left: `${pct}%`,
        top: 0,
        transform: `translateX(-50%) scale(${isActive ? 1.15 : 1})`,
        background: 'none',
        border: `2px solid ${isActive ? 'var(--rvc-text)' : 'transparent'}`,
        borderRadius: '50%',
        padding: 0,
        cursor: 'pointer',
        transition: 'transform 0.15s ease, border-color 0.15s ease',
        zIndex: isActive ? 10 : 5,
        width: markerSize,
        height: markerSize,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {isSingle ? (
        <VideoCommentAvatar author={comments[0].author} size={markerSize - 4} />
      ) : (
        <div
          style={{
            position: 'relative',
            width: markerSize - 4,
            height: markerSize - 4,
          }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0 }}>
            <VideoCommentAvatar
              author={comments[0].author}
              size={markerSize - 4}
            />
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: -2,
              right: -4,
              minWidth: 16,
              height: 16,
              borderRadius: 8,
              background: 'var(--rvc-accent)',
              color: 'var(--rvc-accent-fg)',
              fontSize: 9,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 3px',
              lineHeight: 1,
              border: '1.5px solid var(--rvc-bg)',
              pointerEvents: 'none',
            }}
          >
            {comments.length}
          </div>
        </div>
      )}
    </button>
  )
}
