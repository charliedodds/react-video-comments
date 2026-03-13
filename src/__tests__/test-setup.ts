import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// jsdom doesn't implement scrollIntoView
Element.prototype.scrollIntoView = vi.fn()

// jsdom doesn't implement HTMLMediaElement — stub out the parts we need
window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined)
window.HTMLMediaElement.prototype.pause = vi.fn()
window.HTMLMediaElement.prototype.load = vi.fn()

Object.defineProperty(HTMLMediaElement.prototype, 'duration', {
  configurable: true,
  get: () => 120,
})

Object.defineProperty(HTMLMediaElement.prototype, 'currentTime', {
  configurable: true,
  get: () => 0,
  set: vi.fn(),
})
