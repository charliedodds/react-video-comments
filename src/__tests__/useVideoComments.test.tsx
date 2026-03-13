import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import type { ReactNode } from 'react'
import { useVideoComments, VideoCommentProvider } from '../index'

const wrapper = ({ children }: { children: ReactNode }) => (
  <VideoCommentProvider user={{ id: 'user1', name: 'John Doe' }}>
    {children}
  </VideoCommentProvider>
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

  it('adds a comment', () => {
    const { result } = renderHook(() => useVideoComments(), { wrapper })
    act(() => {
      result.current.addComment(30, 'Great point here')
    })
    expect(result.current.comments).toHaveLength(1)
    expect(result.current.comments[0].body).toBe('Great point here')
    expect(result.current.comments[0].timestamp).toBe(30)
    expect(result.current.comments[0].formattedTime).toBe('0:30')
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

  it('calls onCommentsChange when comments change', () => {
    const onCommentsChange = vi.fn()
    const { result } = renderHook(() => useVideoComments(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <VideoCommentProvider
          user={{ id: 'user1', name: 'John Doe' }}
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
