import type { FC } from 'react'
import { getInitials, getAvatarColor } from '@/utils/helpers'
import type { VideoCommentAuthor } from '@/types'

export interface VideoCommentAvatarProps {
  author: VideoCommentAuthor
  size?: number
}

export const VideoCommentAvatar: FC<VideoCommentAvatarProps> = ({
  author,
  size = 28,
}) => {
  const bg = author.avatarBgColor ?? getAvatarColor(author.id)
  const color = author.avatarTextColor ?? 'white'
  const initials = author.initials ?? getInitials(author.name)

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.36,
        fontWeight: 700,
        color,
        letterSpacing: '0.02em',
        flexShrink: 0,
        userSelect: 'none',
        pointerEvents: 'none',
      }}
    >
      {initials}
    </div>
  )
}
