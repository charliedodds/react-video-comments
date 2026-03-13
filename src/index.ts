export { VideoCommentProvider } from '@/components/VideoCommentProvider'
export { useVideoComments } from '@/hooks/useVideoComments'
export { useVideoSync } from '@/hooks/useVideoSync'

export {
  formatTime,
  toPercentage,
  toTimestamp,
  getInitials,
  getAvatarColor,
} from '@/utils/helpers'

export { lightTheme, darkTheme } from '@/utils/theme'

export type {
  VideoComment,
  VideoCommentReply,
  VideoCommentAuthor,
  VideoCommentState,
  VideoCommentActions,
  VideoCommentContextValue,
  VideoCommentProviderProps,
} from '@/types'
export type { VideoCommentTheme } from '@/utils/theme'
