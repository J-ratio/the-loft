import ReactMarkdown from 'react-markdown'
import type { Post } from './content'

type Props = {
  post: Post
  onBack?: () => void
}

/**
 * Shared reader view — used both inside the scene overlay and on /blog/:slug.
 */
export function BlogReader({ post, onBack }: Props) {
  return (
    <article className="font-serif text-neutral-100">
      {onBack && (
        <button
          onClick={onBack}
          className="text-xs text-neutral-400 hover:text-neutral-100 font-mono mb-4"
        >
          ← back
        </button>
      )}
      <h1 className="text-2xl mb-1">{post.title}</h1>
      <div className="text-xs text-neutral-400 font-mono mb-6">{post.date}</div>
      <div className="prose-loft space-y-4 leading-relaxed">
        <ReactMarkdown>{post.body}</ReactMarkdown>
      </div>
    </article>
  )
}
