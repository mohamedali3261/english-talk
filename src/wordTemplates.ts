import type { Template } from './templates.ts'
import { emptySection } from './utils.ts'

function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

export const wordTemplates: Template[] = [
  {
    name: 'Greetings',
    description: 'Hello! My name is Ahmed.',
    category: 'words',
    build: () => [
      {
        ...emptySection(),
        title: 'تحيات',
        sentence: 'Hello! My name is Ahmed.',
        translation: 'مرحباً! اسمي أحمد.',
        words: [
          { id: generateId(), en: 'Hello!', ar: 'مرحباً!' },
          { id: generateId(), en: 'My', ar: 'اسم' },
          { id: generateId(), en: 'name', ar: 'اسم' },
          { id: generateId(), en: 'is', ar: '—' },
          { id: generateId(), en: 'Ahmed', ar: 'أحمد' },
        ],
      },
    ],
  },
  {
    name: 'At the Restaurant',
    description: 'I would like to order a pizza, please.',
    category: 'words',
    build: () => [
      {
        ...emptySection(),
        title: 'طلب الطعام',
        sentence: 'I would like to order a pizza, please.',
        translation: 'أود أن أطلب بيتزا، من فضلك.',
        words: [
          { id: generateId(), en: 'I', ar: 'أنا' },
          { id: generateId(), en: 'would like', ar: 'أود' },
          { id: generateId(), en: 'to order', ar: 'أطلب' },
          { id: generateId(), en: 'a', ar: '—' },
          { id: generateId(), en: 'pizza', ar: 'بيتزا' },
          { id: generateId(), en: 'please', ar: 'من فضلك' },
        ],
      },
    ],
  },
  {
    name: 'Shopping',
    description: 'How much does this shirt cost?',
    category: 'words',
    build: () => [
      {
        ...emptySection(),
        title: 'السؤال عن السعر',
        sentence: 'How much does this shirt cost?',
        translation: 'كم تكلفة هذا القميص؟',
        words: [
          { id: generateId(), en: 'How much', ar: 'كم' },
          { id: generateId(), en: 'does', ar: '—' },
          { id: generateId(), en: 'this', ar: 'هذا' },
          { id: generateId(), en: 'shirt', ar: 'قميص' },
          { id: generateId(), en: 'cost', ar: 'يكلف' },
        ],
      },
    ],
  },
  {
    name: 'Daily Routine',
    description: 'I wake up at 6 o\'clock every morning.',
    category: 'words',
    build: () => [
      {
        ...emptySection(),
        title: 'الروتين الصباحي',
        sentence: 'I wake up at 6 o\'clock every morning.',
        translation: 'أستيقظ في الساعة السادسة كل صباح.',
        words: [
          { id: generateId(), en: 'I', ar: 'أنا' },
          { id: generateId(), en: 'wake up', ar: 'أستيقظ' },
          { id: generateId(), en: 'at', ar: 'في' },
          { id: generateId(), en: "6 o'clock", ar: 'الساعة السادسة' },
          { id: generateId(), en: 'every', ar: 'كل' },
          { id: generateId(), en: 'morning', ar: 'صباح' },
        ],
      },
    ],
  },
  {
    name: 'Travel',
    description: 'Where is the boarding gate?',
    category: 'words',
    build: () => [
      {
        ...emptySection(),
        title: 'في المطار',
        sentence: 'Where is the boarding gate?',
        translation: 'أين بوابة الصعود إلى الطائرة؟',
        words: [
          { id: generateId(), en: 'Where', ar: 'أين' },
          { id: generateId(), en: 'is', ar: '—' },
          { id: generateId(), en: 'the', ar: 'الـ' },
          { id: generateId(), en: 'boarding gate', ar: 'بوابة الصعود' },
        ],
      },
    ],
  },
  {
    name: 'How are you?',
    description: 'How are you today? I am fine, thank you.',
    category: 'words',
    build: () => [
      {
        ...emptySection(),
        title: 'كيف الحال؟',
        sentence: 'How are you today? I am fine, thank you.',
        translation: 'كيف حالك اليوم؟ أنا بخير، شكراً لك.',
        words: [
          { id: generateId(), en: 'How', ar: 'كيف' },
          { id: generateId(), en: 'are you', ar: 'حالك' },
          { id: generateId(), en: 'today', ar: 'اليوم' },
          { id: generateId(), en: 'I', ar: 'أنا' },
          { id: generateId(), en: 'am fine', ar: 'بخير' },
          { id: generateId(), en: 'thank you', ar: 'شكراً' },
        ],
      },
    ],
  },
  {
    name: 'Can I see the menu?',
    description: 'Can I see the menu?',
    category: 'words',
    build: () => [
      {
        ...emptySection(),
        title: 'طلب الطعام',
        sentence: 'Can I see the menu?',
        translation: 'هل يمكنني رؤية قائمة الطعام؟',
        words: [
          { id: generateId(), en: 'Can', ar: 'هل يمكن' },
          { id: generateId(), en: 'I', ar: 'أنا' },
          { id: generateId(), en: 'see', ar: 'أرى' },
          { id: generateId(), en: 'the', ar: 'الـ' },
          { id: generateId(), en: 'menu', ar: 'قائمة الطعام' },
        ],
      },
    ],
  },
  {
    name: 'At the Hotel',
    description: 'I have a reservation under the name Ali.',
    category: 'words',
    build: () => [
      {
        ...emptySection(),
        title: 'تسجيل الدخول',
        sentence: 'I have a reservation under the name Ali.',
        translation: 'لدي حجز باسم علي.',
        words: [
          { id: generateId(), en: 'I have', ar: 'لدي' },
          { id: generateId(), en: 'a', ar: '—' },
          { id: generateId(), en: 'reservation', ar: 'حجز' },
          { id: generateId(), en: 'under', ar: 'باسم' },
          { id: generateId(), en: 'the', ar: 'الـ' },
          { id: generateId(), en: 'name', ar: 'اسم' },
          { id: generateId(), en: 'Ali', ar: 'علي' },
        ],
      },
    ],
  },
]
