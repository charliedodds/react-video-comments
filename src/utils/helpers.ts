/**
 * Formats raw seconds into a mm:ss or h:mm:ss string.
 * e.g. 83.4 → "1:23"
 */
export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }
  return `${m}:${s.toString().padStart(2, '0')}`
}

/**
 * Converts a timestamp (seconds) to a percentage of the total duration.
 * e.g. timestamp=30, duration=120 → 25
 */
export function toPercentage(timestamp: number, duration: number): number {
  if (duration <= 0) return 0
  return Math.min(100, Math.max(0, (timestamp / duration) * 100))
}

/**
 * Converts a percentage position back to a timestamp in seconds.
 * e.g. percentage=25, duration=120 → 30
 */
export function toTimestamp(percentage: number, duration: number): number {
  return Math.min(duration, Math.max(0, (percentage / 100) * duration))
}

/**
 * Derives initials from a full name.
 * "Jane Doe" → "JD", "Alice" → "A"
 */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/**
 * Generates a consistent avatar background colour from an author id.
 * Same id always produces the same colour.
 */
export function getAvatarColor(id: string): string {
  const palette = [
    '#e05c5c',
    '#e0835c',
    '#d4b84a',
    '#5cb85c',
    '#5cb8b2',
    '#5c8de0',
    '#8e5ce0',
    '#d45cb8',
  ]
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0
  }
  return palette[hash % palette.length]
}

/**
 * Groups comments that fall within `thresholdPct` percent of total duration
 * of each other into clusters. Comments are sorted by timestamp before
 * clustering, and each cluster is represented by the earliest comment's
 * timestamp as its anchor.
 *
 * @param comments - sorted array of VideoComment
 * @param duration - total video duration in seconds
 * @param thresholdPct - proximity threshold as a percentage of duration (default 5)
 */
export function clusterComments<T extends { timestamp: number }>(
  comments: T[],
  duration: number,
  thresholdPct = 5
): Array<{ anchor: number; comments: T[] }> {
  if (comments.length === 0) return []

  const sorted = [...comments].sort((a, b) => a.timestamp - b.timestamp)
  const clusters: Array<{ anchor: number; comments: T[] }> = []

  // When duration is unknown, skip proximity grouping — one cluster per comment
  const threshold = duration > 0 ? (thresholdPct / 100) * duration : 0

  for (const comment of sorted) {
    const last = clusters[clusters.length - 1]
    if (last && threshold > 0 && comment.timestamp - last.anchor <= threshold) {
      last.comments.push(comment)
    } else {
      clusters.push({ anchor: comment.timestamp, comments: [comment] })
    }
  }

  return clusters
}

/**
 * Generates a unique id. Uses crypto.randomUUID if available, otherwise falls
 * back to a simple random string so the package works in all environments.
 */
export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).slice(2, 11)
}
