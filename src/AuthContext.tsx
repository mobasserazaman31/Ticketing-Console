import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import keycloak, { initializeKeycloak } from './keycloak'

export interface AuthUser {
  sub?: string
  preferred_username?: string
  email?: string
  roles: string[]
  realm_access?: {
    roles?: string[]
  }
}

interface AuthContextValue {
  authenticated: boolean
  token: string | undefined
  user: AuthUser | undefined
  loading: boolean
  error: string | undefined
  login: (register?: boolean) => void
  logout: () => void
  hasRole: (roleName: string) => boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authenticated, setAuthenticated] = useState(false)
  const [token, setToken] = useState<string>()
  const [user, setUser] = useState<AuthUser>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>()

  useEffect(() => {
    let active = true

    const syncAuthState = () => {
      if (!active) return

      const claims = keycloak.tokenParsed as AuthUser | undefined
      setAuthenticated(Boolean(keycloak.authenticated))
      setToken(keycloak.token)
      setUser(
        keycloak.authenticated && claims
          ? { ...claims, roles: claims.realm_access?.roles ?? [] }
          : undefined,
      )
    }

    const refreshExpiredToken = () => {
      void keycloak.updateToken(30).then(syncAuthState).catch(syncAuthState)
    }

    keycloak.onAuthSuccess = syncAuthState
    keycloak.onAuthLogout = syncAuthState
    keycloak.onAuthRefreshSuccess = syncAuthState
    keycloak.onAuthRefreshError = syncAuthState
    keycloak.onTokenExpired = refreshExpiredToken

    void initializeKeycloak()
      .then(() => {
        syncAuthState()
        if (active) setLoading(false)
      })
      .catch((initError: unknown) => {
        if (!active) return
        setError(
          initError instanceof Error
            ? initError.message
            : 'Unable to initialize Keycloak.',
        )
        setLoading(false)
      })

    return () => {
      active = false
      keycloak.onAuthSuccess = undefined
      keycloak.onAuthLogout = undefined
      keycloak.onAuthRefreshSuccess = undefined
      keycloak.onAuthRefreshError = undefined
      keycloak.onTokenExpired = undefined
    }
  }, [])

  const value: AuthContextValue = {
    authenticated,
    token,
    user,
    loading,
    error,
    login: (register = false) => {
      void keycloak.login(register ? { action: 'register' } : undefined)
    },
    logout: () => {
      void keycloak.logout({ redirectUri: window.location.origin })
    },
    hasRole: (roleName) => user?.roles.includes(roleName) ?? false,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}