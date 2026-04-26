import { useNavigate, Link } from 'react-router-dom'
import { listPosts } from './content'
import { BlogList } from './BlogList'

export function BlogIndexPage() {
  const navigate = useNavigate()
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <nav className="mb-10 flex items-center justify-between text-xs font-mono text-neutral-500">
          <Link to="/" className="hover:text-neutral-100">← the loft</Link>
          <span className="tracking-widest">JOURNAL</span>
        </nav>
        <h1 className="font-serif text-3xl mb-8">Writing</h1>
        <BlogList
          posts={listPosts()}
          onSelect={(slug) => navigate(`/blog/${slug}`)}
        />
      </div>
    </main>
  )
}
