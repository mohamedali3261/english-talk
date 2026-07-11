let currentAudio: HTMLAudioElement | null = null

export function stopGoogleTts() {
  if (currentAudio) { currentAudio.pause(); currentAudio = null }
}

function pcmToWav(pcm: ArrayBuffer, sampleRate = 24000, channels = 1, bitsPerSample = 16): Blob {
  const byteRate = sampleRate * channels * bitsPerSample / 8
  const blockAlign = channels * bitsPerSample / 8
  const dataSize = pcm.byteLength
  const buffer = new ArrayBuffer(44 + dataSize)
  const view = new DataView(buffer)
  const writeStr = (off: number, s: string) => { for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i)) }
  writeStr(0, 'RIFF')
  view.setUint32(4, 36 + dataSize, true)
  writeStr(8, 'WAVE')
  writeStr(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, channels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, byteRate, true)
  view.setUint16(32, blockAlign, true)
  view.setUint16(34, bitsPerSample, true)
  writeStr(36, 'data')
  view.setUint32(40, dataSize, true)
  new Uint8Array(buffer, 44).set(new Uint8Array(pcm))
  return new Blob([buffer], { type: 'audio/wav' })
}

const voices = ['Zephyr', 'Puck', 'Charon', 'Kore', 'Fenrir', 'Leda', 'Orus', 'Aoede', 'Callirrhoe', 'Autonoe', 'Enceladus', 'Iapetus', 'Umbriel', 'Algieba', 'Despina', 'Erinome', 'Algenib', 'Rasalgethi', 'Laomedeia', 'Achernar', 'Alnilam', 'Schedar', 'Gacrux', 'Pulcherrima', 'Achird', 'Zubenelgenubi', 'Vindemiatrix', 'Sadachbia', 'Sadaltager', 'Sulafat']

export const GOOGLE_VOICES = voices

export async function speakGoogle(text: string, apiKey: string, voiceName = 'Kore'): Promise<void> {
  stopGoogleTts()
  const res = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/interactions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        model: 'gemini-2.5-flash-preview-tts',
        input: text,
        response_format: { type: 'audio' },
        generation_config: {
          speech_config: [{ voice: voiceName }]
        }
      })
    }
  )
  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    throw new Error(`Google TTS ${res.status}: ${errText.slice(0, 300)}`)
  }
  const data = await res.json()
  const audioB64 = data.output_audio?.data
  if (!audioB64) {
    console.error('Google TTS response:', JSON.stringify(data).slice(0, 500))
    throw new Error('No audio in response')
  }
  const pcm = Uint8Array.from(atob(audioB64), c => c.charCodeAt(0)).buffer
  const wav = pcmToWav(pcm)
  const url = URL.createObjectURL(wav)
  const audio = new Audio(url)
  currentAudio = audio
  await new Promise<void>((resolve, reject) => {
    audio.onended = () => { URL.revokeObjectURL(url); currentAudio = null; resolve() }
    audio.onerror = (e) => { URL.revokeObjectURL(url); currentAudio = null; reject(e) }
    audio.play()
  })
}

export async function speakSequentialGoogle(texts: string[], apiKey: string, voiceName = 'Kore'): Promise<void> {
  stopGoogleTts()
  for (const text of texts) {
    await speakGoogle(text, apiKey, voiceName)
  }
}
