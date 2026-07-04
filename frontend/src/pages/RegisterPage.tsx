import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, AlertCircle } from 'lucide-react'
import gsap from 'gsap'
import { AuthService } from '../services/AuthService'
import { useAuthStore } from '../store/useAuthStore'
import { FloatingInput, PasswordInput } from './LoginPage'

export function RegisterPage() {
  const navigate        = useNavigate()
  const login           = useAuthStore((s) => s.login)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  const [form, setForm]         = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const cardRef                 = useRef<HTMLDivElement>(null)

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
    if (form.name.trim().length < 2) { setError('Name must be at least 2 characters.'); return }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) { setError('Please enter a valid email address.'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return }
    
    setLoading(true); setError('')
    try {
      const { user, token } = await AuthService.register({ name: form.name, email: form.email, password: form.password })
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
      <div ref={cardRef} style={{ width: '100%', maxWidth: '440px', background: 'rgba(255,255,255,0.68)', backdropFilter: 'blur(24px) saturate(1.5)', WebkitBackdropFilter: 'blur(24px) saturate(1.5)', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 20px 60px rgba(92,85,80,0.12)', borderRadius: '20px', padding: '2.75rem 2.5rem', opacity: 0 }}>
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--ink-900)', letterSpacing: '-0.03em', marginBottom: '0.4rem' }}>Start writing</h1>
          <p style={{ color: 'var(--stone-500)', fontSize: '0.9rem' }}>Create your Chronicle account</p>
        </div>

        {error && (
          <div role="alert" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', borderRadius: '10px', background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.2)', color: '#c0392b', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            <AlertCircle size={15} />{error}
          </div>
        )}

        <form id="register-form" onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <FloatingInput id="register-name"     name="name"            type="text"  label="Full name"         value={form.name}            onChange={handleChange} icon={<User size={16} />} required />
          <FloatingInput id="register-email"    name="email"           type="email" label="Email address"     value={form.email}           onChange={handleChange} icon={<Mail size={16} />} required />
          <PasswordInput id="register-password" name="password"                     label="Password (min 6)"  value={form.password}         onChange={handleChange} show={showPass} onToggle={() => setShowPass((v) => !v)} icon={<Lock size={16} />} />
          <PasswordInput id="register-confirm"  name="confirmPassword"              label="Confirm password"  value={form.confirmPassword}  onChange={handleChange} show={showPass} onToggle={() => setShowPass((v) => !v)} icon={<Lock size={16} />} />

          <button id="btn-register-submit" type="submit" disabled={loading}
            style={{ marginTop: '0.5rem', padding: '0.9rem', borderRadius: '12px', border: 'none', background: loading ? 'rgba(28,25,23,0.5)' : 'var(--ink-900)', color: '#fff', fontSize: '0.95rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.875rem', color: 'var(--stone-500)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--ink-900)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </section>
  )
}
