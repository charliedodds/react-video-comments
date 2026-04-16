import type { VideoComment } from '@/types'
import { useEffect, useRef, type FC, type RefObject } from 'react'
import { closeButtonStyles } from '../styles'
import { VideoCommentCard } from '../VideoCommentCard'

export interface PopoverProps {
  comments: VideoComment[]
  anchorPct: number
  onClose: () => void
  onReply: (commentId: string, body: string) => void
  onRemoveReply: (commentId: string, replyId: string) => void
  containerRef: RefObject<HTMLDivElement | null>
}

const POPOVER_WIDTH = 280

export const VideoCommentPopover: FC<PopoverProps> = ({
  comments,
  anchorPct,
  onClose,
  onReply,
  onRemoveReply,
  containerRef,
}) => {
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: globalThis.MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  const containerWidth = containerRef.current?.offsetWidth ?? 300
  const anchorPx = (anchorPct / 100) * containerWidth
  const clampedLeft = Math.max(
    0,
    Math.min(anchorPx - POPOVER_WIDTH / 2, containerWidth - POPOVER_WIDTH)
  )

  return (
    <div
      ref={popoverRef}
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'absolute',
        bottom: 'calc(100% + 8px)',
        left: clampedLeft,
        width: POPOVER_WIDTH,
        background: 'var(--rvc-bg)',
        border: '1px solid var(--rvc-border)',
        borderRadius: '0.625rem',
        boxShadow: `0 8px 32px var(--rvc-shadow)`,
        zIndex: 100,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.5rem 0.75rem 0',
          borderBottom:
            comments.length > 1 ? '1px solid var(--rvc-border-subtle)' : 'none',
        }}
      >
        <span
          style={{
            fontSize: '0.72rem',
            fontWeight: 600,
            color: 'var(--rvc-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {comments.length > 1 ? `${comments.length} comments` : 'Comment'}
        </span>
        <button onClick={onClose} aria-label="Close" style={closeButtonStyles}>
          ×
        </button>
      </div>

      <div style={{ maxHeight: 360, overflowY: 'auto' }}>
        {comments.map((comment, i) => {
          return (
            <VideoCommentCard
              key={`comment-card-${comment.id}`}
              comment={comment}
              divider={i > 0}
              onReply={(body) => onReply(comment.id, body)}
              onRemoveReply={(replyId) => onRemoveReply(comment.id, replyId)}
            />
          )
        })}
      </div>
    </div>
  )
}
