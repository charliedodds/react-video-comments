import { VideoComment } from '@/types'
import { FC, useEffect, useRef, useState } from 'react'
import { VideoCommentAvatar } from '../VideoCommentAvatar'
import { dividerStyles, ghostButtonStyles } from '../styles'

export interface VideoCommentCardProps {
  comment: VideoComment
  onReply: (body: string) => void
  onRemoveReply: (replyId: string) => void
  divider?: boolean
}

export const VideoCommentCard: FC<VideoCommentCardProps> = ({
  comment,
  onReply,
  onRemoveReply,
  divider,
}) => {
  const [replyInput, setReplyInput] = useState('')
  const [showReplyInput, setShowReplyInput] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (showReplyInput) inputRef.current?.focus()
  }, [showReplyInput])

  const handleSubmit = () => {
    if (replyInput.trim()) {
      onReply(replyInput.trim())
      setReplyInput('')
      setShowReplyInput(false)
    }
  }

  const commentBodyStyle = {
    margin: 0,
    fontSize: '0.825rem',
    color: 'var(--rvc-text)',
    lineHeight: 1.5,
  }

  const authorNameStyle = {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'var(--rvc-text)',
  }

  const timestampStyle = {
    fontSize: '0.75rem',
    color: 'var(--rvc-text-muted)',
  }

  return (
    <div>
      {divider && <div style={dividerStyles} />}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.6rem 0.75rem 0.3rem',
        }}
      >
        <VideoCommentAvatar author={comment.author} size={26} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              ...authorNameStyle,
            }}
          >
            {comment.author.name}
          </div>
          <div style={timestampStyle}>{comment.formattedTime}</div>
        </div>
      </div>

      <p
        style={{
          ...commentBodyStyle,
          padding: '0 0.75rem 0.4rem',
          paddingLeft: 'calc(0.75rem + 26px + 0.5rem)',
        }}
      >
        {comment.body}
      </p>

      {(comment.replies ?? []).length > 0 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            padding: '0 0.75rem 0.4rem',
            paddingLeft: 'calc(0.75rem + 26px + 0.5rem)',
          }}
        >
          {(comment.replies ?? []).map((reply) => {
            return (
              <div
                key={`comment-card-reply-${reply.id}`}
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'flex-start',
                }}
              >
                <VideoCommentAvatar author={reply.author} size={24} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ ...authorNameStyle, marginRight: '0.35rem' }}>
                    {reply.author.name}
                  </span>
                  <span style={commentBodyStyle}>{reply.body}</span>
                </div>
                <button
                  onClick={() => onRemoveReply(reply.id)}
                  aria-label="Remove reply"
                  style={{
                    ...ghostButtonStyles,
                    color: 'var(--rvc-text-faint)',
                    fontSize: '0.85rem',
                    flexShrink: 0,
                  }}
                >
                  ×
                </button>
              </div>
            )
          })}
        </div>
      )}

      <div
        style={{
          padding: '0 0.75rem 0.5rem',
          paddingLeft: 'calc(0.75rem + 26px + 0.5rem)',
        }}
      >
        {!showReplyInput ? (
          <button
            onClick={() => setShowReplyInput(true)}
            style={ghostButtonStyles}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = 'var(--rvc-text)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = 'var(--rvc-text-muted)')
            }
          >
            Reply
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <textarea
              ref={inputRef}
              value={replyInput}
              onChange={(e) => setReplyInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit()
                }
                if (e.key === 'Escape') {
                  setShowReplyInput(false)
                }
              }}
              placeholder="Reply…"
              rows={1}
              style={{
                flex: 1,
                resize: 'none',
                background: 'var(--rvc-bg-subtle)',
                border: '1px solid var(--rvc-border)',
                borderRadius: '0.375rem',
                padding: '0.3rem 0.5rem',
                fontSize: '0.8rem',
                color: 'var(--rvc-text)',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
            <button
              onClick={handleSubmit}
              disabled={!replyInput.trim()}
              style={{
                padding: '0.3rem 0.6rem',
                background: 'var(--rvc-accent)',
                border: 'none',
                borderRadius: '0.375rem',
                color: 'var(--rvc-accent-fg)',
                fontWeight: 600,
                fontSize: '0.75rem',
                cursor: replyInput.trim() ? 'pointer' : 'not-allowed',
                opacity: replyInput.trim() ? 1 : 0.4,
                flexShrink: 0,
                alignSelf: 'flex-end',
              }}
            >
              Reply
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
