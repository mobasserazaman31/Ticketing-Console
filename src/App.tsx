import { useAuth } from './AuthContext'
import Navbar from './components/Navbar'
import ProtectedResource from './components/ProtectedResource'
import UserProfile from './components/UserProfile'
import './App.css'
import InteractiveAPITestDashboard from './components/InterativeAPITestDashboard'

function App() {
  const { authenticated, error, loading } = useAuth()

  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-content">
        <section className="page-intro">
          <div>
            <p className="eyebrow">Access overview</p>
            <h1>Identity &amp; access</h1>
            <p className="intro-copy">Review your session and the resources available to your account.</p>
          </div>
          <div className={`session-badge ${authenticated ? 'session-badge--active' : ''}`}>
            <span className="session-light" aria-hidden="true" />
            {loading ? 'Connecting' : authenticated ? 'Session active' : 'Signed out'}
          </div>
        </section>

        {error && (
          <div className="initialization-error" role="alert">
            Keycloak could not be reached: {error}
          </div>
        )}

        <div className="dashboard-grid">
          <UserProfile />
          <InteractiveAPITestDashboard/>
        </div>
        <footer className="page-footer">
          <span>Ticketing Console</span>
          <span>Protected by Keycloak</span>
        </footer>
      </main>
    </div>
  )
}

export default App
