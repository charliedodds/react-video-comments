/* eslint-disable react-hooks/rules-of-hooks */
import * as ReactNS from 'react'
import { useRef } from 'react'

let counter = 0

const nativeUseId = (ReactNS as { useId?: () => string }).useId

/**
 * Returns a stable unique id for the lifetime of the component.
 * Uses React 18's `useId` when available; falls back to a module-level
 * counter on React 17 so the hook is safe across all supported versions.
 *
 * The returned string contains only alphanumeric characters and is safe
 * to use in class names and CSS selectors.
 */
export function useStableId(): string {
  if (nativeUseId) {
    return nativeUseId().replace(/\W/g, '')
  }

  const ref = useRef<string | null>(null)
  if (ref.current === null) {
    ref.current = `rvc${counter++}`
  }
  return ref.current
}
