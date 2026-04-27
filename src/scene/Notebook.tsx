import { Html } from '@react-three/drei'
import ReactMarkdown from 'react-markdown'
import { useState } from 'react'
import { useLoftStore } from '../state/store'
import { listPosts, getPost } from '../blog/content'

/**
 * Open notebook on the desk — the Blog anchor.
 *
 * Primitive: two slightly-tilted page planes + cover + spine.
 * Clicking the notebook opens the Blog: the camera dollies to the desk
 * focus pose, and blog content renders AS HTML attached to the right page.
 *
 * Position: on top of the desk_set (desk at z=-3.15, top ~y=0.73).
 */
export function Notebook() {
  const setActiveAnchor = useLoftStore((s) => s.setActiveAnchor)
  const activeAnchor = useLoftStore((s) => s.activeAnchor)
  const readingSlug = useLoftStore((s) => s.readingSlug)
  const setReadingSlug = useLoftStore((s) => s.setReadingSlug)
  const [hovered, setHovered] = useState(false)

  const open = activeAnchor === 'desk'
  const reading = readingSlug ? getPost(readingSlug) : undefined

  return (
    <group position={[0, 0.85, -3.15]} rotation={[0, 0.1, 0]}>
      {/* Dark book cover underneath */}
      <mesh castShadow position={[0, -0.003, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.34, 0.26]} />
        <meshStandardMaterial color="#3a2618" roughness={0.8} />
      </mesh>

      {/* Spine */}
      <mesh castShadow position={[0, 0.002, 0]}>
        <boxGeometry args={[0.01, 0.008, 0.24]} />
        <meshStandardMaterial color="#2a1810" roughness={0.7} />
      </mesh>

      {/* Left page */}
      <mesh
        castShadow
        position={[-0.085, 0.006, 0]}
        rotation={[-Math.PI / 2, 0, -0.04]}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = 'auto'
        }}
        onClick={(e) => {
          e.stopPropagation()
          if (!open) setActiveAnchor('desk')
        }}
      >
        <planeGeometry args={[0.15, 0.22]} />
        <meshStandardMaterial
          color={hovered && !open ? '#fff5e0' : '#f0e4c8'}
          roughness={0.95}
        />
      </mesh>

      {/* Right page */}
      <mesh
        castShadow
        position={[0.085, 0.006, 0]}
        rotation={[-Math.PI / 2, 0, 0.04]}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = 'auto'
        }}
        onClick={(e) => {
          e.stopPropagation()
          if (!open) setActiveAnchor('desk')
        }}
      >
        <planeGeometry args={[0.15, 0.22]} />
        <meshStandardMaterial
          color={hovered && !open ? '#fff5e0' : '#f0e4c8'}
          roughness={0.95}
        />
      </mesh>

      {/* In-scene blog content — HTML plane positioned just above the pages,
          rendered with drei's <Html transform>. */}
      {open && (
        <Html
          transform
          position={[0, 0.012, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={0.003}
          style={{ width: '120px', pointerEvents: 'auto' }}
        >
          <div
            className="font-serif text-amber-950"
            onClick={(e) => e.stopPropagation()}
            style={{ padding: '2px 6px' }}
          >
            {!reading && <NotebookIndex onSelect={setReadingSlug} />}
            {reading && (
              <NotebookPost
                post={reading}
                onBack={() => setReadingSlug(null)}
              />
            )}
          </div>
        </Html>
      )}
    </group>
  )
}

function NotebookIndex({ onSelect }: { onSelect: (slug: string) => void }) {
  const posts = listPosts()
  return (
    <div>
      <div style={{ fontSize: '5px', letterSpacing: '0.1em', marginBottom: '4px', fontFamily: 'monospace', color: '#8a5a2c' }}>
        JOURNAL
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {posts.map((p) => (
          <li key={p.slug} style={{ marginBottom: '3px' }}>
            <button
              onClick={() => onSelect(p.slug)}
              style={{
                background: 'transparent',
                border: 'none',
                padding: 0,
                textAlign: 'left',
                fontFamily: 'inherit',
                color: 'inherit',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: '6px', lineHeight: 1.2 }}>{p.title}</div>
              <div style={{ fontSize: '3.5px', fontFamily: 'monospace', color: '#a87c50' }}>{p.date}</div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function NotebookPost({
  post,
  onBack,
}: {
  post: { slug: string; title: string; date: string; body: string }
  onBack: () => void
}) {
  return (
    <div>
      <button
        onClick={onBack}
        style={{
          background: 'transparent',
          border: 'none',
          padding: 0,
          fontSize: '3.5px',
          fontFamily: 'monospace',
          color: '#8a5a2c',
          cursor: 'pointer',
          marginBottom: '3px',
        }}
      >
        ← back
      </button>
      <div style={{ fontSize: '6px', lineHeight: 1.2, marginBottom: '2px', fontWeight: 'bold' }}>
        {post.title}
      </div>
      <div style={{ fontSize: '3.5px', fontFamily: 'monospace', color: '#a87c50', marginBottom: '3px' }}>
        {post.date}
      </div>
      <div style={{ fontSize: '3.5px', lineHeight: 1.35 }}>
        <ReactMarkdown>{post.body}</ReactMarkdown>
      </div>
    </div>
  )
}
