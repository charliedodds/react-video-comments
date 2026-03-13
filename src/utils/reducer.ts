import type {
  VideoComment,
  VideoCommentReply,
  VideoCommentState,
} from '../types'

export type VideoCommentAction =
  | { type: 'ADD_COMMENT'; payload: VideoComment }
  | { type: 'REMOVE_COMMENT'; payload: string }
  | { type: 'UPDATE_COMMENT'; payload: { id: string; body: string } }
  | {
      type: 'ADD_REPLY'
      payload: { commentId: string; reply: VideoCommentReply }
    }
  | { type: 'REMOVE_REPLY'; payload: { commentId: string; replyId: string } }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'SET_CURRENT_TIME'; payload: number }
  | { type: 'SET_ACTIVE_COMMENT'; payload: VideoComment | null }
  | { type: 'SET_COMMENTS'; payload: VideoComment[] }
  | { type: 'SET_IS_PLAYING'; payload: boolean }
  | { type: 'SET_IS_SHOWING_SIDEBAR'; payload: boolean }

export function videoCommentReducer(
  state: VideoCommentState,
  action: VideoCommentAction
): VideoCommentState {
  switch (action.type) {
    case 'ADD_COMMENT': {
      const comments = [...state.comments, action.payload].sort(
        (a, b) => a.timestamp - b.timestamp
      )
      return { ...state, comments }
    }

    case 'REMOVE_COMMENT': {
      const comments = state.comments.filter((c) => c.id !== action.payload)
      const activeComment =
        state.activeComment?.id === action.payload ? null : state.activeComment
      return { ...state, comments, activeComment }
    }

    case 'UPDATE_COMMENT': {
      const comments = state.comments.map((c) =>
        c.id === action.payload.id ? { ...c, body: action.payload.body } : c
      )
      return { ...state, comments }
    }

    case 'ADD_REPLY': {
      const comments = state.comments.map((c) =>
        c.id === action.payload.commentId
          ? { ...c, replies: [...(c.replies ?? []), action.payload.reply] }
          : c
      )
      const activeComment =
        state.activeComment?.id === action.payload.commentId
          ? (comments.find((c) => c.id === action.payload.commentId) ?? null)
          : state.activeComment
      return { ...state, comments, activeComment }
    }

    case 'REMOVE_REPLY': {
      const comments = state.comments.map((c) =>
        c.id === action.payload.commentId
          ? {
              ...c,
              replies: (c.replies ?? []).filter(
                (r) => r.id !== action.payload.replyId
              ),
            }
          : c
      )
      const activeComment =
        state.activeComment?.id === action.payload.commentId
          ? (comments.find((c) => c.id === action.payload.commentId) ?? null)
          : state.activeComment
      return { ...state, comments, activeComment }
    }

    case 'SET_DURATION':
      return { ...state, duration: action.payload }

    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: action.payload }

    case 'SET_ACTIVE_COMMENT':
      return { ...state, activeComment: action.payload }

    case 'SET_IS_PLAYING':
      return { ...state, isPlaying: action.payload }

    case 'SET_IS_SHOWING_SIDEBAR':
      return { ...state, isShowingSidebar: action.payload }

    case 'SET_COMMENTS': {
      const comments = [...action.payload].sort(
        (a, b) => a.timestamp - b.timestamp
      )
      return { ...state, comments }
    }

    default:
      return state
  }
}
