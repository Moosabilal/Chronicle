import axios from 'axios'

const rawBaseURL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1').trim()
const cleanedURL = rawBaseURL.replace(/\/+$/, '')
const baseURL = cleanedURL.endsWith('/api/v1') ? cleanedURL : `${cleanedURL}/api/v1`

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

/* ── Request interceptor: inject JWT ─────────────────────────────────────── */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('chronicle_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

/* ── Response interceptor: handle 401 globally ───────────────────────────── */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('chronicle_token')
      localStorage.removeItem('chronicle_user')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
