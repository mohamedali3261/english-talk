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
