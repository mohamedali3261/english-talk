import { useState, useEffect, useMemo, type ReactNode } from 'react'
import type { Section, ElementKey } from '../types.ts'
import { backgrounds } from '../constants.ts'

function speak(text: string, rate = 0.9, voice: SpeechSynthesisVoice | null = null) {
  window.speechSynthesis.cancel()
  const utter = new SpeechSynthesisUtterance(text)
  const isArabic = /[\u0600-\u06FF]/.test(text)
  utter.lang = isArabic ? 'ar-SA' : 'en-US'
  utter.rate = isArabic ? 1 : rate
  if (isArabic && voice) utter.voice = voice
  window.speechSynthesis.speak(utter)
}

function speakSequential(texts: string[], rate = 0.9, arVoice: SpeechSynthesisVoice | null = null) {
  window.speechSynthesis.cancel()
  texts.forEach((text) => {
    const utter = new SpeechSynthesisUtterance(text)
    const isArabic = /[\u0600-\u06FF]/.test(text)
    utter.lang = isArabic ? 'ar-SA' : 'en-US'
    utter.rate = isArabic ? 1 : rate
    if (isArabic && arVoice) utter.voice = arVoice
    window.speechSynthesis.speak(utter)
  })
}

type Slide = { sectionIdx: number; type: 'translation' | 'sentence'; section: Section }

interface PreviewPanelProps {
  sections: Section[]
  selectedElement: ElementKey | null
  setSelectedElement: (key: ElementKey | null) => void
  changeSize: (key: ElementKey, delta: number) => void
  getSize: (key: ElementKey) => number
  setElementSizes: React.Dispatch<React.SetStateAction<Record<ElementKey, number>>>
  bgIndex: number
}

const transitions = [
  { value: 'anim-fadeSlideUp', label: 'Slide Up' },
  { value: 'anim-fadeIn', label: 'Fade' },
  { value: 'anim-slideRight', label: 'Slide' },
  { value: 'anim-scaleIn', label: 'Scale' },
  { value: 'anim-bounceIn', label: 'Bounce' },
  { value: 'anim-flipIn', label: 'Flip' },
  { value: 'anim-typing', label: 'Type' },
]

export default function PreviewPanel({
  sections, selectedElement: selEl, setSelectedElement, changeSize, getSize, setElementSizes,
  bgIndex,
}: PreviewPanelProps) {
  const [presentMode, setPresentMode] = useState(false)
  const [presentIndex, setPresentIndex] = useState(0)
  const [revealedCount, setRevealedCount] = useState(0)
  const [transition, setTransition] = useState('anim-fadeSlideUp')
  const [previewKey, setPreviewKey] = useState(0)
  const [speechRate, setSpeechRate] = useState(0.9)
  const [arVoices, setArVoices] = useState<SpeechSynthesisVoice[]>([])
  const [arVoiceName, setArVoiceName] = useState('')

  const loadVoices = () => {
    const voices = window.speechSynthesis?.getVoices() ?? []
    const ar = voices.filter(v => v.lang.startsWith('ar'))
    if (ar.length > 0) {
      setArVoices(ar)
      setArVoiceName(prev => prev || ar[0].name)
    }
    return ar
  }

  useEffect(() => {
    loadVoices()
    window.speechSynthesis?.addEventListener('voiceschanged', loadVoices)
    const forceLoad = () => {
      const u = new SpeechSynthesisUtterance(' ')
      u.volume = 0
      window.speechSynthesis?.speak(u)
      setTimeout(() => { window.speechSynthesis?.cancel(); loadVoices() }, 200)
    }
    document.addEventListener('click', forceLoad, { once: true })
    return () => {
      window.speechSynthesis?.removeEventListener('voiceschanged', loadVoices)
      document.removeEventListener('click', forceLoad)
    }
  }, [])

  const arVoice = arVoices.find(v => v.name === arVoiceName) ?? null

  const slides = useMemo(() => {
    const result: Slide[] = []
    sections.forEach((s, i) => {
      if (s.translation) result.push({ sectionIdx: i, type: 'translation', section: s })
      if (s.sentence) result.push({ sectionIdx: i, type: 'sentence', section: s })
    })
    return result
  }, [sections])

  const maxIndex = slides.length - 1

  useEffect(() => {
    if (!presentMode || presentIndex < 0 || presentIndex > maxIndex) return
    setRevealedCount(c => Math.max(c, presentIndex))
    const { section: s, type } = slides[presentIndex]
    setSelectedElement(type === 'translation' ? `translation-${s.id}` : `sentence-${s.id}`)
    if (type === 'translation' && s.translation) speak(s.translation, speechRate, arVoice)
    else if (type === 'sentence' && s.sentence) speak(s.sentence, speechRate, arVoice)
  }, [presentMode, presentIndex, slides, maxIndex, speechRate])

  const enterPresent = () => { setPresentMode(true); setPresentIndex(0); setRevealedCount(0) }
  const exitPresent = () => { setPresentMode(false); setPresentIndex(0); setRevealedCount(0) }
  const goPrev = () => setPresentIndex(i => Math.max(0, i - 1))
  const goNext = () => setPresentIndex(i => Math.min(maxIndex, i + 1))

  return (
    <div className="flex-1 flex flex-col items-center gap-3 p-4 md:p-8 overflow-y-auto">
      <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2">
        <button onClick={() => selEl && changeSize(selEl, -10)} className={`text-lg w-7 h-7 rounded-lg transition-all ${selEl ? 'text-white/70 hover:bg-white/20' : 'text-white/20'} bg-white/10`}>A−</button>
        <span className="text-white/60 text-xs w-10 text-center">{selEl ? `${getSize(selEl)}%` : '—'}</span>
        <button onClick={() => selEl && changeSize(selEl, 10)} className={`text-lg w-7 h-7 rounded-lg transition-all ${selEl ? 'text-white/70 hover:bg-white/20' : 'text-white/20'} bg-white/10`}>A+</button>
        <button onClick={() => selEl && setElementSizes((prev) => { const n = { ...prev }; delete n[selEl]; return n; })} className="text-white/40 hover:text-white text-xs ml-1 transition-all">Reset</button>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 bg-white/5 rounded-2xl px-4 py-2.5 border border-white/[0.06]">
        <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-1.5">
          <span className="text-[10px] text-white/40 font-medium">EN</span>
          <input type="range" min="0.2" max="1.5" step="0.1" value={speechRate}
            onChange={e => setSpeechRate(+e.target.value)}
            className="w-20 h-1 accent-emerald-400 cursor-pointer" />
          <span className="text-emerald-400/80 text-[11px] w-7 text-center font-mono">{speechRate.toFixed(1)}x</span>
        </div>
        <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-1.5" onClick={loadVoices}>
          <span className="text-[10px] text-white/40 font-medium">AR</span>
          {arVoices.length > 0 ? (
            <select value={arVoiceName} onChange={e => setArVoiceName(e.target.value)}
              className="bg-transparent text-white text-[11px] rounded-md px-1.5 py-0.5 outline-none cursor-pointer border border-white/10 hover:border-white/25 transition-colors">
              {arVoices.map(v => (
                <option key={v.name} value={v.name} className="bg-gray-800 text-white">{v.name.replace(/Arabic.*$/, '').trim() || v.name}</option>
              ))}
            </select>
          ) : (
            <span className="text-[11px] text-white/30">الصوت الافتراضي</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 bg-white/5 rounded-xl px-3 py-1.5">
        <span className="text-[10px] text-white/40 font-medium mr-1">Transition</span>
        {transitions.map(t => (
          <button key={t.value}
            className={`text-[11px] px-2 py-0.5 rounded-md transition-all ${transition === t.value ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white/80'}`}
            onClick={() => setTransition(t.value)}>{t.label}</button>
        ))}
        <span className="text-white/15 mx-0.5">|</span>
        <button onClick={() => setPreviewKey(k => k + 1)}
          className="text-[11px] px-2 py-0.5 rounded-md text-blue-300 hover:text-blue-200 hover:bg-white/10 transition-all">▶ Preview</button>
      </div>

      {!presentMode ? (
        <button onClick={enterPresent}
          className="px-6 py-2 rounded-xl text-sm font-bold tracking-wider transition-all shadow-lg bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30">
          ▶ PRESENT
        </button>
      ) : (
        <div className="flex items-center gap-3">
          <button onClick={exitPresent}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-red-500/20 hover:bg-red-500/40 text-red-300 border border-red-500/30 transition-all">
            ✕ Exit
          </button>
          <button onClick={goPrev} disabled={presentIndex === 0}
            className="px-4 py-2 rounded-xl text-sm font-bold bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all">
            ◀ Prev
          </button>
          <span className="text-white/70 text-sm font-mono min-w-[60px] text-center">{presentIndex + 1}/{slides.length}</span>
          <button onClick={goNext} disabled={presentIndex === maxIndex}
            className="px-4 py-2 rounded-xl text-sm font-bold bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all">
            Next ▶
          </button>
        </div>
      )}

      <div className={`relative w-full md:w-[420px] max-w-[420px] h-[750px] ${backgrounds[bgIndex]} rounded-none shadow-2xl overflow-hidden border-4 border-white/20`}>
        <div className="absolute inset-0 z-0 pointer-events-none select-none text-[40px] leading-none opacity-20">
          <span className="absolute top-[8%] left-[10%] rotate-[-15deg] text-pink-400">★</span>
          <span className="absolute top-[15%] right-[12%] rotate-[10deg] text-yellow-400">♪</span>
          <span className="absolute top-[30%] left-[5%] rotate-[25deg] text-sky-400">●</span>
          <span className="absolute top-[40%] right-[8%] rotate-[-20deg] text-violet-400">◆</span>
          <span className="absolute top-[55%] left-[12%] rotate-[30deg] text-emerald-400">✿</span>
          <span className="absolute top-[60%] right-[5%] rotate-[-10deg] text-orange-400">♡</span>
          <span className="absolute top-[75%] left-[8%] rotate-[-25deg] text-cyan-400">◇</span>
          <span className="absolute top-[82%] right-[10%] rotate-[15deg] text-rose-400">☆</span>
        </div>

        <div className="absolute top-0 left-0 right-0 z-20 flex justify-center pt-3 pointer-events-none">
          <img src="/lo.png" className="w-[150px] h-auto object-contain opacity-80" />
        </div>

        <div className="h-full flex flex-col justify-center px-3 py-4 gap-1.5 relative z-10">
          {sections.length === 0 ? (
            <p className="text-white/30 text-sm text-center">Add a template or section</p>
          ) : (
            (() => {
              let slideAcc = 0
              const pk = previewKey > 0 ? previewKey : ''
              return sections.flatMap((s) => {
                const types: ('translation' | 'sentence')[] = []
                if (s.translation) types.push('translation')
                if (s.sentence) types.push('sentence')
                const sectionStart = slideAcc
                slideAcc += types.length
                if (presentMode && sectionStart > revealedCount) return []
                const previewTriggered = !presentMode && previewKey > 0
                const items: ReactNode[] = []
                if (s.title) {
                  items.push(
                    <SectionTitle key={`title-${s.id}-${pk}`} section={s} selectedElement={selEl} setSelectedElement={setSelectedElement} getSize={getSize} speechRate={speechRate} arVoice={arVoice} cls={presentMode && sectionStart === presentIndex || previewTriggered ? transition : ''} />
                  )
                }
                const visibleTypes = presentMode ? types.filter((_, ti) => sectionStart + ti <= revealedCount) : types
                const hasAnyContent = visibleTypes.length > 0
                if (hasAnyContent) {
                  items.push(
                    <div key={`box-${s.id}-${pk}`} className="bg-white/[0.07] rounded-xl px-3 py-1.5 border border-white/10">
                      {visibleTypes.includes('translation') && (
                        <SectionItem section={s} type="translation" selectedElement={selEl} setSelectedElement={setSelectedElement} getSize={getSize} speechRate={speechRate} arVoice={arVoice} cls={presentMode && sectionStart + types.indexOf('translation') === presentIndex || previewTriggered ? transition : ''} />
                      )}
                      {visibleTypes.includes('sentence') && (
                        <SectionItem section={s} type="sentence" selectedElement={selEl} setSelectedElement={setSelectedElement} getSize={getSize} speechRate={speechRate} arVoice={arVoice} cls={presentMode && sectionStart + types.indexOf('sentence') === presentIndex || previewTriggered ? transition : ''} />
                      )}
                    </div>
                  )
                }
                const words = s.words.filter(w => w.en || w.ar)
                if (words.length > 0) items.push(
                  <div key={`words-${s.id}-${pk}`} className="flex flex-col items-center gap-1">
                    <p className="text-[10px] text-white/30 font-medium">— تفكيك الجملة —</p>
                    {words.map(w => (
                      <WordItem key={`${w.id}-${pk}`} word={w} selectedElement={selEl} setSelectedElement={setSelectedElement} getSize={getSize} speechRate={speechRate} arVoice={arVoice} />
                    ))}
                  </div>
                )
                return items
              })
            })()
          )}
        </div>
      </div>
    </div>
  )
}

function SectionTitle({ section: s, selectedElement, setSelectedElement, getSize, speechRate, arVoice, cls = '' }: {
  section: Section; selectedElement: ElementKey | null; setSelectedElement: (key: ElementKey | null) => void; getSize: (key: ElementKey) => number; speechRate: number; arVoice: SpeechSynthesisVoice | null; cls?: string
}) {
  const eKey = `title-${s.id}`
  const active = selectedElement === eKey
  return (
    <p className={`text-center font-bold transition-all cursor-pointer px-3 py-1 rounded-lg ${cls} ${active ? 'text-green-300 bg-green-500/15 ring-1 ring-green-400/40' : 'text-white/70'}`}
      style={{ fontSize: `${getSize(eKey) * 0.016}rem` }}
      onClick={(e) => { e.stopPropagation(); setSelectedElement(eKey); speak(s.title, speechRate, arVoice) }}>{s.title}</p>
  )
}

function SectionItem({ section: s, type, selectedElement, setSelectedElement, getSize, speechRate, arVoice, cls = '' }: {
  section: Section; type: 'sentence' | 'translation'; selectedElement: ElementKey | null; setSelectedElement: (key: ElementKey | null) => void; getSize: (key: ElementKey) => number; speechRate: number; arVoice: SpeechSynthesisVoice | null; cls?: string
}) {
  const text = type === 'sentence' ? s.sentence : s.translation
  if (!text) return null
  const eKey = `${type}-${s.id}`
  const active = selectedElement === eKey
  const isAr = type === 'translation'
  return (
    <p className={`text-center leading-tight font-medium transition-all cursor-pointer rounded-lg ${cls} ${active ? 'text-green-300 bg-green-500/15 ring-1 ring-green-400/40' : isAr ? 'text-emerald-300/90' : 'text-white'}`}
      style={{ fontSize: `${getSize(eKey) * (isAr ? 0.013 : 0.014)}rem` }}
      onClick={(e) => { e.stopPropagation(); setSelectedElement(eKey); speak(text, speechRate, arVoice) }}>{text}</p>
  )
}

function WordItem({ word: w, selectedElement, setSelectedElement, getSize, speechRate, arVoice, cls = '' }: {
  word: { id: string; en: string; ar: string }; selectedElement: ElementKey | null; setSelectedElement: (key: ElementKey | null) => void; getSize: (key: ElementKey) => number; speechRate: number; arVoice: SpeechSynthesisVoice | null; cls?: string
}) {
  const eKey = `word-${w.id}`
  const active = selectedElement === eKey
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1 border transition-all cursor-pointer ${cls} ${
        active
          ? 'bg-green-500/15 border-green-400/40 ring-1 ring-green-400/40'
          : 'bg-white/[0.06] border-white/10 hover:border-white/20'
      }`}
      style={{ fontSize: `${getSize(eKey) * 0.013}rem` }}
      onClick={(e) => { e.stopPropagation(); setSelectedElement(eKey); speakSequential([w.en, w.ar], speechRate, arVoice) }}
    >
      <span className={`transition-colors ${active ? 'text-green-300' : 'text-white'}`}>{w.en}</span>
      <span className="text-gray-500"> = </span>
      <span className={`transition-colors ${active ? 'text-green-300' : 'text-emerald-300'}`}>{w.ar}</span>
    </div>
  )
}
