
export enum View {
  DASHBOARD = 'DASHBOARD',
  EXERCISES = 'EXERCISES',
  MEDICATION = 'MEDICATION',
  DIARY = 'DIARY',
  QUIZ = 'QUIZ',
  REPORTS = 'REPORTS',
  CONTACTS = 'CONTACTS'
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
  remindersEnabled: boolean;
}

export interface DiaryEntry {
  id: string;
  date: string;
  timestamp: number;
  mood: string;
  tremorLevel: number; // 1-10
  notes: string;
  image?: string; // Base64 ou URL da imagem
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

export interface AIContent {
  motivation: string;
  physicalExercises: Array<{
    title: string;
    description: string;
    target: string;
    duration: string;
  }>;
  mentalExercise: {
    question: string;
    answer: string;
  };
}
