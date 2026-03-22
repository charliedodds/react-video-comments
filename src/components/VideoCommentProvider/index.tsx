import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useMemo,
  type FC,
} from 'react'
import type {
  VideoComment,
  VideoCommentAuthor,
  VideoCommentContextValue,
  VideoCommentProviderProps,
} from '@/types'
import { videoCommentReducer } from '@/utils/reducer'
import { formatTime, generateId } from '@/utils/helpers'
import { lightTheme, themeToVars } from '@/utils/theme'
import { useStableId } from '@/hooks/useStableId'

export const VideoCommentContext =
  createContext<VideoCommentContextValue | null>(null)

export const VideoCommentProvider: FC<VideoCommentProviderProps> = ({
  children,
  user,
  videoTitle,
  initialComments = [],
  initialSidebarOpen = false,
  onCommentsChange,
  theme,
  sidebarBreakpoint = 768,
  sidebarWidth = '320px',
}) => {
  const uid = useStableId()

  const cssVars = useMemo(
    () => themeToVars({ ...lightTheme, ...theme }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(theme)]
  )
  const [state, dispatch] = useReducer(videoCommentReducer, {
    user,
    videoTitle,
    comments: [...initialComments].sort((a, b) => a.timestamp - b.timestamp),
    activeComment: null,
    duration: 0,
    currentTime: 0,
    isPlaying: false,
    isShowingSidebar: initialSidebarOpen,
  })

  useEffect(() => {
    onCommentsChange?.(state.comments)
  }, [state.comments, onCommentsChange])

  const setComments = useCallback((comments: VideoComment[]) => {
    dispatch({ type: 'SET_COMMENTS', payload: comments })
  }, [])

  const addComment = useCallback(
    (
      timestamp: number,
      body: string,
      author?: VideoCommentAuthor,
      id = generateId()
    ) => {
      const resolvedAuthor = author ?? user
      if (!resolvedAuthor)
        throw new Error(
          'No author provided and no user set on VideoCommentProvider'
        )
      dispatch({
        type: 'ADD_COMMENT',
        payload: {
          id,
          timestamp,
          formattedTime: formatTime(timestamp),
          body,
          author: resolvedAuthor,
          replies: [],
          createdAt: new Date(),
        },
      })
    },
    [user]
  )

  const removeComment = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_COMMENT', payload: id })
  }, [])

  const updateComment = useCallback((id: string, body: string) => {
    dispatch({ type: 'UPDATE_COMMENT', payload: { id, body } })
  }, [])

  const addReply = useCallback(
    (
      commentId: string,
      body: string,
      author?: VideoCommentAuthor,
      id = generateId()
    ) => {
      const resolvedAuthor = author ?? user
      if (!resolvedAuthor)
        throw new Error(
          'No author provided and no user set on VideoCommentProvider'
        )
      dispatch({
        type: 'ADD_REPLY',
        payload: {
          commentId,
          reply: {
            id,
            body,
            author: resolvedAuthor,
            createdAt: new Date(),
          },
        },
      })
    },
    [user]
  )

  const removeReply = useCallback((commentId: string, replyId: string) => {
    dispatch({ type: 'REMOVE_REPLY', payload: { commentId, replyId } })
  }, [])

  const seekTo = useCallback((timestamp: number) => {
    dispatch({ type: 'SET_CURRENT_TIME', payload: timestamp })
  }, [])

  const setDuration = useCallback((duration: number) => {
    dispatch({ type: 'SET_DURATION', payload: duration })
  }, [])

  const setCurrentTime = useCallback((time: number) => {
    dispatch({ type: 'SET_CURRENT_TIME', payload: time })
  }, [])

  const setActiveComment = useCallback(
    (comment: VideoCommentContextValue['activeComment']) => {
      dispatch({ type: 'SET_ACTIVE_COMMENT', payload: comment })
    },
    []
  )

  const setIsPlaying = useCallback((playing: boolean) => {
    dispatch({ type: 'SET_IS_PLAYING', payload: playing })
  }, [])

  const setIsShowingSidebar = useCallback((showing: boolean) => {
    dispatch({ type: 'SET_IS_SHOWING_SIDEBAR', payload: showing })
  }, [])

  return (
    <VideoCommentContext.Provider
      value={{
        ...state,
        setComments,
        addComment,
        removeComment,
        updateComment,
        addReply,
        removeReply,
        seekTo,
        setDuration,
        setCurrentTime,
        setActiveComment,
        setIsPlaying,
        setIsShowingSidebar,
      }}
    >
      <style>{`
        .rvc-provider-${uid} {
          --rvc-sidebar-width: 100vw;
          --rvc-video-max-height: 100svh;
        }
        @media (min-width: ${sidebarBreakpoint}px) {
          .rvc-provider-${uid} {
            --rvc-sidebar-width: ${sidebarWidth};
          }
        }
      `}</style>
      <div
        className={`rvc-provider-${uid}`}
        style={
          {
            ...(cssVars as React.CSSProperties),
            color: 'var(--rvc-text)',
            background: 'var(--rvc-bg)',
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </VideoCommentContext.Provider>
  )
}

export function useVideoCommentContext(): VideoCommentContextValue {
  const ctx = useContext(VideoCommentContext)
  if (!ctx) {
    throw new Error(
      '[react-video-comments] useVideoComments must be used inside <VideoCommentProvider>.'
    )
  }
  return ctx
}
