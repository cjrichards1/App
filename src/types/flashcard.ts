export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isLatex: boolean;
  createdAt: string;
  lastStudied?: string;
  correctCount: number;
  incorrectCount: number;
  folderId?: string;
  isCorrect?: boolean;
}

export type NewFlashcard = Omit<Flashcard, 'id' | 'createdAt' | 'correctCount' | 'incorrectCount' | 'lastStudied' | 'isCorrect'>;

export interface Folder {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  cardCount: number;
}

export interface StudySession {
  totalCards: number;
  correctAnswers: number;
  incorrectAnswers: number;
  startTime: string;
  endTime?: string;
}

export interface FlashcardStats {
  totalCards: number;
  studiedToday: number;
  averageAccuracy: number;
  categoryBreakdown: Record<string, number>;
}