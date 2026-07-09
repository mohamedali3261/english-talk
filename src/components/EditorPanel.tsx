import type { Section } from '../types.ts'
import { backgrounds } from '../constants.ts'
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import type { SensorDescriptor, SensorOptions } from '@dnd-kit/core'
import SortableSection from './SortableSection.tsx'

interface EditorPanelProps {
  sections: Section[]
  selectedId: string
  setSelectedId: (id: string) => void
  updateSection: (s: Section) => void
  deleteSection: (id: string) => void
  addSection: () => void
  handleDragEnd: (event: DragEndEvent) => void
  sensors: SensorDescriptor<SensorOptions>[]
  bgIndex: number
  setBgIndex: (i: number) => void
}

export default function EditorPanel({
  sections, selectedId, setSelectedId, updateSection, deleteSection, addSection,
  handleDragEnd, sensors, bgIndex, setBgIndex,
}: EditorPanelProps) {
  return (
    <div className="w-full md:w-[480px] md:min-w-[480px] bg-white/5 backdrop-blur-xl md:border-r border-white/10 p-6 overflow-y-auto flex flex-col min-h-0 md:h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">✏️ Lesson Editor</h1>
        <button
          onClick={addSection}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-blue-500/25"
        >
          + Add Section
        </button>
      </div>

      <div className="mb-3 p-4 bg-white/5 rounded-xl border border-white/10">
        <label className="block text-xs font-medium text-white/50 mb-2">Background</label>
        <div className="flex flex-wrap gap-1.5">
          {backgrounds.map((bg, i) => (
            <button
              key={i}
              onClick={() => setBgIndex(i)}
              className={`w-7 h-7 rounded-lg border transition-all ${bg} ${bgIndex === i ? 'ring-2 ring-white scale-110' : 'border-white/10 hover:scale-105'}`}
            />
          ))}
        </div>
      </div>



      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4 flex-1">
            {sections.map((section) => (
              <div
                key={section.id}
                onClick={() => setSelectedId(section.id)}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedId === section.id ? 'ring-2 ring-blue-400 rounded-xl' : 'opacity-80 hover:opacity-100'
                }`}
              >
                <SortableSection
                  section={section}
                  onUpdate={updateSection}
                  onDelete={() => deleteSection(section.id)}
                />
              </div>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {sections.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-white/40 text-sm">
          No sections yet. Click "Add Section" to start.
        </div>
      )}
    </div>
  )
}
