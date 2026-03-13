import type { CSSProperties } from 'react'

export const ghostButtonStyles: CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--rvc-text-muted)',
  cursor: 'pointer',
  fontSize: '0.72rem',
  padding: 0,
  transition: 'color 0.15s',
  lineHeight: 1,
}

export const textareaStyles: CSSProperties = {
  resize: 'none',
  background: 'var(--rvc-bg-subtle)',
  border: '1px solid var(--rvc-border)',
  borderRadius: '0.375rem',
  padding: '0.4rem 0.6rem',
  fontSize: '0.825rem',
  color: 'var(--rvc-text)',
  outline: 'none',
  fontFamily: 'inherit',
  width: '100%',
  boxSizing: 'border-box',
}

export function getSubmitButtonStyles(enabled: boolean): CSSProperties {
  return {
    alignSelf: 'flex-end',
    padding: '0.35rem 0.9rem',
    borderRadius: '0.375rem',
    border: 'none',
    background: 'var(--rvc-accent)',
    color: 'var(--rvc-accent-fg)',
    fontWeight: 600,
    fontSize: '0.8rem',
    cursor: enabled ? 'pointer' : 'not-allowed',
    opacity: enabled ? 1 : 0.4,
    flexShrink: 0,
  }
}

export const overlayIconButtonStyles: CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--rvc-overlay-fg)',
  cursor: 'pointer',
  padding: '0.25rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '0.25rem',
  flexShrink: 0,
}

export const dividerStyles: CSSProperties = {
  height: 1,
  background: 'var(--rvc-border-subtle)',
  margin: '0 0.75rem',
}

export const closeButtonStyles: CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--rvc-text-muted)',
  cursor: 'pointer',
  padding: '0.125rem',
  fontSize: '1rem',
  lineHeight: 1,
}
