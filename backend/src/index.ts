import express from 'express'
import path from 'path'
import fetch from 'node-fetch'
import cors from 'cors'
import router from './routes/upload'

const app = express()
app.use(express.json())
app.use(cors())
app.use('/api', router)

app.get('/proxy', async (req, res) => {
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
})

app.use(express.static(path.join(__dirname, '../../frontend/dist')));

app.listen(5000, () => console.log('Proxy server running on port 5000'))
