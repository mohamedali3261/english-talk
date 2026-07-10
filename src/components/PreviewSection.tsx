import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Section, ElementKey } from '../types.ts'

export default function PreviewSection({
  section,
  onSelect,
  getSize,
  selectedElement,
}: {
  section: Section
  onSelect: (k: ElementKey) => void
  getSize: (k: ElementKey) => number
  selectedElement: ElementKey | null
}) {
  const id = `sec-${section.id}`
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  const eTitle = `title-${section.id}`
  const eSentence = `sentence-${section.id}`
  const eTranslation = `translation-${section.id}`

  const noWords = section.words.every(w => !w.en && !w.ar)

  return (
    <div ref={setNodeRef} style={style} className="w-full space-y-3">
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        {section.title ? (
          <div
            onClick={(e) => { e.stopPropagation(); onSelect(eTitle) }}
            className={`px-4 py-3 w-full rounded-2xl bg-white/5 border transition-all text-center cursor-pointer ${selectedElement === eTitle ? 'border-blue-400 ring-2 ring-blue-400' : 'border-white/10'}`}
          >
            <h2
              className="font-bold text-white/80 text-center"
              style={{ fontSize: `${getSize(eTitle) * 0.016}rem`, lineHeight: 1.2 }}
            >{section.title}</h2>
          </div>
        ) : (
          <div className="h-4" />
        )}
      </div>

      {section.sentence && (
        <div
          onClick={(e) => { e.stopPropagation(); onSelect(eSentence) }}
          className={`p-5 w-full rounded-2xl bg-white/5 border transition-all text-center cursor-pointer ${selectedElement === eSentence ? 'border-blue-400 ring-2 ring-blue-400' : 'border-white/10'}`}
        >
          <p
            className="text-white font-semibold text-center leading-snug"
            style={{ fontSize: `${getSize(eSentence) * (noWords ? 0.025 : 0.02)}rem` }}
            dir="ltr"
          >{section.sentence}</p>
        </div>
      )}
      {section.translation && (
        <div
          onClick={(e) => { e.stopPropagation(); onSelect(eTranslation) }}
          className={`p-5 w-full rounded-2xl bg-white/5 border transition-all text-center cursor-pointer ${selectedElement === eTranslation ? 'border-blue-400 ring-2 ring-blue-400' : 'border-white/10'}`}
        >
          <p
            className="text-emerald-300 text-center leading-snug"
            style={{ fontSize: `${getSize(eTranslation) * (noWords ? 0.02 : 0.016)}rem` }}
            dir="rtl"
          >{section.translation}</p>
        </div>
      )}
    </div>
  )
}
