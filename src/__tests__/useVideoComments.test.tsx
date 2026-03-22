import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import type { ReactNode } from 'react'
import { VideoCommentProvider } from '@/components/VideoCommentProvider'
import { useVideoComments } from '@/hooks/useVideoComments'
import type { VideoCommentAuthor } from '@/types'

const authorA: VideoCommentAuthor = { id: 'user-1', name: 'Alice Johnson' }
const authorB: VideoCommentAuthor = { id: 'user-2', name: 'Bob Smith' }

const wrapper = ({ children }: { children: ReactNode }) => (
  <VideoCommentProvider user={authorA}>{children}</VideoCommentProvider>
)

describe('useVideoComments', () => {
  it('throws outside of VideoCommentProvider', () => {
    expect(() => renderHook(() => useVideoComments())).toThrow(
      '[react-video-comments] useVideoComments must be used inside <VideoCommentProvider>.'
    )
  })

  it('initialises with empty comments', () => {
    const { result } = renderHook(() => useVideoComments(), { wrapper })
    expect(result.current.comments).toEqual([])
    expect(result.current.activeComment).toBeNull()
    expect(result.current.duration).toBe(0)
    expect(result.current.currentTime).toBe(0)
  })

  it('initialises with isShowingSidebar false', () => {
    const { result } = renderHook(() => useVideoComments(), { wrapper })
    expect(result.current.isShowingSidebar).toBe(false)
  })

  it('initialises with isPlaying false', () => {
    const { result } = renderHook(() => useVideoComments(), { wrapper })
    expect(result.current.isPlaying).toBe(false)
  })

  it('adds a comment attributed to the current user', () => {
    const { result } = renderHook(() => useVideoComments(), { wrapper })
    act(() => {
      result.current.addComment(30, 'Great point here')
    })
    expect(result.current.comments).toHaveLength(1)
    expect(result.current.comments[0].body).toBe('Great point here')
    expect(result.current.comments[0].timestamp).toBe(30)
    expect(result.current.comments[0].formattedTime).toBe('0:30')
    expect(result.current.comments[0].author).toEqual(authorA)
  })

  it('preserves a provided id when adding a comment', () => {
    const { result } = renderHook(() => useVideoComments(), { wrapper })
    act(() => {
      result.current.addComment(30, 'With known id', authorA, 'known-id-123')
    })
    expect(result.current.comments[0].id).toBe('known-id-123')
  })

  it('keeps comments sorted by timestamp', () => {
    const { result } = renderHook(() => useVideoComments(), { wrapper })
    act(() => {
      result.current.addComment(60, 'Second')
      result.current.addComment(10, 'First')
      result.current.addComment(90, 'Third')
    })
    const timestamps = result.current.comments.map((c) => c.timestamp)
    expect(timestamps).toEqual([10, 60, 90])
  })

  it('removes a comment by id', () => {
    const { result } = renderHook(() => useVideoComments(), { wrapper })
    act(() => result.current.addComment(30, 'To delete'))
    const id = result.current.comments[0].id
    act(() => result.current.removeComment(id))
    expect(result.current.comments).toHaveLength(0)
  })

  it('updates a comment body', () => {
    const { result } = renderHook(() => useVideoComments(), { wrapper })
    act(() => result.current.addComment(30, 'Original'))
    const id = result.current.comments[0].id
    act(() => result.current.updateComment(id, 'Updated'))
    expect(result.current.comments[0].body).toBe('Updated')
  })

  it('adds a reply to a comment', () => {
    const { result } = renderHook(() => useVideoComments(), { wrapper })
    act(() => result.current.addComment(30, 'Parent'))
    const commentId = result.current.comments[0].id
    act(() => result.current.addReply(commentId, 'A reply', authorB))
    expect(result.current.comments[0].replies).toHaveLength(1)
    expect(result.current.comments[0].replies![0].body).toBe('A reply')
    expect(result.current.comments[0].replies![0].author).toEqual(authorB)
  })

  it('preserves a provided id when adding a reply', () => {
    const { result } = renderHook(() => useVideoComments(), { wrapper })
    act(() => result.current.addComment(30, 'Parent'))
    const commentId = result.current.comments[0].id
    act(() =>
      result.current.addReply(commentId, 'Reply', authorB, 'reply-id-123')
    )
    expect(result.current.comments[0].replies![0].id).toBe('reply-id-123')
  })

  it('removes a reply', () => {
    const { result } = renderHook(() => useVideoComments(), { wrapper })
    act(() => result.current.addComment(30, 'Parent'))
    const commentId = result.current.comments[0].id
    act(() => result.current.addReply(commentId, 'To remove', authorB))
    const replyId = result.current.comments[0].replies![0].id
    act(() => result.current.removeReply(commentId, replyId))
    expect(result.current.comments[0].replies).toHaveLength(0)
  })

  it('replaces all comments with setComments', () => {
    const { result } = renderHook(() => useVideoComments(), { wrapper })
    act(() => result.current.addComment(30, 'Old comment'))
    act(() =>
      result.current.setComments([
        {
          id: 'new-1',
          timestamp: 60,
          formattedTime: '1:00',
          body: 'New comment',
          author: authorB,
          replies: [],
          createdAt: new Date(),
        },
      ])
    )
    expect(result.current.comments).toHaveLength(1)
    expect(result.current.comments[0].id).toBe('new-1')
    expect(result.current.comments[0].body).toBe('New comment')
  })

  it('sets duration', () => {
    const { result } = renderHook(() => useVideoComments(), { wrapper })
    act(() => result.current.setDuration(120))
    expect(result.current.duration).toBe(120)
  })

  it('seeks to a timestamp', () => {
    const { result } = renderHook(() => useVideoComments(), { wrapper })
    act(() => result.current.seekTo(45))
    expect(result.current.currentTime).toBe(45)
  })

  it('sets active comment', () => {
    const { result } = renderHook(() => useVideoComments(), { wrapper })
    act(() => result.current.addComment(30, 'Hello'))
    const comment = result.current.comments[0]
    act(() => result.current.setActiveComment(comment))
    expect(result.current.activeComment?.id).toBe(comment.id)
  })

  it('clears active comment when it is deleted', () => {
    const { result } = renderHook(() => useVideoComments(), { wrapper })
    act(() => result.current.addComment(30, 'Hello'))
    const comment = result.current.comments[0]
    act(() => result.current.setActiveComment(comment))
    act(() => result.current.removeComment(comment.id))
    expect(result.current.activeComment).toBeNull()
  })

  it('toggles isShowingSidebar', () => {
    const { result } = renderHook(() => useVideoComments(), { wrapper })
    act(() => result.current.setIsShowingSidebar(true))
    expect(result.current.isShowingSidebar).toBe(true)
    act(() => result.current.setIsShowingSidebar(false))
    expect(result.current.isShowingSidebar).toBe(false)
  })

  it('toggles isPlaying', () => {
    const { result } = renderHook(() => useVideoComments(), { wrapper })
    act(() => result.current.setIsPlaying(true))
    expect(result.current.isPlaying).toBe(true)
    act(() => result.current.setIsPlaying(false))
    expect(result.current.isPlaying).toBe(false)
  })

  it('calls onCommentsChange when comments change', () => {
    const onCommentsChange = vi.fn()
    const { result } = renderHook(() => useVideoComments(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <VideoCommentProvider
          user={authorA}
          onCommentsChange={onCommentsChange}
        >
          {children}
        </VideoCommentProvider>
      ),
    })
    act(() => result.current.addComment(30, 'Hello'))
    expect(onCommentsChange).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ body: 'Hello' })])
    )
  })
})
