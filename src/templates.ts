import type { Section } from './types.ts'
import { emptySection } from './utils.ts'

export interface Template {
  name: string
  description: string
  category: 'words' | 'sentences' | 'conversation'
  build: () => Section[]
}

export const templates: Template[] = [
  // ──── Sentences Only ────
  {
    name: 'Basic Questions',
    description: '5 common questions',
    category: 'sentences',
    build: () => [
      { ...emptySection(), title: 'أسئلة أساسية', sentence: 'What is your name?', translation: 'ما اسمك؟', words: [] },
      { ...emptySection(), title: '', sentence: 'Where are you from?', translation: 'من أين أنت؟', words: [] },
      { ...emptySection(), title: '', sentence: 'How old are you?', translation: 'كم عمرك؟', words: [] },
      { ...emptySection(), title: '', sentence: 'What do you do?', translation: 'ماذا تعمل؟', words: [] },
      { ...emptySection(), title: '', sentence: 'Do you speak English?', translation: 'هل تتحدث الإنجليزية؟', words: [] },
    ],
  },
  {
    name: 'Daily Life',
    description: '5 everyday sentences',
    category: 'sentences',
    build: () => [
      { ...emptySection(), title: 'روتيني اليومي', sentence: 'I wake up at 7 o\'clock.', translation: 'أستيقظ في الساعة السابعة.', words: [] },
      { ...emptySection(), title: '', sentence: 'I eat breakfast every morning.', translation: 'أتناول الفطور كل صباح.', words: [] },
      { ...emptySection(), title: '', sentence: 'I go to work by bus.', translation: 'أذهب إلى العمل بالحافلة.', words: [] },
      { ...emptySection(), title: '', sentence: 'I have lunch at noon.', translation: 'أتناول الغداء في الظهر.', words: [] },
      { ...emptySection(), title: '', sentence: 'I go to bed at 11 o\'clock.', translation: 'أذهب إلى الفراش في الساعة الحادية عشرة.', words: [] },
    ],
  },
  {
    name: 'Feelings',
    description: '5 feeling expressions',
    category: 'sentences',
    build: () => [
      { ...emptySection(), title: 'مشاعري', sentence: 'I am very happy today.', translation: 'أنا سعيد جداً اليوم.', words: [] },
      { ...emptySection(), title: '', sentence: 'I am feeling sad right now.', translation: 'أشعر بالحزن الآن.', words: [] },
      { ...emptySection(), title: '', sentence: 'I am tired after work.', translation: 'أنا متعب بعد العمل.', words: [] },
      { ...emptySection(), title: '', sentence: 'I am excited about the trip.', translation: 'أنا متحمس للرحلة.', words: [] },
      { ...emptySection(), title: '', sentence: 'I am hungry. Let\'s eat.', translation: 'أنا جائع. هيا نأكل.', words: [] },
    ],
  },
  {
    name: 'At Home',
    description: '5 home-related sentences',
    category: 'sentences',
    build: () => [
      { ...emptySection(), title: 'في المنزل', sentence: 'Please open the door.', translation: 'من فضلك افتح الباب.', words: [] },
      { ...emptySection(), title: '', sentence: 'Turn off the lights.', translation: 'أطفئ الأنوار.', words: [] },
      { ...emptySection(), title: '', sentence: 'The kitchen is very clean.', translation: 'المطبخ نظيف جداً.', words: [] },
      { ...emptySection(), title: '', sentence: 'Where is the remote control?', translation: 'أين جهاز التحكم؟', words: [] },
      { ...emptySection(), title: '', sentence: 'I need to do the laundry.', translation: 'أحتاج إلى غسل الملابس.', words: [] },
    ],
  },
  {
    name: 'Shopping Phrases',
    description: '5 shopping sentences',
    category: 'sentences',
    build: () => [
      { ...emptySection(), title: 'عبارات تسوق', sentence: 'How much does this cost?', translation: 'كم يكلف هذا؟', words: [] },
      { ...emptySection(), title: '', sentence: 'I am just looking around.', translation: 'أنا فقط أتفرج.', words: [] },
      { ...emptySection(), title: '', sentence: 'Can I try this on?', translation: 'هل يمكنني تجربة هذا؟', words: [] },
      { ...emptySection(), title: '', sentence: 'Do you have a smaller size?', translation: 'هل لديك مقاس أصغر؟', words: [] },
      { ...emptySection(), title: '', sentence: 'I will take this, please.', translation: 'سآخذ هذا، من فضلك.', words: [] },
    ],
  },
  {
    name: 'Travel Talk',
    description: '5 travel sentences',
    category: 'sentences',
    build: () => [
      { ...emptySection(), title: 'السفر', sentence: 'Where is the train station?', translation: 'أين محطة القطار؟', words: [] },
      { ...emptySection(), title: '', sentence: 'I need a ticket to London.', translation: 'أحتاج تذكرة إلى لندن.', words: [] },
      { ...emptySection(), title: '', sentence: 'What time does the flight leave?', translation: 'في أي وقت تقلع الرحلة؟', words: [] },
      { ...emptySection(), title: '', sentence: 'Is there a bus to the city center?', translation: 'هل هناك حافلة إلى وسط المدينة؟', words: [] },
      { ...emptySection(), title: '', sentence: 'I need to check in for my flight.', translation: 'أحتاج إلى تسجيل الدخول لرحلتي.', words: [] },
    ],
  },
  {
    name: 'Weather & Time',
    description: '5 weather and time sentences',
    category: 'sentences',
    build: () => [
      { ...emptySection(), title: 'الطقس والوقت', sentence: 'The weather is beautiful today.', translation: 'الجو جميل اليوم.', words: [] },
      { ...emptySection(), title: '', sentence: 'It is raining outside.', translation: 'إنها تمطر بالخارج.', words: [] },
      { ...emptySection(), title: '', sentence: 'What time is it?', translation: 'كم الساعة؟', words: [] },
      { ...emptySection(), title: '', sentence: 'It is 3 o\'clock in the afternoon.', translation: 'الساعة الثالثة بعد الظهر.', words: [] },
      { ...emptySection(), title: '', sentence: 'See you tomorrow.', translation: 'أراك غداً.', words: [] },
    ],
  },
  {
    name: 'Work & Study',
    description: '5 work and study sentences',
    category: 'sentences',
    build: () => [
      { ...emptySection(), title: 'العمل والدراسة', sentence: 'I work as a teacher.', translation: 'أعمل معلماً.', words: [] },
      { ...emptySection(), title: '', sentence: 'I study English every day.', translation: 'أدرس الإنجليزية كل يوم.', words: [] },
      { ...emptySection(), title: '', sentence: 'I have a meeting at 10 o\'clock.', translation: 'لدي اجتماع في الساعة العاشرة.', words: [] },
      { ...emptySection(), title: '', sentence: 'I need to finish this report.', translation: 'أحتاج إلى إنهاء هذا التقرير.', words: [] },
      { ...emptySection(), title: '', sentence: 'The office is closed on Sunday.', translation: 'المكتب مغلق يوم الأحد.', words: [] },
    ],
  },
  {
    name: 'Apologies & Thanks',
    description: '5 apology and thanks sentences',
    category: 'sentences',
    build: () => [
      { ...emptySection(), title: 'اعتذار وشكر', sentence: 'Thank you very much.', translation: 'شكراً جزيلاً.', words: [] },
      { ...emptySection(), title: '', sentence: 'I am sorry. It was my mistake.', translation: 'أنا آسف. كان خطأي.', words: [] },
      { ...emptySection(), title: '', sentence: 'You are welcome.', translation: 'عفواً.', words: [] },
      { ...emptySection(), title: '', sentence: 'Excuse me, can I ask a question?', translation: 'عذراً، هل يمكنني طرح سؤال؟', words: [] },
      { ...emptySection(), title: '', sentence: 'I really appreciate your help.', translation: 'أنا أقدر مساعدتك حقاً.', words: [] },
    ],
  },
  {
    name: 'Family & Friends',
    description: '5 family and friends sentences',
    category: 'sentences',
    build: () => [
      { ...emptySection(), title: 'العائلة والأصدقاء', sentence: 'I have two brothers and one sister.', translation: 'لدي أخوان وأخت واحدة.', words: [] },
      { ...emptySection(), title: '', sentence: 'My mother is a doctor.', translation: 'والدتي طبيبة.', words: [] },
      { ...emptySection(), title: '', sentence: 'My best friend lives next door.', translation: 'صديقي المفضل يسكن بجانبي.', words: [] },
      { ...emptySection(), title: '', sentence: 'I love spending time with my family.', translation: 'أحب قضاء الوقت مع عائلتي.', words: [] },
      { ...emptySection(), title: '', sentence: 'We have dinner together every Friday.', translation: 'نتناول العشاء معاً كل يوم جمعة.', words: [] },
    ],
  },
]
