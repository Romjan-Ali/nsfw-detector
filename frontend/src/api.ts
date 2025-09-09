// api.js
import axios from 'axios'

const api = axios.create({
  baseURL:
    import.meta.env.VITE_NODE_ENV === 'development'
      ? 'http://localhost:5000/api' // Localhost in development
      : 'https://nsfw-detector-93nm.onrender.com/api', // Same domain in production
  withCredentials: true,
})

export default api
