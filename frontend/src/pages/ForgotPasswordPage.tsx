import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Mail, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react'
import gsap from 'gsap'
import { AuthService } from '../services/AuthService'
import { FloatingInput } from './LoginPage'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!cardRef.current) return
    gsap.fromTo(cardRef.current, { opacity: 0, y: 32, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: 'power3.out' })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) { setError('Please enter a valid email address.'); return }

    setLoading(true); setError(''); setSuccess('')
    try {
      const msg = await AuthService.forgotPassword(email)
      setSuccess(msg || 'If the email exists, a reset link has been sent.')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>
      <div ref={cardRef} style={{ width: '100%', maxWidth: '420px', background: 'rgba(255,255,255,0.68)', backdropFilter: 'blur(24px) saturate(1.5)', WebkitBackdropFilter: 'blur(24px) saturate(1.5)', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 20px 60px rgba(92,85,80,0.12)', borderRadius: '20px', padding: '2.75rem 2.5rem', opacity: 0 }}>
        
        <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--stone-500)', fontSize: '0.85rem', textDecoration: 'none', marginBottom: '1.5rem', transition: 'color 0.2s' }}>
          <ArrowLeft size={14} /> Back to login
        </Link>

        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--ink-900)', letterSpacing: '-0.03em', marginBottom: '0.4rem' }}>Reset Password</h1>
          <p style={{ color: 'var(--stone-500)', fontSize: '0.9rem' }}>Enter your email and we'll send a reset link.</p>
        </div>

        {error && (
          <div role="alert" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', borderRadius: '10px', background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.2)', color: '#c0392b', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            <AlertCircle size={15} />{error}
          </div>
        )}

        {success && (
          <div role="status" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', borderRadius: '10px', background: 'rgba(39,174,96,0.08)', border: '1px solid rgba(39,174,96,0.2)', color: '#27ae60', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            <CheckCircle2 size={15} />{success}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <FloatingInput id="reset-email" name="email" type="email" label="Email address" value={email} onChange={e => setEmail(e.target.value)} icon={<Mail size={16} />} required />
          <button type="submit" disabled={loading}
            style={{ marginTop: '0.5rem', padding: '0.9rem', borderRadius: '12px', border: 'none', background: loading ? 'rgba(28,25,23,0.5)' : 'var(--ink-900)', color: '#fff', fontSize: '0.95rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}>
            {loading ? 'Sending link…' : 'Send reset link'}
          </button>
        </form>
      </div>
    </section>
  )
}
