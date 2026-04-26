import { Link, useNavigate, useParams } from 'react-router-dom'
import { getPost } from './content'
import { BlogReader } from './BlogReader'

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const post = slug ? getPost(slug) : undefined

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <nav className="mb-10 flex items-center justify-between text-xs font-mono text-neutral-500">
          <Link to="/blog" className="hover:text-neutral-100">← journal</Link>
          <Link to="/" className="hover:text-neutral-100">the loft</Link>
        </nav>
        {post ? (
          <BlogReader post={post} onBack={() => navigate('/blog')} />
        ) : (
          <p className="text-neutral-400">No such post.</p>
        )}
      </div>
    </main>
  )
}
