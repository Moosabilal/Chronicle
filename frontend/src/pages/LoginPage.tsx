import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import gsap from 'gsap'
import { AuthService } from '../services/AuthService'
import { useAuthStore } from '../store/useAuthStore'

export function LoginPage() {
  const navigate        = useNavigate()
  const login           = useAuthStore((s) => s.login)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  const [form, setForm]       = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const cardRef               = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isAuthenticated) { navigate('/'); return }
    if (!cardRef.current) return
    gsap.fromTo(cardRef.current, { opacity: 0, y: 32, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: 'power3.out' })
  }, [isAuthenticated, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Client-side validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) { setError('Please enter a valid email address.'); return }
    if (!form.password) { setError('Password is required.'); return }

    setLoading(true); setError('')
    try {
      const { user, token } = await AuthService.login(form)
      login(user, token)
      navigate('/')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>
      <div ref={cardRef} style={{ width: '100%', maxWidth: '420px', background: 'rgba(255,255,255,0.68)', backdropFilter: 'blur(24px) saturate(1.5)', WebkitBackdropFilter: 'blur(24px) saturate(1.5)', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 20px 60px rgba(92,85,80,0.12)', borderRadius: '20px', padding: '2.75rem 2.5rem', opacity: 0 }}>
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--ink-900)', letterSpacing: '-0.03em', marginBottom: '0.4rem' }}>Welcome back</h1>
          <p style={{ color: 'var(--stone-500)', fontSize: '0.9rem' }}>Sign in to your Chronicle account</p>
        </div>

        {error && (
          <div role="alert" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', borderRadius: '10px', background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.2)', color: '#c0392b', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            <AlertCircle size={15} />{error}
          </div>
        )}

        <form id="login-form" onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <FloatingInput id="login-email" name="email" type="email" label="Email address" value={form.email} onChange={handleChange} icon={<Mail size={16} />} required />
          <PasswordInput id="login-password" name="password" label="Password" value={form.password} onChange={handleChange} show={showPass} onToggle={() => setShowPass((v) => !v)} icon={<Lock size={16} />} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-0.5rem' }}>
            <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--stone-500)', textDecoration: 'none' }}>Forgot password?</Link>
          </div>
          <button id="btn-login-submit" type="submit" disabled={loading}
            style={{ marginTop: '0.5rem', padding: '0.9rem', borderRadius: '12px', border: 'none', background: loading ? 'rgba(28,25,23,0.5)' : 'var(--ink-900)', color: '#fff', fontSize: '0.95rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.875rem', color: 'var(--stone-500)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--ink-900)', fontWeight: 600, textDecoration: 'none' }}>Create one</Link>
        </p>
      </div>
    </section>
  )
}

/* ─── Shared input primitives ────────────────────────────────────────────── */
export const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.8rem 1rem 0.8rem 2.6rem', borderRadius: '10px',
  border: '1px solid rgba(92,85,80,0.18)', background: 'rgba(255,255,255,0.7)',
  fontSize: '0.95rem', color: 'var(--ink-900)', outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s', boxSizing: 'border-box',
}

export function FloatingInput({ id, name, type, label, value, onChange, icon, required }: {
  id: string; name: string; type: string; label: string; value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; icon: React.ReactNode; required?: boolean
}) {
  return (
    <div>
      <label htmlFor={id} style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: 'var(--stone-700)', marginBottom: '0.4rem' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--stone-500)', pointerEvents: 'none' }}>{icon}</span>
        <input id={id} name={name} type={type} value={value} onChange={onChange} required={required} aria-label={label} style={inputStyle}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--stone-700)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(92,85,80,0.1)' }}
          onBlur={(e)  => { e.currentTarget.style.borderColor = 'rgba(92,85,80,0.18)'; e.currentTarget.style.boxShadow = 'none' }} />
      </div>
    </div>
  )
}

export function PasswordInput({ id, name, label, value, onChange, show, onToggle, icon }: {
  id: string; name: string; label: string; value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; show: boolean; onToggle: () => void; icon: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: 'var(--stone-700)', marginBottom: '0.4rem' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--stone-500)', pointerEvents: 'none' }}>{icon}</span>
        <input id={id} name={name} type={show ? 'text' : 'password'} value={value} onChange={onChange} aria-label={label}
          style={{ ...inputStyle, paddingRight: '2.8rem' }}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--stone-700)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(92,85,80,0.1)' }}
          onBlur={(e)  => { e.currentTarget.style.borderColor = 'rgba(92,85,80,0.18)'; e.currentTarget.style.boxShadow = 'none' }} />
        <button type="button" id={`${id}-toggle`} aria-label={show ? 'Hide password' : 'Show password'} onClick={onToggle}
          style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--stone-500)', cursor: 'pointer', padding: 0, display: 'flex' }}>
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  )
}
