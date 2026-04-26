import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Scene } from './scene/Scene'
import { BlogIndexPage } from './blog/BlogIndexPage'
import { BlogPostPage } from './blog/BlogPostPage'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Scene />} />
        <Route path="/blog" element={<BlogIndexPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
      </Routes>
    </BrowserRouter>
  )
}
