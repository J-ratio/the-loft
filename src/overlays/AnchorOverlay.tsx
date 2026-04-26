import { useEffect } from 'react'
import { useLoftStore } from '../state/store'
import { getAnchor } from '../anchors'
import { listPosts, getPost } from '../blog/content'
import { BlogList } from '../blog/BlogList'
import { BlogReader } from '../blog/BlogReader'

/**
 * HTML overlay that floats on top of the Canvas.
 * Contents are driven by the active anchor's `overlay` type.
 */
export function AnchorOverlay() {
  const activeAnchor = useLoftStore((s) => s.activeAnchor)
  const setActiveAnchor = useLoftStore((s) => s.setActiveAnchor)
  const readingSlug = useLoftStore((s) => s.readingSlug)
  const setReadingSlug = useLoftStore((s) => s.setReadingSlug)

  // ESC closes the overlay and returns camera home.
  useEffect(() => {
    if (!activeAnchor) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (readingSlug) setReadingSlug(null)
        else setActiveAnchor(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeAnchor, readingSlug, setActiveAnchor, setReadingSlug])

  if (!activeAnchor) return null

  const anchor = getAnchor(activeAnchor)
  if (!anchor) return null

  const reading = readingSlug ? getPost(readingSlug) : undefined

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none">
      <div
        className="pointer-events-auto bg-neutral-900/95 backdrop-blur border border-neutral-700 rounded-lg shadow-2xl w-[min(640px,90vw)] max-h-[80vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono tracking-widest text-neutral-500">
            {anchor.label}
          </span>
          <button
            onClick={() => setActiveAnchor(null)}
            className="text-neutral-500 hover:text-neutral-100 text-sm"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {anchor.overlay === 'blog' && !reading && (
          <BlogList posts={listPosts()} onSelect={setReadingSlug} />
        )}
        {anchor.overlay === 'blog' && reading && (
          <BlogReader post={reading} onBack={() => setReadingSlug(null)} />
        )}
      </div>
    </div>
  )
}
