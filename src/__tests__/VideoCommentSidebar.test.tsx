import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import type { ReactNode } from 'react'
import { VideoCommentProvider } from '../index'
import { VideoCommentSidebar } from '../components/VideoCommentSidebar'
import { useVideoComments } from '../hooks/useVideoComments'
import { act, renderHook } from '@testing-library/react'
import type { VideoCommentAuthor } from '../types'

const authorA: VideoCommentAuthor = { id: 'user-1', name: 'Alice Johnson' }
const authorB: VideoCommentAuthor = { id: 'user-2', name: 'Bob Smith' }

const wrapper = ({ children }: { children: ReactNode }) => (
  <VideoCommentProvider user={authorA} initialSidebarOpen>
    {children}
  </VideoCommentProvider>
)

describe('VideoCommentSidebar — comment input', () => {
  it('shows empty state when there are no comments', () => {
    render(
      <VideoCommentProvider user={authorA} initialSidebarOpen>
        <VideoCommentSidebar />
      </VideoCommentProvider>
    )
    expect(screen.getByText(/no comments yet/i)).toBeInTheDocument()
  })

  it('renders existing comments with author name and timestamp', () => {
    render(
      <VideoCommentProvider
        user={authorA}
        initialSidebarOpen
        initialComments={[
          {
            id: '1',
            timestamp: 30,
            formattedTime: '0:30',
            body: 'First comment',
            author: authorA,
            replies: [],
            createdAt: new Date(),
          },
        ]}
      >
        <VideoCommentSidebar />
      </VideoCommentProvider>
    )
    expect(screen.getByText('First comment')).toBeInTheDocument()
    expect(screen.getByText('0:30')).toBeInTheDocument()
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
  })

  it('disables the post button when input is empty', () => {
    render(
      <VideoCommentProvider user={authorA} initialSidebarOpen>
        <VideoCommentSidebar />
      </VideoCommentProvider>
    )
    expect(screen.getByRole('button', { name: /post/i })).toBeDisabled()
  })

  it('enables the post button when input has text', () => {
    render(
      <VideoCommentProvider user={authorA} initialSidebarOpen>
        <VideoCommentSidebar />
      </VideoCommentProvider>
    )
    fireEvent.change(screen.getByPlaceholderText(/add a comment/i), {
      target: { value: 'My comment' },
    })
    expect(screen.getByRole('button', { name: /post/i })).not.toBeDisabled()
  })

  it('adds a comment on submit attributed to the given author', () => {
    render(
      <VideoCommentProvider user={authorA} initialSidebarOpen>
        <VideoCommentSidebar />
      </VideoCommentProvider>
    )
    fireEvent.change(screen.getByPlaceholderText(/add a comment/i), {
      target: { value: 'New comment' },
    })
    fireEvent.click(screen.getByRole('button', { name: /post/i }))
    expect(screen.getByText('New comment')).toBeInTheDocument()
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
  })

  it('clears input after submit', () => {
    render(
      <VideoCommentProvider user={authorA} initialSidebarOpen>
        <VideoCommentSidebar />
      </VideoCommentProvider>
    )
    const textarea = screen.getByPlaceholderText(/add a comment/i)
    fireEvent.change(textarea, { target: { value: 'Hello' } })
    fireEvent.click(screen.getByRole('button', { name: /post/i }))
    expect(textarea).toHaveValue('')
  })

  it('submits a comment with Enter key', () => {
    render(
      <VideoCommentProvider user={authorA} initialSidebarOpen>
        <VideoCommentSidebar />
      </VideoCommentProvider>
    )
    const textarea = screen.getByPlaceholderText(/add a comment/i)
    fireEvent.change(textarea, { target: { value: 'Enter comment' } })
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false })
    expect(screen.getByText('Enter comment')).toBeInTheDocument()
  })

  it('does not submit with Shift+Enter', () => {
    render(
      <VideoCommentProvider user={authorA} initialSidebarOpen>
        <VideoCommentSidebar />
      </VideoCommentProvider>
    )
    const textarea = screen.getByPlaceholderText(/add a comment/i)
    fireEvent.change(textarea, { target: { value: 'Draft' } })
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true })
    expect(screen.getByText(/no comments yet/i)).toBeInTheDocument()
  })
})

describe('VideoCommentSidebar — delete permissions', () => {
  it('shows delete button on a comment when author id matches', () => {
    render(
      <VideoCommentProvider
        user={authorA}
        initialSidebarOpen
        initialComments={[
          {
            id: '1',
            timestamp: 10,
            formattedTime: '0:10',
            body: 'Mine',
            author: authorA,
            replies: [],
            createdAt: new Date(),
          },
        ]}
      >
        <VideoCommentSidebar />
      </VideoCommentProvider>
    )
    expect(screen.getByLabelText(/delete comment/i)).toBeInTheDocument()
  })

  it('hides delete button on a comment when author id does not match', () => {
    render(
      <VideoCommentProvider
        user={authorA}
        initialSidebarOpen
        initialComments={[
          {
            id: '1',
            timestamp: 10,
            formattedTime: '0:10',
            body: 'Not mine',
            author: authorB,
            replies: [],
            createdAt: new Date(),
          },
        ]}
      >
        <VideoCommentSidebar />
      </VideoCommentProvider>
    )
    expect(screen.queryByLabelText(/delete comment/i)).not.toBeInTheDocument()
  })

  it('calls onCommentDelete and removes the comment when delete is clicked', () => {
    const onCommentDelete = vi.fn()
    const { result } = renderHook(() => useVideoComments(), { wrapper })
    act(() => result.current.addComment(30, 'Delete me'))

    render(
      <VideoCommentProvider
        user={authorA}
        initialSidebarOpen
        initialComments={result.current.comments}
      >
        <VideoCommentSidebar onCommentDelete={onCommentDelete} />
      </VideoCommentProvider>
    )

    fireEvent.click(screen.getByLabelText(/delete comment/i))
    expect(onCommentDelete).toHaveBeenCalledOnce()
    expect(onCommentDelete).toHaveBeenCalledWith(
      expect.objectContaining({ body: 'Delete me' })
    )
    expect(screen.queryByText('Delete me')).not.toBeInTheDocument()
  })

  it('shows delete button on a reply when author id matches', () => {
    render(
      <VideoCommentProvider
        user={authorA}
        initialSidebarOpen
        initialComments={[
          {
            id: '1',
            timestamp: 10,
            formattedTime: '0:10',
            body: 'Parent',
            author: authorB,
            replies: [
              {
                id: 'r1',
                body: 'My reply',
                author: authorA,
                createdAt: new Date(),
              },
            ],
            createdAt: new Date(),
          },
        ]}
      >
        <VideoCommentSidebar />
      </VideoCommentProvider>
    )
    expect(
      screen.getByRole('button', { name: /remove reply/i })
    ).toBeInTheDocument()
  })

  it('hides delete button on a reply when author id does not match', () => {
    render(
      <VideoCommentProvider
        user={authorA}
        initialSidebarOpen
        initialComments={[
          {
            id: '1',
            timestamp: 10,
            formattedTime: '0:10',
            body: 'Parent',
            author: authorA,
            replies: [
              {
                id: 'r1',
                body: 'Their reply',
                author: authorB,
                createdAt: new Date(),
              },
            ],
            createdAt: new Date(),
          },
        ]}
      >
        <VideoCommentSidebar />
      </VideoCommentProvider>
    )
    expect(
      screen.queryByRole('button', { name: /remove reply/i })
    ).not.toBeInTheDocument()
  })

  it('removes a reply when its delete button is clicked', () => {
    render(
      <VideoCommentProvider
        user={authorA}
        initialSidebarOpen
        initialComments={[
          {
            id: '1',
            timestamp: 10,
            formattedTime: '0:10',
            body: 'Parent',
            author: authorB,
            replies: [
              {
                id: 'r1',
                body: 'Remove me',
                author: authorA,
                createdAt: new Date(),
              },
            ],
            createdAt: new Date(),
          },
        ]}
      >
        <VideoCommentSidebar />
      </VideoCommentProvider>
    )
    fireEvent.click(screen.getByRole('button', { name: /remove reply/i }))
    expect(screen.queryByText('Remove me')).not.toBeInTheDocument()
  })
})

describe('VideoCommentSidebar — toggle', () => {
  it('closes when the close button is clicked', () => {
    render(
      <VideoCommentProvider user={authorA} initialSidebarOpen>
        <VideoCommentSidebar />
      </VideoCommentProvider>
    )
    fireEvent.click(screen.getByRole('button', { name: /close/i }))

    expect(
      screen.queryByRole('button', { name: /close/i })
    ).not.toBeInTheDocument()
  })

  it('close button has an accessible label', () => {
    render(
      <VideoCommentProvider user={authorA} initialSidebarOpen>
        <VideoCommentSidebar />
      </VideoCommentProvider>
    )
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument()
  })

  it('sidebar panel has an accessible region label', () => {
    render(
      <VideoCommentProvider user={authorA} initialSidebarOpen>
        <VideoCommentSidebar />
      </VideoCommentProvider>
    )

    const sidebar =
      screen.queryByRole('dialog') ?? screen.queryByRole('complementary')
    expect(sidebar).toBeInTheDocument()
  })

  it('close button returns focus to the element that opened the sidebar', () => {
    render(
      <VideoCommentProvider user={authorA} initialSidebarOpen>
        <button data-testid="open-btn">View comments</button>
        <VideoCommentSidebar />
      </VideoCommentProvider>
    )

    const openBtn = screen.getByTestId('open-btn')
    openBtn.focus()
    fireEvent.click(screen.getByRole('button', { name: /close/i }))

    expect(document.activeElement).toBe(openBtn)
  })
})

describe('VideoCommentSidebar — accessibility', () => {
  it('comment list has an accessible label', () => {
    render(
      <VideoCommentProvider user={authorA} initialSidebarOpen>
        <VideoCommentSidebar />
      </VideoCommentProvider>
    )
    expect(
      screen.getByRole('list', { name: /video comments/i })
    ).toBeInTheDocument()
  })

  it('active comment has aria-current set', () => {
    const { result } = renderHook(() => useVideoComments(), { wrapper })
    act(() => result.current.addComment(30, 'Active one'))

    render(
      <VideoCommentProvider
        user={authorA}
        initialSidebarOpen
        initialComments={result.current.comments}
      >
        <VideoCommentSidebar />
      </VideoCommentProvider>
    )

    fireEvent.click(screen.getByText('Active one'))
    expect(screen.getByRole('listitem', { current: true })).toBeInTheDocument()
  })

  it('sidebar is hidden from assistive technology when closed', () => {
    render(
      <VideoCommentProvider user={authorA} initialSidebarOpen>
        <VideoCommentSidebar />
      </VideoCommentProvider>
    )

    fireEvent.click(screen.getByRole('button', { name: /close/i }))

    const sidebar =
      screen.queryByRole('dialog') ?? screen.queryByRole('complementary')
    const isHidden =
      sidebar === null ||
      sidebar.getAttribute('aria-hidden') === 'true' ||
      sidebar.getAttribute('inert') !== null

    expect(isHidden).toBe(true)
  })
})

describe('VideoCommentSidebar — replies', () => {
  it('renders existing replies threaded under their parent comment', () => {
    render(
      <VideoCommentProvider
        user={authorA}
        initialSidebarOpen
        initialComments={[
          {
            id: '1',
            timestamp: 10,
            formattedTime: '0:10',
            body: 'Parent comment',
            author: authorA,
            replies: [
              {
                id: 'r1',
                body: 'A reply',
                author: authorB,
                createdAt: new Date(),
              },
            ],
            createdAt: new Date(),
          },
        ]}
      >
        <VideoCommentSidebar />
      </VideoCommentProvider>
    )
    expect(screen.getByText('Parent comment')).toBeInTheDocument()
    expect(screen.getByText('A reply')).toBeInTheDocument()
    expect(screen.getByText('Bob Smith')).toBeInTheDocument()
  })

  it('shows reply count on the reply button when replies exist', () => {
    render(
      <VideoCommentProvider
        user={authorA}
        initialSidebarOpen
        initialComments={[
          {
            id: '1',
            timestamp: 10,
            formattedTime: '0:10',
            body: 'Has replies',
            author: authorA,
            replies: [
              {
                id: 'r1',
                body: 'Reply one',
                author: authorB,
                createdAt: new Date(),
              },
              {
                id: 'r2',
                body: 'Reply two',
                author: authorB,
                createdAt: new Date(),
              },
            ],
            createdAt: new Date(),
          },
        ]}
      >
        <VideoCommentSidebar />
      </VideoCommentProvider>
    )
    expect(screen.getByText(/2 replies/i)).toBeInTheDocument()
  })

  it('toggles the inline reply input when the reply button is clicked', () => {
    render(
      <VideoCommentProvider
        user={authorA}
        initialSidebarOpen
        initialComments={[
          {
            id: '1',
            timestamp: 10,
            formattedTime: '0:10',
            body: 'Reply to me',
            author: authorA,
            replies: [],
            createdAt: new Date(),
          },
        ]}
      >
        <VideoCommentSidebar />
      </VideoCommentProvider>
    )
    expect(
      screen.queryByPlaceholderText(/write a reply/i)
    ).not.toBeInTheDocument()
    fireEvent.click(screen.getByText(/^reply$/i))
    expect(screen.getByPlaceholderText(/write a reply/i)).toBeInTheDocument()
  })

  it('adds a reply attributed to the given author', () => {
    render(
      <VideoCommentProvider
        user={authorB}
        initialSidebarOpen
        initialComments={[
          {
            id: '1',
            timestamp: 10,
            formattedTime: '0:10',
            body: 'Parent',
            author: authorA,
            replies: [],
            createdAt: new Date(),
          },
        ]}
      >
        <VideoCommentSidebar />
      </VideoCommentProvider>
    )
    fireEvent.click(screen.getByText(/^reply$/i))
    fireEvent.change(screen.getByPlaceholderText(/write a reply/i), {
      target: { value: 'My reply' },
    })
    const replyBtns = screen.getAllByRole('button', { name: /^reply$/i })
    fireEvent.click(replyBtns[replyBtns.length - 1])
    expect(screen.getByText('My reply')).toBeInTheDocument()
    expect(screen.getByText('Bob Smith')).toBeInTheDocument()
  })

  it('closes the reply input with Escape', () => {
    render(
      <VideoCommentProvider
        user={authorA}
        initialSidebarOpen
        initialComments={[
          {
            id: '1',
            timestamp: 10,
            formattedTime: '0:10',
            body: 'Parent',
            author: authorA,
            replies: [],
            createdAt: new Date(),
          },
        ]}
      >
        <VideoCommentSidebar />
      </VideoCommentProvider>
    )
    fireEvent.click(screen.getByText(/^reply$/i))
    fireEvent.keyDown(screen.getByPlaceholderText(/write a reply/i), {
      key: 'Escape',
    })
    expect(
      screen.queryByPlaceholderText(/write a reply/i)
    ).not.toBeInTheDocument()
  })
})
