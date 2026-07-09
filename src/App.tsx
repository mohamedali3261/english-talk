import { useState, useCallback } from 'react'
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import type { Section, ElementKey } from './types.ts'
import { emptySection } from './utils.ts'
import { templates } from './templates.ts'
import EditorPanel from './components/EditorPanel.tsx'
import PreviewPanel from './components/PreviewPanel.tsx'
import TemplatesSidebar from './components/TemplatesSidebar.tsx'
export default function App() {
  const [sections, setSections] = useState<Section[]>([{ ...emptySection(), title: 'Lesson 1' }])
  const [selectedId, setSelectedId] = useState<string>(sections[0].id)
  const [elementSizes, setElementSizes] = useState<Record<ElementKey, number>>({})
  const [selectedElement, setSelectedElement] = useState<ElementKey | null>(null)
  const [bgIndex, setBgIndex] = useState(0)
  const [speechRate, setSpeechRate] = useState(0.9)
  const [voiceGender, setVoiceGender] = useState<'male' | 'female' | 'auto'>('auto')
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview' | 'templates'>('edit')

  const getSize = (key: ElementKey) => elementSizes[key] ?? 100
  const changeSize = (key: ElementKey, delta: number) =>
    setElementSizes((prev) => ({ ...prev, [key]: Math.max(30, Math.min(300, (prev[key] ?? 100) + delta)) }))

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setSections((prev) => {
      const oldIndex = prev.findIndex((s) => s.id === active.id)
      const newIndex = prev.findIndex((s) => s.id === over.id)
      if (oldIndex === -1 || newIndex === -1) return prev
      const result = [...prev]
      const [moved] = result.splice(oldIndex, 1)
      result.splice(newIndex, 0, moved)
      return result
    })
  }, [])

  const updateSection = useCallback((updated: Section) => {
    setSections((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
  }, [])

  const deleteSection = useCallback((id: string) => {
    setSections((prev) => {
      const next = prev.filter((s) => s.id !== id)
      if (next.length === 0) return [{ ...emptySection(), title: 'Lesson 1' }]
      return next
    })
  }, [])

  const loadTemplate = useCallback((template: typeof templates[number]) => {
    const built = template.build()
    setSections(built)
    setSelectedId(built[0]?.id ?? '')
  }, [])

  const addSection = useCallback(() => {
    const s = emptySection()
    setSections((prev) => [...prev, s])
    setSelectedId(s.id)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col md:flex-row overflow-hidden">
      {/* Mobile tabs */}
      <div className="md:hidden flex items-stretch bg-black/30 border-b border-white/10 shrink-0">
        <button onClick={() => setMobileTab('edit')}
          className={`flex-1 py-3 text-sm font-medium text-center transition-all ${mobileTab === 'edit' ? 'text-white bg-white/10 border-b-2 border-blue-400' : 'text-white/50'}`}>✏️ Edit</button>
        <button onClick={() => setMobileTab('preview')}
          className={`flex-1 py-3 text-sm font-medium text-center transition-all ${mobileTab === 'preview' ? 'text-white bg-white/10 border-b-2 border-blue-400' : 'text-white/50'}`}>📱 Preview</button>
        <button onClick={() => setMobileTab('templates')}
          className={`flex-1 py-3 text-sm font-medium text-center transition-all ${mobileTab === 'templates' ? 'text-white bg-white/10 border-b-2 border-blue-400' : 'text-white/50'}`}>📋 Templates</button>
      </div>

      <div className={`${mobileTab !== 'edit' ? 'hidden md:flex' : 'flex'} md:flex flex-col flex-1 md:flex-none md:shrink-0 min-h-0`}>
        <EditorPanel
          sections={sections}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          updateSection={updateSection}
          deleteSection={deleteSection}
          addSection={addSection}
          handleDragEnd={handleDragEnd}
          sensors={sensors}
          bgIndex={bgIndex}
          setBgIndex={setBgIndex}
        />
      </div>
      <div className={`flex-1 min-h-0 ${mobileTab !== 'preview' ? 'hidden md:flex' : 'flex'} md:flex flex-col`}>
        <PreviewPanel
          sections={sections}
          selectedElement={selectedElement}
          setSelectedElement={setSelectedElement}
          changeSize={changeSize}
          getSize={getSize}
          setElementSizes={setElementSizes}
          bgIndex={bgIndex}
          speechRate={speechRate}
          setSpeechRate={setSpeechRate}
          voiceGender={voiceGender}
          setVoiceGender={setVoiceGender}
        />
      </div>
      <div className={`${mobileTab !== 'templates' ? 'hidden md:flex' : 'flex'} md:flex flex-col flex-1 md:flex-none md:shrink-0 min-h-0`}>
        <TemplatesSidebar loadTemplate={loadTemplate} />
      </div>
    </div>
  )
}
