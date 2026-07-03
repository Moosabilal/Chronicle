/* ─── Placeholder page factory ──────────────────────────────────────────────
   Each of these will be replaced with full implementations in Step 6.
   They're intentionally minimal so the router resolves cleanly.
─────────────────────────────────────────────────────────────────────────────── */

function PlaceholderPage({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <section
      style={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 1.5rem',
        textAlign: 'center',
      }}
    >
      <div
        className="glass"
        style={{
          padding: '3rem 4rem',
          borderRadius: '20px',
          maxWidth: '480px',
          width: '100%',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2.25rem',
            fontWeight: 700,
            color: 'var(--ink-900)',
            marginBottom: '0.75rem',
          }}
        >
          {title}
        </h1>
        <p style={{ color: 'var(--stone-500)', fontSize: '1rem' }}>{subtitle}</p>
      </div>
    </section>
  )
}

export function FeedPage() {
  return <PlaceholderPage title="Chronicle" subtitle="Stories worth reading." />
}

export function LoginPage() {
  return <PlaceholderPage title="Welcome back" subtitle="Sign in to your Chronicle account." />
}

export function RegisterPage() {
  return <PlaceholderPage title="Start writing" subtitle="Create your Chronicle account." />
}

export function CreatePostPage() {
  return <PlaceholderPage title="New Post" subtitle="Share your story with the world." />
}

export function ViewPostPage() {
  return <PlaceholderPage title="Reading…" subtitle="Loading your story." />
}
