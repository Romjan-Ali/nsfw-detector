import express from 'express'
import cors from 'cors'
import router from './routes/upload'
import { Server } from 'http'

const app = express()
app.use(express.json())

// Fixed CORS configuration
const corsOptions = {
  origin:
    process.env.NODE_ENV === 'development'
      ? [
          'http://localhost:5000',   // React Create App default
          'http://localhost:5173',   // Vite dev server
          'http://localhost:4173',   // Vite preview
          'http://127.0.0.1:5000',   // Alternative localhost
          'http://127.0.0.1:5173',   // Alternative localhost
          'http://127.0.0.1:4173'    // Alternative localhost
        ]
      : 'https://photo-nsfw-scanner.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}

app.use(cors(corsOptions))

// API routes
app.use('/api', router)

const server: Server = app.listen(5000, () => {
  console.log('Server running on port 5000')
  console.log('Environment:', process.env.NODE_ENV || 'production')
  console.log('CORS origins:', corsOptions.origin)
})

// Graceful shutdown handlers
const gracefulShutdown = (signal: string) => {
  console.log(`${signal} signal received... Server shutting down gracefully.`)
  
  if (server) {
    server.close((err) => {
      if (err) {
        console.error('Error during server close:', err)
        process.exit(1)
      }
      console.log('Server closed successfully.')
      process.exit(0) // Success exit code
    })
    
    // Force exit after 10 seconds
    setTimeout(() => {
      console.log('Force closing server...')
      process.exit(1)
    }, 10000)
  } else {
    process.exit(0)
  }
}

// Handle termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
  gracefulShutdown('unhandledRejection')
})

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
  gracefulShutdown('uncaughtException')
})