import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'
import { execFile } from 'child_process'
import ffmpegPath from 'ffmpeg-static'

const recordingsDir = path.resolve('recordings')
if (!fs.existsSync(recordingsDir)) {
  fs.mkdirSync(recordingsDir, { recursive: true })
}

function convertToMp4(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    if (!ffmpegPath) {
      resolve(false)
      return
    }
    execFile(ffmpegPath, [
      '-y',
      '-i', inputPath,
      '-c:v', 'libx264',
      '-preset', 'fast',
      '-crf', '23',
      '-pix_fmt', 'yuv420p',
      outputPath,
    ], (err) => {
      if (err) reject(err)
      else resolve(true)
    })
  })
}

export default defineConfig({
  plugins: [
    tailwindcss(),
    {
      name: 'recording-server',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url === '/api/upload-recording' && req.method === 'POST') {
            const chunks = []
            for await (const chunk of req) chunks.push(chunk)
            const buffer = Buffer.concat(chunks)
            const filename = req.headers['x-filename'] || `recording-${Date.now()}.mp4`
            const fmt = req.headers['x-format'] || 'webm'

            const tmpFile = path.join(recordingsDir, `tmp-${Date.now()}.${fmt}`)
            const outFile = path.join(recordingsDir, filename)

            fs.writeFileSync(tmpFile, buffer)

            if (fmt === 'webm') {
              try {
                await convertToMp4(tmpFile, outFile)
                fs.unlinkSync(tmpFile)
              } catch {
                if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile)
                fs.writeFileSync(outFile, buffer)
              }
            } else {
              try { fs.renameSync(tmpFile, outFile) } catch { fs.writeFileSync(outFile, buffer); fs.unlinkSync(tmpFile) }
            }

            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ ok: true, filename }))
            return
          }

          if (req.url === '/api/list-recordings') {
            const files = fs.readdirSync(recordingsDir)
              .filter(f => f.endsWith('.mp4'))
              .map(f => {
                const stat = fs.statSync(path.join(recordingsDir, f))
                return { name: f, timestamp: stat.mtimeMs, size: stat.size }
              })
              .sort((a, b) => b.timestamp - a.timestamp)
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(files))
            return
          }

          if (req.url?.startsWith('/recordings/') && req.method === 'GET') {
            const filename = path.basename(req.url)
            const filepath = path.join(recordingsDir, filename)
            if (fs.existsSync(filepath)) {
              const stat = fs.statSync(filepath)
              res.writeHead(200, {
                'Content-Type': 'video/mp4',
                'Content-Length': stat.size,
              })
              fs.createReadStream(filepath).pipe(res)
              return
            }
          }

          if (req.url?.startsWith('/api/google-tts') && req.method === 'POST') {
            const chunks = []
            for await (const chunk of req) chunks.push(chunk)
            const body = Buffer.concat(chunks)
            const url = new URL(req.url, 'http://localhost')
            const apiKey = url.searchParams.get('key') || ''
            try {
              const googleRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: body.toString(),
              })
              const data = await googleRes.text()
              res.writeHead(googleRes.status, { 'Content-Type': 'application/json' })
              res.end(data)
            } catch (e) {
              res.writeHead(500, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: { message: e.message } }))
            }
            return
          }

          next()
        })
      },
    },
  ],
  server: {
    fs: {
      allow: ['.', recordingsDir],
    },
  },
})
