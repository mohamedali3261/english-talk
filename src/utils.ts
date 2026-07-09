import type { Word, Section } from './types.ts'

export function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

export const emptyWord = (): Word => ({ id: generateId(), en: '', ar: '' })

export const emptySection = (): Section => ({
  id: generateId(),
  title: '',
  sentence: '',
  translation: '',
  words: [emptyWord()],
})

let cachedVoices: SpeechSynthesisVoice[] | null = null

function ensureVoices(): SpeechSynthesisVoice[] {
  if (cachedVoices && cachedVoices.length > 0) return cachedVoices
  const v = window.speechSynthesis?.getVoices()
  if (v && v.length > 0) cachedVoices = v
  return cachedVoices ?? []
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    const v = window.speechSynthesis.getVoices()
    if (v.length > 0) cachedVoices = v
  }
}

export function speak(text: string, lang: string, pitch = 1, rate = 0.9, gender?: 'male' | 'female') {
  if (!text || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang

  const isAr = lang.startsWith('ar')
  utterance.rate = isAr ? 1 : rate
  utterance.pitch = isAr ? 0.85 : pitch

  const voices = ensureVoices()
  if (voices.length > 0) {
    const langPrefix = lang.split('-')[0]
    const effGender = isAr ? 'male' : gender

    let voice = voices.find(v =>
      v.lang.startsWith(langPrefix) &&
      v.name.includes('Microsoft') &&
      v.name.toLowerCase().includes(effGender === 'female' ? 'female' : 'male')
    )
    if (!voice) voice = voices.find(v =>
      v.lang.startsWith(langPrefix) &&
      v.name.includes('Microsoft')
    )
    if (!voice) voice = voices.find(v =>
      v.lang.startsWith(langPrefix) &&
      v.name.toLowerCase().includes(effGender === 'female' ? 'female' : 'male')
    )
    if (!voice) voice = voices.find(v => v.lang.startsWith(langPrefix))
    if (voice) utterance.voice = voice
  }

  window.speechSynthesis.speak(utterance)
}
