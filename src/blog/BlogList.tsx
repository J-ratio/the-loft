import type { Post } from './content'

type Props = {
  posts: Post[]
  onSelect: (slug: string) => void
}

/**
 * Shared index view — used both inside the scene overlay and on /blog.
 */
export function BlogList({ posts, onSelect }: Props) {
  if (posts.length === 0) {
    return <p className="text-neutral-400 italic">No entries yet.</p>
  }
  return (
    <ul className="divide-y divide-neutral-700/60">
      {posts.map((p) => (
        <li key={p.slug}>
          <button
            onClick={() => onSelect(p.slug)}
            className="w-full text-left py-3 hover:bg-white/5 transition-colors px-2 -mx-2 rounded"
          >
            <div className="text-lg font-serif text-neutral-100">{p.title}</div>
            <div className="text-xs text-neutral-400 font-mono">{p.date}</div>
          </button>
        </li>
      ))}
    </ul>
  )
}
