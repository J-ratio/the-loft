import { Buffer } from 'buffer'

// gray-matter expects Node's Buffer at runtime; provide it in the browser.
if (typeof window !== 'undefined' && !(window as unknown as { Buffer?: unknown }).Buffer) {
  ;(window as unknown as { Buffer: typeof Buffer }).Buffer = Buffer
}
