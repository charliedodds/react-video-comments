import { VideoCommentProvider } from '@/components/VideoCommentProvider'
import { VideoCommentSidebar } from '@/components/VideoCommentSidebar'
import { VideoCommentVideo } from '@/components/VideoCommentVideo'
import type { VideoComment, VideoCommentAuthor } from '@/types'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta = {
  title: 'Prebuilt/Full Player',
  parameters: { layout: 'fullscreen' },
}

export default meta

const authors: VideoCommentAuthor[] = [
  { id: 'user-1', name: 'Alice Johnson' },
  { id: 'user-2', name: 'Bob Smith' },
  { id: 'user-3', name: 'Carol White' },
]

const currentUser = authors[0]

const initialComments: VideoComment[] = [
  {
    id: '1',
    timestamp: 5,
    formattedTime: '0:05',
    body: 'Great intro!',
    author: authors[0],
    replies: [],
    createdAt: new Date(),
  },
  {
    id: '2',
    timestamp: 12,
    formattedTime: '0:12',
    body: 'Love the transition here.',
    author: authors[1],
    replies: [
      {
        id: 'r1',
        body: 'Totally agree!',
        author: authors[2],
        createdAt: new Date(),
      },
    ],
    createdAt: new Date(),
  },
  {
    id: '3',
    timestamp: 28,
    formattedTime: '0:28',
    body: 'This section could be shorter.',
    author: authors[2],
    replies: [],
    createdAt: new Date(),
  },
]

export const FullPlayer: StoryObj = {
  name: 'Full player (prebuilt)',
  render: () => (
    <VideoCommentProvider
      user={currentUser}
      initialSidebarOpen
      initialComments={initialComments}
    >
      <div style={{ display: 'flex', height: '100vh' }}>
        <VideoCommentVideo
          src="https://www.w3schools.com/html/mov_bbb.mp4"
          wrapperStyle={{ flex: 1 }}
        />
        <VideoCommentSidebar />
      </div>
    </VideoCommentProvider>
  ),
}

export const SidebarClosed: StoryObj = {
  name: 'Sidebar closed (toggle via video overlay)',
  render: () => (
    <VideoCommentProvider user={currentUser} initialComments={initialComments}>
      <div style={{ display: 'flex', height: '100vh' }}>
        <VideoCommentVideo
          src="https://www.w3schools.com/html/mov_bbb.mp4"
          wrapperStyle={{ flex: 1 }}
        />
        <VideoCommentSidebar />
      </div>
    </VideoCommentProvider>
  ),
}

export const Empty: StoryObj = {
  name: 'Empty state',
  render: () => (
    <VideoCommentProvider user={currentUser} initialSidebarOpen>
      <div style={{ display: 'flex', height: '100vh' }}>
        <VideoCommentVideo
          src="https://www.w3schools.com/html/mov_bbb.mp4"
          wrapperStyle={{ flex: 1 }}
        />
        <VideoCommentSidebar />
      </div>
    </VideoCommentProvider>
  ),
}
