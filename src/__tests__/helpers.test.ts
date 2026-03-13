import { describe, it, expect } from 'vitest'
import {
  formatTime,
  toPercentage,
  toTimestamp,
  generateId,
} from '@/utils/helpers'

describe('formatTime', () => {
  it('formats seconds under a minute', () => {
    expect(formatTime(5)).toBe('0:05')
    expect(formatTime(59)).toBe('0:59')
  })

  it('formats minutes and seconds', () => {
    expect(formatTime(83)).toBe('1:23')
    expect(formatTime(3599)).toBe('59:59')
  })

  it('formats hours', () => {
    expect(formatTime(3600)).toBe('1:00:00')
    expect(formatTime(3661)).toBe('1:01:01')
  })

  it('handles zero', () => {
    expect(formatTime(0)).toBe('0:00')
  })
})

describe('toPercentage', () => {
  it('returns correct percentage', () => {
    expect(toPercentage(30, 120)).toBe(25)
    expect(toPercentage(60, 120)).toBe(50)
  })

  it('clamps to 0 when duration is 0', () => {
    expect(toPercentage(30, 0)).toBe(0)
  })

  it('clamps to 100 at max', () => {
    expect(toPercentage(150, 120)).toBe(100)
  })

  it('never returns negative', () => {
    expect(toPercentage(-10, 120)).toBe(0)
  })
})

describe('toTimestamp', () => {
  it('converts percentage back to seconds', () => {
    expect(toTimestamp(25, 120)).toBe(30)
    expect(toTimestamp(50, 120)).toBe(60)
  })

  it('clamps to duration', () => {
    expect(toTimestamp(110, 120)).toBe(120)
  })
})

describe('generateId', () => {
  it('returns a non-empty string', () => {
    expect(typeof generateId()).toBe('string')
    expect(generateId().length).toBeGreaterThan(0)
  })

  it('generates unique ids', () => {
    const ids = new Set(Array.from({ length: 100 }, generateId))
    expect(ids.size).toBe(100)
  })
})
