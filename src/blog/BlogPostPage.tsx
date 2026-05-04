import { Link, useNavigate, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { getPost } from './content'
import { BlogReader } from './BlogReader'

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const post = slug ? getPost(slug) : undefined

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 px-6 py-12">
      {post && (
        <Helmet>
          <title>{post.title} — Jatin Kishnani</title>
          <meta name="description" content={`${post.title} — a blog post by Jatin Kishnani.`} />
          <meta property="og:title" content={`${post.title} — Jatin Kishnani`} />
          <meta property="og:description" content={`${post.title} — a blog post by Jatin Kishnani.`} />
          <meta property="og:url" content={`https://the-loft.vercel.app/blog/${post.slug}`} />
          <link rel="canonical" href={`https://the-loft.vercel.app/blog/${post.slug}`} />
        </Helmet>
      )}
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
