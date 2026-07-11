import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Word, ElementKey } from '../types.ts'

export default function PreviewWord({
  word,
  sectionId,
  onSelect,
  getSize,
  selectedElement,
}: {
  word: Word
  sectionId: string
  onSelect: (k: ElementKey) => void
  getSize: (k: ElementKey) => number
  selectedElement: ElementKey | null
}) {
  const id = `wrd-${sectionId}-${word.id}`
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  const eWord = `word-${word.id}`

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={(e) => { e.stopPropagation(); onSelect(eWord) }}
      className={`flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-3 cursor-grab active:cursor-grabbing border transition-all ${selectedElement === eWord ? 'border-blue-400 ring-2 ring-blue-400' : 'border-white/5'}`}
    >
      <span
        className="font-medium text-white transition-all"
        style={{ fontSize: `${getSize(eWord) * 0.014}rem` }}
      >{word.en}</span>
      <span className="text-gray-400" style={{ fontSize: `${getSize(eWord) * 0.012}rem` }}>=</span>
      <span
        className="text-emerald-300 transition-all"
        style={{ fontSize: `${getSize(eWord) * 0.014}rem` }}
      >{word.ar}</span>
    </div>
  )
}
