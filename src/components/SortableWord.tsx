import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Word } from '../types.ts'

export default function SortableWord({
  word,
  sectionId,
  onUpdate,
  onDelete,
}: {
  word: Word
  sectionId: string
  onUpdate: (w: Word) => void
  onDelete: () => void
}) {
  const id = `word-${sectionId}-${word.id}`
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="flex gap-2 items-center">
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-blue-400 touch-none p-1 shrink-0">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" d="M9 5h1M9 12h1M9 19h1M14 5h1M14 12h1M14 19h1"/></svg>
      </div>
      <input
        type="text"
        value={word.en}
        onChange={(e) => onUpdate({ ...word, en: e.target.value })}
        placeholder="English"
        className="w-28 px-3 py-1.5 border border-gray-600 rounded-lg text-white bg-gray-700/50 focus:bg-gray-700 focus:border-blue-500 outline-none text-sm transition-all cursor-text placeholder-gray-500"
      />
      <span className="text-gray-500 text-sm font-medium shrink-0">=</span>
      <input
        type="text"
        value={word.ar}
        onChange={(e) => onUpdate({ ...word, ar: e.target.value })}
        placeholder="عربي"
        className="w-28 px-3 py-1.5 border border-gray-600 rounded-lg text-white bg-gray-700/50 focus:bg-gray-700 focus:border-blue-500 outline-none text-sm transition-all cursor-text placeholder-gray-500"
      />
      <button onClick={onDelete} className="text-red-400 hover:text-red-300 transition-colors shrink-0">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>
  )
}
