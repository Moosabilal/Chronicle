import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Lock, AlertCircle } from 'lucide-react'
import gsap from 'gsap'
import { AuthService } from '../services/AuthService'
import { PasswordInput } from './LoginPage'

export function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!cardRef.current) return
    gsap.fromTo(cardRef.current, { opacity: 0, y: 32, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: 'power3.out' })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true); setError('')
    try {
      await AuthService.resetPassword(token as string, password)
      alert('Password has been reset successfully. Please log in.')
      navigate('/login')
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
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--ink-900)', letterSpacing: '-0.03em', marginBottom: '0.4rem' }}>Set New Password</h1>
          <p style={{ color: 'var(--stone-500)', fontSize: '0.9rem' }}>Enter a strong password for your account.</p>
        </div>

        {error && (
          <div role="alert" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', borderRadius: '10px', background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.2)', color: '#c0392b', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            <AlertCircle size={15} />{error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <PasswordInput id="reset-password" name="password" label="New Password" value={password} onChange={e => setPassword(e.target.value)} show={showPass} onToggle={() => setShowPass(v => !v)} icon={<Lock size={16} />} />
          <PasswordInput id="reset-confirm-password" name="confirmPassword" label="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} show={showPass} onToggle={() => setShowPass(v => !v)} icon={<Lock size={16} />} />
          <button type="submit" disabled={loading}
            style={{ marginTop: '0.5rem', padding: '0.9rem', borderRadius: '12px', border: 'none', background: loading ? 'rgba(28,25,23,0.5)' : 'var(--ink-900)', color: '#fff', fontSize: '0.95rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}>
            {loading ? 'Resetting…' : 'Reset Password'}
          </button>
        </form>
      </div>
    </section>
  )
}
