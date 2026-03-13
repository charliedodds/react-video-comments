# react-video-comments

> Headless React primitives for timestamped video comments — like Loom's marker system.

[![CI](https://github.com/charliedodds/react-video-comments/actions/workflows/ci.yml/badge.svg)](https://github.com/your-username/react-video-comments/actions)
[![npm](https://img.shields.io/npm/v/react-video-comments)](https://www.npmjs.com/package/react-video-comments)
[![license](https://img.shields.io/npm/l/react-video-comments)](./LICENSE)

---

## Features

- 📍 Timestamped comments pinned to video progress
- 🎯 Headless core — bring your own markup and styles
- 🎨 Optional prebuilt UI layer for quick integration
- 🔷 Full TypeScript support
- 🪶 Zero runtime dependencies (React is a peer dep)
- ♿ Accessible by default (ARIA roles and keyboard nav)

---

## Install

```bash
npm install react-video-comments
```

React 17+ and react-dom are required as peer dependencies.

---

## Headless Usage

Use this if you want full control over your markup and styling.

```tsx
import { VideoCommentProvider, useVideoComments } from 'react-video-comments'

function VideoPage() {
  return (
    <VideoCommentProvider>
      <MyPlayer />
      <MyProgressBar />
      <MyCommentSidebar />
    </VideoCommentProvider>
  )
}

function MyProgressBar() {
  const { comments, duration, currentTime, seekTo } = useVideoComments()

  return (
    <div
      className="progress-bar"
      onClick={(e) => {
        /* seek on click */
      }}
    >
      <div style={{ width: `${(currentTime / duration) * 100}%` }} />
      {comments.map((comment) => (
        <button
          key={comment.id}
          style={{ left: `${(comment.timestamp / duration) * 100}%` }}
          onClick={() => seekTo(comment.timestamp)}
          title={comment.body}
        />
      ))}
    </div>
  )
}

function MyCommentSidebar() {
  const { comments, currentTime, addComment } = useVideoComments()

  return (
    <aside>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <span>{comment.formattedTime}</span>
            <p>{comment.body}</p>
          </li>
        ))}
      </ul>
      <button onClick={() => addComment(currentTime, 'My comment')}>
        Add comment
      </button>
    </aside>
  )
}
```

### Syncing a native `<video>` element

```tsx
import { useRef } from 'react'
import { VideoCommentProvider, useVideoSync } from 'react-video-comments'

function MyPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null)
  useVideoSync(videoRef) // syncs the video ↔ context automatically

  return <video ref={videoRef} src="/my-video.mp4" controls />
}
```

---

## Prebuilt Usage

For a quick drop-in integration using a native `<video>` element:

```tsx
import { VideoCommentProvider } from 'react-video-comments'
import {
  VideoCommentVideo,
  VideoCommentTimeline,
  VideoCommentSidebar,
} from 'react-video-comments/prebuilt'

function VideoPage() {
  return (
    <VideoCommentProvider>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <div style={{ flex: 1 }}>
          <VideoCommentVideo src="/my-video.mp4" controls />
          <VideoCommentTimeline />
        </div>
        <VideoCommentSidebar style={{ width: 300 }} />
      </div>
    </VideoCommentProvider>
  )
}
```

---

## API

### `<VideoCommentProvider>`

| Prop                 | Type                                 | Default      | Description                                                                |
| -------------------- | ------------------------------------ | ------------ | -------------------------------------------------------------------------- |
| `user`               | `VideoCommentAuthor`                 | -            | Current user to attribute comments and replies to                          |
| `initialComments`    | `VideoComment[]`                     | `[]`         | Pre-populate comments (e.g. from a database)                               |
| `onCommentsChange`   | `(comments: VideoComment[]) => void` | -            | Called whenever comments change                                            |
| `videoTitle`         | `string`                             | -            | Optional title shown in the sidebar header                                 |
| `initialSidebarOpen` | `boolean`                            | `false`      | Whether the sidebar starts open                                            |
| `sidebarBreakpoint`  | `number`                             | `768`        | Viewport width (px) at which the sidebar switches from full-width to fixed |
| `sidebarWidth`       | `string`                             | `"320px"`    | Sidebar width above the breakpoint. Any valid CSS length                   |
| `theme`              | `Partial<VideoCommentTheme>`         | `lightTheme` | Theme token overrides applied as CSS custom properties                     |

### `useVideoComments()`

Returns the full context:

| Value                 | Type                                | Description                            |
| --------------------- | ----------------------------------- | -------------------------------------- |
| `comments`            | `VideoComment[]`                    | All comments, sorted by timestamp      |
| `activeComment`       | `VideoComment \| null`              | Currently focused comment              |
| `duration`            | `number`                            | Video duration in seconds              |
| `currentTime`         | `number`                            | Current playback time in seconds       |
| `isPlaying`           | `boolean`                           | Whether the video is currently playing |
| `isShowingSidebar`    | `boolean`                           | Whether the sidebar is open            |
| `videoTitle`          | `string \| undefined`               | Title passed to the provider           |
| `addComment`          | `(timestamp, body, author) => void` | Add a new comment                      |
| `removeComment`       | `(id) => void`                      | Remove a comment                       |
| `updateComment`       | `(id, body) => void`                | Edit a comment's body                  |
| `addReply`            | `(commentId, body, author) => void` | Add a reply to a comment               |
| `removeReply`         | `(commentId, replyId) => void`      | Remove a reply                         |
| `seekTo`              | `(timestamp) => void`               | Seek video to a timestamp              |
| `setDuration`         | `(duration) => void`                | Set the video duration                 |
| `setCurrentTime`      | `(time) => void`                    | Update current playback time           |
| `setActiveComment`    | `(comment \| null) => void`         | Set the active comment                 |
| `setIsPlaying`        | `(playing) => void`                 | Update playing state                   |
| `setIsShowingSidebar` | `(showing) => void`                 | Open or close the sidebar              |

### `useVideoSync(ref)`

Syncs a native `HTMLVideoElement` ref with the VideoComment context. Call inside any component that is a child of `<VideoCommentProvider>`.

### Prebuilt Components

| Component                | Description                                                |
| ------------------------ | ---------------------------------------------------------- |
| `<VideoCommentVideo>`    | Wraps a native `<video>`, auto-syncs to context            |
| `<VideoCommentTimeline>` | Progress bar with comment marker pins and cluster popovers |
| `<VideoCommentSidebar>`  | Scrollable comment list with input                         |

---

## License

MIT
