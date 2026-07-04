import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ChevronLeft, ChevronRight, Clock, Tag } from 'lucide-react'
import gsap from 'gsap'
import { BlogService } from '../services/BlogService'
import type { Blog } from '../services/BlogService'

/* ─── Blog Card ──────────────────────────────────────────────────────────── */
function BlogCard({ blog, index }: { blog: Blog; index: number }) {
  const cardRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!cardRef.current) return
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 40, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.7, delay: index * 0.1, ease: 'power3.out' }
    )
  }, [index])

  const formattedDate = new Date(blog.createdAt).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  })

  return (
    <article ref={cardRef as React.RefObject<HTMLElement>} style={{ opacity: 0 }}>
      <Link to={`/post/${blog.slug}`} id={`blog-card-${blog.slug}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
        <div
          style={{
            height: '100%', borderRadius: '16px', overflow: 'hidden',
            background: 'rgba(255,255,255,0.60)',
            backdropFilter: 'blur(16px) saturate(1.4)',
            WebkitBackdropFilter: 'blur(16px) saturate(1.4)',
            border: '1px solid rgba(255,255,255,0.45)',
            boxShadow: '0 4px 24px rgba(92,85,80,0.07)',
            display: 'flex', flexDirection: 'column',
            transition: 'transform 0.25s ease, box-shadow 0.25s ease', cursor: 'pointer',
          }}
          onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = '0 16px 48px rgba(92,85,80,0.14)' }}
          onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = '0 4px 24px rgba(92,85,80,0.07)' }}
        >
          {blog.coverImage && (
            <div style={{ height: '180px', overflow: 'hidden' }}>
              <img src={blog.coverImage} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {blog.tags?.length > 0 && (
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {blog.tags.slice(0, 3).map((tag) => (
                  <span key={tag} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                    fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase',
                    padding: '0.2rem 0.6rem', borderRadius: '20px',
                    background: 'rgba(92,85,80,0.08)', color: 'var(--stone-700)',
                  }}>
                    <Tag size={9} />{tag}
                  </span>
                ))}
              </div>
            )}
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700,
              color: 'var(--ink-900)', lineHeight: 1.3, letterSpacing: '-0.02em',
            }}>
              {blog.title}
            </h2>
            {blog.excerpt && (
              <p style={{
                fontSize: '0.88rem', color: 'var(--stone-500)', lineHeight: 1.6, flex: 1,
                display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>
                {blog.excerpt}
              </p>
            )}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              paddingTop: '0.75rem', borderTop: '1px solid rgba(92,85,80,0.1)', marginTop: 'auto',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--cream-300), var(--stone-500))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.7rem', fontWeight: 700, color: '#fff', overflow: 'hidden',
                }}>
                  {blog.author?.avatar
                    ? <img src={blog.author.avatar} alt={blog.author.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : blog.author?.name?.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--stone-700)' }}>{blog.author?.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--stone-500)', fontSize: '0.75rem' }}>
                <Clock size={12} strokeWidth={2} />{formattedDate}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}

/* ─── Feed Page ──────────────────────────────────────────────────────────── */
export function FeedPage() {
  const [blogs, setBlogs]             = useState<Blog[]>([])
  const [total, setTotal]             = useState(0)
  const [page, setPage]               = useState(1)
  const [query, setQuery]             = useState('')
  const [debouncedQuery, setDQ]       = useState('')
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState('')
  const limit   = 9
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => { const t = setTimeout(() => setDQ(query), 500); return () => clearTimeout(t) }, [query])
  useEffect(() => { setPage(1) }, [debouncedQuery])

  useEffect(() => {
    let cancelled = false
    setLoading(true); setError('')
    BlogService.getBlogs({ query: debouncedQuery, page, limit })
      .then((data) => { if (!cancelled) { setBlogs(data.blogs); setTotal(data.total) } })
      .catch((err: Error) => { if (!cancelled) setError(err.message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [debouncedQuery, page])

  useEffect(() => {
    if (!heroRef.current) return
    gsap.fromTo(heroRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' })
  }, [])

  const totalPages = Math.ceil(total / limit)

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem 6rem' }}>
      <header ref={heroRef} style={{ textAlign: 'center', marginBottom: '3.5rem', opacity: 0 }}>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 8vw, 4rem)',
          fontWeight: 700, color: 'var(--ink-900)', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '1rem',
        }}>
          Stories worth&nbsp;<span style={{ fontStyle: 'italic', color: 'var(--stone-500)' }}>reading.</span>
        </h1>
        <p style={{ color: 'var(--stone-500)', fontSize: '1.05rem', maxWidth: '440px', margin: '0 auto' }}>
          Thoughtfully written articles from authors who care about craft.
        </p>
      </header>

      <div style={{ maxWidth: '520px', margin: '0 auto 3rem', position: 'relative' }}>
        <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--stone-500)', pointerEvents: 'none' }} />
        <input
          id="blog-search" type="search" placeholder="Search stories…" value={query}
          onChange={(e) => setQuery(e.target.value)} aria-label="Search blog posts"
          style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 2.75rem', borderRadius: '12px', border: '1px solid rgba(92,85,80,0.15)', background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', fontSize: '0.95rem', color: 'var(--ink-900)', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s' }}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--stone-500)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(92,85,80,0.1)' }}
          onBlur={(e)  => { e.currentTarget.style.borderColor = 'rgba(92,85,80,0.15)'; e.currentTarget.style.boxShadow = 'none' }}
        />
      </div>

      {loading && <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--stone-500)' }}><p>Loading stories…</p></div>}
      {error   && <div style={{ textAlign: 'center', padding: '3rem', color: '#c0392b' }}><p>{error}</p></div>}

      {!loading && !error && blogs.length === 0 && (
        <div style={{ textAlign: 'center', padding: '5rem 0' }}>
          <p style={{ color: 'var(--stone-500)', fontSize: '1.05rem' }}>No stories found{debouncedQuery ? ` for "${debouncedQuery}"` : ''}.</p>
          <Link to="/write" style={{ display: 'inline-block', marginTop: '1.5rem', padding: '0.75rem 1.5rem', borderRadius: '10px', background: 'var(--ink-900)', color: '#fff', textDecoration: 'none', fontWeight: 500 }}>Start writing</Link>
        </div>
      )}

      {!loading && !error && blogs.length > 0 && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {blogs.map((blog, i) => <BlogCard key={blog._id} blog={blog} index={i} />)}
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginTop: '4rem' }}>
              <PaginationBtn id="btn-prev-page" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} aria-label="Previous page"><ChevronLeft size={16} /></PaginationBtn>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button key={n} id={`btn-page-${n}`} onClick={() => setPage(n)} aria-current={page === n ? 'page' : undefined}
                  style={{ width: '38px', height: '38px', borderRadius: '10px', border: '1px solid', borderColor: page === n ? 'var(--ink-900)' : 'rgba(92,85,80,0.2)', background: page === n ? 'var(--ink-900)' : 'rgba(255,255,255,0.6)', color: page === n ? '#fff' : 'var(--stone-700)', fontSize: '0.88rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}>
                  {n}
                </button>
              ))}
              <PaginationBtn id="btn-next-page" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} aria-label="Next page"><ChevronRight size={16} /></PaginationBtn>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function PaginationBtn({ children, onClick, disabled, id, 'aria-label': ariaLabel }: { children: React.ReactNode; onClick: () => void; disabled: boolean; id: string; 'aria-label': string }) {
  return (
    <button id={id} onClick={onClick} disabled={disabled} aria-label={ariaLabel}
      style={{ width: '38px', height: '38px', borderRadius: '10px', border: '1px solid rgba(92,85,80,0.2)', background: 'rgba(255,255,255,0.6)', color: disabled ? 'rgba(92,85,80,0.3)' : 'var(--stone-700)', cursor: disabled ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
      {children}
    </button>
  )
}
