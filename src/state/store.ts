import { create } from 'zustand'
import type { AnchorId } from '../anchors'

type Store = {
  /** Which anchor is currently focused. null = home pose. */
  activeAnchor: AnchorId | null
  setActiveAnchor: (id: AnchorId | null) => void

  /** Which blog post is being read inside the overlay. null = list view. */
  readingSlug: string | null
  setReadingSlug: (slug: string | null) => void
}

export const useLoftStore = create<Store>((set) => ({
  activeAnchor: null,
  setActiveAnchor: (id) => set({ activeAnchor: id, readingSlug: null }),

  readingSlug: null,
  setReadingSlug: (slug) => set({ readingSlug: slug }),
}))
