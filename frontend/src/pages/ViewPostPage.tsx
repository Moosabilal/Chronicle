import { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Clock, Tag, ArrowLeft, Send, User, AlertCircle } from 'lucide-react'
import gsap from 'gsap'
import { BlogService } from '../services/BlogService'
import type { Blog, BlogComment } from '../services/BlogService'
import { useAuthStore } from '../store/useAuthStore'

export function ViewPostPage() {
  const { slug }          = useParams<{ slug: string }>()
  const [blog, setBlog]   = useState<Blog | null>(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [comment, setComment]   = useState('')
  const [commentLoading, setCL] = useState(false)
  const [commentError, setCE]   = useState('')
  const heroRef    = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    BlogService.getBlogBySlug(slug)
      .then((data) => setBlog(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    if (!blog || !heroRef.current || !contentRef.current) return
    const tl = gsap.timeline()
    tl.fromTo(heroRef.current,   { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
    tl.fromTo(contentRef.current, { opacity: 0, y: 24 },  { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4')
  }, [blog])

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim() || !slug) return
    setCL(true); setCE('')
    try {
      const newComment: BlogComment = await BlogService.addComment(slug, comment)
      setBlog((prev) => prev ? { ...prev, comments: [...prev.comments, newComment] } : prev)
      setComment('')
    } catch (err: any) {
      setCE(err.message)
    } finally {
      setCL(false)
    }
  }

  if (loading) {
    return <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: 'var(--stone-500)' }}>Loading story…</p></div>
  }
  if (error || !blog) {
    return (
      <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
        <p style={{ color: '#c0392b' }}>{error || 'Story not found.'}</p>
        <Link to="/" style={{ color: 'var(--stone-700)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
          <ArrowLeft size={14} /> Back to stories
        </Link>
      </div>
    )
  }

  const formattedDate = new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <article style={{ maxWidth: '780px', margin: '0 auto', padding: '3rem 1.5rem 8rem' }}>
      <Link to="/" id="btn-back-to-feed" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--stone-500)', textDecoration: 'none', marginBottom: '2.5rem', transition: 'color 0.2s' }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ink-900)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--stone-500)')}>
        <ArrowLeft size={14} /> All stories
      </Link>

      <header ref={heroRef as React.RefObject<HTMLElement>} style={{ marginBottom: '3rem', opacity: 0 }}>
        {blog.tags?.length > 0 && (
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            {blog.tags.map((tag) => (
              <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '0.25rem 0.7rem', borderRadius: '20px', background: 'rgba(92,85,80,0.08)', color: 'var(--stone-700)' }}>
                <Tag size={9} />{tag}
              </span>
            ))}
          </div>
        )}

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, color: 'var(--ink-900)', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '1.25rem' }}>
          {blog.title}
        </h1>

        {blog.excerpt && (
          <p style={{ fontSize: '1.1rem', color: 'var(--stone-500)', lineHeight: 1.65, marginBottom: '1.5rem' }}>{blog.excerpt}</p>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1.75rem', borderBottom: '1px solid rgba(92,85,80,0.12)' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', overflow: 'hidden', background: 'linear-gradient(135deg, var(--cream-300), var(--stone-500))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
            {blog.author?.avatar
              ? <img src={blog.author.avatar} alt={blog.author.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : blog.author?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p style={{ fontWeight: 600, color: 'var(--ink-900)', fontSize: '0.9rem' }}>{blog.author?.name}</p>
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--stone-500)', fontSize: '0.8rem' }}>
              <Clock size={11} />{formattedDate}
            </p>
          </div>
        </div>

        {blog.coverImage && (
          <div style={{ marginTop: '2rem', borderRadius: '16px', overflow: 'hidden', maxHeight: '420px' }}>
            <img src={blog.coverImage} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
      </header>

      <div ref={contentRef} style={{ opacity: 0, fontSize: '1.08rem', lineHeight: 1.9, color: 'var(--stone-700)', whiteSpace: 'pre-wrap', letterSpacing: '0.005em' }}>
        {blog.content}
      </div>

      {/* Comments */}
      <section aria-label="Comments" style={{ marginTop: '5rem', paddingTop: '3rem', borderTop: '1px solid rgba(92,85,80,0.12)' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--ink-900)', letterSpacing: '-0.02em', marginBottom: '2rem' }}>
          {blog.comments?.length || 0} {blog.comments?.length === 1 ? 'Comment' : 'Comments'}
        </h2>

        {isAuthenticated ? (
          <form id="comment-form" onSubmit={handleCommentSubmit}
            style={{ display: 'flex', gap: '0.75rem', marginBottom: '2.5rem', background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.45)', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 4px 20px rgba(92,85,80,0.07)' }}>
            <textarea id="comment-input" value={comment} onChange={(e) => { setComment(e.target.value); setCE('') }}
              placeholder="Share your thoughts…" rows={3} aria-label="Write a comment"
              style={{ flex: 1, border: '1px solid rgba(92,85,80,0.15)', borderRadius: '10px', padding: '0.75rem', fontSize: '0.9rem', color: 'var(--ink-900)', background: 'rgba(255,255,255,0.7)', outline: 'none', resize: 'none', fontFamily: 'var(--font-body)', lineHeight: 1.6, transition: 'border-color 0.2s' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--stone-500)' }}
              onBlur={(e)  => { e.currentTarget.style.borderColor = 'rgba(92,85,80,0.15)' }} />
            <button id="btn-submit-comment" type="submit" disabled={commentLoading || !comment.trim()} aria-label="Post comment"
              style={{ alignSelf: 'flex-end', padding: '0.7rem 1rem', borderRadius: '10px', border: 'none', background: !comment.trim() || commentLoading ? 'rgba(28,25,23,0.3)' : 'var(--ink-900)', color: '#fff', cursor: !comment.trim() || commentLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.2s' }}>
              <Send size={14} />{commentLoading ? '…' : 'Post'}
            </button>
          </form>
        ) : (
          <div style={{ padding: '1.25rem', borderRadius: '14px', marginBottom: '2rem', background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(92,85,80,0.1)', textAlign: 'center', fontSize: '0.9rem', color: 'var(--stone-500)' }}>
            <Link to="/login" style={{ color: 'var(--ink-900)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link> to leave a comment.
          </div>
        )}

        {commentError && (
          <div role="alert" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#c0392b', fontSize: '0.85rem', marginBottom: '1rem' }}>
            <AlertCircle size={14} />{commentError}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {(!blog.comments || blog.comments.length === 0) && (
            <p style={{ color: 'var(--stone-500)', fontSize: '0.9rem', textAlign: 'center', padding: '2rem 0' }}>No comments yet. Be the first to respond.</p>
          )}
          {blog.comments?.map((c) => (
            <div key={c._id} style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '14px', padding: '1.25rem 1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, var(--cream-300), var(--stone-500))', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {c.author?.avatar
                    ? <img src={c.author.avatar} alt={c.author.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <User size={14} strokeWidth={2} style={{ color: '#fff' }} />}
                </div>
                <div>
                  <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--ink-900)' }}>{c.author?.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--stone-500)', marginLeft: '0.5rem' }}>
                    {new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>
              <p style={{ fontSize: '0.92rem', color: 'var(--stone-700)', lineHeight: 1.65 }}>{c.content}</p>
            </div>
          ))}
        </div>
      </section>
    </article>
  )
}
