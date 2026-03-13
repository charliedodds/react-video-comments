import { VideoCommentProvider } from '@/components/VideoCommentProvider'
import { VideoCommentSidebar } from '@/components/VideoCommentSidebar'
import type { VideoComment, VideoCommentAuthor } from '@/types'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof VideoCommentSidebar> = {
  title: 'Prebuilt/VideoCommentSidebar',
  component: VideoCommentSidebar,
  argTypes: {
    placeholder: { control: 'text' },
    submitLabel: { control: 'text' },
  },
}

export default meta

const authors: VideoCommentAuthor[] = [
  { id: 'user-1', name: 'Alice Johnson' },
  { id: 'user-2', name: 'Bob Smith' },
  { id: 'user-3', name: 'Carol White' },
]

const currentUser = authors[0]

const withComments: VideoComment[] = [
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
  {
    id: '4',
    timestamp: 45,
    formattedTime: '0:45',
    body: 'Perfect pacing here.',
    author: authors[0],
    replies: [],
    createdAt: new Date(),
  },
]

const wrapperStyle = {
  width: '320px',
  height: '560px',
  outline: '1px solid rgba(0,0,0,0.08)',
  borderRadius: '0.5rem',
  overflow: 'hidden',
}

export const Empty: StoryObj<typeof VideoCommentSidebar> = {
  decorators: [
    (Story) => (
      <VideoCommentProvider user={currentUser} initialSidebarOpen>
        <Story />
      </VideoCommentProvider>
    ),
  ],

  render: (args) => (
    <VideoCommentSidebar {...args} wrapperStyle={wrapperStyle} />
  ),
}

export const WithComments: StoryObj<typeof VideoCommentSidebar> = {
  decorators: [
    (Story) => (
      <VideoCommentProvider
        user={currentUser}
        initialSidebarOpen
        initialComments={withComments}
      >
        <Story />
      </VideoCommentProvider>
    ),
  ],
  render: (args) => (
    <VideoCommentSidebar {...args} wrapperStyle={wrapperStyle} />
  ),
}

export const DarkTheme: StoryObj<typeof VideoCommentSidebar> = {
  decorators: [
    (Story) => (
      <VideoCommentProvider
        user={currentUser}
        initialSidebarOpen
        initialComments={withComments}
        theme={{
          bg: '#1c1c1e',
          bgSubtle: 'rgba(255,255,255,0.07)',
          border: 'rgba(255,255,255,0.12)',
          borderSubtle: 'rgba(255,255,255,0.06)',
          text: '#ffffff',
          textMuted: 'rgba(255,255,255,0.45)',
          textFaint: 'rgba(255,255,255,0.25)',
          accent: '#facc15',
          accentFg: '#000000',
          danger: '#ef4444',
          shadow: 'rgba(0,0,0,0.5)',
        }}
      >
        <Story />
      </VideoCommentProvider>
    ),
  ],

  render: (args) => (
    <VideoCommentSidebar {...args} wrapperStyle={wrapperStyle} />
  ),
}
