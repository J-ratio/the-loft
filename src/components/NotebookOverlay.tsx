import { useEffect, useRef, useState } from 'react'
import { PageFlip } from 'page-flip'
import ReactMarkdown from 'react-markdown'
import { useLoftStore } from '../state/store'
import { listPosts } from '../blog/content'

export function NotebookOverlay() {
  const notebookOpen = useLoftStore((s) => s.notebookOpen)
  const setNotebookOpen = useLoftStore((s) => s.setNotebookOpen)

  const handleClose = () => {
    setNotebookOpen(false)
  }

  if (!notebookOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose()
      }}
    >
      <div className="relative">
        <FlipBook key="notebook" />
      </div>
    </div>
  )
}

function FlipBook() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const flipRef = useRef<PageFlip | null>(null)
  const [ready, setReady] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const pageIndexMap = useRef<Record<string, number>>({})
  const blockFlipRef = useRef(false)

  const posts = listPosts()

  useEffect(() => {
    const raf = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    if (!ready || !wrapperRef.current) return

    const container = wrapperRef.current

    // Block PageFlip's mousedown when clicking interactive elements
    container.addEventListener('mousedown', (e) => {
      if ((e.target as HTMLElement).closest('[data-no-flip]')) {
        e.stopImmediatePropagation()
        blockFlipRef.current = true
      }
    }, true)

    const pages = container.querySelectorAll('.page')
    if (pages.length === 0) return

    const vw = window.innerWidth
    const vh = window.innerHeight
    const pageWidth = Math.min(Math.floor(vw * 0.42), 620)
    const pageHeight = Math.min(Math.floor(vh * 0.82), 780)

    const pf = new PageFlip(container, {
      width: pageWidth,
      height: pageHeight,
      showCover: true,
      maxShadowOpacity: 0.3,
      mobileScrollSupport: false,
      flippingTime: 600,
      useMouseEvents: true,
      swipeDistance: 50,
      startPage: 0,
      clickEventForward: false,
      disableFlipByClick: true,
      usePortrait: false,
      showPageCorners: false,
    })

    pf.loadFromHTML(pages as unknown as HTMLElement[])
    flipRef.current = pf
    setInitialized(true)

    return () => {
      pf.destroy()
      flipRef.current = null
    }
  }, [ready])

  const flipToPost = (slug: string) => {
    const idx = pageIndexMap.current[slug]
    if (idx != null && flipRef.current) {
      setTimeout(() => flipRef.current?.flip(idx), 10)
    }
  }

  const { pages: allPages, indexMap } = buildPages(posts, flipToPost)
  pageIndexMap.current = indexMap

  return (
    <div ref={wrapperRef} className="notebook-flip" style={{ visibility: initialized ? 'visible' : 'hidden' }}>
      {allPages}
    </div>
  )
}

function buildPages(posts: ReturnType<typeof listPosts>, onFlipTo: (slug: string) => void) {
  const pages: React.ReactNode[] = []
  const indexMap: Record<string, number> = {}

  // Front cover — vintage leather style
  pages.push(
    <div key="cover-front" className="page page-cover" data-density="hard">
      <div className="h-full flex flex-col items-center justify-center rounded-r-md relative"
        style={{ background: 'linear-gradient(145deg, #5a3520 0%, #3a1e10 100%)' }}
      >
        {/* Emboss border */}
        <div className="absolute inset-4 border border-amber-700/40 rounded-sm" />
        <div className="absolute inset-6 border border-amber-800/30 rounded-sm" />
        <div className="text-4xl font-serif tracking-wide text-amber-200/90">Journal</div>
        <div className="text-[10px] font-mono mt-3 text-amber-400/50 tracking-widest uppercase">slide to open →</div>
        {/* Strap detail */}
        <div className="absolute right-6 top-0 bottom-0 w-2 bg-amber-950/60" />
        <div className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-3 rounded-sm bg-amber-600/70 border border-amber-500/50" />
      </div>
    </div>
  )

  // TOC page
  pages.push(
    <div key="toc" className="page page-unruled">
      <div className="h-full p-8 bg-transparent overflow-hidden">
        <div className="text-base font-mono text-amber-700 tracking-widest mb-6">CONTENTS</div>
        <ul className="space-y-5" data-no-flip>
          {posts.map((p) => (
            <li key={p.slug}>
              <button
                onClick={() => onFlipTo(p.slug)}
                className="text-left w-full hover:bg-amber-100 rounded px-3 py-2 transition-colors"
              >
                <div className="text-lg font-serif text-amber-950">{p.title}</div>
                <div className="text-base font-mono text-amber-600">{p.date}</div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )

  // Each blog post split into pages
  for (const post of posts) {
    const chunks = paginateContent(post.body)

    // Ensure title page lands on left side of spread.
    // In page-flip with showCover, page indices after cover:
    // index 1 = right, index 2 = left, index 3 = right, etc.
    // Left pages have even index. So we want title at even index.
    const currentIdx = pages.length
    if (currentIdx % 2 === 0) {
      pages.push(
        <div key={`${post.slug}-sep`} className="page page-unruled">
          <div className="h-full bg-transparent" />
        </div>
      )
    }

    // Title page for the post
    indexMap[post.slug] = pages.length
    pages.push(
      <div key={`${post.slug}-title`} className="page page-unruled">
        <div className="h-full p-8 bg-transparent flex flex-col justify-center">
          <div className="text-2xl font-serif text-amber-950 mb-3">{post.title}</div>
          <div className="text-base font-mono text-amber-600 mb-4">{post.date}</div>
          <div className="w-12 h-px bg-amber-300" />
        </div>
      </div>
    )

    // Content pages
    for (let i = 0; i < chunks.length; i++) {
      pages.push(
        <div key={`${post.slug}-${i}`} className="page">
          <div className="h-full px-10 py-10 bg-transparent overflow-hidden relative">
            <div className="prose prose-lg prose-amber max-w-none text-amber-950 font-serif" style={{ fontSize: '1.05rem', lineHeight: '2rem' }}>
              <ReactMarkdown>{chunks[i]}</ReactMarkdown>
            </div>
            <div className="absolute bottom-4 right-5 text-[10px] font-mono text-amber-400/60">
              {i + 1}/{chunks.length}
            </div>
          </div>
        </div>
      )
    }
  }

  // Pad to even total (page-flip needs even page count excluding covers)
  const innerPages = pages.length - 1 // minus front cover
  if (innerPages % 2 !== 0) {
    pages.push(
      <div key="pad" className="page page-unruled">
        <div className="h-full bg-transparent" />
      </div>
    )
  }

  // Back cover
  pages.push(
    <div key="cover-back" className="page page-cover" data-density="hard">
      <div className="h-full rounded-l-md" style={{ background: 'linear-gradient(215deg, #5a3520 0%, #3a1e10 100%)' }} />
    </div>
  )

  return { pages, indexMap }
}

function paginateContent(markdown: string): string[] {
  const paragraphs = markdown.split('\n\n')
  const pages: string[] = []
  let current = ''

  for (const para of paragraphs) {
    const combined = current ? current + '\n\n' + para : para
    if (combined.length > 1400 && current) {
      pages.push(current)
      current = para
    } else {
      current = combined
    }
  }
  if (current) pages.push(current)

  return pages.length > 0 ? pages : ['']
}
