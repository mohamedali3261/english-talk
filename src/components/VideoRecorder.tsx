import { useState, useRef, useEffect, useCallback } from 'react'

interface Region {
  x: number
  y: number
  width: number
  height: number
}

export default function VideoRecorder() {
  const [mode, setMode] = useState<'idle' | 'selecting' | 'recording'>('idle')
  const [elapsed, setElapsed] = useState(0)
  const [region, setRegion] = useState<Region | null>(null)
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<number>(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const videoElRef = useRef<HTMLVideoElement | null>(null)
  const regionRef = useRef<Region | null>(null)

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (timerRef.current) clearInterval(timerRef.current)
      if (videoElRef.current) { videoElRef.current.srcObject = null; videoElRef.current = null }
      if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null }
    }
  }, [])

  const getMp4Mime = () => {
    const types = ['video/mp4;codecs=avc1', 'video/mp4;codecs=h264', 'video/mp4']
    for (const t of types) {
      if (MediaRecorder.isTypeSupported(t)) return t
    }
    return null
  }

  const startRecording = async (selectedRegion: Region) => {
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: { width: 1920, height: 1080, cursor: "never" },
        audio: false,
      } as any)
      streamRef.current = displayStream

      const videoTrack = displayStream.getVideoTracks()[0]
      const settings = videoTrack.getSettings()
      const dispW = settings.width || window.screen.width
      const dispH = settings.height || window.screen.height
      const scaleX = dispW / window.screen.width
      const scaleY = dispH / window.screen.height

      const videoEl = document.createElement('video')
      videoEl.srcObject = displayStream
      videoEl.muted = true
      videoEl.playsInline = true
      await videoEl.play()
      videoElRef.current = videoEl

      const canvas = document.createElement('canvas')
      canvas.width = selectedRegion.width
      canvas.height = selectedRegion.height
      canvasRef.current = canvas

      const ctx = canvas.getContext('2d')!

      const draw = () => {
        ctx.drawImage(
          videoEl,
          selectedRegion.x * scaleX, selectedRegion.y * scaleY,
          selectedRegion.width * scaleX, selectedRegion.height * scaleY,
          0, 0, selectedRegion.width, selectedRegion.height
        )
        rafRef.current = requestAnimationFrame(draw)
      }
      draw()

      const recordStream = canvas.captureStream(30)
      const mp4Mime = getMp4Mime()
      const mimeType = mp4Mime || (
        MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
          ? 'video/webm;codecs=vp9'
          : 'video/webm'
      )

      const mediaRecorder = new MediaRecorder(recordStream, { mimeType })
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        cleanupRecording()
        saveRecording(mp4Mime ? 'mp4' : 'webm')
      }

      mediaRecorder.start(1000)
      setMode('recording')
      setRegion(null)

      const startTime = Date.now()
      setElapsed(0)
      timerRef.current = window.setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
    } catch (err) {
      console.error('Recording error:', err)
      cleanupRecording()
      setMode('idle')
    }
  }

  const cleanupRecording = () => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = 0 }
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = 0 }
    if (videoElRef.current) { videoElRef.current.srcObject = null; videoElRef.current = null }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
  }

  const saveRecording = async (ext: string) => {
    const blob = new Blob(chunksRef.current, { type: `video/${ext}` })
    const timestamp = Date.now()
    const filename = `recording-${new Date(timestamp).toISOString().slice(0, 19).replace(/[:-]/g, '')}.mp4`

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)

    try {
      await fetch('/api/upload-recording', {
        method: 'POST',
        headers: { 'X-Filename': filename, 'X-Format': ext },
        body: blob,
      })
    } catch {}
  }

  const triggerSelect = () => {
    setMode('selecting')
    setRegion(null)
  }

  const confirmRegion = () => {
    const r = regionRef.current
    if (r) {
      setMode('idle')
      startRecording(r)
    }
  }

  const cancelSelect = () => {
    setMode('idle')
    setRegion(null)
  }

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (mode !== 'selecting') return
    setDrawStart({ x: e.clientX, y: e.clientY })
    setRegion(null)
  }, [mode])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (mode !== 'selecting' || !drawStart) return
    const x = Math.min(drawStart.x, e.clientX)
    const y = Math.min(drawStart.y, e.clientY)
    const w = Math.abs(e.clientX - drawStart.x)
    const h = Math.abs(e.clientY - drawStart.y)
    const r = { x, y, width: w, height: h }
    setRegion(r)
    regionRef.current = r
  }, [mode, drawStart])

  const handleMouseUp = useCallback(() => {
    if (mode !== 'selecting') return
    setDrawStart(null)
  }, [mode])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <>
      {mode === 'selecting' && (
        <div
          className="fixed inset-0 z-[200] cursor-crosshair"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {region && (
            <div
              className="absolute border-2 border-green-400 bg-green-400/10"
              style={{ left: region.x, top: region.y, width: region.width, height: region.height }}
            >
              <div className="absolute -top-8 left-0 bg-green-500 text-white text-xs px-2 py-0.5 rounded whitespace-nowrap">
                {region.width} x {region.height}
              </div>
            </div>
          )}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3" onMouseDown={e => e.stopPropagation()}>
            {region && (
              <button
                onClick={confirmRegion}
                className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium cursor-pointer"
              >
                ✓ Record This Area
              </button>
            )}
            <button
              onClick={cancelSelect}
              className="px-5 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-medium cursor-pointer"
            >
              ✕ Cancel
            </button>
          </div>
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm bg-black/50 px-4 py-2 rounded-lg">
            Drag to select the area, then click "Record This Area"
          </div>
        </div>
      )}

      {mode === 'idle' && (
        <button
          onClick={triggerSelect}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-2xl shadow-red-500/40 flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
          title="Record"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4z" />
          </svg>
        </button>
      )}

      {mode === 'recording' && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-gray-900/90 backdrop-blur-xl rounded-full px-5 py-3 shadow-2xl border border-white/10">
          <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <span className="text-red-400 text-sm font-medium tabular-nums">{formatTime(elapsed)}</span>
          <button
            onClick={stopRecording}
            className="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-all cursor-pointer"
          >
            ■ Stop
          </button>
        </div>
      )}
    </>
  )
}
