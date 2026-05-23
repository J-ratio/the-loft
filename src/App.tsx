import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { Scene } from './scene/Scene'
import { BlogIndexPage } from './blog/BlogIndexPage'
import { BlogPostPage } from './blog/BlogPostPage'
import { NotebookOverlay } from './components/NotebookOverlay'

export function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<><Scene /><NotebookOverlay /></>} />
          <Route path="/blog" element={<BlogIndexPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
        </Routes>
      </BrowserRouter>
      <Analytics />
    </>
  )
}
