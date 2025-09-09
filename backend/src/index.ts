import express from 'express'
import path from 'path'
import fetch from 'node-fetch'
import cors from 'cors'
import router from './routes/upload'
import { Server } from 'http'

const app = express()
app.use(express.json())
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'development'
        ? [
            'http://localhost:5000',
            'http://localhost:4173',
            'http://127.0.0.1:5000',
          ]
        : 'https://nsfw-detector-93nm.onrender.com',
    credentials: true,
  })
)

app.use('/api', router)

/* app.get('/proxy', async (req, res) => {
  const { url } = req.query
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing URL' })
  }

  try {
    const response = await fetch(url)
    const buffer = await response.arrayBuffer()

    res.setHeader(
      'Content-Type',
      response.headers.get('content-type') || 'image/jpeg'
    )
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.send(Buffer.from(buffer))
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch image' })
  }
}) */

app.use(express.static(path.join(__dirname, '../../frontend/dist')))

// The "catchall" handler: for any request that doesn't
// match an API route, send back React's index.html file.
/* app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist', 'index.html'));
}); */

const server: Server = app.listen(5000, () =>
  console.log('Server running on port 5000')
)

// Handle any type of server closing and error issue

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received... Server shutting down..')
  if (server) {
    server.close(() => {
      process.exit(1)
    })
  }
  process.exit(1)
})

process.on('SIGINT', () => {
  console.log('SIGINT signal received... Server shutting down..')
  if (server) {
    server.close(() => {
      process.exit(1)
    })
  }
  process.exit(1)
})

process.on('unhandledRejection', () => {
  console.log('Unhandled Rejection signal received... Server shutting down..')
  if (server) {
    server.close(() => {
      process.exit(1)
    })
  }
  process.exit(1)
})

process.on('uncaughtException', () => {
  console.log('Uncaught Exception signal received... Server shutting down..')
  if (server) {
    server.close(() => {
      process.exit(1)
    })
  }
  process.exit(1)
})
