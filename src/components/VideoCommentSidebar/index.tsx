import { VideoCommentAvatar } from '@/components/VideoCommentAvatar'
import { useVideoCommentContext } from '@/components/VideoCommentProvider'
import type { VideoComment } from '@/types'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FC,
} from 'react'
import {
  closeButtonStyles,
  dividerStyles,
  getSubmitButtonStyles,
  ghostButtonStyles,
  textareaStyles,
} from '../styles'

export interface VideoCommentSidebarProps {
  placeholder?: string
  submitLabel?: string
  onCommentClick?: (comment: VideoComment) => void
  onCommentDelete?: (comment: VideoComment) => void
  className?: string
  style?: CSSProperties
  wrapperClassName?: string
  wrapperStyle?: CSSProperties
}

export const VideoCommentSidebar: FC<VideoCommentSidebarProps> = ({
  placeholder = 'Add a comment…',
  submitLabel = 'Post',
  onCommentClick,
  onCommentDelete,
  className,
  style,
  wrapperClassName,
  wrapperStyle,
}) => {
  const {
    user,
    videoTitle,
    comments,
    activeComment,
    currentTime,
    isShowingSidebar,
    addComment,
    removeComment,
    addReply,
    removeReply,
    seekTo,
    setActiveComment,
    setIsShowingSidebar,
  } = useVideoCommentContext()

  const [inputValue, setInputValue] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({})

  const activeRef = useRef<HTMLLIElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (isShowingSidebar) {
      // Capture whatever was focused before we opened
      previousFocusRef.current = document.activeElement as HTMLElement
      // Delay slightly so the width transition has started and the button
      // is no longer hidden, otherwise .focus() is a no-op in some browsers
      const id = setTimeout(() => closeButtonRef.current?.focus(), 50)
      return () => clearTimeout(id)
    } else {
      previousFocusRef.current?.focus()
      previousFocusRef.current = null
    }
  }, [isShowingSidebar])

  const onClose = useCallback(() => {
    setActiveComment(null)
    setIsShowingSidebar(false)
  }, [setActiveComment, setIsShowingSidebar])

  useEffect(() => {
    if (!isShowingSidebar) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isShowingSidebar, onClose])

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [activeComment?.id])

  const handleSubmit = useCallback(() => {
    const body = inputValue.trim()
    if (!body) return
    addComment(currentTime, body, user)
    setInputValue('')
  }, [inputValue, currentTime, addComment, user])

  const handleReplySubmit = useCallback(
    (commentId: string) => {
      const body = replyInputs[commentId]?.trim()
      if (!body) return
      addReply(commentId, body, user)
      setReplyInputs((prev) => ({ ...prev, [commentId]: '' }))
      setReplyingTo(null)
    },
    [replyInputs, addReply, user]
  )

  const handleCommentClick = useCallback(
    (comment: VideoComment) => {
      setActiveComment(comment)
      seekTo(comment.timestamp)
      onCommentClick?.(comment)
    },
    [seekTo, setActiveComment, onCommentClick]
  )

  const handleDelete = useCallback(
    (e: React.MouseEvent, comment: VideoComment) => {
      e.stopPropagation()
      removeComment(comment.id)
      onCommentDelete?.(comment)
    },
    [removeComment, onCommentDelete]
  )

  return (
    <div
      className={wrapperClassName}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        width: isShowingSidebar ? 'var(--rvc-sidebar-width)' : 0,
        visibility: isShowingSidebar ? 'visible' : 'hidden',
        transition: 'width 0.4s ease, visibility 0.4s ease',
        ...wrapperStyle,
      }}
    >
      <div
        role="dialog"
        aria-label="Comments"
        aria-modal="true"
        // @ts-expect-error - inert not in @types/react
        inert={isShowingSidebar ? undefined : ''}
        className={className}
        style={{
          flexShrink: 0,
          minWidth: 'fit-content',
          width: 'var(--rvc-sidebar-width)',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          color: 'var(--rvc-text)',
          opacity: isShowingSidebar ? 1 : 0,
          transition: 'opacity 0.4s ease',
          padding: '1rem',
          ...style,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            padding: '0.75rem 0.75rem 0.5rem',
            background: 'var(--rvc-bg-subtle)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '0.1rem',
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: '0.7rem',
                color: 'var(--rvc-text-muted)',
              }}
            >
              Viewing comments{videoTitle ? ' for' : ''}
            </p>
            {videoTitle && (
              <p style={{ margin: 0, color: 'var(--rvc-text)' }}>
                {videoTitle}
              </p>
            )}
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close"
            style={closeButtonStyles}
          >
            ×
          </button>
        </div>
        <ul
          aria-label="Video comments"
          style={{
            flex: 1,
            overflowY: 'auto',
            margin: 0,
            padding: 0,
            listStyle: 'none',
          }}
        >
          {comments.length === 0 && (
            <li
              style={{
                padding: '1rem',
                color: 'var(--rvc-text-muted)',
                fontSize: '0.875rem',
                textAlign: 'center',
              }}
            >
              No comments yet. Add the first one.
            </li>
          )}
          {comments.map((comment) => {
            const isActive = activeComment?.id === comment.id
            const showDeleteComment = user.id === comment.author.id
            const replyCount = (comment.replies ?? []).length

            return (
              <li
                key={comment.id}
                ref={isActive ? activeRef : undefined}
                aria-current={isActive ? 'true' : undefined}
                style={{
                  borderLeft: isActive
                    ? '3px solid var(--rvc-accent)'
                    : '3px solid transparent',
                  transition: 'border-color 0.15s ease',
                }}
              >
                <button
                  onClick={() => handleCommentClick(comment)}
                  style={{
                    display: 'flex',
                    gap: '0.6rem',
                    padding: '0.75rem 0.75rem 0.5rem',
                    cursor: 'pointer',
                    opacity: isActive ? 1 : 0.85,
                    transition: 'opacity 0.15s',
                    background: 'none',
                    border: 'none',
                    width: '100%',
                    textAlign: 'left',
                    color: 'inherit',
                    fontFamily: 'inherit',
                  }}
                >
                  <VideoCommentAvatar author={comment.author} size={28} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: '0.4rem',
                        marginBottom: '0.2rem',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          color: 'var(--rvc-text)',
                        }}
                      >
                        {comment.author.name}
                      </span>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          color: 'var(--rvc-text-muted)',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {comment.formattedTime}
                      </span>
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '0.825rem',
                        color: 'var(--rvc-text)',
                        lineHeight: 1.5,
                      }}
                    >
                      {comment.body}
                    </p>
                  </div>
                </button>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0 0.75rem 0.35rem',
                    paddingLeft: 'calc(0.75rem + 28px + 0.6rem)',
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setReplyingTo(
                        replyingTo === comment.id ? null : comment.id
                      )
                    }}
                    style={ghostButtonStyles}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = 'var(--rvc-text)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = 'var(--rvc-text-muted)')
                    }
                  >
                    {replyCount > 0
                      ? `${replyCount} repl${replyCount === 1 ? 'y' : 'ies'}`
                      : 'Reply'}
                  </button>
                  {showDeleteComment && (
                    <button
                      onClick={(e) => handleDelete(e, comment)}
                      aria-label={`Delete comment at ${comment.formattedTime}`}
                      style={{
                        ...ghostButtonStyles,
                        marginLeft: 'auto',
                        color: 'var(--rvc-text-faint)',
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = 'var(--rvc-danger)')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = 'var(--rvc-text-faint)')
                      }
                    >
                      Delete
                    </button>
                  )}
                </div>

                {replyCount > 0 && (
                  <div
                    style={{
                      paddingLeft: 'calc(0.75rem + 28px + 0.6rem)',
                      paddingRight: '0.75rem',
                      paddingBottom: '0.4rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                    }}
                  >
                    {(comment.replies ?? []).map((reply) => {
                      const showDeleteReply = user.id === reply.author.id
                      return (
                        <div
                          key={reply.id}
                          style={{
                            display: 'flex',
                            gap: '0.6rem',
                            alignItems: 'flex-start',
                          }}
                        >
                          <VideoCommentAvatar author={reply.author} size={28} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'baseline',
                                gap: '0.4rem',
                                marginBottom: '0.2rem',
                              }}
                            >
                              <span
                                style={{
                                  fontSize: '0.8rem',
                                  fontWeight: 600,
                                  color: 'var(--rvc-text)',
                                }}
                              >
                                {reply.author.name}
                              </span>
                            </div>
                            <p
                              style={{
                                margin: 0,
                                fontSize: '0.825rem',
                                color: 'var(--rvc-text)',
                                lineHeight: 1.5,
                              }}
                            >
                              {reply.body}
                            </p>
                          </div>
                          {showDeleteReply && (
                            <button
                              onClick={() => removeReply(comment.id, reply.id)}
                              aria-label="Remove reply"
                              style={{
                                ...ghostButtonStyles,
                                color: 'var(--rvc-text-faint)',
                                fontSize: '0.85rem',
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.color =
                                  'var(--rvc-danger)')
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.color =
                                  'var(--rvc-text-faint)')
                              }
                            >
                              ×
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}

                {replyingTo === comment.id && (
                  <div
                    style={{
                      paddingLeft: 'calc(0.75rem + 28px + 0.6rem)',
                      paddingRight: '0.75rem',
                      paddingBottom: '0.6rem',
                      display: 'flex',
                      gap: '0.4rem',
                    }}
                  >
                    <textarea
                      autoFocus
                      value={replyInputs[comment.id] ?? ''}
                      onChange={(e) =>
                        setReplyInputs((prev) => ({
                          ...prev,
                          [comment.id]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleReplySubmit(comment.id)
                        }
                        if (e.key === 'Escape') setReplyingTo(null)
                      }}
                      placeholder="Write a reply…"
                      rows={1}
                      style={{ ...textareaStyles, width: 'auto', flex: 1 }}
                    />
                    <button
                      onClick={() => handleReplySubmit(comment.id)}
                      disabled={!replyInputs[comment.id]?.trim()}
                      style={getSubmitButtonStyles(
                        !!replyInputs[comment.id]?.trim()
                      )}
                    >
                      Reply
                    </button>
                  </div>
                )}

                <div style={dividerStyles} />
              </li>
            )
          })}
        </ul>

        <div
          style={{
            padding: '0.75rem',
            borderTop: '1px solid var(--rvc-border)',
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'flex-start',
          }}
        >
          <VideoCommentAvatar author={user} size={28} />
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
            }}
          >
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit()
                }
              }}
              placeholder={placeholder}
              rows={2}
              style={textareaStyles}
            />
            <button
              onClick={handleSubmit}
              disabled={!inputValue.trim()}
              style={getSubmitButtonStyles(!!inputValue.trim())}
            >
              {submitLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
