export interface Word {
  id: string
  en: string
  ar: string
}

export interface Section {
  id: string
  title: string
  sentence: string
  translation: string
  words: Word[]
  gender?: 'male' | 'female'
}

export type ElementKey = string
