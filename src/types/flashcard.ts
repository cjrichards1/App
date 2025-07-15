export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isLatex: boolean;
  createdAt: Date;
  lastStudied?: Date;
  correctCount: number;
  incorrectCount: number;
  folderId?: string;
}

export interface Folder {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
  cardCount: number;
}

export interface StudySession {
  totalCards: number;
  correctAnswers: number;
  incorrectAnswers: number;
  startTime: Date;
  endTime?: Date;
}

export interface FlashcardStats {
  totalCards: number;
  studiedToday: number;
  averageAccuracy: number;
  categoryBreakdown: Record<string, number>;
}