import { useVideoCommentContext } from '../components/VideoCommentProvider'

/**
 * Access the full VideoComment context from anywhere inside <VideoCommentProvider>.
 *
 * @example
 * const { comments, addComment, seekTo, duration, currentTime } = useVideoComments();
 */
export function useVideoComments() {
  return useVideoCommentContext()
}
