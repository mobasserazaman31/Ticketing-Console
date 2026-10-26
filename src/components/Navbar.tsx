import { useAuth } from '../AuthContext'

export default function Navbar() {
  const { authenticated, loading, user, login, logout } = useAuth()

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <a className="brand" href="/" aria-label="Ticketing Console home">
          <span className="brand-mark" aria-hidden="true">T</span>
          <span>Ticketing Console</span>
        </a>
        <div className="navbar-actions">
          {authenticated && (
            <span className="nav-username">
              <span className="status-dot" aria-hidden="true" />
              {user?.preferred_username ?? user?.email ?? 'Signed in'}
            </span>
          )}
          {loading ? (
            <span className="nav-loading" role="status">Checking session</span>
          ) : authenticated ? (
            <button className="button button-secondary" onClick={logout} type="button">Logout</button>
          ) : (
            <button className="button button-primary" onClick={() => login()} type="button">Login / Register</button>
          )}
        </div>
      </div>
    </header>
  )
}