import { create } from 'zustand'
import type { AnchorId } from '../anchors'

type Store = {
  /** Which anchor is currently focused. null = home pose. */
  activeAnchor: AnchorId | null
  setActiveAnchor: (id: AnchorId | null) => void

  /** Whether the notebook 2D overlay is open. */
  notebookOpen: boolean
  setNotebookOpen: (open: boolean) => void

  /** Which blog post is being read inside the overlay. null = list view. */
  readingSlug: string | null
  setReadingSlug: (slug: string | null) => void
}

export const useLoftStore = create<Store>((set) => ({
  activeAnchor: null,
  setActiveAnchor: (id) => set({ activeAnchor: id, readingSlug: null, notebookOpen: false }),

  notebookOpen: false,
  setNotebookOpen: (open) => set({ notebookOpen: open }),

  readingSlug: null,
  setReadingSlug: (slug) => set({ readingSlug: slug }),
}))

if (import.meta.env.DEV && typeof window !== 'undefined') {
  ;(window as unknown as { __loft?: unknown }).__loft = useLoftStore
}
