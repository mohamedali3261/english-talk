import { useState, useEffect, useCallback, useRef } from 'react'

export interface SpeechVoice {
  name: string
  lang: string
  voiceURI: string
}

export function useSpeech() {
  const [voices, setVoices] = useState<SpeechVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<string>('')
  const [selectedArVoice, setSelectedArVoice] = useState<string>('')
  const [enRate, setEnRate] = useState(0.7)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playingId, setPlayingId] = useState<string | null>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices()
      const allVoices = availableVoices
        .filter(v => v.lang.startsWith('en') || v.lang.startsWith('ar'))
        .map(v => ({
          name: v.name,
          lang: v.lang,
          voiceURI: v.voiceURI
        }))
      setVoices(allVoices)
      if (allVoices.length > 0 && !selectedVoice) {
        const defaultVoice = allVoices.find(v => v.lang === 'en-US') || allVoices.find(v => v.lang.startsWith('en'))
        if (defaultVoice) setSelectedVoice(defaultVoice.voiceURI)
      }
      if (allVoices.length > 0 && !selectedArVoice) {
        const defaultArVoice = allVoices.find(v => v.lang.startsWith('ar'))
        if (defaultArVoice) setSelectedArVoice(defaultArVoice.voiceURI)
      }
    }

    loadVoices()
    speechSynthesis.onvoiceschanged = loadVoices

    return () => {
      speechSynthesis.onvoiceschanged = null
    }
  }, [])

  const speak = useCallback((text: string, id: string, lang?: 'en' | 'ar') => {
    if (isPlaying && playingId === id) {
      speechSynthesis.cancel()
      setIsPlaying(false)
      setPlayingId(null)
      return
    }

    speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    let voiceUri = selectedVoice
    if (lang === 'ar') {
      voiceUri = selectedArVoice || voices.find(v => v.lang.startsWith('ar'))?.voiceURI || selectedVoice
    }
    const voice = voices.find(v => v.voiceURI === voiceUri)
    if (voice) {
      const allVoices = speechSynthesis.getVoices()
      const matchVoice = allVoices.find(v => v.voiceURI === voice.voiceURI)
      if (matchVoice) utterance.voice = matchVoice
      utterance.lang = voice.lang
    }
    utterance.rate = lang === 'ar' ? 0.9 : enRate
    utterance.pitch = 1

    utterance.onstart = () => {
      setIsPlaying(true)
      setPlayingId(id)
    }
    utterance.onend = () => {
      setIsPlaying(false)
      setPlayingId(null)
    }
    utterance.onerror = () => {
      setIsPlaying(false)
      setPlayingId(null)
    }

    utteranceRef.current = utterance
    speechSynthesis.speak(utterance)
  }, [voices, selectedVoice, isPlaying, playingId])

  const stop = useCallback(() => {
    speechSynthesis.cancel()
    setIsPlaying(false)
    setPlayingId(null)
  }, [])

  return {
    voices,
    selectedVoice,
    setSelectedVoice,
    selectedArVoice,
    setSelectedArVoice,
    enRate,
    setEnRate,
    speak,
    stop,
    isPlaying,
    playingId
  }
}
