import { useEffect, useState } from 'react'
import axios from 'axios'
import apiClient from '../apiClient'
import { useAuth } from '../AuthContext'

export default function ProtectedResource() {
  const { authenticated } = useAuth()
  const [data, setData] = useState<unknown>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()

  const fetchUsers = async (signal?: AbortSignal) => {
    setLoading(true)
    setError(undefined)

    try {
      const response = await apiClient.get('/api/users', { signal })
      setData(response.data)
    } catch (requestError: unknown) {
      if (axios.isCancel(requestError)) return

      const status = axios.isAxiosError(requestError)
        ? requestError.response?.status
        : undefined
      setError(
        status === 401
          ? 'The API rejected this session (401 Unauthorized). Sign in again and retry.'
          : status === 403
            ? 'Your account does not have permission to view this resource (403 Forbidden).'
            : requestError instanceof Error
              ? requestError.message
              : 'Unable to load the protected resource.',
      )
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }

  useEffect(() => {
    if (!authenticated) {
      setData(undefined)
      setError(undefined)
      setLoading(false)
      return
    }

    const controller = new AbortController()
    void fetchUsers(controller.signal)
    return () => controller.abort()
  }, [authenticated])

  return (
    <section className="panel resource-panel">
      <div className="section-heading">
        <div>
          <span className="eyebrow">API connection</span>
          <h2>Protected resource</h2>
        </div>
        <button
          className="button button-secondary"
          disabled={!authenticated || loading}
          onClick={() => void fetchUsers()}
          type="button"
        >
          Refresh
        </button>
      </div>

      <div className="resource-content">
        <div className="resource-meta">
          <span className="method-label">GET</span>
          <code>http://localhost:8080/api/users</code>
        </div>

        {!authenticated ? (
          <p className="resource-message">Authenticate to request this resource.</p>
        ) : error ? (
          <div className="resource-error" role="alert">{error}</div>
        ) : loading ? (
          <p className="resource-message" role="status">Requesting protected data…</p>
        ) : data !== undefined ? (
          <pre className="response-preview">{JSON.stringify(data, null, 2)}</pre>
        ) : (
          <p className="resource-message">No response yet.</p>
        )}
      </div>
    </section>
  )
}