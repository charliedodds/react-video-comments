import { VideoCommentTheme } from '@/utils/theme'

export interface VideoCommentAuthor {
  id: string
  name: string
  /** Optional: override initials (defaults to first letter of first + last name) */
  initials?: string
  /** Optional: override avatar background colour (defaults to a hash of the id) */
  avatarBgColor?: string
  /** Optional: override avatar text colour (defaults to white) */
  avatarTextColor?: string
}

export interface VideoCommentReply {
  id: string
  body: string
  author: VideoCommentAuthor
  createdAt: Date
}

export interface VideoComment {
  id: string
  timestamp: number
  formattedTime: string
  body: string
  author: VideoCommentAuthor
  replies?: VideoCommentReply[]
  createdAt: Date
}

export interface VideoCommentState {
  user: VideoCommentAuthor
  videoTitle?: string
  comments: VideoComment[]
  activeComment: VideoComment | null
  duration: number
  currentTime: number
  isPlaying: boolean
  isShowingSidebar: boolean
}

export interface VideoCommentActions {
  setComments: (comments: VideoComment[]) => void
  addComment: (
    timestamp: number,
    body: string,
    author?: VideoCommentAuthor,
    id?: string
  ) => void
  removeComment: (id: string) => void
  updateComment: (id: string, body: string) => void
  addReply: (
    commentId: string,
    body: string,
    author?: VideoCommentAuthor,
    id?: string
  ) => void
  removeReply: (commentId: string, replyId: string) => void
  seekTo: (timestamp: number) => void
  setDuration: (duration: number) => void
  setCurrentTime: (time: number) => void
  setActiveComment: (comment: VideoComment | null) => void
  setIsPlaying: (playing: boolean) => void
  setIsShowingSidebar: (showing: boolean) => void
}

export type VideoCommentContextValue = VideoCommentState & VideoCommentActions

export interface VideoCommentProviderProps {
  children?: React.ReactNode
  user: VideoCommentAuthor
  videoTitle?: string
  initialComments?: VideoComment[]
  initialSidebarOpen?: boolean
  /** Sync comments with external state */
  onCommentsChange?: (comments: VideoComment[]) => void
  /** Import `lightTheme` or `darkTheme` from `react-video-comments` as a starting point. */
  theme?: Partial<VideoCommentTheme>
  sidebarBreakpoint?: number
  sidebarWidth?: string
}
