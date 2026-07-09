import { useState } from 'react'
import { templates } from '../templates.ts'
import { wordTemplates } from '../wordTemplates.ts'
import { conversationTemplates } from '../conversations.ts'

const allTemplates = [...wordTemplates, ...templates, ...conversationTemplates]

const catInfo: Record<string, { icon: string; label: string; color: string }> = {
  words: { icon: '📖', label: 'قوالب كلمات', color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30' },
  sentences: { icon: '💬', label: 'قوالب جمل', color: 'from-sky-500/20 to-sky-600/10 border-sky-500/30' },
  conversation: { icon: '🎭', label: 'حوارات', color: 'from-violet-500/20 to-violet-600/10 border-violet-500/30' },
}

export default function TemplatesSidebar({ loadTemplate }: {
  loadTemplate: (template: typeof templates[number]) => void
}) {
  const [activeCat, setActiveCat] = useState<string | null>(null)

  return (
    <div className="w-full md:w-[420px] md:min-w-[420px] bg-white/5 backdrop-blur-xl md:border-l border-white/10 p-5 overflow-y-auto min-h-0 md:h-screen">
      <h2 className="text-lg font-bold text-white mb-5 text-center">📦 القوالب</h2>

      <div className="flex flex-col gap-2 mb-5">
        {Object.entries(catInfo).map(([key, cat]) => (
          <button
            key={key}
            onClick={() => setActiveCat(activeCat === key ? null : key)}
            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all text-left flex items-center gap-3 ${
              activeCat === key
                ? 'bg-white/15 ring-2 ring-white/30 text-white'
                : 'bg-white/[0.06] hover:bg-white/10 text-white/70'
            }`}
          >
            <span className="text-lg">{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {activeCat && (
        <div className={`p-3 bg-gradient-to-br rounded-xl border space-y-2 ${catInfo[activeCat]?.color ?? 'bg-white/5 border-white/10'}`}>
          {allTemplates.filter(t => t.category === activeCat).map((t, i) => (
            <button
              key={i}
              onClick={() => { loadTemplate(t); setActiveCat(null) }}
              className="w-full text-left px-4 py-3 rounded-xl bg-black/30 hover:bg-black/50 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white font-semibold text-sm">{t.name}</span>
              </div>
              <div className="text-white/50 text-xs leading-relaxed">
                {t.build().slice(0, 3).map((s, j) => (
                  <span key={j}>
                    {s.title && activeCat === 'conversation' ? (
                      <span className="text-violet-300 font-medium">{s.title}: </span>
                    ) : (
                      <span className="text-white/30">{j + 1}. </span>
                    )}
                    <span>{s.sentence}</span><br />
                  </span>
                ))}
                {t.build().length > 3 && <span className="text-white/30">+{t.build().length - 3} more</span>}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
