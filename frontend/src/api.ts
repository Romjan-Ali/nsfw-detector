// api.js - Debug version
import axios from 'axios'

// Log all environment variables for debugging
console.log('=== Environment Debug ===')
console.log('All env vars:', import.meta.env)
console.log('MODE:', import.meta.env.MODE)
console.log('PROD:', import.meta.env.PROD)
console.log('DEV:', import.meta.env.DEV)
console.log('Current URL:', window.location.href)
console.log('Current Origin:', window.location.origin)

// Determine base URL
const isDevelopment = import.meta.env.MODE === 'development' || import.meta.env.DEV
const baseURL = isDevelopment 
  ? 'http://localhost:5000/api' 
  : 'https://nsfw-detector-backend.onrender.com/api'
  // : 'https://nsfw-detector-backend.vercel.app/api'

console.log('Is Development:', isDevelopment)
console.log('Computed baseURL:', baseURL)

const api = axios.create({
  baseURL,
  withCredentials: true,
  // timeout: 10000, // 10 second timeout
})

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('=== API Request ===')
    console.log('Base URL', config.baseURL || '')
    console.log('URL', config.url || '')
    console.log('Method:', config.method)
    console.log('Headers:', config.headers)
    console.log('Data:', config.data)
    return config
  },
  (error) => {
    console.error('Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('=== API Response ===')
    console.log('Status:', response.status)
    console.log('Data:', response.data)
    return response
  },
  (error) => {
    console.error('=== API Error ===')
    console.error('Error:', error)
    console.error('Response:', error.response)
    console.error('Request:', error.config)
    
    if (error.code === 'ERR_NETWORK') {
      console.error('Network Error - possible causes:')
      console.error('1. Server not running')
      console.error('2. CORS issues')
      console.error('3. Wrong URL')
      console.error('4. Firewall blocking request')
    }
    
    return Promise.reject(error)
  }
)

export default api

// Test function - you can call this to test the API
export const testAPI = async () => {
  try {
    console.log('=== Testing API Connection ===')
    const response = await api.get('/test') // Create a test endpoint
    console.log('API Test Success:', response.data)
    return response.data
  } catch (error) {
    console.error('API Test Failed:', error)
    throw error
  }
}