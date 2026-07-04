import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { CheckCircle, AlertCircle, Trash2, Edit3, Loader2 } from 'lucide-react'
import gsap from 'gsap'
import { useAuthStore } from '../store/useAuthStore'
import { AuthService } from '../services/AuthService'
import { BlogService } from '../services/BlogService'
import type { Blog } from '../services/BlogService'
import { UploadService } from '../services/UploadService'
import { inputStyle } from './LoginPage'

export function ProfilePage() {
  const navigate = useNavigate()
  const { user, isAuthenticated, updateUser } = useAuthStore()

  const [activeTab, setActiveTab] = useState<'profile' | 'posts'>('profile')
  const containerRef = useRef<HTMLDivElement>(null)

  // Profile State
  const [name, setName] = useState(user?.name || '')
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [profileSuccess, setProfileSuccess] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Posts State
  const [posts, setPosts] = useState<Blog[]>([])
  const [postsLoading, setPostsLoading] = useState(true)
  const [postsError, setPostsError] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 5

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return }
    if (containerRef.current) {
      gsap.fromTo(containerRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
    }
  }, [isAuthenticated, navigate])

  const fetchMyPosts = useCallback(async () => {
    if (!user) return
    setPostsLoading(true); setPostsError('')
    try {
      const res = await BlogService.getBlogs({ page, limit, author: user._id })
      setPosts(res.blogs)
      setTotal(res.total)
    } catch (err: any) {
      setPostsError(err.message)
    } finally {
      setPostsLoading(false)
    }
  }, [page, user])

  useEffect(() => {
    if (activeTab === 'posts') {
      fetchMyPosts()
    }
  }, [activeTab, fetchMyPosts])

  // ── Profile Handlers ──
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileLoading(true); setProfileError(''); setProfileSuccess('')
    try {
      let finalAvatarUrl = user?.avatar
      
      if (avatarFile) {
        setUploadingAvatar(true)
        finalAvatarUrl = await UploadService.uploadImage(avatarFile)
        setUploadingAvatar(false)
      }

      const updatedUser = await AuthService.updateProfile({ name, avatar: finalAvatarUrl })
      updateUser(updatedUser)
      setProfileSuccess('Profile updated successfully!')
      setAvatarFile(null)
      setTimeout(() => setProfileSuccess(''), 3000)
    } catch (err: any) {
      setProfileError(err.message)
      setUploadingAvatar(false)
    } finally {
      setProfileLoading(false)
    }
  }

  // ── Posts Handlers ──
  const handleDeletePost = async (slug: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return
    try {
      await BlogService.deleteBlog(slug)
      fetchMyPosts() // refresh
    } catch (err: any) {
      alert(err.message)
    }
  }

  const tabStyle = (isActive: boolean) => ({
    padding: '0.75rem 1.5rem', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 600,
    borderBottom: isActive ? '2px solid var(--ink-900)' : '2px solid transparent',
    color: isActive ? 'var(--ink-900)' : 'var(--stone-500)', transition: 'all 0.2s',
  })

  return (
    <section style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 1.5rem 6rem' }}>
      <div ref={containerRef} style={{ opacity: 0 }}>
        
        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700, color: 'var(--ink-900)', letterSpacing: '-0.03em' }}>
            Your Profile
          </h1>
          <p style={{ color: 'var(--stone-500)', marginTop: '0.5rem', fontSize: '0.95rem' }}>
            Manage your account settings and stories.
          </p>
        </header>

        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid rgba(92,85,80,0.15)', marginBottom: '2rem' }}>
          <button style={tabStyle(activeTab === 'profile')} onClick={() => setActiveTab('profile')} type="button" className="tab-btn">Settings</button>
          <button style={tabStyle(activeTab === 'posts')} onClick={() => setActiveTab('posts')} type="button" className="tab-btn">My Stories</button>
        </div>

        {activeTab === 'profile' && (
          <div style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.45)', borderRadius: '20px', padding: '2.5rem', boxShadow: '0 8px 32px rgba(92,85,80,0.08)' }}>
            {profileError && (
              <div role="alert" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 1rem', borderRadius: '10px', background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.2)', color: '#c0392b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                <AlertCircle size={15} />{profileError}
              </div>
            )}
            {profileSuccess && (
              <div role="status" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 1rem', borderRadius: '10px', background: 'rgba(39,174,96,0.08)', border: '1px solid rgba(39,174,96,0.2)', color: '#27ae60', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                <CheckCircle size={15} />{profileSuccess}
              </div>
            )}
            
            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--stone-700)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Profile Picture</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', background: 'linear-gradient(135deg, var(--cream-300), var(--stone-500))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      user?.name?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} />
                  <button type="button" onClick={() => fileInputRef.current?.click()} style={{ padding: '0.65rem 1.25rem', borderRadius: '10px', border: '1px solid rgba(92,85,80,0.2)', background: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', color: 'var(--ink-900)' }}>
                    Change Avatar
                  </button>
                  {avatarFile && (
                    <button type="button" onClick={() => { setAvatarFile(null); setAvatarPreview(user?.avatar || '') }} style={{ color: '#c0392b', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500 }}>
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--stone-700)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required style={{ ...inputStyle, paddingLeft: '1rem' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="submit" disabled={profileLoading || uploadingAvatar}
                  style={{ padding: '0.8rem 2rem', borderRadius: '12px', border: 'none', background: (profileLoading || uploadingAvatar) ? 'rgba(28,25,23,0.5)' : 'var(--ink-900)', color: '#fff', cursor: (profileLoading || uploadingAvatar) ? 'not-allowed' : 'pointer', fontSize: '0.9rem', fontWeight: 600, transition: 'all 0.2s' }}>
                  {(profileLoading || uploadingAvatar) ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'posts' && (
          <div>
            {postsLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0', color: 'var(--stone-500)' }}><Loader2 size={24} className="spin" /></div>
            ) : postsError ? (
              <div style={{ color: '#c0392b', padding: '1rem', background: 'rgba(192,57,43,0.08)', borderRadius: '10px' }}>{postsError}</div>
            ) : posts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 0', background: 'rgba(255,255,255,0.5)', borderRadius: '20px', border: '1px dashed rgba(92,85,80,0.2)' }}>
                <p style={{ color: 'var(--stone-500)', marginBottom: '1rem' }}>You haven't published any stories yet.</p>
                <Link to="/write" style={{ display: 'inline-block', padding: '0.75rem 1.5rem', background: 'var(--ink-900)', color: '#fff', borderRadius: '10px', textDecoration: 'none', fontWeight: 500 }}>Write a story</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {posts.map(post => (
                  <div key={post._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(10px)', padding: '1.25rem 1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 4px 15px rgba(92,85,80,0.05)' }}>
                    <div>
                      <Link to={`/post/${post.slug}`} style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink-900)', textDecoration: 'none', display: 'block', marginBottom: '0.35rem' }}>
                        {post.title}
                      </Link>
                      <span style={{ fontSize: '0.8rem', color: 'var(--stone-500)' }}>
                        {new Date(post.createdAt).toLocaleDateString()} · {post.comments?.length || 0} comments
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => navigate(`/edit/${post.slug}`)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(255,255,255,0.8)', color: 'var(--stone-700)', border: '1px solid rgba(92,85,80,0.15)', cursor: 'pointer', transition: 'all 0.2s' }} title="Edit">
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => handleDeletePost(post.slug)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(192,57,43,0.08)', color: '#c0392b', border: '1px solid rgba(192,57,43,0.15)', cursor: 'pointer', transition: 'all 0.2s' }} title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                
                {/* Pagination Controls */}
                {total > limit && (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(92,85,80,0.2)', background: 'var(--cream-100)', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1 }}>Previous</button>
                    <span style={{ fontSize: '0.9rem', color: 'var(--stone-500)' }}>Page {page} of {Math.ceil(total / limit)}</span>
                    <button disabled={page >= Math.ceil(total / limit)} onClick={() => setPage(p => p + 1)} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(92,85,80,0.2)', background: 'var(--cream-100)', cursor: page >= Math.ceil(total / limit) ? 'not-allowed' : 'pointer', opacity: page >= Math.ceil(total / limit) ? 0.5 : 1 }}>Next</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Global CSS for spin animation */}
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
        .tab-btn:hover { color: var(--ink-900) !important; }
      `}</style>
    </section>
  )
}
