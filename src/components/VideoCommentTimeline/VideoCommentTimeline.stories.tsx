import type { Meta, StoryObj } from '@storybook/react'
import { useEffect } from 'react'
import { VideoCommentProvider } from '@/components/VideoCommentProvider'
import { VideoCommentTimeline } from '@/components/VideoCommentTimeline'
import { useVideoComments } from '@/hooks/useVideoComments'
import type { VideoCommentAuthor } from '@/types'

const meta: Meta<typeof VideoCommentTimeline> = {
  title: 'Prebuilt/VideoCommentTimeline',
  component: VideoCommentTimeline,
  argTypes: {
    trackHeight: { control: { type: 'range', min: 2, max: 12 } },
    markerSize: { control: { type: 'range', min: 16, max: 40 } },
    markerGap: { control: { type: 'range', min: 0, max: 12 } },
    progressColor: { control: 'color' },
    trackColor: { control: 'color' },
  },
}

export default meta

const authors: VideoCommentAuthor[] = [
  { id: 'user-1', name: 'Alice Johnson' },
  { id: 'user-2', name: 'Bob Smith' },
  { id: 'user-3', name: 'Carol White' },
]

const currentUser = authors[0]

function SeededTimeline(
  props: React.ComponentProps<typeof VideoCommentTimeline>
) {
  const { addComment, setDuration } = useVideoComments()

  useEffect(() => {
    setDuration(120)
    addComment(10, 'First comment', authors[0])
    addComment(45, 'Halfway through', authors[1])
    addComment(90, 'Near the end', authors[2])
  }, [addComment, setDuration])

  return (
    <div style={{ padding: '2rem' }}>
      <VideoCommentTimeline {...props} />
    </div>
  )
}

export const Default: StoryObj<typeof VideoCommentTimeline> = {
  decorators: [
    (Story) => (
      <VideoCommentProvider user={currentUser}>
        <Story />
      </VideoCommentProvider>
    ),
  ],
  render: (args) => <SeededTimeline {...args} />,
  args: {
    progressColor: '#ffffff',
    trackColor: 'rgba(255,255,255,0.25)',
    trackHeight: 4,
    markerSize: 26,
    markerGap: 4,
  },
}

export const Thick: StoryObj<typeof VideoCommentTimeline> = {
  decorators: [
    (Story) => (
      <VideoCommentProvider user={currentUser}>
        <Story />
      </VideoCommentProvider>
    ),
  ],
  render: (args) => <SeededTimeline {...args} />,
  args: {
    trackHeight: 8,
    markerSize: 34,
    progressColor: '#22d3ee',
  },
}
