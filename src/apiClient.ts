import axios from 'axios'
import keycloak from './keycloak'

const apiClient = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    Accept: 'application/json',
  },
})

apiClient.interceptors.request.use(async (config) => {
  if (keycloak.authenticated) {
    await keycloak.updateToken(30)
    if (keycloak.token) {
      config.headers.Authorization = `Bearer ${keycloak.token}`
    }
  }

  return config
})

export default apiClient