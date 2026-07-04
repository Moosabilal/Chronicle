import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ImageIcon, Tag, Type, FileText, AlignLeft, AlertCircle, CheckCircle, Upload, X } from 'lucide-react'
import gsap from 'gsap'
import { BlogService } from '../services/BlogService'
import { UploadService } from '../services/UploadService'
import { useAuthStore } from '../store/useAuthStore'

export function CreatePostPage() {
  const navigate        = useNavigate()
  const { slug }        = useParams<{ slug: string }>()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  const [form, setForm] = useState({ title: '', excerpt: '', content: '', tags: '' })
  const [coverImage, setCoverImage]         = useState<string>('')
  const [imageFile, setImageFile]           = useState<File | null>(null)
  const [imagePreview, setImagePreview]     = useState<string>('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [loading, setLoading]               = useState(false)
  const [error, setError]                   = useState('')
  const [success, setSuccess]               = useState('')
  const containerRef                        = useRef<HTMLDivElement>(null)
  const fileInputRef                        = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return }
    if (!containerRef.current) return
    gsap.fromTo(containerRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })

    if (slug) {
      BlogService.getBlogBySlug(slug)
        .then(blog => {
          setForm({ title: blog.title, excerpt: blog.excerpt || '', content: blog.content, tags: blog.tags.join(', ') })
          if (blog.coverImage) {
            setCoverImage(blog.coverImage)
            setImagePreview(blog.coverImage)
          }
        })
        .catch(() => setError('Failed to load story for editing.'))
    }
  }, [isAuthenticated, navigate, slug])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    if (error) setError('')
  }

  /* ── Image file selection ── */
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageFile(file)
    setCoverImage('')

    // Show local preview before upload
    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }, [])

  const handleUploadImage = async () => {
    if (!imageFile) return
    setUploadingImage(true)
    setError('')
    try {
      const url = await UploadService.uploadImage(imageFile)
      setCoverImage(url)
      setSuccess('Image uploaded to Cloudinary ✓')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploadingImage(false)
    }
  }

  const clearImage = () => {
    setImageFile(null)
    setImagePreview('')
    setCoverImage('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.content.trim()) { setError('Title and content are required.'); return }
    if (imageFile && !coverImage) { setError('Please upload the selected image first before publishing.'); return }

    setLoading(true); setError('')
    try {
      const tags = form.tags.split(',').map((t) => t.trim()).filter(Boolean)
      const data = {
        title:      form.title,
        content:    form.content,
        excerpt:    form.excerpt || undefined,
        coverImage: coverImage  || undefined,
        tags,
      }
      
      const blog = slug 
        ? await BlogService.updateBlog(slug, data)
        : await BlogService.createBlog(data)

      setSuccess(slug ? 'Post updated!' : 'Post published!')
      setTimeout(() => navigate(`/post/${blog.slug}`), 800)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fieldStyle: React.CSSProperties = {
    width: '100%', padding: '0.85rem 1rem', borderRadius: '12px',
    border: '1px solid rgba(92,85,80,0.15)', background: 'rgba(255,255,255,0.65)',
    backdropFilter: 'blur(8px)', fontSize: '0.95rem', color: 'var(--ink-900)',
    outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box', fontFamily: 'var(--font-body)',
  }
  const focusStyle = {
    onFocus: (e: React.FocusEvent<any>) => { e.currentTarget.style.borderColor = 'var(--stone-700)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(92,85,80,0.1)' },
    onBlur:  (e: React.FocusEvent<any>) => { e.currentTarget.style.borderColor = 'rgba(92,85,80,0.15)'; e.currentTarget.style.boxShadow = 'none' },
  }
  const labelStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600,
    color: 'var(--stone-700)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em',
  }

  return (
    <section style={{ maxWidth: '780px', margin: '0 auto', padding: '3rem 1.5rem 6rem' }}>
      <div ref={containerRef} style={{ opacity: 0 }}>
        <header style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: 'var(--ink-900)', letterSpacing: '-0.04em', lineHeight: 1.1 }}>{slug ? 'Edit Story' : 'New Story'}</h1>
          <p style={{ color: 'var(--stone-500)', marginTop: '0.5rem', fontSize: '0.95rem' }}>{slug ? 'Update your masterpiece.' : 'Write something worth reading.'}</p>
        </header>

        {error && (
          <div role="alert" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 1rem', borderRadius: '10px', background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.2)', color: '#c0392b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            <AlertCircle size={15} />{error}
          </div>
        )}
        {success && (
          <div role="status" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 1rem', borderRadius: '10px', background: 'rgba(39,174,96,0.08)', border: '1px solid rgba(39,174,96,0.2)', color: '#27ae60', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            <CheckCircle size={15} />{success}
          </div>
        )}

        <form id="create-post-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.45)', borderRadius: '20px', padding: '2.5rem', boxShadow: '0 8px 32px rgba(92,85,80,0.08)' }}>
          
          {/* Title */}
          <div>
            <label style={labelStyle}><Type size={13} />Title</label>
            <input id="post-title" name="title" type="text" placeholder="An unforgettable headline…" value={form.title} onChange={handleChange} required
              style={{ ...fieldStyle, fontSize: '1.1rem', fontWeight: 500 }} {...focusStyle} />
          </div>

          {/* Excerpt */}
          <div>
            <label style={labelStyle}><FileText size={13} />Excerpt</label>
            <input id="post-excerpt" name="excerpt" type="text" placeholder="A brief, compelling summary…" value={form.excerpt} onChange={handleChange}
              style={fieldStyle} {...focusStyle} />
          </div>

          {/* Content */}
          <div>
            <label style={labelStyle}><AlignLeft size={13} />Content</label>
            <textarea id="post-content" name="content" placeholder="Tell your story…" value={form.content} onChange={handleChange} required rows={16}
              style={{ ...fieldStyle, resize: 'vertical', lineHeight: 1.8, minHeight: '320px' }} {...focusStyle} />
          </div>

          {/* Cover Image — file picker + Cloudinary upload */}
          <div>
            <label style={labelStyle}><ImageIcon size={13} />Cover Image</label>
            
            {/* Hidden file input */}
            <input ref={fileInputRef} id="post-image-file" type="file" accept="image/*" onChange={handleFileSelect}
              style={{ display: 'none' }} aria-label="Select cover image file" />

            {imagePreview ? (
              <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(92,85,80,0.15)' }}>
                <img src={imagePreview} alt="Cover preview" style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                  {!coverImage && (
                    <button id="btn-upload-image" type="button" onClick={handleUploadImage} disabled={uploadingImage}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', borderRadius: '10px', border: 'none', background: 'rgba(255,255,255,0.92)', color: 'var(--ink-900)', fontWeight: 600, fontSize: '0.85rem', cursor: uploadingImage ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}>
                      <Upload size={14} />{uploadingImage ? 'Uploading…' : 'Upload to Cloudinary'}
                    </button>
                  )}
                  {coverImage && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', borderRadius: '10px', background: 'rgba(39,174,96,0.9)', color: '#fff', fontSize: '0.82rem', fontWeight: 600 }}>
                      <CheckCircle size={13} />Uploaded
                    </span>
                  )}
                  <button id="btn-clear-image" type="button" onClick={clearImage}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1rem', borderRadius: '10px', border: 'none', background: 'rgba(255,255,255,0.85)', color: '#c0392b', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}>
                    <X size={13} />Remove
                  </button>
                </div>
              </div>
            ) : (
              <button id="btn-browse-image" type="button" onClick={() => fileInputRef.current?.click()}
                style={{ width: '100%', padding: '2rem', borderRadius: '12px', border: '2px dashed rgba(92,85,80,0.25)', background: 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem', transition: 'all 0.2s', color: 'var(--stone-500)' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--stone-500)'; e.currentTarget.style.background = 'rgba(255,255,255,0.7)' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(92,85,80,0.25)'; e.currentTarget.style.background = 'rgba(255,255,255,0.4)' }}>
                <ImageIcon size={28} strokeWidth={1.5} />
                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Click to browse image</span>
                <span style={{ fontSize: '0.78rem', opacity: 0.7 }}>JPG, PNG, WebP — max 5 MB</span>
              </button>
            )}
          </div>

          {/* Tags */}
          <div>
            <label style={labelStyle}><Tag size={13} />Tags (comma-separated)</label>
            <input id="post-tags" name="tags" type="text" placeholder="tech, design, culture" value={form.tags} onChange={handleChange}
              style={fieldStyle} {...focusStyle} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.5rem' }}>
            <button id="btn-cancel-post" type="button" onClick={() => navigate('/')}
              style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', border: '1px solid rgba(92,85,80,0.2)', background: 'transparent', color: 'var(--stone-700)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500, transition: 'all 0.2s' }}>
              Cancel
            </button>
            <button id="btn-publish-post" type="submit" disabled={loading}
              style={{ padding: '0.8rem 2rem', borderRadius: '12px', border: 'none', background: loading ? 'rgba(28,25,23,0.5)' : 'var(--ink-900)', color: '#fff', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '0.9rem', fontWeight: 600, transition: 'all 0.2s' }}>
              {loading ? (slug ? 'Updating…' : 'Publishing…') : (slug ? 'Update story' : 'Publish story')}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
