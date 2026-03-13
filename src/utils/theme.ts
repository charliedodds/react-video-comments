/**
 * Design tokens for react-video-comments.
 * All values are set as CSS custom properties on the VideoCommentProvider
 * wrapper, so any nested component can consume them via var(--rvc-*).
 */
export interface VideoCommentTheme {
  /** Panel and popover background */
  bg: string
  /** Input fields and secondary surface backgrounds */
  bgSubtle: string
  /** Borders */
  border: string
  /** Subtle dividers */
  borderSubtle: string
  /** Primary text */
  text: string
  /** Secondary / metadata text */
  textMuted: string
  /** Faint text used on ghost buttons */
  textFaint: string
  /** Accent colour — active states, submit buttons */
  accent: string
  /** Text rendered on top of the accent colour */
  accentFg: string
  /** Destructive action hover colour */
  danger: string
  /** Box shadow for floating elements */
  shadow: string
  /**
   * Gradient applied to the bottom of the video frame so bottom controls are legible.
   * This is intentionally dark regardless of theme since it overlays video content.
   */
  overlayGradientBottom: string
  /**
   * Gradient applied to the top of the video frame so top controls are legible.
   * This is intentionally dark regardless of theme since it overlays video content.
   */
  overlayGradientTop: string
  /** Foreground colour used inside the video overlay (icons, time display) */
  overlayFg: string
  /** Unplayed portion of the timeline track */
  track: string
  /** Played portion of the timeline track */
  progress: string
}

export function themeToVars(theme: VideoCommentTheme): Record<string, string> {
  return {
    '--rvc-bg': theme.bg,
    '--rvc-bg-subtle': theme.bgSubtle,
    '--rvc-border': theme.border,
    '--rvc-border-subtle': theme.borderSubtle,
    '--rvc-text': theme.text,
    '--rvc-text-muted': theme.textMuted,
    '--rvc-text-faint': theme.textFaint,
    '--rvc-accent': theme.accent,
    '--rvc-accent-fg': theme.accentFg,
    '--rvc-danger': theme.danger,
    '--rvc-shadow': theme.shadow,
    '--rvc-overlay-gradient-bottom': theme.overlayGradientBottom,
    '--rvc-overlay-gradient-top': theme.overlayGradientTop,
    '--rvc-overlay-fg': theme.overlayFg,
    '--rvc-track': theme.track,
    '--rvc-progress': theme.progress,
  }
}

export const lightTheme: VideoCommentTheme = {
  bg: '#ffffff',
  bgSubtle: 'rgba(0,0,0,0.05)',
  border: 'rgba(0,0,0,0.12)',
  borderSubtle: 'rgba(0,0,0,0.06)',
  text: '#111827',
  textMuted: 'rgba(0,0,0,0.45)',
  textFaint: 'rgba(0,0,0,0.3)',
  accent: '#2563eb',
  accentFg: '#ffffff',
  danger: '#dc2626',
  shadow: 'rgba(0,0,0,0.15)',
  overlayGradientBottom: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
  overlayGradientTop: 'linear-gradient(rgba(0,0,0,0.7), transparent)',
  overlayFg: '#ffffff',
  track: 'rgba(255,255,255,0.25)',
  progress: '#ffffff',
}

export const darkTheme: VideoCommentTheme = {
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
  overlayGradientBottom: 'linear-gradient(transparent, rgba(0,0,0,0.75))',
  overlayGradientTop: 'linear-gradient(rgba(0,0,0,0.75), transparent)',
  overlayFg: '#ffffff',
  track: 'rgba(255,255,255,0.25)',
  progress: '#ffffff',
}
