import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { PenSquare, BookOpen, LogIn, LogOut, Menu, X, UserPlus, User } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Scene } from '../components/canvas/Scene'
import { useAuthStore } from '../store/useAuthStore'

/* ─── Navbar ────────────────────────────────────────────────────────────── */
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  useEffect(() => { setMenuOpen(false) }, [location])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header
      role="banner"
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        transition: 'box-shadow 0.3s ease, background 0.3s ease',
        background: scrolled ? 'rgba(249, 248, 246, 0.82)' : 'rgba(249, 248, 246, 0.52)',
        backdropFilter: 'blur(20px) saturate(1.5)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.5)',
        borderBottom: '1px solid rgba(255,255,255,0.35)',
        boxShadow: scrolled ? '0 4px 24px rgba(92,85,80,0.09)' : 'none',
      }}
    >
      <nav
        role="navigation"
        aria-label="Main navigation"
        style={{
          maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem',
          height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        {/* Brand */}
        <Link
          to="/"
          id="nav-brand"
          aria-label="Chronicle — return to home"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
        >
          <BookOpen size={22} strokeWidth={1.5} style={{ color: 'var(--stone-700)' }} />
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700,
            color: 'var(--ink-900)', letterSpacing: '-0.03em',
          }}>
            Chronicle
          </span>
        </Link>

        {/* Desktop Nav */}
        <ul
          role="list"
          style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', listStyle: 'none' }}
          className="hidden md:flex"
        >
          {isAuthenticated ? (
            /* ── Authenticated nav ── */
            <>
              <NavItem to="/" label="Read" />
              <NavItem to="/write" label="Write" icon={<PenSquare size={14} strokeWidth={2} />} />
              <NavItem to="/profile" label="Profile" icon={<User size={14} strokeWidth={2} />} />
              <li>
                <div
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.35rem 0.75rem', borderRadius: '8px',
                    background: 'rgba(28,25,23,0.06)', border: '1px solid rgba(28,25,23,0.1)',
                  }}
                >
                  <div style={{
                    width: '26px', height: '26px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
                    background: 'linear-gradient(135deg, var(--cream-300), var(--stone-500))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', fontWeight: 700, color: '#fff',
                  }}>
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      user?.name?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--ink-900)', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.name}
                  </span>
                </div>
              </li>
              <li>
                <button
                  id="btn-logout"
                  onClick={handleLogout}
                  aria-label="Sign out"
                  title="Sign out"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                    padding: '0.45rem 0.85rem', borderRadius: '8px',
                    fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer',
                    color: 'var(--stone-700)', background: 'transparent',
                    border: '1px solid transparent', transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(192,57,43,0.08)'; e.currentTarget.style.color = '#c0392b'; e.currentTarget.style.borderColor = 'rgba(192,57,43,0.15)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--stone-700)'; e.currentTarget.style.borderColor = 'transparent' }}
                >
                  <LogOut size={14} strokeWidth={2} />
                  Sign out
                </button>
              </li>
            </>
          ) : (
            /* ── Guest nav ── */
            <>
              <NavItem to="/" label="Read" />
              <NavItem to="/register" label="Register" icon={<UserPlus size={14} strokeWidth={2} />} />
              <NavItem to="/login" label="Sign in" icon={<LogIn size={14} strokeWidth={2} />} isPrimary />
            </>
          )}
        </ul>

        {/* Mobile hamburger */}
        <button
          id="nav-menu-toggle"
          aria-label="Toggle mobile menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--stone-700)', padding: '0.5rem', borderRadius: '6px',
          }}
          className="md:hidden"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          role="menu"
          style={{
            padding: '0.75rem 1.5rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem',
            borderTop: '1px solid rgba(255,255,255,0.25)',
          }}
          className="md:hidden"
        >
          <MobileNavItem to="/" label="Read" />
          {isAuthenticated ? (
            <>
              <MobileNavItem to="/write" label="Write" />
              <MobileNavItem to="/profile" label="Profile" />
              <button
                id="btn-logout-mobile"
                onClick={handleLogout}
                style={{
                  padding: '0.65rem 0.75rem', borderRadius: '8px', fontSize: '1rem', fontWeight: 500,
                  color: '#c0392b', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <MobileNavItem to="/register" label="Register" />
              <MobileNavItem to="/login" label="Sign in" />
            </>
          )}
        </div>
      )}
    </header>
  )
}

/* ─── NavItem helpers ─────────────────────────────────────────────────────── */
function NavItem({ to, label, icon, isPrimary = false }: { to: string; label: string; icon?: React.ReactNode; isPrimary?: boolean }) {
  return (
    <li>
      <Link
        to={to}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
          padding: '0.45rem 0.85rem', borderRadius: '8px',
          fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none',
          transition: 'all 0.2s ease',
          color: isPrimary ? 'var(--ink-900)' : 'var(--stone-700)',
          background: isPrimary ? 'rgba(28, 25, 23, 0.07)' : 'transparent',
          border: isPrimary ? '1px solid rgba(28, 25, 23, 0.12)' : '1px solid transparent',
        }}
        onMouseEnter={(e) => { const el = e.currentTarget; el.style.background = 'rgba(28,25,23,0.07)'; el.style.color = 'var(--ink-900)' }}
        onMouseLeave={(e) => { const el = e.currentTarget; el.style.background = isPrimary ? 'rgba(28,25,23,0.07)' : 'transparent'; el.style.color = isPrimary ? 'var(--ink-900)' : 'var(--stone-700)' }}
      >
        {icon}{label}
      </Link>
    </li>
  )
}

function MobileNavItem({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      role="menuitem"
      style={{ padding: '0.65rem 0.75rem', borderRadius: '8px', fontSize: '1rem', fontWeight: 500, textDecoration: 'none', color: 'var(--stone-700)', transition: 'background 0.2s ease' }}
    >
      {label}
    </Link>
  )
}

/* ─── Main Layout ─────────────────────────────────────────────────────────── */
export function MainLayout() {
  return (
    <>
      <Scene />
      <Navbar />
      <main id="main-content" role="main" style={{ minHeight: '100vh', paddingTop: '64px' }}>
        <Outlet />
      </main>
    </>
  )
}
