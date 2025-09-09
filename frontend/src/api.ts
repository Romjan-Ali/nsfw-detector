// api.js
import axios from 'axios'

console.log('All env vars:', import.meta.env)

const api = axios.create({
  baseURL:
    import.meta.env.VITE_NODE_ENV === 'development'
      ? 'http://localhost:5000/api' // Localhost in development
      : '/api', // Same domain in production
  withCredentials: true,
})

export default api
