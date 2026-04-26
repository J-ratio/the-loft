import '../lib/buffer-shim'
import matter from 'gray-matter'

export type Post = {
  slug: string
  title: string
  date: string
  body: string
}

type Frontmatter = {
  title?: string
  date?: string | Date
  slug?: string
}

// Load all markdown files at build time. `?raw` gives us the raw string.
const rawModules = import.meta.glob('../../content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

function filenameToSlug(path: string): string {
  const match = path.match(/([^/]+)\.md$/)
  return match ? match[1] : path
}

function parsePost(path: string, raw: string): Post {
  const { data, content } = matter(raw)
  const fm = data as Frontmatter
  const slug = fm.slug ?? filenameToSlug(path)
  const date =
    fm.date instanceof Date
      ? fm.date.toISOString().slice(0, 10)
      : (fm.date ?? '')
  return {
    slug,
    title: fm.title ?? slug,
    date,
    body: content.trim(),
  }
}

const posts: Post[] = Object.entries(rawModules)
  .map(([path, raw]) => parsePost(path, raw))
  .sort((a, b) => (a.date < b.date ? 1 : -1))

export function listPosts(): Post[] {
  return posts
}

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug)
}
