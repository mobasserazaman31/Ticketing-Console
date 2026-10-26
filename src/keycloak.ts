import Keycloak from 'keycloak-js'

const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8081',
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'ticketing-realm',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'postman-client',
})

let initialization: Promise<boolean> | undefined

export function initializeKeycloak(): Promise<boolean> {
  initialization ??= keycloak.init({
    onLoad: 'check-sso',
    pkceMethod: 'S256',
    checkLoginIframe: false,
  })

  return initialization
}

export default keycloak