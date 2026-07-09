import { useCallback } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Section } from '../types.ts'
import SortableWord from './SortableWord.tsx'
import { emptyWord } from '../utils.ts'

export default function SortableSection({
  section,
  onUpdate,
  onDelete,
}: {
  section: Section
  onUpdate: (s: Section) => void
  onDelete: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: section.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const titleListeners = { ...listeners }
  const titleAttributes = { ...attributes }

  const wordSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleWordDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const extractWordId = (id: string) => id.replace(/^word-[^-]+-/, '')
    const activeWordId = extractWordId(active.id as string)
    const overWordId = extractWordId(over.id as string)
    const words = [...section.words]
    const oldIndex = words.findIndex(w => w.id === activeWordId)
    const newIndex = words.findIndex(w => w.id === overWordId)
    if (oldIndex === -1 || newIndex === -1) return
    const [moved] = words.splice(oldIndex, 1)
    words.splice(newIndex, 0, moved)
    onUpdate({ ...section, words })
  }, [section, onUpdate])

  return (
    <div ref={setNodeRef} style={style} className="bg-gray-800/80 rounded-xl shadow-sm border border-gray-700 p-5 space-y-4">
      <div className="flex items-center gap-3">
        <div {...titleAttributes} {...titleListeners} className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-300 touch-none">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" d="M9 5h1M9 12h1M9 19h1M14 5h1M14 12h1M14 19h1"/></svg>
        </div>
        <textarea
          value={section.title}
          onChange={(e) => onUpdate({ ...section, title: e.target.value })}
          placeholder="Lesson Title"
          rows={1}
          className="flex-1 text-lg font-semibold bg-transparent border-none outline-none text-white placeholder-gray-500 cursor-text resize-none overflow-hidden leading-7"
          onInput={(e) => { e.currentTarget.style.height = 'auto'; e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px' }}
        />
        <button onClick={onDelete} className="text-red-400 hover:text-red-300 transition-colors" title="حذف القسم">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">English Sentence</label>
          <input
            type="text"
            value={section.sentence}
            onChange={(e) => onUpdate({ ...section, sentence: e.target.value })}
            placeholder="I can see the cat"
            className="w-full px-3 py-2 border border-gray-600 rounded-lg text-white bg-gray-700/50 focus:bg-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none transition-all placeholder-gray-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Arabic Translation</label>
          <input
            type="text"
            value={section.translation}
            onChange={(e) => onUpdate({ ...section, translation: e.target.value })}
            placeholder="أنا أستطيع رؤية القطة"
            className="w-full px-3 py-2 border border-gray-600 rounded-lg text-white bg-gray-700/50 focus:bg-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none transition-all placeholder-gray-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">Word Breakdown</label>
          <DndContext sensors={wordSensors} collisionDetection={closestCenter} onDragEnd={handleWordDragEnd}>
            <SortableContext items={section.words.map(w => `word-${section.id}-${w.id}`)} strategy={verticalListSortingStrategy}>
              <div className="space-y-1.5">
                {section.words.map((w, i) => (
                  <SortableWord
                    key={`word-${section.id}-${w.id}`}
                    word={w}
                    sectionId={section.id}
                    onUpdate={(updated) => {
                      const words = [...section.words]
                      words[i] = updated
                      onUpdate({ ...section, words })
                    }}
                    onDelete={() => {
                      const words = section.words.filter((_, idx) => idx !== i)
                      onUpdate({ ...section, words })
                    }}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          <button
            onClick={() => onUpdate({ ...section, words: [...section.words, emptyWord()] })}
            className="mt-2 text-sm text-blue-500 hover:text-blue-600 font-medium transition-colors"
          >
            + Add word
          </button>
        </div>
      </div>
    </div>
  )
}
