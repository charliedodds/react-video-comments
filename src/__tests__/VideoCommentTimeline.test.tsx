import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { useEffect, type ReactNode } from 'react'
import { VideoCommentProvider } from '../components/VideoCommentProvider'
import { VideoCommentTimeline } from '../components/VideoCommentTimeline'
import { useVideoComments } from '../hooks/useVideoComments'
import type { VideoCommentAuthor } from '../types'

const authorA: VideoCommentAuthor = { id: 'user-1', name: 'Alice Johnson' }
const authorB: VideoCommentAuthor = { id: 'user-2', name: 'Bob Smith' }

function TimelineWithDuration({
  duration = 120,
  children,
}: {
  duration?: number
  children?: ReactNode
}) {
  const { setDuration } = useVideoComments()
  useEffect(() => {
    setDuration(duration)
  }, [duration, setDuration])
  return <>{children}</>
}

describe('VideoCommentTimeline', () => {
  it('renders without crashing when there are no comments', () => {
    render(
      <VideoCommentProvider user={authorA}>
        <VideoCommentTimeline />
      </VideoCommentProvider>
    )
    expect(document.querySelector("[style*='position: relative']")).toBeTruthy()
  })

  it('renders no markers when duration is 0', () => {
    render(
      <VideoCommentProvider
        user={authorA}
        initialComments={[
          {
            id: '1',
            timestamp: 30,
            formattedTime: '0:30',
            body: 'Hello',
            author: authorA,
            replies: [],
            createdAt: new Date(),
          },
        ]}
      >
        <VideoCommentTimeline />
      </VideoCommentProvider>
    )
    expect(screen.queryAllByRole('button')).toHaveLength(0)
  })

  it('renders a marker button for each comment when duration is set', () => {
    render(
      <VideoCommentProvider
        user={authorA}
        initialComments={[
          {
            id: '1',
            timestamp: 10,
            formattedTime: '0:10',
            body: 'First',
            author: authorA,
            replies: [],
            createdAt: new Date(),
          },
          {
            id: '2',
            timestamp: 60,
            formattedTime: '1:00',
            body: 'Second',
            author: authorB,
            replies: [],
            createdAt: new Date(),
          },
        ]}
      >
        <TimelineWithDuration>
          <VideoCommentTimeline />
        </TimelineWithDuration>
      </VideoCommentProvider>
    )
    expect(screen.getAllByRole('button')).toHaveLength(2)
  })

  it('marker aria-label includes author name and timestamp', () => {
    render(
      <VideoCommentProvider
        user={authorA}
        initialComments={[
          {
            id: '1',
            timestamp: 30,
            formattedTime: '0:30',
            body: 'Nice shot',
            author: authorA,
            replies: [],
            createdAt: new Date(),
          },
        ]}
      >
        <TimelineWithDuration>
          <VideoCommentTimeline />
        </TimelineWithDuration>
      </VideoCommentProvider>
    )
    expect(
      screen.getByRole('button', { name: /alice johnson/i })
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /0:30/i })).toBeInTheDocument()
  })

  it('calls onMarkerClick with the comment when a marker is clicked', () => {
    const onMarkerClick = vi.fn()
    render(
      <VideoCommentProvider
        user={authorA}
        initialComments={[
          {
            id: '1',
            timestamp: 30,
            formattedTime: '0:30',
            body: 'Click me',
            author: authorA,
            replies: [],
            createdAt: new Date(),
          },
        ]}
      >
        <TimelineWithDuration>
          <VideoCommentTimeline onMarkerClick={onMarkerClick} />
        </TimelineWithDuration>
      </VideoCommentProvider>
    )

    fireEvent.click(screen.getByRole('button'))
    expect(onMarkerClick).toHaveBeenCalledOnce()
    expect(onMarkerClick).toHaveBeenCalledWith([
      expect.objectContaining({ body: 'Click me', author: authorA }),
    ])
  })

  it('opens a popover when a marker is clicked', () => {
    render(
      <VideoCommentProvider
        user={authorA}
        initialComments={[
          {
            id: '1',
            timestamp: 30,
            formattedTime: '0:30',
            body: 'Popover content',
            author: authorA,
            replies: [],
            createdAt: new Date(),
          },
        ]}
      >
        <TimelineWithDuration>
          <VideoCommentTimeline />
        </TimelineWithDuration>
      </VideoCommentProvider>
    )

    fireEvent.click(screen.getByRole('button', { name: /alice johnson/i }))
    expect(screen.getByText('Popover content')).toBeInTheDocument()
  })

  it('shows existing replies inside the popover', () => {
    render(
      <VideoCommentProvider
        user={authorA}
        initialComments={[
          {
            id: '1',
            timestamp: 30,
            formattedTime: '0:30',
            body: 'Top-level',
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
        <TimelineWithDuration>
          <VideoCommentTimeline />
        </TimelineWithDuration>
      </VideoCommentProvider>
    )

    fireEvent.click(screen.getByRole('button', { name: /alice johnson/i }))
    expect(screen.getByText('A reply')).toBeInTheDocument()
    expect(screen.getByText('Bob Smith')).toBeInTheDocument()
  })

  it('adds a reply via the popover', async () => {
    render(
      <VideoCommentProvider
        user={authorA}
        initialComments={[
          {
            id: '1',
            timestamp: 30,
            formattedTime: '0:30',
            body: 'Top-level',
            author: authorA,
            replies: [],
            createdAt: new Date(),
          },
        ]}
      >
        <TimelineWithDuration>
          <VideoCommentTimeline />
        </TimelineWithDuration>
      </VideoCommentProvider>
    )

    // Open the popover
    fireEvent.click(screen.getByRole('button', { name: /alice johnson/i }))
    // Reveal the reply input
    fireEvent.click(screen.getByRole('button', { name: /^reply$/i }))

    const textarea = screen.getByPlaceholderText(/reply/i)
    fireEvent.change(textarea, { target: { value: 'My reply' } })
    fireEvent.click(screen.getByRole('button', { name: /^reply$/i }))

    expect(screen.getByText('My reply')).toBeInTheDocument()
  })

  it('closes the popover when the close button is clicked', () => {
    render(
      <VideoCommentProvider
        user={authorA}
        initialComments={[
          {
            id: '1',
            timestamp: 30,
            formattedTime: '0:30',
            body: 'Close me',
            author: authorA,
            replies: [],
            createdAt: new Date(),
          },
        ]}
      >
        <TimelineWithDuration>
          <VideoCommentTimeline />
        </TimelineWithDuration>
      </VideoCommentProvider>
    )

    fireEvent.click(screen.getByRole('button', { name: /alice johnson/i }))
    expect(screen.getByText('Close me')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /close/i }))
    expect(screen.queryByText('Close me')).not.toBeInTheDocument()
  })
})
