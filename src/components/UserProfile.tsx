import { useAuth } from '../AuthContext'

function formatToken(token: string): string {
  return token.match(/.{1,56}/g)?.join('\n') ?? token
}

export default function UserProfile() {
  const { authenticated, loading, token, user } = useAuth()

  if (loading) {
    return (
      <section className="panel profile-panel" aria-busy="true">Loading profile…</section>
    )
  }

  if (!authenticated || !user) {
    return (
      <section className="panel profile-panel empty-state">
        <span className="eyebrow">Identity</span>
        <h2>No active session</h2>
        <p>Sign in to view your Keycloak profile and assigned access.</p>
      </section>
    )
  }

  return (
    <section className="panel profile-panel">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Identity</span>
          <h2>User profile</h2>
        </div>
        <span className="access-badge">Authenticated</span>
      </div>

      <div className="profile-content">
        <dl className="profile-fields">
          <div>
            <dt>Subject ID</dt>
            <dd className="mono">{user.sub ?? 'Not provided'}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{user.email ?? 'Not provided'}</dd>
          </div>
          <div>
            <dt>Username</dt>
            <dd>{user.preferred_username ?? 'Not provided'}</dd>
          </div>
          <div>
            <dt>Realm roles</dt>
            <dd>
              {user.roles.length > 0 ? (
                <div className="role-list">
                  {user.roles.map((role) => <span className="role-tag" key={role}>{role}</span>)}
                </div>
              ) : 'No realm roles assigned'}
            </dd>
          </div>
        </dl>

        <div className="token-section">
          <div className="token-heading">
            <span className="eyebrow">Credential</span>
            <span>Access token · JWT</span>
          </div>
          <pre className="token-preview">{token ? formatToken(token) : 'Token unavailable'}</pre>
        </div>
      </div>
    </section>
  )
}